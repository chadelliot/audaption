import { NextResponse } from "next/server";

/*
  Enquiry submission.

  Two deliveries, independent of each other:

  1. An email to the address below, which is the one that actually matters —
     somebody reads it and replies.
  2. A HubSpot contact, when a token is configured, so the enquiry is queryable
     later rather than living only in an inbox.

  Neither is required for the form to succeed. If a provider is unconfigured or
  unreachable the submission is logged server-side and the visitor still gets a
  clean confirmation, because a lead lost to a missing API key is worse than a
  lead recorded in a log.

  Environment:
    RESEND_API_KEY   enables the email. Without it the email is logged only.
    ENQUIRY_TO       overrides the recipient below.
    ENQUIRY_FROM     verified sender, e.g. "Audaption <site@audaption.com>"
    HUBSPOT_TOKEN    enables the CRM record.
*/

const TO = process.env.ENQUIRY_TO ?? "cparker@audaption.com";
const FROM = process.env.ENQUIRY_FROM ?? "Audaption Site <onboarding@resend.dev>";
const HUBSPOT_URL = "https://api.hubapi.com/crm/v3/objects/contacts";
const RESEND_URL = "https://api.resend.com/emails";

interface Body {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  situation?: string;
  ask?: string;
  symptom?: string | null;
}

const ASK_LABEL: Record<string, string> = {
  expert: "Chat with an expert",
  guide: "Send the Growth System Guide",
};

/** Anything a visitor typed goes through this before it reaches an inbox. */
const esc = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid work email is required." },
      { status: 400 },
    );
  }
  if (!body.name?.trim() || !body.company?.trim()) {
    return NextResponse.json(
      { error: "Name and company are required." },
      { status: 400 },
    );
  }

  const name = body.name.trim();
  const company = body.company.trim();
  const role = body.role?.trim() ?? "";
  const situation = body.situation?.trim().slice(0, 2000) ?? "";
  const ask = ASK_LABEL[body.ask ?? ""] ?? body.ask ?? "";

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Role", role || "—"],
    ["Asked for", ask || "—"],
    ["Situation", situation || "—"],
  ];

  await Promise.allSettled([
    sendEmail(name, company, email, rows),
    sendToHubspot({ email, name, company, role, situation, ask, symptom: body.symptom }),
  ]);

  /* The visitor's outcome does not depend on our integrations. */
  return NextResponse.json({ ok: true });
}

async function sendEmail(
  name: string,
  company: string,
  replyTo: string,
  rows: [string, string][],
) {
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;color:#262626">
      <p style="margin:0 0 18px"><strong>${esc(name)}</strong> at <strong>${esc(company)}</strong> asked to talk.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 20px 6px 0;color:#8a8b84;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[enquiry] no RESEND_API_KEY — would email ${TO}`, rows);
    return;
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: replyTo,
      subject: `Growth system enquiry — ${name}, ${company}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] email rejected", res.status, await res.text());
  }
}

async function sendToHubspot(f: {
  email: string;
  name: string;
  company: string;
  role: string;
  situation: string;
  ask: string;
  symptom?: string | null;
}) {
  const token = process.env.HUBSPOT_TOKEN;
  const [firstname, ...rest] = f.name.split(/\s+/);
  const properties = {
    email: f.email,
    firstname,
    lastname: rest.join(" "),
    company: f.company,
    jobtitle: f.role,
    audaption_symptom: f.symptom ?? "",
    audaption_ask: f.ask,
    audaption_situation: f.situation,
  };

  if (!token) {
    console.info("[enquiry] no HUBSPOT_TOKEN — contact logged only", properties);
    return;
  }

  const res = await fetch(HUBSPOT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  // A contact that already exists is a normal outcome, not a failure.
  if (!res.ok && res.status !== 409) {
    console.error("[enquiry] hubspot rejected", res.status, await res.text());
  }
}
