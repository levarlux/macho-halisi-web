import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { pageBySlugQuery, allPageSlugsQuery } from "@/lib/sanity/queries";
import { urlForWidth } from "@/lib/sanity/image";
import type { Page } from "@/types";

// Extend the Page type locally for this route
interface CmsPage extends Page {
  heroImage?: { asset: { url: string; metadata: { dimensions: { width: number; height: number } } } };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allPageSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await client.fetch<CmsPage>(pageBySlugQuery, { slug });
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.body?.slice(0, 160),
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await client.fetch<CmsPage>(pageBySlugQuery, { slug });
  if (!page) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-charcoal py-24">
        {page.heroImage && (
          <img
            src={urlForWidth(page.heroImage, 1920)}
            alt={page.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="container-main relative">
          <h1 className="text-warm-white">{page.title}</h1>
          <div className="divider-editorial" />
        </div>
      </section>

      {/* Content */}
      <section className="bg-warm-white py-[var(--spacing-section)]">
        <div className="container-main">
          <div className="mx-auto max-w-3xl">
            {page.body && (
              <div className="font-body text-lg leading-relaxed text-charcoal-light">
                {page.body.split("\n\n").map((paragraph, i) => (
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
