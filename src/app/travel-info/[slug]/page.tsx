import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { travelInfoBySlugQuery, allTravelInfoSlugsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { TravelInfoArticle } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allTravelInfoSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await client.fetch<TravelInfoArticle>(travelInfoBySlugQuery, { slug });
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.body?.slice(0, 160),
  };
}

export default async function TravelInfoPage({ params }: Props) {
  const { slug } = await params;
  const article = await client.fetch<TravelInfoArticle>(travelInfoBySlugQuery, { slug });
  if (!article) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[280px] overflow-hidden bg-charcoal">
        {article.heroImage && (
          <img
            src={urlForWidth(article.heroImage, 1920)}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="container-main relative flex h-full flex-col justify-end pb-10">
          <div className="flex items-center gap-3">
            <span className="rounded bg-khaki px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-warm-white">
              Travel Info
            </span>
            {article.category && (
              <span className="font-body text-sm text-cream-dark">{article.category}</span>
            )}
          </div>
          <h1 className="mt-3 text-warm-white">{article.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            {article.body && (
              <div className="prose prose-lg max-w-none font-body leading-relaxed text-charcoal-light prose-headings:font-display prose-headings:text-charcoal prose-a:text-terracotta prose-strong:text-charcoal">
                {article.body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-6">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
