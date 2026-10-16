# Slate Design Agency website

Static site for GitHub Pages. No build step needed.

## Go live
1. Create a GitHub repository (for example `slate-website`) and drag everything in this folder (all the .html files, `favicon.svg`, and the `assets` folder) into the repository root. `index.html` must be at the top level.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then **Save**.
4. After a minute or two, your site is live at the URL GitHub shows on that page.

## Turn on the contact form (one time)
The form sends to slatedesignagency1999@gmail.com through FormSubmit (formsubmit.co).
1. Open the live site, go to **Contact**, and send yourself a test message.
2. Check that Gmail inbox (and spam) for an email from FormSubmit and click **Activate Form**.
3. Every message after that lands in your inbox.

## Where things live
Every page is its own HTML file in the top folder:
- `index.html` (home), `about.html`, `services.html`, `process.html`, `contact.html`
- Service pages: `drone-media.html`, `photography.html`, `videography.html`, `software-development.html`, `seo.html`
- `privacy.html`, `thanks.html` (shown after the contact form), `404.html` (broken links)

The `assets/` folder holds everything else:
- `assets/css/style.css` – all styling (whiteboard look, colors, fonts)
- `assets/js/site.js` – menu, S-draw home transition, videos, contact form
- `assets/img/` – headshot and video poster images; `assets/video/` – drone clips (720p, web-compressed)

## Custom domain (optional)
In Settings → Pages, add your domain under **Custom domain**, then point your DNS at GitHub Pages as GitHub describes.
