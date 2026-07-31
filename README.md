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

## Quote form

The form posts to [Web3Forms](https://web3forms.com), which emails each request on to the address the access key belongs to. GitHub Pages only serves static files, so it cannot run a mailer of its own.

**To switch the form on**, get a free key at web3forms.com and paste it into `WEB3FORMS_KEY` near the top of `script.js`. The key is public by design — it is safe in this repository. Until it is set, the form falls back to opening the visitor's email application with the request pre-written.

Free tier limits worth knowing: **250 submissions/month**, **one recipient address**, and **no file attachments**. Because of the last one there is no photo upload on the form; visitors are asked to email photos instead. Attachments and CC to a second address both need a paid plan.

## Setup notes

- **DNS (Namecheap → Advanced DNS):** four `A` records on `@` pointing to GitHub Pages IPs (185.199.108–111.153) and a `CNAME` for `www` pointing to `meowster221.github.io`. The Google-verification TXT record and Gmail MX record are unrelated to the website — do not delete them.
- **`CNAME` file** in this repo tells GitHub Pages which domain to serve. Don't delete it.
- **`.htaccess`** is only used by Apache hosts; GitHub Pages ignores it. Kept in case the site ever moves to traditional hosting. The retired service pages under `services/` are meta-refresh redirect stubs that replace its 301 redirects.
- The business's old site remains at sjnybuilds.com (GoDaddy Website Builder, separate account).
