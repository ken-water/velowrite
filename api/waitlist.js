import {
  json,
  checkRateLimit,
  readContactPayload,
  requireLoopsApiKey,
  setCors,
  upsertLoopsContact,
  validateEmail,
} from "./loops.js";

export default async function handler(request, response) {
  if (!setCors(request, response)) {
    json(response, 403, { error: "Origin not allowed" });
    return;
  }

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    json(response, 405, { error: "Method not allowed" });
    return;
  }

  if (!checkRateLimit(request, response)) {
    return;
  }

  if (!requireLoopsApiKey(response, "Waitlist is not configured")) {
    return;
  }

  let payload;
  try {
    payload = readContactPayload(request, {
      source: "waitlist",
      userGroup: "waitlist",
      signupPath: "/",
    });
    if (payload.source === "pro") {
      payload.userGroup = "pro-interest";
      payload.signupPath = "/pro";
    } else {
      payload.userGroup = "waitlist";
      payload.signupPath = "/";
    }
  } catch {
    json(response, 400, { error: "Invalid JSON body" });
    return;
  }

  if (!validateEmail(payload.email)) {
    json(response, 400, { error: "Invalid email" });
    return;
  }

  payload.source = "velowrite.app";

  try {
    await upsertLoopsContact(payload);
    json(response, 200, { ok: true });
  } catch {
    console.error("Loops waitlist signup failed");
    json(response, 502, { error: "Waitlist signup failed" });
  }
}
