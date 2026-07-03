# Amin Sati — SMM Packages (Jekyll site)

A Jekyll version of the Social Media Management Packages landing page.
Content is data-driven (`_data/packages.yml`) and the page is split into
reusable includes so it's easy to edit section by section.

## Folder structure

```
_config.yml          site settings, business details, SEO
_data/
  packages.yml        Basic/Standard/Premium package content (edit here to update pricing)
  site_info.yml        contact-form endpoint
_layouts/default.html  base HTML shell (head, SEO, schema, navbar, footer wrapper)
_includes/              one file per section (hero, packages, contact, etc.)
assets/css/style.css   all site styles
assets/js/main.js      nav, scroll-reveal, counters, contact-form submit
index.html             assembles the page from the includes above
```

## Run locally

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000`.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
For GitHub Pages: push this repo, enable Pages in repo settings, and set
`url`/`baseurl` in `_config.yml` to match your GitHub Pages URL.

---

## Contact form → emails satiamin786@gmail.com dynamically

Jekyll builds a **static** site — there's no server to send mail from, so
the form posts to **Formspree**, a form-relay service, which forwards
every submission straight to your inbox. Free tier is enough for this.

**Setup (5 minutes):**

1. Go to **https://formspree.io** and sign up using `satiamin786@gmail.com`.
2. Click **New Form**, name it (e.g. "SMM Packages Enquiry").
3. Copy the endpoint it gives you — looks like `https://formspree.io/f/abcdwxyz`.
4. Open `_data/site_info.yml` and replace the placeholder:
   ```yaml
   form_endpoint: "https://formspree.io/f/abcdwxyz"
   ```
5. Formspree sends a one-time verification email to `satiamin786@gmail.com`
   the first time someone submits the form — click the link inside it.
6. Rebuild/redeploy the site. Every enquiry submitted on the live site
   now lands in `satiamin786@gmail.com` automatically, with the sender's
   name, business name, mobile number, package interest, and message.

No backend, database, or server code required — it works on any static
host. The form also has a hidden honeypot field (`_gotcha`) to block bots.

### Alternative: EmailJS

If you'd rather not redirect through Formspree, **EmailJS** sends mail
directly from the browser via JavaScript (also free tier):

1. Create an account at https://www.emailjs.com and connect your Gmail
   (`satiamin786@gmail.com`) as the sending service.
2. Create an email template, note your **Service ID**, **Template ID**,
   and **Public Key**.
3. In `assets/js/main.js`, swap the `fetch()` call in the contact-form
   handler for `emailjs.send(serviceID, templateID, formData, publicKey)`
   — EmailJS's docs have a copy-paste snippet for this.

Formspree is recommended here since it needs zero extra script tags and
keeps the current AJAX success/error UI working as-is.

---

## Editing content

- **Packages/pricing** → `_data/packages.yml`
- **Phone/address/email/WhatsApp link** → `_config.yml`
- **Section copy** → the matching file in `_includes/`
- **Colors** → CSS variables at the top of `assets/css/style.css`
- **Sample images** → replace the Unsplash URLs in `_includes/samples.html`
  and `_includes/hero.html` with your real portfolio images
