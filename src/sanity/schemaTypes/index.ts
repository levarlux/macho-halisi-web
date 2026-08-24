import { type SchemaTypeDefinition } from "sanity";

import { siteSettings } from "./siteSettings";
import { navigation } from "./navigation";
import { homePage } from "./homePage";
import { tourPackage } from "./tourPackage";
import { route } from "./route";
import { region } from "./region";
import { accommodation } from "./accommodation";
import { travelInfoArticle } from "./travelInfoArticle";
import { galleryImage } from "./galleryImage";
import { leadCapture } from "./leadCapture";
import { page } from "./page";
import { inquiry } from "./inquiry";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  navigation,
  homePage,
  tourPackage,
  route,
  region,
  accommodation,
  travelInfoArticle,
  galleryImage,
  leadCapture,
  page,
  inquiry,
];
