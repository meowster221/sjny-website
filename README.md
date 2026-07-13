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

## Setup notes

- **DNS (Namecheap → Advanced DNS):** four `A` records on `@` pointing to GitHub Pages IPs (185.199.108–111.153) and a `CNAME` for `www` pointing to `meowster221.github.io`. The Google-verification TXT record and Gmail MX record are unrelated to the website — do not delete them.
- **`CNAME` file** in this repo tells GitHub Pages which domain to serve. Don't delete it.
- **`.htaccess`** is only used by Apache hosts; GitHub Pages ignores it. Kept in case the site ever moves to traditional hosting. The retired service pages under `services/` are meta-refresh redirect stubs that replace its 301 redirects.
- The business's old site remains at sjnybuilds.com (GoDaddy Website Builder, separate account).
