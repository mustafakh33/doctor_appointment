import Link from "next/link";

function PremiumFooterSection() {
  return (
    <footer
      className="px-5 pb-10 pt-6 md:px-20 md:pb-12"
      style={{ background: "#f8f9ff" }}
    >
      <div className="mx-auto max-w-7xl border-t border-[#dde3f5] pt-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-[#0f1e46]">
              The Clinical Curator
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#667196]">
              Redefining health precision through curated specialist access and
              editorial digital design.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#556285]">
              Platform
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-[#5f6883]">
              <li>
                <Link href="/doctors">Find a Specialist</Link>
              </li>
              <li>
                <Link href="/explore">Hospital Locations</Link>
              </li>
              <li>
                <Link href="/auth/register">Patient Registration</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#556285]">
              Support
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-[#5f6883]">
              <li>
                <Link href="/contact-us">Arabic Support</Link>
              </li>
              <li>
                <Link href="/terms">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/faq">Help Center</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#556285]">
              Newsletter
            </h4>
            <div className="mt-4 flex overflow-hidden rounded-xl border border-[#d6def3] bg-white">
              <input
                type="email"
                placeholder="Your email"
                className="h-11 flex-1 px-3 text-sm text-[#0f1e46] outline-none"
              />
              <button
                type="button"
                className="inline-flex w-11 items-center justify-center text-white"
                style={{ background: "#0050cb" }}
                aria-label="Subscribe"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#8c96b5]">
          © 2024 The Clinical Curator. Editorial Health Precision.
        </p>
      </div>
    </footer>
  );
}

export default PremiumFooterSection;
