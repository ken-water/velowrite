import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import feedbackHandler from "./feedback.js";
import waitlistHandler from "./waitlist.js";
import {
  parseBody,
  readContactPayload,
  setCors,
  validateEmail,
} from "./loops.js";

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
      ),
    ).toMatchObject({
      email: "test@example.com",
      source: "waitlist",
      userGroup: "waitlist",
      signupPath: "/",
      extra: { role: "writer" },
    });
  });

  it("sets cors and validates email", () => {
    const response = createResponse();
    setCors({ headers: { origin: "https://example.com" } }, response);

    expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://example.com");
    expect(validateEmail("good@example.com")).toBe(true);
    expect(validateEmail("bad-email")).toBe(false);
  });

  it("falls back to the public origin when request origin is missing", () => {
    const response = createResponse();
    setCors({ headers: {} }, response);

    expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://velowrite.app");
  });
});

describe("waitlist handler", () => {
  beforeEach(() => {
    process.env.LOOPS_API_KEY = "test-key";
  });

  it("routes pro waitlist signups to pro-interest", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    const response = createResponse();
    await waitlistHandler(
      {
        method: "POST",
        headers: {},
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

  it("rejects invalid JSON bodies", async () => {
    const response = createResponse();

    await waitlistHandler(
      {
        method: "POST",
        headers: {},
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
        headers: {},
      },
      response,
    );

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: "Method not allowed" });
  });
});

describe("feedback handler", () => {
  beforeEach(() => {
    process.env.LOOPS_API_KEY = "test-key";
  });

  it("stores feedback notes with context fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);

    const response = createResponse();
    await feedbackHandler(
      {
        method: "POST",
        headers: {},
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

  it("rejects invalid emails", async () => {
    const response = createResponse();

    await feedbackHandler(
      {
        method: "POST",
        headers: {},
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
        headers: {},
      },
      response,
    );

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({ error: "Method not allowed" });
  });
});
