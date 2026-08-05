# server/

`assessment-route.ts` is the Next.js route handler the enquiry form used to
post to. It emails the submission to cparker@audaption.com and creates a
HubSpot contact.

**It is not built.** The site is exported statically for GitHub Pages, which
serves files and does not run a server, so this file lives outside `src/app`
where Next will not try to compile it.

## To bring it back

Move it to `src/app/api/assessment/route.ts`, drop `output: "export"` from
`next.config.ts`, and deploy somewhere that runs Node — Vercel, Netlify
Functions, Cloudflare Workers. Then set `NEXT_PUBLIC_FORM_ENDPOINT` to
`/api/assessment` and the form will use it again with no other change.

## Until then

The form posts to whatever `NEXT_PUBLIC_FORM_ENDPOINT` is set to at build
time — a Formspree or Web3Forms endpoint takes the same JSON. With nothing
set it falls back to opening the visitor's mail client with the fields
already filled in, addressed to cparker@audaption.com.
