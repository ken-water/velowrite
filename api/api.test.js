import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import feedbackHandler from "./feedback.js";
import waitlistHandler from "./waitlist.js";
import {
  parseBody,
  readContactPayload,
  requireLoopsApiKey,
  resetRateLimitsForTests,
  setCors,
  upsertLoopsContact,
  validateEmail,
} from "./loops.js";

const allowedHeaders = {
  origin: "https://velowrite.app",
  "x-forwarded-for": "127.0.0.1",
};

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end() {
      this.ended = true;
    },
  };
}

describe("loops helpers", () => {
  beforeEach(() => {
    delete process.env.LOOPS_API_KEY;
    resetRateLimitsForTests();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses body strings and strips empty extras", () => {
    expect(parseBody({ body: JSON.stringify({ email: "a@b.com", role: "writer", empty: "" }) })).toEqual({
      email: "a@b.com",
      role: "writer",
      empty: "",
    });

    expect(
      readContactPayload(
        { body: JSON.stringify({ email: "  Test@Example.com ", role: "writer", empty: "" }) },
        { source: "waitlist", userGroup: "waitlist", signupPath: "/" },
        ["role"],
      ),
    ).toMatchObject({
      email: "test@example.com",
      source: "waitlist",
      userGroup: "waitlist",
      signupPath: "/",
      extra: { role: "writer" },
    });
  });

  it("sets CORS for an allowed origin and validates email", () => {
    const response = createResponse();
    expect(setCors({ headers: allowedHeaders }, response)).toBe(true);

    expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://velowrite.app");
    expect(response.headers.Vary).toBe("Origin");
    expect(validateEmail("good@example.com")).toBe(true);
    expect(validateEmail("bad-email")).toBe(false);
  });

  it("rejects missing or untrusted origins", () => {
    const response = createResponse();
    expect(setCors({ headers: {} }, response)).toBe(false);
    expect(setCors({ headers: { origin: "https://example.com" } }, response)).toBe(false);

    expect(response.headers["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("parses object bodies and default contact fields", () => {
    expect(
      readContactPayload(
        {
          body: {
            email: "USER@Example.COM",
            message: "hello",
            wantsReply: true,
            ignored: null,
          },
        },
        { source: "feedback", userGroup: "feedback", signupPath: "/feedback" },
        ["message", "wantsReply"],
      ),
    ).toEqual({
      email: "user@example.com",
      product: "velowrite",
      source: "feedback",
      userGroup: "feedback",
      signupPath: "/feedback",
      notes: "",
      extra: {
        message: "hello",
        wantsReply: true,
      },
    });
  });

  it("rejects missing loops configuration", () => {
    const response = createResponse();

    expect(requireLoopsApiKey(response, "Missing key")).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Missing key" });
  });

  it("sends notes and extra fields to Loops", async () => {
    process.env.LOOPS_API_KEY = "test-key";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    await upsertLoopsContact({
      email: "user@example.com",
      source: "velowrite.app",
      userGroup: "feedback",
      product: "velowrite",
      signupPath: "/feedback",
      notes: "Useful note",
      extra: {
        surface: "web",
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://app.loops.so/api/v1/contacts/update",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        },
      }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      email: "user@example.com",
      notes: "Useful note",
      surface: "web",
    });
  });

  it("throws useful errors when Loops rejects the request", async () => {
    process.env.LOOPS_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 429, text: async () => "rate limited" }),
    );

    await expect(
      upsertLoopsContact({
        email: "user@example.com",
        source: "velowrite.app",
        userGroup: "waitlist",
        product: "velowrite",
        signupPath: "/",
        notes: "",
        extra: {},
      }),
    ).rejects.toThrow("Loops returned 429: rate limited");
  });
});

