#!/usr/bin/env python3
"""
Re-apply the quote form wiring after dropping in a sjny-website-upload zip.

The uploads are generated from a snapshot that predates the move to
Web3Forms, so each one reintroduces the same four regressions. Applying a
zip wholesale leaves a form that looks fine and silently delivers nothing.

Run from the repo root, after copying the zip contents over the working
tree and before committing:

    python3 scripts/fix-form.py

What it undoes:
  - send-quote.php, which GitHub Pages cannot execute. POST returns 405
    and GET serves the PHP source, including the recipient addresses.
  - QUOTE_ENDPOINT pointing at /send-quote.php.
  - The admin@sjnyconstruction.com CC. That Zoho group only accepts mail
    from its own members, so a visitor's mail to it is always rejected.
  - The photo upload field. No free form service accepts attachments, so
    visitors are asked to email photos instead.

What it puts back: the Web3Forms endpoint and key, delivery to quotes@,
the client-side honeypot, the photo note, and the .form-note link colour
that the stylesheet keeps losing.

Safe to run twice. Every edit is skipped if already applied. If the
upstream markup drifts far enough that a patch no longer matches, the
script exits non-zero and says which step failed rather than leaving the
form half-wired.
"""

import glob
import os
import re
import sys

WEB3FORMS_KEY = "95a9ee05-2213-4c91-82fe-c652dc0d4045"
RECIPIENT = "quotes@sjnyconstruction.com"
ENDPOINT = "https://api.web3forms.com/submit"

changes: list[str] = []
failures: list[str] = []


def note(msg: str) -> None:
    changes.append(msg)


def fail(msg: str) -> None:
    failures.append(msg)


# --------------------------------------------------------------------------
# 1. send-quote.php
# --------------------------------------------------------------------------

if os.path.exists("send-quote.php"):
    os.remove("send-quote.php")
    note("removed send-quote.php")


# --------------------------------------------------------------------------
# 2. script.js
# --------------------------------------------------------------------------

CONFIG = f'''/* ==========================================================================
   QUOTE FORM
   GitHub Pages serves static files only and cannot run a mailer, so
   requests post to Web3Forms, which emails them on to whichever address
   is tied to WEB3FORMS_KEY. Any time that request fails, the form falls
   back to opening the visitor's email application with the request
   pre-written.

   Do not point this at send-quote.php. Pages will not execute it: POST
   returns 405 and GET serves the PHP source to the public.
   ========================================================================== */

/* quotes@ is a distribution group, so adding people to it in Zoho is how
   more of the team gets copied. Do not add admin@sjnyconstruction.com here:
   that group only accepts mail from its own members, so anything a visitor
   sends to it is rejected. */
const QUOTE_EMAIL = "{RECIPIENT}";
const QUOTE_ENDPOINT = "{ENDPOINT}";

/* Free key from https://web3forms.com, tied to {RECIPIENT}.
   Public by design, so it is safe to keep here in the repository. */
const WEB3FORMS_KEY = "{WEB3FORMS_KEY}";'''

HONEYPOT = '''    const sentMessage = "Received. Your request went straight to our team and your quote is on its way.";

    /* Honeypot: humans never see this field. If it is filled, act as though
       the request went through so the bot moves on, and send nothing. */
    if (String(data.get("company") || "").trim()) {
      form.reset();
      status.textContent = sentMessage;
      return;
    }
    data.delete("company");
'''

SUBMIT = '''    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "Estimate request from " + name);
    data.append("from_name", "SJNY Construction website");
    data.append("replyto", email);

    status.textContent = "Sending your request.";
    fetch(QUOTE_ENDPOINT, { method: "POST", body: data })
      .then(function (response) {
        return response.json()
          .catch(function () { return {}; })
          .then(function (result) { return { ok: response.ok, result: result || {} }; });
      })
      .then(function (payload) {
        const sent = payload.result.success === true ||
          (payload.ok && payload.result.success === undefined);
        if (!sent) throw new Error("send failed");
        form.reset();
        status.textContent = sentMessage;
      })
      .catch(mailFallback);'''

if not os.path.exists("script.js"):
    fail("script.js not found — are you in the repo root?")
