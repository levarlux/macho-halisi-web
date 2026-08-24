import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source).url();
}

export function urlForWidth(source: SanityImageSource, width: number) {
  return builder.image(source).width(width).url();
}

export function urlForDimensions(
  source: SanityImageSource,
  width: number,
  height: number,
) {
  return builder.image(source).width(width).height(height).url();
}
