/**
 * Macho Halisi — Sanity Content Migration Script
 *
 * Run: npx tsx scripts/migrate-content.ts
 *
 * Requires SANITY_AUTH_TOKEN in .env.local (a write token from sanity.io/manage)
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

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

// ─── Helpers ──────────────────────────────────────────────

async function createOrReplace(doc: { _id: string; _type: string; [key: string]: unknown }) {
  const result = await client.createOrReplace(doc as any);
  console.log(`  ✓ ${doc._type}: ${doc.title || doc.name || doc._id}`);
  return result;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── 1. Site Settings ─────────────────────────────────────

async function migrateSiteSettings() {
  console.log("\n📋 Migrating Site Settings...");
  await createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: "Macho Halisi Tanzania Safaris",
    tagline:
      "Serengeti National Park Safaris, Ngorongoro Crater, Tarangire, Mount Kilimanjaro",
    slogan: "Your Passport to Adventure 365 Days a Year",
    phone: "+255 754 474 792",
    email: "info@machohalisi.com",
    socialLinks: {
      facebook: "https://www.facebook.com/MACHOHALISITOUR/",
    },
    footerText: "© 2026 Macho Halisi LTD. All rights reserved.",
  });
}

// ─── 2. Navigation ────────────────────────────────────────

async function migrateNavigation() {
  console.log("\n🧭 Migrating Navigation...");

  // We'll create the nav after all content is created so references work
  // For now, create placeholder references
  await createOrReplace({
    _id: "navigation-main",
    _type: "navigation",
    title: "Main Navigation",
    items: [
      { label: "Home", link: { _ref: "homePage", _type: "homePage" } },
      {
        label: "About Us",
        children: [
          {
            label: "Our Company",
            link: { _ref: "page-our-company", _type: "page" },
          },
          {
            label: "Why Book With Us",
            link: { _ref: "page-why-book", _type: "page" },
          },
        ],
      },
      {
        label: "Safaris",
        children: [
          {
            label: "6 Days Northern Parks",
            link: { _ref: "tour-6-days-northern", _type: "tourPackage" },
          },
          {
            label: "7 Days Northern Parks",
            link: { _ref: "tour-7-days-northern", _type: "tourPackage" },
          },
          {
            label: "7 Days Forest & Plains",
            link: { _ref: "tour-7-days-forest", _type: "tourPackage" },
          },
        ],
      },
      {
        label: "Mountain Trekking",
        children: [
          {
            label: "Kilimanjaro Routes",
            children: [
              {
                label: "Marangu Route (5 Days)",
                link: { _ref: "route-kili-marangu", _type: "route" },
              },
              {
                label: "Rongai Route (5-6 Days)",
                link: { _ref: "route-kili-rongai", _type: "route" },
              },
              {
                label: "Umbwe Route (6 Days)",
                link: { _ref: "route-kili-umbwe", _type: "route" },
              },
              {
                label: "Machame Route (7 Days)",
                link: { _ref: "route-kili-machame", _type: "route" },
              },
              {
                label: "Lemosho Route (8 Days)",
                link: { _ref: "route-kili-lemosho", _type: "route" },
              },
            ],
          },
          {
            label: "Mount Meru",
            link: { _ref: "route-meru", _type: "route" },
          },
          {
            label: "Ol'doinyo Lengai",
            link: { _ref: "route-lengai", _type: "route" },
          },
        ],
      },
      {
        label: "Zanzibar",
        children: [
          {
            label: "General Information",
            link: { _ref: "region-zanzibar", _type: "region" },
          },
          {
            label: "Stone Town Tour",
            link: { _ref: "page-stone-town", _type: "page" },
          },
          {
            label: "Spice Tour",
            link: { _ref: "page-spice-tour", _type: "page" },
          },
          {
            label: "Jozani Forest",
            link: { _ref: "page-jozani-forest", _type: "page" },
          },
          {
            label: "North Coast",
            link: { _ref: "page-north-coast", _type: "page" },
          },
        ],
      },
      {
        label: "Swahili Coast",
        children: [
          {
            label: "Pangani",
            link: { _ref: "region-swahili-coast", _type: "region" },
          },
          {
            label: "Saadani National Park",
            link: { _ref: "page-saadani", _type: "page" },
          },
          {
            label: "Bagamoyo",
            link: { _ref: "page-bagamoyo", _type: "page" },
          },
        ],
      },
      {
        label: "Accommodation",
        children: [
          {
            label: "Northern Circuit",
            children: [
              {
                label: "Arusha",
                link: { _ref: "accom-arusha", _type: "accommodation" },
              },
              {
                label: "Tarangire",
                link: { _ref: "accom-tarangire", _type: "accommodation" },
              },
              {
                label: "Lake Manyara",
                link: { _ref: "accom-manyara", _type: "accommodation" },
              },
              {
                label: "Ngorongoro",
                link: { _ref: "accom-ngorongoro", _type: "accommodation" },
              },
              {
                label: "Serengeti",
                link: { _ref: "accom-serengeti", _type: "accommodation" },
              },
            ],
          },
          {
            label: "Southern Circuit",
            link: { _ref: "accom-southern", _type: "accommodation" },
          },
          {
            label: "Zanzibar",
            link: { _ref: "accom-zanzibar", _type: "accommodation" },
          },
          {
            label: "Swahili Coast",
            link: { _ref: "accom-swahili", _type: "accommodation" },
          },
        ],
      },
      {
        label: "Travel Info",
        children: [
          {
            label: "FAQs",
            link: { _ref: "travel-faqs", _type: "travelInfoArticle" },
          },
          {
            label: "Climate & Clothing",
            link: { _ref: "travel-climate", _type: "travelInfoArticle" },
          },
          {
            label: "Safari Guidelines",
            link: { _ref: "travel-guidelines", _type: "travelInfoArticle" },
          },
          {
            label: "Photography",
            link: { _ref: "travel-photography", _type: "travelInfoArticle" },
          },
          {
            label: "Currency",
            link: { _ref: "travel-currency", _type: "travelInfoArticle" },
          },
          {
            label: "Park Rules",
            link: { _ref: "travel-park-rules", _type: "travelInfoArticle" },
          },
          {
            label: "Tipping",
            link: { _ref: "travel-tipping", _type: "travelInfoArticle" },
          },
          {
            label: "Health & Safety",
            link: { _ref: "travel-health-safety", _type: "travelInfoArticle" },
          },
        ],
      },
      {
        label: "Contacts",
        link: { _ref: "page-contacts", _type: "page" },
      },
    ],
  });
}

// ─── 3. Regions ───────────────────────────────────────────

async function migrateRegions() {
  console.log("\n🌍 Migrating Regions...");

  await createOrReplace({
    _id: "region-zanzibar",
    _type: "region",
    name: "Zanzibar",
    slug: { current: "zanzibar" },
    description:
      "Zanzibar is one of the Indian Ocean islands situated on the Swahili Coast, adjacent to Tanzania Mainland. The island is a tranquil, coastal location where you can spend long hours on your idyllic Indian Ocean vacation, strolling along the beaches with soft, delicate white sands sinking below your feet.",
    highlights: [
      "Spectacular sun rises from the east coast",
      "Golden sunsets on the west coast",
      "Exceptional diversity of accommodation",
      "Crystal clear turquoise waters",
      "Traditional fishing dhows",
    ],
    bestTimeToVisit: "June to October (dry season), December to February",
    seo: {
      metaTitle: "Zanzibar Beach Holiday | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Discover Zanzibar's white sandy beaches, crystal clear waters, and rich cultural heritage. Book your Indian Ocean beach holiday with Macho Halisi.",
    },
  });

  await createOrReplace({
    _id: "region-swahili-coast",
    _type: "region",
    name: "Swahili Coast",
    slug: { current: "swahili-coast" },
    description:
      "The coast of Tanzania is blessed with miles of white sandy beaches, tropical oceans, friendly people and blissful absence of large resorts. Life on the coast is laid back with sisal and coconut plantations.",
    highlights: [
      "Miles of white sandy beaches",
      "No large resorts",
      "Laid-back coastal lifestyle",
      "Sisal and coconut plantations",
      "Rich Swahili culture",
    ],
    bestTimeToVisit: "June to October (dry season)",
    seo: {
      metaTitle: "Swahili Coast Tanzania | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Explore Tanzania's Swahili Coast - Pangani, Saadani, and Bagamoyo. White sandy beaches, rich culture, and wildlife encounters.",
    },
  });

  // Region pages for Northern Circuit (used by accommodation references)
  await createOrReplace({
    _id: "region-northern-circuit",
    _type: "region",
    name: "Northern Circuit",
    slug: { current: "northern-circuit" },
    description:
      "The Northern Safari Circuit is Tanzania's most popular safari destination, home to the Serengeti, Ngorongoro Crater, Tarangire, and Lake Manyara.",
    highlights: [
      "Serengeti National Park",
      "Ngorongoro Crater",
      "Tarangire National Park",
      "Lake Manyara National Park",
      "Mount Kilimanjaro",
    ],
    bestTimeToVisit: "Year-round, with peak season June to October",
    seo: {
      metaTitle: "Northern Safari Circuit | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Explore Tanzania's Northern Safari Circuit - Serengeti, Ngorongoro, Tarangire, and more.",
    },
  });

  await createOrReplace({
    _id: "region-southern-circuit",
    _type: "region",
    name: "Southern Circuit",
    slug: { current: "southern-circuit" },
    description:
      "Tanzania's Southern Circuit offers a more remote and wild safari experience with fewer crowds.",
    highlights: [
      "Selous Game Reserve",
      "Mikumi National Park",
      "Ruaha National Park",
    ],
    bestTimeToVisit: "June to October",
    seo: {
      metaTitle: "Southern Safari Circuit | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Discover Tanzania's Southern Safari Circuit - Selous, Mikumi, Ruaha, and more.",
    },
  });
}

// ─── 4. Tour Packages ─────────────────────────────────────

async function migrateTourPackages() {
  console.log("\n🦁 Migrating Tour Packages...");

  await createOrReplace({
    _id: "tour-6-days-northern",
    _type: "tourPackage",
    title: "6 Days in Northern Park Safaris",
    slug: { current: "6-days-northern-park-safaris" },
    category: "wildlife",
    duration: 6,
    highlights: [
      "Lake Manyara National Park",
      "Bushmen cultural visit at Lake Eyasi",
      "Serengeti National Park",
      "Olduvai Gorge",
      "Ngorongoro Crater",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Lake Manyara",
        description:
          "Depart Arusha for a game drive in Lake Manyara National Park, on the floor of the Great Rift Valley, with diverse ecosystems and famous for elephant, birdlife and hippos. Continue to the Highland town of Karatu for dinner and overnight.",
      },
      {
        day: 2,
        title: "Lake Eyasi Cultural Visit",
        description:
          "Enjoy a day trip to the Lake Eyasi area where you'll visit with the remaining tribe of Bushmen in East Africa, the Wa-Haadzabe. Return to Karatu for dinner and overnight.",
      },
      {
        day: 3,
        title: "Karatu to Serengeti",
        description:
          "Depart for Serengeti National Park; home to the greatest wildlife spectacle on earth.",
      },
      {
        day: 4,
        title: "Full Day Serengeti",
        description:
          "Full day's game driving in Serengeti National Park.",
      },
      {
        day: 5,
        title: "Serengeti to Ngorongoro",
        description:
          "Travel to the Ngorongoro Conservation Area where you'll enjoy a tour of the world famous Olduvai Gorge, followed by a trip to the Ngorongoro Crater, Africa's 'Garden of Eden'. Afternoon drive back to the lovely highland town of Karatu.",
      },
      {
        day: 6,
        title: "Karatu to Arusha",
        description:
          "Leisurely morning at the lodge and return to Arusha after lunch.",
      },
    ],
    inclusions:
      "Safari briefing, full board accommodation, transport in customized 4x4 safari vehicles, park and community entrance fees, safari activities as specified, bottled water during game drives.",
    exclusions:
      "International and domestic airfares, visa and passport fees, laundry, beverages at camps and lodges, items of personal nature, gratuities, personal trip cancellation and medical insurance, medical evacuation.",
    region: { _ref: "region-northern-circuit", _type: "region" },
    seo: {
      metaTitle: "6 Days Northern Park Safaris | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Experience the best of Tanzania's northern safari circuit in 6 days - Lake Manyara, Serengeti, Ngorongoro Crater, and cultural encounters.",
    },
  });

  await createOrReplace({
    _id: "tour-7-days-northern",
    _type: "tourPackage",
    title: "7 Days in Northern Parks Safari",
    slug: { current: "7-days-in-northern-parks-safari" },
    category: "wildlife",
    duration: 7,
    highlights: [
      "Lake Manyara National Park",
      "Serengeti National Park with night game drive",
      "Maasai boma visit",
      "Olduvai Gorge",
      "Ngorongoro Crater full day",
      "Wa-Hadzabe bushmen visit",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Lake Manyara",
        description:
          "Depart Arusha for a game drive in Lake Manyara National Park, on the floor of the Great Rift Valley, with diverse eco-systems and famous for elephant, birdlife and hippos. Continue to the Highland town of Karatu for dinner and overnight.",
      },
      {
        day: 2,
        title: "Karatu to Serengeti",
        description:
          "Proceed to Serengeti National Park to view the most prolific wildlife spectacle on earth.",
      },
      {
        day: 3,
        title: "Full Day Serengeti",
        description:
          "Full day's game driving in Serengeti National Park. Night game drive if possible.",
      },
      {
        day: 4,
        title: "Serengeti to Ngorongoro",
        description:
          "Next stop, the Ngorongoro Conservation Area where you'll enjoy a visit to a traditional Maasai boma (village) and a tour of the world famous Olduvai Gorge, home to many discoveries about the anthropology of early man and his ancestors.",
      },
      {
        day: 5,
        title: "Ngorongoro Crater",
        description:
          "Full day game drive in Ngorongoro Crater, Africa's 'Garden of Eden'.",
      },
      {
        day: 6,
        title: "Lake Eyasi Cultural Visit",
        description:
          "Visit the Lake Eyasi area to observe the remaining tribe of bushmen in East Africa, the Wa-Hadzabe.",
      },
      {
        day: 7,
        title: "Karatu to Arusha",
        description:
          "Leisurely morning at the lodge and return to Arusha after lunch.",
      },
    ],
    inclusions:
      "Safari briefing, full board accommodation, transport in customized 4x4 safari vehicles, park and community entrance fees, safari activities as specified, bottled water during game drives.",
    exclusions:
      "International and domestic airfares, visa and passport fees, laundry, beverages at camps and lodges, items of personal nature, gratuities, personal trip cancellation and medical insurance, medical evacuation.",
    region: { _ref: "region-northern-circuit", _type: "region" },
    seo: {
      metaTitle: "7 Days Northern Parks Safari | Macho Halisi Tanzania Safaris",
      metaDescription:
        "A comprehensive 7-day Tanzania safari covering Lake Manyara, Serengeti, Ngorongoro Crater, and cultural encounters with the Maasai and Hadzabe tribes.",
    },
  });

  await createOrReplace({
    _id: "tour-7-days-forest",
    _type: "tourPackage",
    title: "7 Days Forest and Plains Safari",
    slug: { current: "7-days-forest-and-plains-safari" },
    category: "wildlife",
    duration: 7,
    highlights: [
      "Tarangire National Park",
      "Ngorongoro Crater game drive",
      "Serengeti National Park",
      "Olduvai Gorge",
      "Lake Eyasi bushmen visit",
      "Forest hike near Ngorongoro",
      "Lake Manyara National Park",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Tarangire",
        description:
          "Early departure from Arusha for a game drive in Tarangire National Park. In the dry season Tarangire is teeming with elephant, wildebeest and zebra and is known for wonderful leopard sightings. Continue to the highland town of Karatu for dinner and overnight.",
      },
      {
        day: 2,
        title: "Ngorongoro to Serengeti",
        description:
          "Depart for the World Heritage Site, Ngorongoro Crater. After a game drive and lunch in the crater continue on to Serengeti National Park.",
      },
      {
        day: 3,
        title: "Full Day Serengeti",
        description:
          "Full day's game driving in Serengeti National Park.",
      },
      {
        day: 4,
        title: "Olduvai Gorge",
        description:
          "Visit the famous Olduvai Gorge, site of years of excavation works by the Leakey family and various universities. Learn about the anthropology of man's earliest ancestors. In the evening return to the beautiful highland area around Karatu.",
      },
      {
        day: 5,
        title: "Lake Eyasi Cultural Visit",
        description:
          "Enjoy a day trip to the Lake Eyasi area where you'll visit with the remaining tribe of Bushmen in East Africa, the Wa-Haadzabe. Return to Karatu for dinner and overnight.",
      },
      {
        day: 6,
        title: "Forest Hike",
        description:
          "Hike in the nearby forest adjacent to the Ngorongoro Conservation Area.",
      },
      {
        day: 7,
        title: "Lake Manyara to Arusha",
        description:
          "Full day's game drive with picnic lunch in the diverse Lake Manyara National Park. Return to Arusha by evening.",
      },
    ],
    inclusions:
      "Safari briefing, full board accommodation, transport in customized 4x4 safari vehicles, park and community entrance fees, safari activities as specified, bottled water during game drives.",
    exclusions:
      "International and domestic airfares, visa and passport fees, laundry, beverages at camps and lodges, items of personal nature, gratuities, personal trip cancellation and medical insurance, medical evacuation.",
    region: { _ref: "region-northern-circuit", _type: "region" },
    seo: {
      metaTitle: "7 Days Forest and Plains Safari | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Experience Tanzania's forests and plains on this 7-day safari covering Tarangire, Serengeti, Ngorongoro, and Lake Manyara.",
    },
  });
}

// ─── 5. Mountain Routes ───────────────────────────────────

async function migrateRoutes() {
  console.log("\n⛰️  Migrating Mountain Routes...");

  // Kilimanjaro Overview
  await createOrReplace({
    _id: "route-kili-marangu",
    _type: "route",
    title: "5 Days Kilimanjaro - Marangu Route",
    slug: { current: "5-days-kilimanjaro-marangu-route" },
    mountain: "kilimanjaro",
    duration: 5,
    difficulty: "moderate",
    bestSeason: "June to September, February to March",
    highlights: [
      "Most popular route (Coca Cola route)",
      "Hut accommodation",
      "Rainforest, moorland, and alpine desert zones",
      "Sunrise from Uhuru Peak",
    ],
    overview:
      "The Marangu Route is the most popular and therefore the most heavily travelled. Overnights are spent in 'huts' by the tourists climbing the mountain.",
    itinerary: [
      {
        day: 1,
        title: "Marangu Gate to Mandara Hut",
        description:
          "One or two hours is spent at Marangu Gate Headquarters for registration and payment of fees. From Marangu Gate at 18,000 meters, the trail leads through lush rain forest. About an hour and half from the gate it is possible to cross the stream and rejoin the main trail. Both paths continue on opposite sides of the stream, merging one hour before Mandara Hut, located at 2,700 meters. From Mandara Hut it's a short walk to the Maundi Crater for a scenic view.",
        altitude: "2,700m (8,856 ft)",
        trekkingHours: "5-6",
        overnight: "Mandara Hut",
      },
      {
        day: 2,
        title: "Mandara Hut to Horombo Hut",
        description:
          "The morning is spent walking over the steep slopes and rushing streams of the giant heather forest, after which the track opens out into the southern slopes of Mawenzi running through a band of moorland. Five hours and fourteen kilometers from Mandara bring you to Horombo Hut at 3,810 meters.",
        altitude: "3,810m (12,500 ft)",
        trekkingHours: "5-6",
        overnight: "Horombo Hut",
      },
      {
        day: 3,
        title: "Horombo Hut to Kibo Hut",
        description:
          "A valley behind Horombo leads straight up to the barren and rockstrewn saddle between Kibo and Mawenzi passing Zebra Rocks on the way. It is thirteen kilometres and seven hours to Kibo Hut at 4,725 meters.",
        altitude: "4,725m (15,500 ft)",
        trekkingHours: "7",
        overnight: "Kibo Hut",
      },
      {
        day: 4,
        title: "Summit Day - Uhuru Peak",
        description:
          "The climb begins shortly after midnight. The first part of the trail is uneven and leads to Hans Meyer Cave. From the cave the path switchbacks most of the way to the top, with a last scramble over rocks to Gillman's Point. From there the trail continues along the rim past Stella Point to the triumphant Uhuru Peak at 19,340 feet.",
        altitude: "5,895m (19,340 ft) - Uhuru Peak",
        trekkingHours: "6-8",
        overnight: "Horombo Hut",
      },
      {
        day: 5,
        title: "Descent to Marangu Gate",
        description:
          "The descent continues from Horombo to Mandara Hut, which is reached by lunch time, then proceeds to the park gate and Marangu in the afternoon.",
        altitude: "1,800m (5,904 ft)",
        trekkingHours: "5-6",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "5 Days Kilimanjaro Marangu Route | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb Kilimanjaro via the classic Marangu Route in 5 days. Hut accommodation, rainforest to summit experience.",
    },
  });

  await createOrReplace({
    _id: "route-kili-rongai",
    _type: "route",
    title: "5-6 Days Kilimanjaro - Rongai Route",
    slug: { current: "5-6-days-kilimanjaro-rongai-route" },
    mountain: "kilimanjaro",
    duration: 6,
    difficulty: "moderate",
    bestSeason: "June to October",
    highlights: [
      "Less crowded northern approach",
      "Excellent wildlife sightings",
      "Diverse vegetation zones",
    ],
    overview:
      "The Rongai Route approaches from the north, offering a quieter and more wilderness experience.",
    itinerary: [
      {
        day: 1,
        title: "Marangu Gate to Mandara Hut",
        description:
          "Registration at Marangu Gate followed by trek through lush rainforest to Mandara Hut at 2,700 meters.",
        altitude: "2,700m",
        trekkingHours: "5-6",
        overnight: "Mandara Hut",
      },
      {
        day: 2,
        title: "Mandara Hut to Horombo Hut",
        description:
          "Trek through giant heather forest and moorland to Horombo Hut.",
        altitude: "3,810m",
        trekkingHours: "5-6",
        overnight: "Horombo Hut",
      },
      {
        day: 3,
        title: "Horombo Hut to Kibo Hut",
        description:
          "Ascend through the saddle between Kibo and Mawenzi to Kibo Hut.",
        altitude: "4,725m",
        trekkingHours: "7",
        overnight: "Kibo Hut",
      },
      {
        day: 4,
        title: "Summit Day",
        description:
          "Midnight start for the summit attempt via Gillman's Point to Uhuru Peak.",
        altitude: "5,895m",
        trekkingHours: "6-8",
        overnight: "Horombo Hut",
      },
      {
        day: 5,
        title: "Descent",
        description:
          "Descend to Marangu Gate and transfer back to lodge.",
        altitude: "1,800m",
        trekkingHours: "5-6",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "5-6 Days Kilimanjaro Rongai Route | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb Kilimanjaro via the quieter Rongai Route. 5-6 day itinerary with excellent acclimatization.",
    },
  });

  await createOrReplace({
    _id: "route-kili-umbwe",
    _type: "route",
    title: "6 Days Kilimanjaro - Umbwe Route",
    slug: { current: "6-days-kilimanjaro-umbwe-route" },
    mountain: "kilimanjaro",
    duration: 6,
    difficulty: "challenging",
    bestSeason: "June to October, February to March",
    highlights: [
      "Steepest and most direct route",
      "Dense rainforest start",
      "Barranco Wall scramble",
      "Fewer crowds",
    ],
    overview:
      "The Umbwe Route is the most direct and challenging route up Kilimanjaro, offering a more adventurous experience.",
    itinerary: [
      {
        day: 1,
        title: "Umbwe Gate to Umbwe Caves Camp",
        description:
          "The climb starts after a hearty breakfast and comprehensive climb briefing. The rugged path leads through thick forest of roots and rocks. Overnight at the forested Umbwe Caves camp.",
        altitude: "2,850m (9,500 ft)",
        trekkingHours: "6-7",
        overnight: "Umbwe Caves Camp",
      },
      {
        day: 2,
        title: "Umbwe Caves to Barranco Camp",
        description:
          "Continue up through the forest. The taller trees give way to Giant Erica and Giant Heather. After lunch, encounter giant groundsels and giant lobelia as you enter the Moorland zone.",
        altitude: "3,960m (13,004 ft)",
        trekkingHours: "6-7",
        overnight: "Barranco Camp",
      },
      {
        day: 3,
        title: "Barranco Wall to Karanga Camp",
        description:
          "The day begins with a scramble up the steep Barranco Wall exposing you to altitudes upwards of 14,000 feet in the Alpine Desert zone.",
        altitude: "4,033m (13,231 ft)",
        trekkingHours: "4-5",
        overnight: "Karanga Camp",
      },
      {
        day: 4,
        title: "Karanga to Barafu Camp",
        description:
          "The trail turns steadily uphill. Barafu Camp is set on an exposed ridge, acting as base camp for the summit attempt at midnight.",
        altitude: "4,673m (15,331 ft)",
        trekkingHours: "5-6",
        overnight: "Barafu Camp",
      },
      {
        day: 5,
        title: "Summit Day",
        description:
          "Awoken before midnight, set out for the summit. Sun rises over Mawenzi as you reach Stella Point, then continue to Uhuru Peak. Descend to Mweka Camp.",
        altitude: "5,895m (19,340 ft) - Uhuru Peak",
        trekkingHours: "6-8 to summit / 5-7 to Mweka",
        overnight: "Mweka Camp",
      },
      {
        day: 6,
        title: "Descent to Mweka Gate",
        description:
          "Complete your descent through the rainforest to the Mweka Gate.",
        altitude: "1,640m",
        trekkingHours: "4-5",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "6 Days Kilimanjaro Umbwe Route | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb Kilimanjaro via the challenging Umbwe Route in 6 days. Steepest and most direct route to the summit.",
    },
  });

  await createOrReplace({
    _id: "route-kili-machame",
    _type: "route",
    title: "7 Days Kilimanjaro - Machame Route",
    slug: { current: "7-days-kilimanjaro-machame-route" },
    mountain: "kilimanjaro",
    duration: 7,
    difficulty: "challenging",
    bestSeason: "June to October, January to March",
    highlights: [
      "Scenic 'Whiskey Route'",
      "Barranco Wall",
      "Excellent acclimatization",
      "Diverse landscapes",
    ],
    overview:
      "The Machame Route, also known as the 'Whiskey Route', is one of the most scenic routes up Kilimanjaro.",
    itinerary: [
      {
        day: 1,
        title: "Machame Gate to Mti Mkubwa",
        description:
          "Transfer to Machame gate for entrance formalities. Hike through the rain forest for 3-4 hours.",
        altitude: "2,650m",
        trekkingHours: "3-4",
        overnight: "Mti Mkubwa Camp",
      },
      {
        day: 2,
        title: "Mti Mkubwa to Shira Camp",
        description:
          "Cross the valley and continue along the steep ridge through heather, turning west into a river gorge.",
        altitude: "3,800m",
        trekkingHours: "6-7",
        overnight: "Shira Camp",
      },
      {
        day: 3,
        title: "Shira to Barranco Camp",
        description:
          "Continue walking towards the glacier streams.",
        altitude: "3,900m",
        trekkingHours: "6-7",
        overnight: "Barranco Camp",
      },
      {
        day: 4,
        title: "Barranco Wall to Karanga Camp",
        description:
          "Start the trek by climbing Barranco Wall then hiking for another 3-4 hours.",
        altitude: "3,900m",
        trekkingHours: "4-5",
        overnight: "Karanga Camp",
      },
      {
        day: 5,
        title: "Karanga to Barafu Camp",
        description:
          "Spend the day trekking about 4 hours to Barafu.",
        altitude: "4,600m",
        trekkingHours: "4",
        overnight: "Barafu Camp",
      },
      {
        day: 6,
        title: "Summit Day",
        description:
          "Early start to the summit, Uhuru Peak, the highest point in Africa at 5,895m. From here descend to Mweka camp.",
        altitude: "5,895m (19,340 ft)",
        trekkingHours: "6-8",
        overnight: "Mweka Camp",
      },
      {
        day: 7,
        title: "Descent to Mweka Gate",
        description:
          "Continue down to Mweka Gate.",
        altitude: "1,640m",
        trekkingHours: "4-5",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "7 Days Kilimanjaro Machame Route | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb Kilimanjaro via the scenic Machame Route in 7 days. Known as the Whiskey Route for its stunning landscapes.",
    },
  });

  await createOrReplace({
    _id: "route-kili-lemosho",
    _type: "route",
    title: "8 Days Kilimanjaro - Lemosho Route",
    slug: { current: "8-days-kilimanjaro-lemosho-route" },
    mountain: "kilimanjaro",
    duration: 8,
    difficulty: "challenging",
    bestSeason: "June to October, January to March",
    highlights: [
      "Most scenic route",
      "Western approach through rainforest",
      "Wildlife sightings (buffalo, elephant, monkeys)",
      "Excellent acclimatization profile",
      "Lava Tower",
    ],
    overview:
      "The Lemosho Route ascends through the western part of the mountain where one can enjoy the tranquil beautiful scenery of the rain forest and sometimes see animals such as buffalo, elephant and monkeys.",
    itinerary: [
      {
        day: 1,
        title: "Lemosho Gate to Mti Mkubwa",
        description:
          "Transfer to the Lemosho Gate for entrance formalities. Hike through the rain forest for 3-4 hours.",
        altitude: "2,650m",
        trekkingHours: "3-4",
        overnight: "Mti Mkubwa Camp",
      },
      {
        day: 2,
        title: "Mti Mkubwa to Shira One",
        description:
          "After breakfast leave Mti Mkubwa, trekking through the Shira Plateaus for 4-5 hours.",
        altitude: "3,650m",
        trekkingHours: "4-5",
        overnight: "Shira One",
      },
      {
        day: 3,
        title: "Shira One to Shira Two",
        description:
          "Hike through the moorland zone to desert for about 3-4 hours.",
        altitude: "3,800m",
        trekkingHours: "3-4",
        overnight: "Shira Two",
      },
      {
        day: 4,
        title: "Shira to Barranco via Lava Tower",
        description:
          "Pass through Shira Plateau and Lava Tower (4,630m), then descend to Barranco Hut.",
        altitude: "3,930m",
        trekkingHours: "6-7",
        overnight: "Barranco Camp",
      },
      {
        day: 5,
        title: "Barranco Wall to Karanga",
        description:
          "Start the trek by climbing the Barranco wall, and continue trekking for 3-4 hours.",
        altitude: "3,900m",
        trekkingHours: "4-5",
        overnight: "Karanga Camp",
      },
      {
        day: 6,
        title: "Karanga to Barafu",
        description:
          "Today it's possible to see the Western Breach. 2-3 hours trekking.",
        altitude: "4,600m",
        trekkingHours: "2-3",
        overnight: "Barafu Camp",
      },
      {
        day: 7,
        title: "Summit Day",
        description:
          "Begin the steep 7-8 hour climb to Stella Point at night, arriving at sunrise. Continue to Uhuru Peak, two hours round trip, before hiking down to Mweka.",
        altitude: "5,895m (19,340 ft)",
        trekkingHours: "7-8",
        overnight: "Mweka Camp",
      },
      {
        day: 8,
        title: "Descent",
        description:
          "After breakfast it's about a three hour descent off the mountain.",
        altitude: "1,640m",
        trekkingHours: "3",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "8 Days Kilimanjaro Lemosho Route | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb Kilimanjaro via the scenic Lemosho Route in 8 days. Best acclimatization profile and stunning western approach.",
    },
  });

  // Mount Meru
  await createOrReplace({
    _id: "route-meru",
    _type: "route",
    title: "Mount Meru",
    slug: { current: "mount-meru" },
    mountain: "meru",
    duration: 4,
    difficulty: "challenging",
    bestSeason: "October to February",
    highlights: [
      "Tanzania's second highest peak",
      "Arusha National Park gateway",
      "Armed guard escort through wildlife",
      "Perfect Kilimanjaro acclimatization",
      "Volcanic cones and steam hisses",
    ],
    overview:
      "Mt Meru is Kilimanjaro's 'little sister', still among the highest peaks in Africa. It's a shorter climb and still quite challenging. The views of Meru from the top are stunning. Tanzania's second highest mountain ripples with a velvet green texture and her tip is often shrouded in an ethereal mist.",
    itinerary: [
      {
        day: 1,
        title: "Start",
        description:
          "Begin the trek through Arusha National Park.",
        altitude: "1,500m",
        trekkingHours: "4-5",
        overnight: "Mirakamba Hut",
      },
      {
        day: 2,
        title: "Mirakamba to Saddle Hut",
        description:
          "Continue ascending through changing vegetation zones.",
        altitude: "3,500m",
        trekkingHours: "4-5",
        overnight: "Saddle Hut",
      },
      {
        day: 3,
        title: "Summit Day",
        description:
          "Early morning summit attempt to Socialist Peak (4,566m). Incredible views of Kilimanjaro.",
        altitude: "4,566m",
        trekkingHours: "6-7",
        overnight: "Mirakamba Hut",
      },
      {
        day: 4,
        title: "Descent",
        description:
          "Descend through the park back to the gate.",
        altitude: "1,500m",
        trekkingHours: "4-5",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "Mount Meru Climb | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb Mount Meru, Tanzania's second highest peak. Perfect acclimatization trek before Kilimanjaro.",
    },
  });

  // Ol'doinyo Lengai
  await createOrReplace({
    _id: "route-lengai",
    _type: "route",
    title: "Ol'doinyo Lengai",
    slug: { current: "oldoinyo-lengai" },
    mountain: "lengai",
    duration: 2,
    difficulty: "strenuous",
    bestSeason: "June to October",
    highlights: [
      "World's only active carbonatite volcano",
      "Sacred Maasai mountain",
      "Views into active caldera",
      "Unique cooler lava (510°C vs 1,100°C)",
    ],
    overview:
      "Ol doinyo Lengai is a Maasai saying meaning 'Mountain of GOD'. The summit of this strato-volcano is 2962 metres above sea level, and affords direct views into the caldera of Tanzania's only officially-certified active volcano, and the world's only carbonatite volcano.",
    itinerary: [
      {
        day: 1,
        title: "Approach",
        description:
          "Drive from Arusha to the base of Ol'doinyo Lengai near Lake Natron.",
        altitude: "1,200m",
        trekkingHours: "N/A",
        overnight: "Base Camp",
      },
      {
        day: 2,
        title: "Summit and Return",
        description:
          "Pre-dawn start for the summit attempt. Reach the crater rim for views into the active volcano. Descend and return to Arusha.",
        altitude: "2,962m",
        trekkingHours: "8-10",
        overnight: "N/A",
      },
    ],
    seo: {
      metaTitle: "Ol'doinyo Lengai Climb | Macho Halisi Tanzania Safaris",
      metaDescription:
        "Climb the world's only active carbonatite volcano - Ol'doinyo Lengai, sacred to the Maasai people.",
    },
  });
}

// ─── 6. Accommodation ─────────────────────────────────────

async function migrateAccommodation() {
  console.log("\n🏨 Migrating Accommodation...");

  const accommodations = [
    {
      _id: "accom-arusha",
      name: "Arusha Accommodation",
      slug: { current: "accommodation-arusha" },
      description:
        "All of our itineraries are custom created to suit both your interests and budget. We recommend owner-operated lodges and hotels. Lodges and camps range in size from a few tents or rooms to large facilities.",
      amenities: ["Swimming pool", "Restaurant", "WiFi", "Gift shop", "Laundry"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-northern-circuit", _type: "region" },
    },
    {
      _id: "accom-tarangire",
      name: "Tarangire National Park Accommodation",
      slug: { current: "accommodation-tarangire" },
      description:
        "Tarangire offers thrilling places including Whistling Thorn Camp, Tarangire Safari Lodge, Sopa Lodge, Kikoti Camp, and Tamarind Camp.",
      amenities: ["Game drives", "Swimming pool", "Restaurant", "Wildlife viewing"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-northern-circuit", _type: "region" },
    },
    {
      _id: "accom-manyara",
      name: "Lake Manyara Accommodation",
      slug: { current: "accommodation-lake-manyara" },
      description:
        "Lake Manyara is a small but beautiful park. Most accommodation is located outside the park boundaries. Kirurumu tented camp sits perched on the Great Rift Valley escarpment.",
      amenities: ["Rift Valley views", "Swimming pool", "Restaurant", "Wildlife talks"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-northern-circuit", _type: "region" },
    },
    {
      _id: "accom-ngorongoro",
      name: "Ngorongoro Crater Accommodation",
      slug: { current: "accommodation-ngorongoro" },
      description:
        "There is a variety of accommodation in the Ngorongoro Conservation Area and the nearby Crater Highlands. Options range from crater rim lodges to Karatu highland retreats.",
      amenities: ["Crater views", "Restaurant", "Gift shop", "WiFi", "Cultural visits"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-northern-circuit", _type: "region" },
    },
    {
      _id: "accom-serengeti",
      name: "Serengeti National Park Accommodation",
      slug: { current: "accommodation-serengeti" },
      description:
        "The vast Serengeti is a World Heritage Site. Each area offers something different with the migration of wildebeest and zebra making rounds according to seasons.",
      amenities: ["Game drives", "Migration viewing", "Swimming pool", "Restaurant", "Bush dining"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-northern-circuit", _type: "region" },
    },
    {
      _id: "accom-southern",
      name: "Southern Circuit Accommodation",
      slug: { current: "accommodation-southern-circuit" },
      description:
        "If you choose to travel to the Southern Tanzanian Parks we suggest Rufiji River Camp and Serena Selous Wildlife Lodge.",
      amenities: ["River views", "Game drives", "Bush walks", "Boat safaris"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-southern-circuit", _type: "region" },
    },
    {
      _id: "accom-zanzibar",
      name: "Zanzibar Accommodation",
      slug: { current: "accommodation-zanzibar" },
      description:
        "Zanzibar has more to offer than just historical sites. From Serena Inn in Stone Town to beach resorts on the north and east coasts.",
      amenities: ["Beach access", "Spa", "Diving", "Snorkeling", "Restaurant"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-zanzibar", _type: "region" },
    },
    {
      _id: "accom-swahili",
      name: "Swahili Coast Accommodation",
      slug: { current: "accommodation-swahili-coast" },
      description:
        "We suggest Saadani Safari Lodge, Peponi, Mkoma Bay Lodge, and Travellers Lodge for the Swahili Coast.",
      amenities: ["Beach", "Bush and beach combo", "River excursions", "Snorkeling"],
      starRating: 4,
      pricingRange: "luxury",
      region: { _ref: "region-swahili-coast", _type: "region" },
    },
  ];

  for (const acc of accommodations) {
    await createOrReplace({ ...acc, _type: "accommodation" });
  }
}

// ─── 7. Travel Info Articles ──────────────────────────────

async function migrateTravelInfo() {
  console.log("\n📚 Migrating Travel Info Articles...");

  const articles = [
    {
      _id: "travel-faqs",
      title: "Frequently Asked Questions",
      slug: { current: "faqs" },
      category: "faqs",
      body: "For detailed FAQ information, please refer to our downloadable FAQ guide covering common questions about Tanzania safaris, booking procedures, and travel requirements.",
    },
    {
      _id: "travel-climate",
      title: "Climate and Clothing",
      slug: { current: "climate-and-clothing" },
      category: "climate",
      body: "Tanzania enjoys a mild climate year round. The country lies just two degrees south of the equator so at lower elevations where the climate is tropical, temperatures and humidity can be quite high. On the northern safari circuit and at higher elevations temperatures are pleasant with lower temperatures morning and evening and the middle of the day getting nice and warm (up to 80°F – 26°C). At very high elevations such as on Mt Meru and Kilimanjaro conditions are frigid.\n\nThe seasons are reversed from the northern hemisphere with the coldest months being July and August. Conversely the warmest months are December and January. There are two rainy periods, the 'short' rains in November-December and the 'long rains' in April-May.",
    },
    {
      _id: "travel-guidelines",
      title: "Safari Guidelines",
      slug: { current: "safari-guidelines" },
      category: "guidelines",
      body: "Time Zone: Tanzania is +3 GMT. This means the local time is three hours ahead of London, eight hours ahead of New York and eleven hours ahead of Los Angeles. Tanzania does not observe daylight saving time.\n\nAttitude: The best thing you can bring on safari is a good attitude. Remember that you're experiencing a new and different culture and that Tanzania is a developing nation with limited infrastructure. Things will not be the same as at home and that's part of the joy of travel.",
    },
    {
      _id: "travel-photography",
      title: "Photography",
      slug: { current: "photography" },
      category: "photography",
      body: "Bringing home great photos is one of the joys of safaris. Modern digital equipment allows the possibility to capture all your safari memories easily. Be sure to bring adequate batteries and charging equipment. Remember Tanzania is on 220-240 volts and uses the 3 pin British type plugs.\n\nYour guide will help you to get into the best position possible when photographing wildlife from the vehicle. If you want to take photos of people or their livestock, it's necessary to ask permission and often a fee will be demanded.",
    },
    {
      _id: "travel-currency",
      title: "Currency",
      slug: { current: "currency" },
      category: "currency",
      body: "The currency in Tanzania is the Tanzanian shilling (TSH). It comes in denominations of 10,000; 5,000; and 1,000 notes.\n\nRates fluctuate considerably and also fluctuate within the country. You can exchange currency at most hotels and lodges as well as banks and bureaux de changes in Arusha. US dollars are preferred.\n\nPLEASE NOTE: US bills must be issued after the year 2005 to be accepted in east Africa. Newer notes are always better.\n\nCredit cards are becoming more widely accepted but there are often additional charges. There are a few ATM machines in Arusha, Karatu, Dar es Salaam and Zanzibar but they are not always working.",
    },
    {
      _id: "travel-park-rules",
      title: "National Park Rules",
      slug: { current: "national-park-rules" },
      category: "park-rules",
      body: "• Driving in the parks is only allowed between 6am and 6pm\n• Do not exceed 50km/h and no more than 25km/h in the Ngorongoro Crater\n• Camping is permitted only in designated sites\n• Wild animals always have the right of way\n• Keep to the authorized tracks, there is a fine for off-road driving\n• Do not disturb or harass the wildlife in any way\n• Do not leave litter in the area\n• Do not smoke whilst on game drive\n• Never feed animals at your hotel or in the wild\n• Do not pick, cut or destroy any vegetation\n• All visitors must remain in their vehicle within 200 meters of any game animal\n• Domestic pets are forbidden in the parks",
    },
    {
      _id: "travel-tipping",
      title: "Driver and Guides Tipping",
      slug: { current: "driver-and-guides-tipping" },
      category: "tipping",
      body: "Consult lodges for the tipping guidelines. Many lodges have a staff tip box. Your guide can advise you, but a general guideline is for each guest to leave $5-$10 per day in total for the lodge staff.\n\nAlthough tipping is optional and totally up to your personal discretion, it is a safari tradition. Safari guides typically receive between US$ 20-100 per day from the group, depending on the size of the group, the level of satisfaction and length of the trip.",
    },
    {
      _id: "travel-health-safety",
      title: "Health and Safety",
      slug: { current: "health-and-safety" },
      category: "health-safety",
      body: "Tanzania has been politically stable since independence. Generally the rural areas are free of trouble but always take care of your belongings. Remember that the animals you encounter are wild and you are in their environment.\n\nConsult your doctor for advice on vaccination and malaria prophylaxis. Commonly recommended vaccinations: Yellow Fever, Polio, Tetanus, Hepatitis.\n\nMalaria is a serious tropical disease. It is recommended that you take anti-malarial tablets before, during and after your stay. Malaria is spread by mosquitoes that feed from dusk to dawn. Use a mosquito net, insect repellent, and cover exposed skin after dark.\n\nWhile in Tanzania you should drink only commercially bottled water.",
    },
    {
      _id: "travel-useful-links",
      title: "Useful Links",
      slug: { current: "useful-links" },
      category: "useful-links",
      body: "Center for Disease Control: www.cdc.gov/travel\nWorld Health Organization: www.who.int",
    },
  ];

  for (const article of articles) {
    await createOrReplace({ ...article, _type: "travelInfoArticle" });
  }
}

// ─── 8. Pages ─────────────────────────────────────────────

async function migratePages() {
  console.log("\n📄 Migrating Pages...");

  const pages = [
    {
      _id: "homePage",
      _type: "page",
      title: "Home",
      slug: { current: "home" },
      body: "Macho Halisi (true eyes in Swahili) is a long term provider of safaris in Tanzania. Locally owned and operated, we are native Tanzanians who are proud of our country and love to share our knowledge and passion for safari with you. A safari with Macho Halisi will be the trip of a lifetime, forging memories and experiences that will change you forever.\n\nWe look forward to showing you the interesting cultures, stunning landscapes and masses of wildlife that make our home, Tanzania, such an alluring destination.",
    },
    {
      _id: "page-our-company",
      _type: "page",
      title: "Our Company",
      slug: { current: "our-company" },
      body: "Macho Halisi has been crafting exciting safaris and lifetime adventures for visitors to Tanzania for over fourteen years. Our founder, Dawson Minja, lives in Karatu with wife and three small children. A visionary in Tanzanian tourism, Dawson saw an opportunity to provide travellers to his home nation with a safe, exciting option for safaris that also offer value for money and set out to make it happen.\n\nHis first venture was to build Kudu Lodge and Campsite, a popular stop on the northern safari circuit. From there, the obvious extension was to offer game drives to the nearby national parks and other areas of interest. The company now owns 15 vehicles, specifically outfitted for optimum wildlife viewing and employs knowledgeable safari guides year round.",
    },
    {
      _id: "page-why-book",
      _type: "page",
      title: "Why Book With Us",
      slug: { current: "why-book-with-us" },
      body: "Here at Macho Halisi we take every care to ensure that your safari in Tanzania will be the adventure of a lifetime. We understand the concerns you may have for taking a holiday so far from home and in a place that seems quite foreign.\n\nHowever, we assure you that you'll arrive as a guest and leave as a friend. Our qualified safari experts have assisted many travelers to craft the perfect blend of comfort and adventure, ensuring that whatever your desires are, from mountain climbing, hiking, trekking, wildlife watching, village or town visits to basic shopping for gifts to take home, they will make sure your goals are met.",
    },
    {
      _id: "page-contacts",
      _type: "page",
      title: "Contacts",
      slug: { current: "contacts" },
      body: "Macho Halisi (T) Ltd\nKaratu, Arusha – Tanzania\n\nPhone: +255 789 718505, +255 754 474792\nEmail: info@machohalisi.com",
    },
    {
      _id: "page-stone-town",
      _type: "page",
      title: "Stone Town Tour",
      slug: { current: "stone-town-tour" },
      body: "A visit to Stone Town is like a trip back in time. Visions of a thousand and one Arabian nights spring to mind. The place is full of history and some of the more interesting buildings are: Old Fort, House of Wonders, Palace Museum, Anglican Cathedral, Dhow Countries Music Academy and The Old Dispensary.\n\nWhen visiting Stone Town please remember that you're visiting a conservative Muslim society and scantily clad Westerners do cause offence. Appropriate respectful dress includes long skirts and trousers for women and slacks or knee length shorts for men.",
    },
    {
      _id: "page-spice-tour",
      _type: "page",
      title: "Spice Tour",
      slug: { current: "spice-tour" },
      body: "While on the island, this is one activity not to be missed! Learn how the various spices grow on one of the many plantations in the Kidichi area open to visitors. Tours often offer a sample of local herbal teas and sometimes include lunch.\n\nYou'll learn about ginger, cloves, cardamom, cinnamon, annatto, turmeric, vanilla and much more. At the end you can stock up on ingredients fresh from the farm.",
    },
    {
      _id: "page-jozani-forest",
      _type: "page",
      title: "Jozani Forest",
      slug: { current: "jozani-forest" },
      body: "Jozani Forest is part of the only formally protected terrestrial habitat on Unguja Island. The natural and indigenous forests are habitat for suni and duiker, civet, bush babies, mongoose, chameleons, tree hyrax and blue monkeys.\n\nBe sure you are with a guide and obey the rules of primate viewing. Be sure to take the walk through the mangrove forests on the opposite side of the road.",
    },
    {
      _id: "page-north-coast",
      _type: "page",
      title: "North Coast",
      slug: { current: "north-coast" },
      body: "The north coast is the 'party' side of the island so if you're looking for some nightlife combined with sun, sea and beach during the day, head to the Kendwa and Nungwi. It's also possible to find some nice quieter places to stay in the area.",
    },
    {
      _id: "page-saadani",
      _type: "page",
      title: "Saadani National Park",
      slug: { current: "saadani-national-park" },
      body: "The only National Park in Tanzania to offer both beach, bush and river experiences. Saadani is one of the latest National Parks in our country. There are several nice lodges within the park and the beaches face due east, aiming for fabulous sunrises.",
    },
    {
      _id: "page-bagamoyo",
      _type: "page",
      title: "Bagamoyo",
      slug: { current: "bagamoyo" },
      body: "Bagamoyo has become increasingly popular over the past few years. Once one of the most important dhow building centres on the Swahili coast, you can still find the boats being made here. The town is a nice place for someone with historical interest and is also a burgeoning art centre.",
    },
    {
      _id: "page-cultural-tours",
      _type: "page",
      title: "Cultural Tourism",
      slug: { current: "cultural-tourism" },
      body: "Cultural Tourism in Tanzania is all about getting to let other people experience and gain more knowledge about Tanzania's culture. Mostly the Maasai, Hadzabe and Datoga tribes get the most attention from tourists.\n\nMaasai: Originates from the lower Nile valley and began migrating south around the 15th century. Known for handmade bracelets, chains, earrings.\n\nHadzabe: An indigenous ethnic group in north-central Tanzania, living around Lake Eyasi. The only population in East Africa that still depends on hunting and gathering.\n\nDatoga: Origin can be traced back to the Ethiopian and South Sudanese highlands.",
    },
    {
      _id: "page-karatu",
      _type: "page",
      title: "Our Home - Karatu",
      slug: { current: "our-home-karatu" },
      body: "Macho Halisi's offices are situated on the Kudu Lodge compound, in the Crater Highland town of Karatu. Karatu is a typical small and sometimes slightly dusty town, home mostly to the Iraqw tribe.\n\nIdeally situated within driving distance to the Ngorongoro Conservation Area, Lake Manyara National Park, Lake Eyasi and Tarangire National Park, Karatu is a perfect base for a safari.\n\nWhat can you do while staying in Karatu? Take a walk into town, enjoy a cultural tour, visit a tribal village, game drive in a nearby National Park, hike in the Ngorongoro Forest, visit a farm or coffee plantation.",
    },
  ];

  for (const page of pages) {
    await createOrReplace(page);
  }
}

// ─── 9. Homepage ──────────────────────────────────────────

async function migrateHomePage() {
  console.log("\n🏠 Migrating Homepage...");

  await createOrReplace({
    _id: "homePage-doc",
    _type: "homePage",
    heroSlides: [
      {
        headline: "The Trip of a Lifetime",
        subheadline: "Forging the memory and experiences",
      },
      {
        headline: "African Safari Experience",
        subheadline: "Authentic wildlife encounters",
      },
      {
        headline: "Professional & Friendly Tour Guides",
        subheadline: "Knowledgeable and dedicated naturalists",
      },
      {
        headline: "Mountain Trekking",
        subheadline: "Kilimanjaro, Meru, Ol'doinyo Lengai",
      },
      {
        headline: "Cultural Tours",
        subheadline: "Maasai, Datoga, Hadzabe tribes",
      },
      {
        headline: "Zanzibar Beach Holiday",
        subheadline: "White sands and turquoise waters",
      },
    ],
    intro: {
      heading: "Macho Halisi – Safari and Tour Operator Tanzania",
      body: "Macho Halisi (true eyes in Swahili) is a long term provider of safaris in Tanzania. Locally owned and operated, we are native Tanzanians who are proud of our country and love to share our knowledge and passion for safari with you. A safari with Macho Halisi will be the trip of a lifetime, forging memories and experiences that will change you forever.",
      trustBadges: [
        { text: "TripAdvisor Rated", icon: "tripadvisor" },
        { text: "14+ Years Experience", icon: "calendar" },
        { text: "Locally Owned & Operated", icon: "map-marker" },
      ],
    },
    offeringCards: [
      {
        title: "Tanzania Safaris",
        subtitle: "Wildlife Safari Experience",
      },
      {
        title: "Mountain Trekking",
        subtitle: "Mount Kilimanjaro, Meru, Oldonyo Lengai",
      },
      {
        title: "Beach Holiday",
        subtitle: "Zanzibar Excursion",
      },
      {
        title: "The Great Migration",
        subtitle: "Wildebeest – Great Migration on the move",
      },
      {
        title: "Cultural Tours",
        subtitle: "Maasai | Datoga | Hadzabe",
      },
      {
        title: "Historical Sites",
        subtitle: "Stone Town | Bagamoyo | Mafia",
      },
    ],
    guidesSection: {
      heading: "Our Guides",
      body: "Ask anyone who's been on a safari and they'll most likely start talking about their guide. Your guide can make or break the experience and we pride ourselves in our wonderful guides. Every one of our loyal guides is with us for the long term and some started with us in the beginning. All of them speak fluent English and have studies at the college level. They are dedicated and enthusiastic naturalists, one and all and are the backbone of Macho Halisi.",
    },
    featuredVideo: {
      youtubeUrl: "",
      caption: "Macho Halisi Safari Experience",
    },
    gallery: [],
  });
}

// ─── 10. Lead Capture Settings ─────────────────────────────

async function migrateLeadCapture() {
  console.log("\n📝 Migrating Lead Capture Settings...");

  await createOrReplace({
    _id: "leadCapture-settings",
    _type: "leadCapture",
    formTitle: "Plan My Safari",
    formSteps: [
      {
        stepNumber: 1,
        title: "Trip Type",
        description: "What kind of adventure are you looking for?",
      },
      {
        stepNumber: 2,
        title: "Travel Details",
        description: "When and how many travelers?",
      },
      {
        stepNumber: 3,
        title: "Contact Info",
        description: "How can we reach you?",
      },
    ],
    successTitle: "Thank You!",
    successMessage:
      "We've received your inquiry and will get back to you within 24 hours with a personalized safari proposal.",
    responseTimePromise: "We respond within 24 hours",
    ctaLabel: "Plan My Safari",
  });
}

// ─── Run Migration ────────────────────────────────────────

async function main() {
  console.log("🚀 Starting Macho Halisi Content Migration...\n");
  console.log(`   Project: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(`   Token: ${env.SANITY_AUTH_TOKEN ? "✓ set" : "✗ missing"}`);

  if (!env.SANITY_AUTH_TOKEN) {
    console.error(
      "\n❌ SANITY_AUTH_TOKEN is required. Get one from https://sanity.io/manage → API → Tokens",
    );
    process.exit(1);
  }

  try {
    await migrateSiteSettings();
    await migrateRegions();
    await migrateTourPackages();
    await migrateRoutes();
    await migrateAccommodation();
    await migrateTravelInfo();
    await migratePages();
    await migrateHomePage();
    await migrateLeadCapture();
    await migrateNavigation();

    console.log("\n✅ Migration complete!");
    console.log("\n📊 Summary:");
    console.log("   - 1 siteSettings document");
    console.log("   - 1 navigation document");
    console.log("   - 1 homePage document");
    console.log("   - 4 regions");
    console.log("   - 3 tour packages");
    console.log("   - 7 mountain routes");
    console.log("   - 8 accommodation listings");
    console.log("   - 9 travel info articles");
    console.log("   - 12 pages");
    console.log("   - 1 leadCapture settings");
    console.log("\n   Total: 46 documents");
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
    process.exit(1);
  }
}

main();
