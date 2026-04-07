"use client";

import Image from "next/image";
import Link from "next/link";

function AuthSplitLayout({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  eyebrow,
  quote,
  quoteLabel,
  imageOverlay,
  showImageBrand = true,
  showImageCard = true,
  showImageQuote = true,
  footer,
  children,
}) {
  return (
    <>
      <style jsx global>{`
        header,
        footer {
          display: none !important;
        }
      `}</style>

      <div className="min-h-screen px-0 py-0">
        <div
          className="mx-auto grid min-h-screen w-full max-w-none overflow-hidden border-0 lg:grid-cols-[0.82fr_1.18fr]"
          style={{
            background: "var(--color-surface-1)",
            boxShadow: "none",
            borderRadius: "0",
          }}
        >
          <aside className="relative min-h-[280px] overflow-hidden lg:min-h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  imageOverlay ||
                  "linear-gradient(160deg,rgba(10,18,33,0.22)_0%,rgba(10,18,33,0.72)_100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-8 lg:p-10">
              {showImageBrand ? (
                <Link
                  href="/"
                  className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur-md"
                >
                  <Image
                    src="/assets/img/logo.png"
                    alt="Shifaa"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full"
                  />
                  <span>Shifaa</span>
                </Link>
              ) : (
                <div />
              )}

              {showImageCard ? (
                <div
                  className="max-w-xl border border-white/15 bg-white/10 p-5 backdrop-blur-md md:p-6"
                  style={{ borderRadius: "1.75rem" }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
                    {eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
                    {title}
                  </h2>
                  {subtitle ? (
                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/82 md:text-base">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div />
              )}

              {showImageQuote ? (
                <div className="space-y-3 text-sm text-white/78">
                  {quote ? <p className="max-w-md leading-6">{quote}</p> : null}
                  {quoteLabel ? (
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                      {quoteLabel}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div />
              )}
            </div>
          </aside>

          <section className="flex items-center justify-center px-5 py-6 md:px-8 lg:px-9 lg:py-8">
            <div className="w-full max-w-2xl space-y-5">{children}</div>
          </section>
        </div>

        {footer ? <div className="mx-auto max-w-7xl">{footer}</div> : null}
      </div>
    </>
  );
}

export default AuthSplitLayout;