describe("waitlist handler", () => {
  beforeEach(() => {
    process.env.LOOPS_API_KEY = "test-key";
    resetRateLimitsForTests();
  });

  it("routes pro waitlist signups to pro-interest", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    const response = createResponse();
    await waitlistHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({ email: "pro@example.com", source: "pro" }),
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.userGroup).toBe("pro-interest");
    expect(payload.signupPath).toBe("/pro");
    expect(payload.source).toBe("velowrite.app");
  });

  it("handles CORS preflight without touching Loops", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = createResponse();

    await waitlistHandler({ method: "OPTIONS", headers: allowedHeaders }, response);

    expect(response.statusCode).toBe(204);
    expect(response.ended).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects waitlist signups when Loops is not configured", async () => {
    delete process.env.LOOPS_API_KEY;
    const response = createResponse();

    await waitlistHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({ email: "user@example.com" }),
      },
      response,
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Waitlist is not configured" });
  });

  it("returns a gateway error when Loops waitlist signup fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "down" }),
    );
    const response = createResponse();

    await waitlistHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({ email: "user@example.com" }),
      },
      response,
    );

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: "Waitlist signup failed" });
    errorSpy.mockRestore();
  });

  it("rejects invalid JSON bodies", async () => {
    const response = createResponse();

    await waitlistHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: "{",
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid JSON body" });
  });

  it("returns method not allowed for non-post requests", async () => {
    const response = createResponse();

    await waitlistHandler(
      {
        method: "GET",
        headers: allowedHeaders,
      },
      response,
    );

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: "Method not allowed" });
  });

  it("rejects waitlist requests from other origins", async () => {
    const response = createResponse();

    await waitlistHandler(
      {
        method: "POST",
        headers: { origin: "https://example.com", "x-forwarded-for": "127.0.0.2" },
        body: JSON.stringify({ email: "user@example.com" }),
      },
      response,
    );

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ error: "Origin not allowed" });
  });

  it("rate limits repeated waitlist submissions", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    for (let index = 0; index < 5; index += 1) {
      await waitlistHandler(
        {
          method: "POST",
          headers: { ...allowedHeaders, "x-forwarded-for": "127.0.0.3" },
          body: JSON.stringify({ email: `user${index}@example.com` }),
        },
        createResponse(),
      );
    }

    const response = createResponse();
    await waitlistHandler(
      {
        method: "POST",
        headers: { ...allowedHeaders, "x-forwarded-for": "127.0.0.3" },
        body: JSON.stringify({ email: "limited@example.com" }),
      },
      response,
    );

    expect(response.statusCode).toBe(429);
    expect(response.headers["Retry-After"]).toMatch(/^\d+$/);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});

describe("feedback handler", () => {
  beforeEach(() => {
    process.env.LOOPS_API_KEY = "test-key";
    resetRateLimitsForTests();
  });

  it("stores feedback notes with context fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    const response = createResponse();
    await feedbackHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({
          email: "reader@example.com",
          surface: "web",
          role: "writer",
          useCase: "notes",
          friction: "preview layout",
          message: "Need better split view.",
          wantsDesktop: true,
          wantsPro: false,
          wantsReply: true,
        }),
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.userGroup).toBe("feedback");
    expect(payload.signupPath).toBe("/feedback");
    expect(payload.notes).toContain("Feedback from web");
    expect(payload.notes).toContain("Need better split view.");
  });

  it("handles CORS preflight without touching Loops", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = createResponse();

    await feedbackHandler({ method: "OPTIONS", headers: allowedHeaders }, response);

    expect(response.statusCode).toBe(204);
    expect(response.ended).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects feedback when Loops is not configured", async () => {
    delete process.env.LOOPS_API_KEY;
    const response = createResponse();

    await feedbackHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({ email: "reader@example.com" }),
      },
      response,
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Feedback is not configured" });
  });

  it("rejects invalid feedback JSON bodies", async () => {
    const response = createResponse();

    await feedbackHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: "{",
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid JSON body" });
  });

  it("returns a gateway error when Loops feedback submission fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "down" }),
    );
    const response = createResponse();

    await feedbackHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({ email: "reader@example.com" }),
      },
      response,
    );

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: "Feedback submission failed" });
    errorSpy.mockRestore();
  });

  it("rejects invalid emails", async () => {
    const response = createResponse();

    await feedbackHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({ email: "not-an-email" }),
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid email" });
  });

  it("returns method not allowed for non-post requests", async () => {
    const response = createResponse();

    await feedbackHandler(
      {
        method: "GET",
        headers: allowedHeaders,
      },
      response,
    );

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: "Method not allowed" });
  });

  it("keeps only approved feedback fields and bounds their length", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);
    const response = createResponse();

    await feedbackHandler(
      {
        method: "POST",
        headers: allowedHeaders,
        body: JSON.stringify({
          email: "reader@example.com",
          message: "x".repeat(5_000),
          unexpectedField: "must not reach Loops",
        }),
      },
      response,
    );

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.message).toHaveLength(4_000);
    expect(payload.unexpectedField).toBeUndefined();
  });
});
