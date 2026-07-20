"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function TopBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  if (pathname && pathname.startsWith("/admin")) return null;
  if (!isVisible) return null;

  return (
    <div className="relative isolate flex items-center justify-between overflow-hidden bg-[#724D26] px-4 py-2 sm:px-8 border-b border-[#4a3018]/30 shadow-sm z-50 min-h-[44px] sm:min-h-[52px]">
      {/* Background light reflections for a premium, luxury vibe */}
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-577/310 w-[36.0625rem] bg-gradient-to-r from-[#D4AF37] to-[#8B5A2B] opacity-10"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 26.3%, 38.3% 0%, 20.7% 30.6%, 2.7% 4.9%, 0.1% 62.9%, 17.9% 68.1%, 27.5% 76.7%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-577/310 w-[36.0625rem] bg-gradient-to-r from-[#D4AF37] to-[#8B5A2B] opacity-10"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 26.3%, 38.3% 0%, 20.7% 30.6%, 2.7% 4.9%, 0.1% 62.9%, 17.9% 68.1%, 27.5% 76.7%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* MOBILE SCREEN: Scrolling marquee in a single line */}
      <div className="flex sm:hidden items-center justify-between w-full overflow-hidden gap-x-2">
        <div className="flex-1 overflow-hidden relative">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes bannerMarquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
          `}} />
          <div
            className="whitespace-nowrap flex items-center"
            style={{
              animation: "bannerMarquee 16s linear infinite",
              width: "max-content"
            }}
          >
            <span className="inline-flex items-center text-xs font-normal text-[#FFFDF9] tracking-wide mr-16">
              <span className="inline-block text-[#F5E6C4] bg-black/25 px-2 py-0.5 mr-2 text-[9px] uppercase tracking-widest border border-[#F5E6C4]/20 rounded-none">
                Grand Opening
              </span>
              Indulge in our new artisanal chocolate boutique. Use code <span className="text-[#F5E6C4] font-normal border-b border-[#F5E6C4]/40 pb-0.5 mx-1">FINESTCOCOA</span> for 15% off your first luxury selection.
            </span>
            <span className="inline-flex items-center text-xs font-normal text-[#FFFDF9] tracking-wide mr-16">
              <span className="inline-block text-[#F5E6C4] bg-black/25 px-2 py-0.5 mr-2 text-[9px] uppercase tracking-widest border border-[#F5E6C4]/20 rounded-none">
                Grand Opening
              </span>
              Indulge in our new artisanal chocolate boutique. Use code <span className="text-[#F5E6C4] font-normal border-b border-[#F5E6C4]/40 pb-0.5 mx-1">FINESTCOCOA</span> for 15% off your first luxury selection.
            </span>
          </div>
        </div>
        {/* Mobile close button wrapper with background to mask text overlay */}
        <div className="pl-2 bg-[#724D26] z-10">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 text-white/70 hover:text-white rounded-none transition-colors"
            aria-label="Dismiss banner"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>

      {/* DESKTOP SCREEN: Standard static centered layout */}
      <div className="hidden sm:flex items-center justify-between w-full">
        <div className="flex flex-1" />
        <div className="flex flex-row items-center justify-center gap-x-6 text-sm font-normal text-[#FFFDF9] tracking-wide">
          <div className="flex items-center gap-x-3">
            <span className="inline-flex items-center font-normal text-[#F5E6C4] bg-black/20 px-2.5 py-0.5 rounded-none text-xs uppercase tracking-widest border border-[#F5E6C4]/20">
              Grand Opening
            </span>
            <span className="text-[#FFFDF9] font-normal">
              Indulge in our new artisanal chocolate boutique. Use code{" "}
              <span className="text-[#F5E6C4] font-normal border-b border-[#F5E6C4]/40 pb-0.5">
                FINESTCOCOA
              </span>{" "}
              for 15% off your first luxury selection.
            </span>
          </div>
          <a
            href="/shop"
            className="flex-none rounded-none bg-white/10 px-4 py-1 text-xs font-normal text-white shadow-sm hover:bg-white/20 border border-white/10 transition-colors"
          >
            Explore Collection
          </a>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="-m-3 p-3 text-white/70 hover:text-white rounded-none transition-colors"
            aria-label="Dismiss banner"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