else:
    js = open("script.js").read()
    before = js

    # Config block: everything from the QUOTE FORM banner through the last
    # of the three consts the upload declares.
    if f'const WEB3FORMS_KEY = "{WEB3FORMS_KEY}"' not in js:
        pattern = re.compile(
            r'/\* =+\s*\n\s*QUOTE FORM.*?=+ \*/\s*\n\s*'
            r'const QUOTE_EMAIL = "[^"]*";\s*\n'
            r'(?:const QUOTE_EMAIL_CC = "[^"]*";\s*\n)?'
            r'const QUOTE_ENDPOINT = "[^"]*";',
            re.S,
        )
        js, n = pattern.subn(lambda m: CONFIG, js, count=1)
        if n:
            note("script.js: rewired config to Web3Forms")
        else:
            fail("script.js: could not match the QUOTE FORM config block")

    # Honeypot, inserted after the email/phone/name reads.
    if 'data.delete("company")' not in js:
        anchor = re.compile(
            r'(    const email = String\(data\.get\("email"\) \|\| ""\)\.trim\(\);\n)'
        )
        js, n = anchor.subn(lambda m: m.group(1) + HONEYPOT, js, count=1)
        if n:
            note("script.js: added client-side honeypot")
        else:
            fail("script.js: could not find where to insert the honeypot")

    # Photo handling in the mailto fallback.
    js, n = re.subn(
        r'[ \t]*const photoCount = document\.getElementById\("qPhotos"\)\.files\.length;\n',
        "", js)
    if n:
        note("script.js: dropped photoCount lookup")
    js, n = re.subn(
        r'[ \t]*if \(photoCount > 0\) \{\n.*?\n[ \t]*\}\n', "", js, flags=re.S)
    if n:
        note("script.js: dropped photo line from mail fallback")
    js, n = re.subn(
        r'[ \t]*status\.textContent = photoCount > 0\n'
        r'[ \t]*\? "[^"]*"\n'
        r'[ \t]*: ("[^"]*");',
        lambda m: '      status.textContent = ' + m.group(1) + ';', js)
    if n:
        note("script.js: simplified fallback status message")

    # admin@ CC on the mailto fallback.
    js, n = re.subn(r'[ \t]*"\?cc=" \+ encodeURIComponent\(QUOTE_EMAIL_CC\) \+\n'
                    r'([ \t]*)"&subject=" ',
                    lambda m: m.group(1) + '"?subject=" ', js)
    if n:
        note("script.js: removed admin@ CC from mail fallback")

    # Submit: Web3Forms fields plus tolerant response parsing.
    if "access_key" not in js:
        pattern = re.compile(
            r'    status\.textContent = "Sending your request\.";\n'
            r'    fetch\(QUOTE_ENDPOINT.*?\.catch\(mailFallback\);',
            re.S,
        )
        js, n = pattern.subn(lambda m: SUBMIT, js, count=1)
        if n:
            note("script.js: rewired submit to Web3Forms")
        else:
            fail("script.js: could not match the fetch/submit block")

    if js != before:
        open("script.js", "w").write(js)


# --------------------------------------------------------------------------
# 3. HTML — photo field and the note that replaces it
# --------------------------------------------------------------------------

PHOTO_FIELD = re.compile(
    r'[ \t]*<div class="field full">\s*'
    r'<label for="qPhotos">Photos, if you have them</label>\s*'
    r'<input id="qPhotos" name="photos\[\]" type="file" accept="image/\*" multiple>\s*'
    r'</div>\n',
    re.S,
)
PHOTO_SENTENCE = (
    " Have photos of the work? "
    f'<a href="mailto:{RECIPIENT}?subject=Project%20photos">Email them over</a> '
    "and we will match them to your request."
)
FORM_NOTE = re.compile(r'(<p class="form-note">)(.*?)(</p>)', re.S)

pages = ["index.html", "services.html"] + sorted(glob.glob("services/*.html"))
stripped = noted = 0

for page in pages:
    if not os.path.exists(page):
        continue
    html = open(page).read()
    original = html

    html, n = PHOTO_FIELD.subn("", html)
    stripped += n

    def add_sentence(m: re.Match) -> str:
        if "mailto:quotes@" in m.group(2):
            return m.group(0)
        global noted
        noted += 1
        return m.group(1) + m.group(2).rstrip() + PHOTO_SENTENCE + m.group(3)

    html = FORM_NOTE.sub(add_sentence, html)

    if html != original:
        open(page, "w").write(html)

if stripped:
    note(f"removed the photo upload field from {stripped} page(s)")
if noted:
    note(f"added the email-photos note to {noted} page(s)")


# --------------------------------------------------------------------------
# 4. CSS — the form-note link keeps losing its colour
# --------------------------------------------------------------------------

if os.path.exists("styles.css"):
    css = open("styles.css").read()
    if ".form-note a" not in css:
        anchor = re.compile(r'(\.form-note \{[^}]*\}\n)')
        rule = (
            "\n.form-note a {\n"
            "  color: var(--slate);\n"
            "  text-decoration: underline;\n"
            "  text-underline-offset: 2px;\n"
            "  transition: color 0.2s ease;\n"
            "}\n"
            "\n.form-note a:hover { color: var(--ink); }\n"
        )
        css, n = anchor.subn(lambda m: m.group(1) + rule, css, count=1)
        if n:
            open("styles.css", "w").write(css)
            note("styles.css: restored .form-note link styling")
        else:
            fail("styles.css: could not find the .form-note rule to anchor to")


# --------------------------------------------------------------------------
# 5. Verify the end state regardless of which patches ran
# --------------------------------------------------------------------------

js = open("script.js").read() if os.path.exists("script.js") else ""
html_all = "".join(
    open(p).read() for p in pages if os.path.exists(p)
)

checks = [
    ("send-quote.php is gone", not os.path.exists("send-quote.php")),
    ("no PHP endpoint", 'QUOTE_ENDPOINT = "/send-quote.php"' not in js),
    ("Web3Forms endpoint set", ENDPOINT in js),
    ("Web3Forms key present", WEB3FORMS_KEY in js),
    ("delivers to quotes@", f'const QUOTE_EMAIL = "{RECIPIENT}"' in js),
    ("admin@ CC removed", "QUOTE_EMAIL_CC" not in js),
    ("honeypot wired", 'data.delete("company")' in js),
    ("no photo upload field", "qPhotos" not in js + html_all),
    ("CNAME preserved", os.path.exists("CNAME")),
]

print()
if changes:
    for c in changes:
        print(f"  changed  {c}")
else:
    print("  nothing to change — already wired correctly")

print()
for label, ok in checks:
    print(f"  {'ok  ' if ok else 'FAIL'}     {label}")

broken = [label for label, ok in checks if not ok]
print()

if failures:
    for f in failures:
        print(f"  patch failed: {f}")
if broken:
    print(f"  {len(broken)} check(s) failed — do not commit until resolved")

if failures or broken:
    sys.exit(1)

print("  form wiring is correct")
