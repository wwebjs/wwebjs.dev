import fs from 'node:fs';
import path from 'node:path';
import { render } from 'takumi-js';
import { fromHtml } from 'takumi-js/helpers/html';
import sharp from 'sharp';

/**
 * Helper to generate a safe URL/filename slug from page path
 */
function getPageSlug(pagePath) {
  let cleanPath = pagePath.replace(/^\/|\/$/g, '').replace(/\.html$/, '');
  if (!cleanPath) return 'index';
  return cleanPath.replace(/[\/\s\_]+/g, '-').toLowerCase();
}

/**
 * Helper to clean and format title/description text for takumi-js HTML templates
 */
function cleanText(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#(?:039|39|x27);|&apos;/g, "'")
    .replace(/&#(?:034|34|x22);|&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Generate HTML string template for the 1834x963 OG image card
 */
function createOgHtmlTemplate({ title, description, templateDataUrl }) {
  const safeTitle = cleanText(title || 'whatsapp-web.js');
  const safeDescription = cleanText(
    description || 'A WhatsApp client library for NodeJS'
  );

  return `
    <style>
      .text-container {
        position: absolute;
        left: 103px;
        top: 493px;
        width: 1518px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .heading {
        font-family: 'Archivo Black', sans-serif;
        font-size: 126px;
        letter-spacing: -0.04em;
        line-height: normal;
        text-align: left;
        padding-left: 4px;
        color: #ffffff;
      }
      .subtitle {
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        font-size: 42px;
        line-height: 59px;
        text-align: left;
        padding-left: 8px;
        color: #ffffff;
      }
    </style>

    <div style="
      position: relative;
      width: 1834px;
      height: 963px;
      display: flex;
    ">
      <img src="${templateDataUrl}" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 1834px;
        height: 963px;
        object-fit: cover;
      " />
      <div class="text-container">
        <div class="heading">${safeTitle}</div>
        <div class="subtitle">${safeDescription}</div>
      </div>
    </div>
  `;
}

/**
 * Helper to get font buffers (loads from local cache or fetches if missing)
 */
async function loadFonts(pluginDir) {
  const fontDir = path.join(pluginDir, 'fonts');
  if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir, { recursive: true });

  const archivoPath = path.join(fontDir, 'ArchivoBlack-Regular.ttf');
  const poppinsPath = path.join(fontDir, 'Poppins-Medium.ttf');

  if (!fs.existsSync(archivoPath)) {
    const res = await fetch('https://fonts.gstatic.com/s/archivoblack/v23/HTxqL289NzCGg4MzN6KJ7eW6OYs.ttf');
    fs.writeFileSync(archivoPath, Buffer.from(await res.arrayBuffer()));
  }

  if (!fs.existsSync(poppinsPath)) {
    const res = await fetch('https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLGT9V1s.ttf');
    fs.writeFileSync(poppinsPath, Buffer.from(await res.arrayBuffer()));
  }

  const archivoBuf = new Uint8Array(fs.readFileSync(archivoPath));
  const poppinsBuf = new Uint8Array(fs.readFileSync(poppinsPath));

  return [
    {
      name: 'Archivo Black',
      data: archivoBuf,
      weight: 400,
      style: 'normal'
    },
    {
      name: 'Poppins',
      data: poppinsBuf,
      weight: 500,
      style: 'normal'
    }
  ];
}

/**
 * VuePress 2 Plugin: OG Generator
 */
export const ogGeneratorPlugin = (options = {}) => ({
  name: 'vuepress-plugin-og-generator',

  async onInitialized(app) {
    const pluginDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));

    // 1. Load template image
    const templatePath = path.resolve(app.dir.source(), '.vuepress/public/images/og-template.png');
    let templateDataUrl = '';
    if (fs.existsSync(templatePath)) {
      const base64 = fs.readFileSync(templatePath).toString('base64');
      templateDataUrl = `data:image/png;base64,${base64}`;
    } else {
      console.warn(`[og-generator] Template image not found at ${templatePath}`);
    }

    // 2. Load fonts
    let fonts = [];
    try {
      fonts = await loadFonts(pluginDir);
    } catch (err) {
      console.error('[og-generator] Failed to load fonts:', err);
    }

    // Output directories
    const publicDirs = [
      path.resolve(app.dir.source(), '.vuepress/public/images/og-gen'),
      path.resolve(app.dir.source(), 'public/images/og-gen')
    ];

    for (const dir of publicDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    const domain = options.domain || 'https://wwebjs.dev';

    for (const page of app.pages) {
      // Check for manual og:image override in page frontmatter head
      const hasManualOgImage = page.frontmatter.head?.some((item) => {
        if (!Array.isArray(item)) return false;
        const tag = item[0];
        const attrs = item[1] || {};
        return (
          tag === 'meta' &&
          (attrs.property === 'og:image' || attrs.name === 'og:image')
        );
      });

      if (hasManualOgImage) {
        continue;
      }

      // Extract page data
      const title = page.title || page.frontmatter.title || 'whatsapp-web.js';
      const description =
        page.frontmatter.description ||
        'A WhatsApp client library for NodeJS that connects through the WhatsApp Web browser app';
      const slug = getPageSlug(page.path);
      const filename = `${slug}.png`;
      const imageUrl = `${domain}/images/og-gen/${filename}`;

      // Render image using custom og-index.png for index page, or takumi.js for other pages
      try {
        let compressedBuffer;
        const customIndexImagePath = path.resolve(
          app.dir.source(),
          '.vuepress/public/images/og-index.png'
        );

        if (slug === 'index' && fs.existsSync(customIndexImagePath)) {
          const rawBuffer = fs.readFileSync(customIndexImagePath);
          compressedBuffer = await sharp(rawBuffer)
            .png({
              palette: true,
              quality: 90,
              compressionLevel: 9,
              effort: 10
            })
            .toBuffer();
        } else {
          const html = createOgHtmlTemplate({ title, description, templateDataUrl });
          const { node, stylesheets } = fromHtml(html);
          const imageBuffer = await render(node, {
            width: 1834,
            height: 963,
            stylesheets,
            fonts
          });

          // Compress entire generated image using sharp
          compressedBuffer = await sharp(imageBuffer)
            .png({
              palette: true,
              quality: 90,
              compressionLevel: 9,
              effort: 10
            })
            .toBuffer();
        }

        // Save PNG to public output directories
        for (const dir of publicDirs) {
          const outputPath = path.join(dir, filename);
          fs.writeFileSync(outputPath, compressedBuffer);
        }
      } catch (err) {
        console.error(`[og-generator] Failed to render OG image for ${page.path}:`, err);
      }

      // Inject meta tags into page.frontmatter.head
      if (!page.frontmatter.head) {
        page.frontmatter.head = [];
      }

      page.frontmatter.head = page.frontmatter.head.filter((item) => {
        if (!Array.isArray(item)) return true;
        const attrs = item[1] || {};
        return !(
          item[0] === 'meta' &&
          (attrs.property === 'og:image' ||
            attrs.name === 'twitter:image' ||
            attrs.name === 'twitter:card')
        );
      });

      page.frontmatter.head.push(
        ['meta', { property: 'og:image', content: imageUrl }],
        ['meta', { name: 'twitter:image', content: imageUrl }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
      );
    }
  }
});

export default ogGeneratorPlugin;
