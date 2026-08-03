# SJNY Construction Inc. — sjnyconstruction.com

Static website for S&J NY Construction Inc., hosted free on **GitHub Pages** with the custom domain **sjnyconstruction.com** (registered at Namecheap).

## How to update the site

Edit any file in this folder, then:

```sh
git add -A
git commit -m "Describe your change"
git push
```

GitHub Pages redeploys automatically within a minute or two of every push to `main`. No other steps needed.

## Applying an upload zip

The `sjny-website-upload-N.zip` drops are generated from a snapshot that predates the move to Web3Forms, so **every one of them reintroduces the same regressions** and would leave a form that looks fine while silently delivering nothing. Copy the zip contents over the working tree, then:

```sh
python3 scripts/fix-form.py
```

It strips `send-quote.php` and the photo upload field, restores the Web3Forms wiring and the `.form-note` link colour, then verifies the end state. Safe to run twice; exits non-zero and names the failing step if the upstream markup ever drifts too far to patch. Don't commit an upload without running it.

Also worth knowing: the zips never contain `CNAME`, `README.md` or `.gitignore`, so exclude those when copying — losing `CNAME` takes the custom domain down. The `danny@` and `sunny@` addresses on the about and contact pages are deliberate; they're direct contact links, not form routing.

The real fix is upstream — if the zips are ever generated from this repo instead of the old snapshot, none of this is necessary.

## Quote form

The form posts to [Web3Forms](https://web3forms.com), which emails each request on to the address its access key belongs to. GitHub Pages only serves static files, so it cannot run a mailer of its own — this is why `send-quote.php` cannot be used, and why re-adding it breaks the form.

Submissions go to **quotes@sjnyconstruction.com**, a Zoho distribution group whose only member is Danny. **Adding more people to that group in Zoho is how you copy more of the team** — no code change, and it sidesteps the free tier's single-recipient limit.

The key in `script.js` is public by design and safe in this repository. Changing where submissions land is done at [app.web3forms.com](https://app.web3forms.com), not here: the recipient is a picker limited to verified linked addresses, so a new destination has to be added under Account → Linked Emails and verified first.

Free tier limits: **250 submissions/month**, **one recipient**, **no file attachments**. Because of the last one there is no photo upload; visitors are asked to email photos instead. Web3Forms also rejects non-browser requests, so the form cannot be tested with `curl` — submit it from a real browser.

## Setup notes

- **DNS (Namecheap → Advanced DNS):** four `A` records on `@` pointing to GitHub Pages IPs (185.199.108–111.153) and a `CNAME` for `www` pointing to `meowster221.github.io`.
- **Mail records are unrelated to the website — do not delete them.** Mail moved from Google Workspace to **Zoho** in August 2026: `MX` to `mx.zoho.com` / `mx2` / `mx3`, an SPF record (`include:zohomail.com`), a Zoho verification `TXT`, DKIM under the **`zmail`** selector (not `zoho` — checking the wrong one makes it look missing), and a `_dmarc` record on `p=none`.
- **Namecheap's per-record "HTTPS" toggle is ON** for the `A` records, so the domain resolves to a Namecheap proxy rather than directly to GitHub Pages, and the certificate is Sectigo-via-Namecheap instead of GitHub's own. It works, but it is an extra hop that can fail independently. Turning the toggle off would point visitors straight at GitHub Pages.
- **`CNAME` file** in this repo tells GitHub Pages which domain to serve. Don't delete it.
- **`.htaccess`** is only used by Apache hosts; GitHub Pages ignores it. Kept in case the site ever moves to traditional hosting. The retired service pages under `services/` are meta-refresh redirect stubs that replace its 301 redirects.
- The business's old site remains at sjnybuilds.com (GoDaddy Website Builder, separate account).
