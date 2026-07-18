import {
  json,
  readContactPayload,
  requireLoopsApiKey,
  setCors,
  upsertLoopsContact,
  validateEmail,
} from "./loops.js";

function buildNotes(extra) {
  const parts = [
    `Feedback from ${extra.surface || "unknown surface"}`,
    `Role: ${extra.role || "unspecified"}`,
    `Use case: ${extra.useCase || "unspecified"}`,
    `Friction: ${extra.friction || "unspecified"}`,
    `Wants Desktop: ${extra.wantsDesktop ? "yes" : "no"}`,
    `Wants Pro: ${extra.wantsPro ? "yes" : "no"}`,
    `Wants Reply: ${extra.wantsReply ? "yes" : "no"}`,
    "",
    extra.message || "",
  ];

  return parts.join("\n");
}

export default async function handler(request, response) {
  setCors(request, response);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    json(response, 405, { error: "Method not allowed" });
    return;
  }

  if (!requireLoopsApiKey(response, "Feedback is not configured")) {
    return;
  }

  let payload;
  try {
    payload = readContactPayload(request, {
      source: "feedback",
      userGroup: "feedback",
      signupPath: "/feedback",
    });
  } catch {
    json(response, 400, { error: "Invalid JSON body" });
    return;
  }

  if (!validateEmail(payload.email)) {
    json(response, 400, { error: "Invalid email" });
    return;
  }

  payload.source = "velowrite.app";
  payload.notes = buildNotes(payload.extra);

  try {
    await upsertLoopsContact(payload);
    json(response, 200, { ok: true });
  } catch (error) {
    console.error("Loops feedback submission failed", error);
    json(response, 502, { error: "Feedback submission failed" });
  }
}
