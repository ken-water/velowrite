const loopsContactEndpoint = "https://app.loops.so/api/v1/contacts/update";

function json(response, status, body) {
  response.status(status).json(body);
}

function getOrigin(request) {
  return request.headers.origin || "https://velowrite.app";
}

function setCors(request, response) {
  response.setHeader("Access-Control-Allow-Origin", getOrigin(request));
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseBody(request) {
  return typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body;
}

function readContactPayload(request, defaults = {}) {
  const body = parseBody(request);
  const email = String(body?.email || "").trim().toLowerCase();
  const product = String(body?.product || "velowrite").trim();
  const source = String(body?.source || defaults.source || "waitlist").trim();
  const userGroup = String(body?.userGroup || defaults.userGroup || source).trim();
  const signupPath = String(body?.signupPath || defaults.signupPath || "/").trim();
  const notes = String(body?.notes || defaults.notes || "").trim();
  const extra = {};

  for (const [key, value] of Object.entries(body || {})) {
    if (["email", "product", "source", "userGroup", "signupPath", "notes"].includes(key)) continue;
    if (value === undefined || value === null || value === "") continue;
    extra[key] = value;
  }

  return { email, product, source, userGroup, signupPath, notes, extra };
}

async function upsertLoopsContact(payload) {
  const contact = {
    email: payload.email,
    firstName: "",
    lastName: "",
    source: payload.source,
    userGroup: payload.userGroup,
    product: payload.product,
    signupPath: payload.signupPath,
  };

  if (payload.notes) {
    contact.notes = payload.notes;
  }

  for (const [key, value] of Object.entries(payload.extra)) {
    contact[key] = value;
  }

  const response = await fetch(loopsContactEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Loops returned ${response.status}: ${message}`);
  }
}

function requireLoopsApiKey(response, errorMessage) {
  if (!process.env.LOOPS_API_KEY) {
    json(response, 500, { error: errorMessage });
    return false;
  }
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export {
  json,
  parseBody,
  readContactPayload,
  requireLoopsApiKey,
  setCors,
  upsertLoopsContact,
  validateEmail,
};
