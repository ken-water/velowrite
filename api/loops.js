const loopsContactEndpoint = "https://app.loops.so/api/v1/contacts/update";
const allowedOrigins = new Set([
  "https://velowrite.app",
  "https://www.velowrite.app",
  "http://localhost:1420",
  "http://127.0.0.1:1420",
]);
const requestWindowMs = 10 * 60 * 1000;
const requestLimit = 5;
const requestLogLimit = 5_000;
const requestLog = new Map();
const fieldLimits = {
  email: 254,
  product: 64,
  source: 64,
  userGroup: 64,
  signupPath: 160,
  notes: 4000,
  surface: 40,
  role: 80,
  useCase: 240,
  friction: 240,
  message: 4000,
};

function json(response, status, body) {
  response.status(status).json(body);
}

function getOrigin(request) {
  const origin = request.headers.origin;
  return typeof origin === "string" && allowedOrigins.has(origin) ? origin : null;
}

function setCors(request, response) {
  const origin = getOrigin(request);
  if (!origin) return false;

  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return true;
}

function parseBody(request) {
  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body;
  if (!body || Array.isArray(body) || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }
  return body;
}

function readContactPayload(request, defaults = {}, allowedExtraFields = []) {
  const body = parseBody(request);
  const email = readString(body.email, fieldLimits.email).toLowerCase();
  const product = readString(body.product || "velowrite", fieldLimits.product);
  const source = readString(body.source || defaults.source || "waitlist", fieldLimits.source);
  const userGroup = readString(
    body.userGroup || defaults.userGroup || source,
    fieldLimits.userGroup,
  );
  const signupPath = readString(
    body.signupPath || defaults.signupPath || "/",
    fieldLimits.signupPath,
  );
  const notes = readString(body.notes || defaults.notes || "", fieldLimits.notes);
  const extra = {};

  for (const key of allowedExtraFields) {
    const value = body[key];
    if (value === undefined || value === null || value === "") continue;
    extra[key] =
      typeof value === "boolean" ? value : readString(value, fieldLimits[key] || fieldLimits.message);
  }

  return { email, product, source, userGroup, signupPath, notes, extra };
}

function readString(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function getClientKey(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const address = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]
      : request.headers["x-real-ip"];
  return typeof address === "string" && address.trim() ? address.trim() : "unknown";
}

function checkRateLimit(request, response) {
  const now = Date.now();
  const key = getClientKey(request);
  pruneRequestLog(now);
  const recent = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < requestWindowMs);

  if (recent.length >= requestLimit) {
    const retryAfter = Math.ceil((requestWindowMs - (now - recent[0])) / 1000);
    response.setHeader("Retry-After", String(Math.max(1, retryAfter)));
    json(response, 429, { error: "Too many requests. Please try again later." });
    return false;
  }

  recent.push(now);
  requestLog.set(key, recent);
  return true;
}

function pruneRequestLog(now) {
  if (requestLog.size < requestLogLimit) return;

  for (const [key, timestamps] of requestLog) {
    if (!timestamps.some((timestamp) => now - timestamp < requestWindowMs)) {
      requestLog.delete(key);
    }
  }

  while (requestLog.size >= requestLogLimit) {
    const oldestKey = requestLog.keys().next().value;
    if (!oldestKey) return;
    requestLog.delete(oldestKey);
  }
}

function resetRateLimitsForTests() {
  requestLog.clear();
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
    signal: AbortSignal.timeout(8_000),
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
  return email.length <= fieldLimits.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export {
  json,
  checkRateLimit,
  fieldLimits,
  getOrigin,
  parseBody,
  readContactPayload,
  requireLoopsApiKey,
  resetRateLimitsForTests,
  setCors,
  upsertLoopsContact,
  validateEmail,
};
