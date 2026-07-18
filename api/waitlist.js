const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

function getPayload(request) {
  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body;
  const email = String(body?.email || "").trim().toLowerCase();
  const product = String(body?.product || "velowrite").trim();
  return { email, product };
}

async function upsertLoopsContact({ email, product }) {
  const response = await fetch(loopsContactEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName: "",
      lastName: "",
      source: "velowrite.app",
      userGroup: "waitlist",
      product,
      signupPath: "/",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Loops returned ${response.status}: ${message}`);
  }
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

  if (!process.env.LOOPS_API_KEY) {
    json(response, 500, { error: "Waitlist is not configured" });
    return;
  }

  let payload;
  try {
    payload = getPayload(request);
  } catch {
    json(response, 400, { error: "Invalid JSON body" });
    return;
  }

  if (!emailPattern.test(payload.email)) {
    json(response, 400, { error: "Invalid email" });
    return;
  }

  try {
    await upsertLoopsContact(payload);
    json(response, 200, { ok: true });
  } catch (error) {
    console.error("Loops waitlist signup failed", error);
    json(response, 502, { error: "Waitlist signup failed" });
  }
}
