import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-warm-white">
      <div className="container-main text-center">
        <p className="font-display text-8xl font-bold text-terracotta/20">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-charcoal">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-charcoal-light">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find your way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/inquire" className="btn-secondary">
            Plan a Safari
          </Link>
        </div>
      </div>
    </section>
  );
}
