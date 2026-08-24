/**
 * Macho Halisi — Image Migration Script
 *
 * Downloads images from the old site and uploads them to Sanity CDN,
 * then patches documents with image references.
 *
 * Run: npx tsx scripts/migrate-images.ts
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Load env
const envPath = path.resolve(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
});

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-08-24",
  token: env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const OLD_SITE = "https://machohalisi.com";

// Temp directory for downloaded images
const TMP_DIR = path.resolve(__dirname, "../tmp-images");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

// ─── Helpers ──────────────────────────────────────────────

function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const request = mod.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location!, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", reject);
    });
    request.on("error", reject);
    request.on("timeout", () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function uploadImageToSanity(
  filepath: string,
  filename: string,
): Promise<string> {
  const buffer = fs.readFileSync(filepath);
  const asset = await client.assets.upload("image", buffer, {
    filename,
  });
  return asset._id;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Image Map: document → image URLs ─────────────────────

interface ImageMapping {
  documentId: string;
  documentType: string;
  field: string;
  url: string;
  filename: string;
}

const imageMappings: ImageMapping[] = [
  // ── Homepage hero slides (6) ──
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "heroSlides[0].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/sliderback.jpg`,
    filename: "hero-slide-1.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "heroSlides[1].image",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider2.jpg`,
    filename: "hero-slide-2.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "heroSlides[2].image",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/4X4-Safari-Vehicle-Macho-Halisi1.jpg`,
    filename: "hero-slide-3.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "heroSlides[3].image",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider4.jpg`,
    filename: "hero-slide-4.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "heroSlides[4].image",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider7.jpg`,
    filename: "hero-slide-5.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "heroSlides[5].image",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/Slider8.jpg`,
    filename: "hero-slide-6.jpg",
  },

  // ── Homepage offering cards (6) ──
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "offeringCards[0].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/Safari-to-Tanzania.jpg`,
    filename: "offering-safaris.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "offeringCards[1].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/mount-Kilimanjaro.jpg`,
    filename: "offering-trekking.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "offeringCards[2].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/zanzibar.jpg`,
    filename: "offering-beach.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "offeringCards[3].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/great-migration.jpg`,
    filename: "offering-migration.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "offeringCards[4].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/cultural.jpg`,
    filename: "offering-cultural.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "offeringCards[5].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/historical-sites.jpg`,
    filename: "offering-historical.jpg",
  },

  // ── Homepage guides section ──
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "guidesSection.image",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/safari-guides.jpg`,
    filename: "guides-section.jpg",
  },

  // ── Tour packages ──
  {
    documentId: "tour-6-days-northern",
    documentType: "tourPackage",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/Safari-to-Tanzania.jpg`,
    filename: "tour-6days-hero.jpg",
  },
  {
    documentId: "tour-7-days-northern",
    documentType: "tourPackage",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/great-migration.jpg`,
    filename: "tour-7days-hero.jpg",
  },
  {
    documentId: "tour-7-days-forest",
    documentType: "tourPackage",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/mount-Kilimanjaro.jpg`,
    filename: "tour-forest-hero.jpg",
  },

  // ── Mountain routes ──
  {
    documentId: "route-kili-marangu",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/mount-Kilimanjaro.jpg`,
    filename: "route-marangu.jpg",
  },
  {
    documentId: "route-kili-rongai",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider4.jpg`,
    filename: "route-rongai.jpg",
  },
  {
    documentId: "route-kili-umbwe",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider4.jpg`,
    filename: "route-umbwe.jpg",
  },
  {
    documentId: "route-kili-machame",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider4.jpg`,
    filename: "route-machame.jpg",
  },
  {
    documentId: "route-kili-lemosho",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/slider4.jpg`,
    filename: "route-lemosho.jpg",
  },
  {
    documentId: "route-meru",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/mount-Kilimanjaro.jpg`,
    filename: "route-meru.jpg",
  },
  {
    documentId: "route-lengai",
    documentType: "route",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/mount-Kilimanjaro.jpg`,
    filename: "route-lengai.jpg",
  },

  // ── Regions ──
  {
    documentId: "region-zanzibar",
    documentType: "region",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/zanzibar.jpg`,
    filename: "region-zanzibar.jpg",
  },
  {
    documentId: "region-swahili-coast",
    documentType: "region",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2019/03/Slider8.jpg`,
    filename: "region-swahili.jpg",
  },
  {
    documentId: "region-northern-circuit",
    documentType: "region",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/Safari-to-Tanzania.jpg`,
    filename: "region-northern.jpg",
  },
  {
    documentId: "region-southern-circuit",
    documentType: "region",
    field: "heroImage",
    url: `${OLD_SITE}/wp-content/uploads/2018/06/Safari-to-Tanzania.jpg`,
    filename: "region-southern.jpg",
  },

  // ── Gallery images ──
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[0].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/serengeti-016.jpg`,
    filename: "gallery-serengeti-016.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[1].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/serengeti-029.jpg`,
    filename: "gallery-serengeti-029.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[2].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/serengeti-032.jpg`,
    filename: "gallery-serengeti-032.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[3].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/serengeti-037.jpg`,
    filename: "gallery-serengeti-037.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[4].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/serengeti-039.jpg`,
    filename: "gallery-serengeti-039.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[5].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/ngorongoro-003.jpg`,
    filename: "gallery-ngorongoro-003.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[6].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/ngorongoro-009.jpg`,
    filename: "gallery-ngorongoro-009.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[7].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/ngorongoro-014.jpg`,
    filename: "gallery-ngorongoro-014.jpg",
  },
  {
    documentId: "homePage-doc",
    documentType: "homePage",
    field: "gallery[8].image",
    url: `${OLD_SITE}/wp-content/uploads/2018/07/ngorongoro-027.jpg`,
    filename: "gallery-ngorongoro-027.jpg",
  },
];

// Group mappings by document to patch once per doc
function groupByDocument(mappings: ImageMapping[]) {
  const grouped: Record<string, ImageMapping[]> = {};
  for (const m of mappings) {
    if (!grouped[m.documentId]) grouped[m.documentId] = [];
    grouped[m.documentId].push(m);
  }
  return grouped;
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🖼️  Starting Image Migration...\n");
  console.log(`   Project: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Source: ${OLD_SITE}`);
  console.log(`   Images to process: ${imageMappings.length}\n`);

  if (!env.SANITY_AUTH_TOKEN) {
    console.error("❌ SANITY_AUTH_TOKEN required");
    process.exit(1);
  }

  let uploaded = 0;
  let failed = 0;
  const assetMap: Record<string, string> = {}; // url → sanity asset _id

  // Step 1: Download and upload all images
  console.log("📥 Step 1: Downloading and uploading images...\n");

  for (const mapping of imageMappings) {
    const cacheKey = mapping.url;
    if (assetMap[cacheKey]) {
      console.log(`  ⏭️  ${mapping.filename} (cached)`);
      continue;
    }

    const tmpFile = path.join(TMP_DIR, mapping.filename);
    try {
      process.stdout.write(`  ⬇️  ${mapping.filename}...`);
      await downloadFile(mapping.url, tmpFile);

      process.stdout.write(" ⬆️ uploading...");
      const assetId = await uploadImageToSanity(tmpFile, mapping.filename);
      assetMap[cacheKey] = assetId;
      uploaded++;

      console.log(` ✓ (${assetId})`);
      await sleep(200); // rate limit
    } catch (err: any) {
      failed++;
      console.log(` ✗ ${err.message}`);
    }
  }

  console.log(`\n   Uploaded: ${uploaded}, Failed: ${failed}\n`);

  // Step 2: Patch documents with image references
  console.log("🔗 Step 2: Patching documents with image references...\n");

  const grouped = groupByDocument(imageMappings);

  for (const [docId, mappings] of Object.entries(grouped)) {
    const patches: Record<string, any> = {};

    for (const m of mappings) {
      const assetId = assetMap[m.url];
      if (!assetId) continue;

      // Build nested patch object from field path
      // e.g. "heroSlides[0].image" → { heroSlides: [{ image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } } }] }
      const parts = m.field.replace(/\[(\d+)\]/g, ".$1").split(".");
      let current = patches;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const next = parts[i + 1];
        if (!current[part]) current[part] = {};
        // If next part is a number, ensure array structure
        if (/^\d+$/.test(next)) {
          if (!Array.isArray(current[part])) {
            current[part] = [];
          }
          const idx = parseInt(next);
          if (!current[part][idx]) current[part][idx] = {};
          current = current[part][idx];
        } else {
          current = current[part];
        }
      }

      // Set the image value at the leaf
      const lastPart = parts[parts.length - 1];
      current[lastPart] = {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      };
    }

    // Use a simpler approach: build a GROQ patch
    // For array items, we need to patch the entire array
    const patchSets: string[] = [];
    const patchValues: Record<string, any> = {};

    for (const m of mappings) {
      const assetId = assetMap[m.url];
      if (!assetId) continue;

      const fieldKey = m.field.replace(/\[(\d+)\]/g, "_$1");
      patchSets.push(`"${m.field}" = ${fieldKey}`);
      patchValues[fieldKey] = {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      };
    }

    if (patchSets.length === 0) continue;

    try {
      // For homePage hero slides and offering cards, we need to patch the entire arrays
      if (docId === "homePage-doc") {
        // Fetch current document to merge
        const current = await client.fetch<any>(
          `*[_id == "${docId}"][0]`,
        );

        // Patch hero slides with images
        const heroSlides = current?.heroSlides || [];
        const offeringCards = current?.offeringCards || [];
        const gallery = current?.gallery || [];
        const guidesSection = current?.guidesSection || {};

        // Build updated hero slides
        const updatedHeroSlides = heroSlides.map(
          (slide: any, idx: number) => {
            const mapping = mappings.find(
              (m) => m.field === `heroSlides[${idx}].image`,
            );
            if (mapping && assetMap[mapping.url]) {
              return {
                ...slide,
                image: {
                  _type: "image",
                  asset: { _type: "reference", _ref: assetMap[mapping.url] },
                },
              };
            }
            return slide;
          },
        );

        // Build updated offering cards
        const updatedOfferingCards = offeringCards.map(
          (card: any, idx: number) => {
            const mapping = mappings.find(
              (m) => m.field === `offeringCards[${idx}].image`,
            );
            if (mapping && assetMap[mapping.url]) {
              return {
                ...card,
                image: {
                  _type: "image",
                  asset: { _type: "reference", _ref: assetMap[mapping.url] },
                },
              };
            }
            return card;
          },
        );

        // Build updated gallery
        const updatedGallery = gallery.map((item: any, idx: number) => {
          const mapping = mappings.find(
            (m) => m.field === `gallery[${idx}].image`,
          );
          if (mapping && assetMap[mapping.url]) {
            return {
              ...item,
              image: {
                _type: "image",
                asset: { _type: "reference", _ref: assetMap[mapping.url] },
              },
            };
          }
          return item;
        });

        // Build updated guides section
        const guidesMapping = mappings.find(
          (m) => m.field === "guidesSection.image",
        );
        const updatedGuides = guidesMapping
          ? {
              ...guidesSection,
              image: {
                _type: "image",
                asset: {
                  _type: "reference",
                  _ref: assetMap[guidesMapping.url],
                },
              },
            }
          : guidesSection;

        await client
          .patch(docId)
          .set({
            heroSlides: updatedHeroSlides,
            offeringCards: updatedOfferingCards,
            gallery: updatedGallery,
            guidesSection: updatedGuides,
          })
          .commit();

        console.log(`  ✓ ${docId} — patched ${mappings.length} images`);
      } else {
        // For other documents, patch heroImage or single image fields
        for (const m of mappings) {
          const assetId = assetMap[m.url];
          if (!assetId) continue;

          const fieldKey = m.field;
          await client
            .patch(docId)
            .set({
              [fieldKey]: {
                _type: "image",
                asset: { _type: "reference", _ref: assetId },
              },
            })
            .commit();
        }
        console.log(`  ✓ ${docId} — patched ${mappings.length} image(s)`);
      }
    } catch (err: any) {
      console.log(`  ✗ ${docId} — ${err.message}`);
    }
  }

  // Cleanup tmp files
  console.log("\n🧹 Cleaning up temp files...");
  fs.rmSync(TMP_DIR, { recursive: true, force: true });

  console.log("\n✅ Image migration complete!");
  console.log(`   Total uploaded: ${uploaded} images`);
  console.log(`   Failed: ${failed}`);
}

main();
