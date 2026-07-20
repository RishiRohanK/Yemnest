import Hero from "../../components/hero";
import Collections from "../../components/collections";
import PurityPromise from "../../components/purity";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans rounded-none">
      {/* Hero Banner Carousel */}
      <Hero />

      {/* Categories Bento Grid Section showing the three Kunafa Chocolates */}
      <Collections />

      {/* About Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-200/40 rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-center rounded-none">
          {/* Left Column: Brand Logo (takes 2 cols, aligned right on desktop) */}
          <div className="md:col-span-2 flex justify-center md:justify-end rounded-none">
            <img
              src="https://ik.imagekit.io/dypkhqxip/yemnextols?updatedAt=1784063009812"
              alt="Yemnest Brand Logo"
              className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] h-auto object-contain select-none rounded-none"
            />
          </div>
          {/* Right Column: Two Paragraphs (takes 3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-6 text-zinc-600 leading-relaxed text-sm sm:text-base font-normal rounded-none">
            <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-zinc-900 mb-2 rounded-none">
              Our Craft & Story
            </h3>
            <p className="rounded-none">
              Born from a passion for premium ingredients and culinary excellence, Yemnest represents the pinnacle of modern artisanal chocolate. We select only the finest organic cocoa beans from certified carbon-neutral micro-lots, ensuring each recipe honors the growers and respects the land.
            </p>
            <p className="rounded-none">
              In our specialized refining atelier, our master chocolatiers combine traditional tempering methods with contemporary flavor pairings, such as our viral toasted kataifi kunafa bar. Handcrafted daily using 100% pure cocoa butter and zero artificial shelf-extenders, we invite you to indulge in pure, unaltered luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        {/* Quality Commitments Promise Section */}
        <PurityPromise />

        {/* Brand Mission Banner */}
        <div className="relative rounded-none overflow-hidden bg-[#106636] px-6 py-16 sm:px-12 sm:py-20 lg:px-20 text-center shadow-lg">
          <div className="absolute inset-0 -z-10 bg-black/10 rounded-none" />
          <div className="max-w-2xl mx-auto rounded-none">
            <span className="text-[#F5E6C4] text-xs uppercase tracking-widest block mb-4">
              Our Chocolate Philosophy
            </span>
            <h3 className="text-2xl sm:text-4xl font-normal text-white tracking-tight mb-6">
              Crafted in Harmony with Nature
            </h3>
            <p className="text-sm sm:text-base font-normal text-zinc-100/90 leading-relaxed mb-8">
              At Yemnest, we trace our beans from the pristine canopy forest soils of the tropics to our Swiss refining atelier. We work exclusively with certified carbon-neutral farms to ensure each luxurious bar respects the soil it was born from.
            </p>
            <a
              href="#philosophy"
              className="inline-block bg-white text-[#106636] hover:bg-[#FAF9F6] text-xs uppercase tracking-widest py-3 px-8 rounded-none transition-colors shadow"
            >
              Read Our Story
            </a>
          </div>
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left rounded-none">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-zinc-800 pb-8 mb-8 rounded-none">
            <img
              src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar"
              alt="Yemnest Logo"
              className="h-10 w-auto brightness-0 invert opacity-75 rounded-none"
            />
            <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-1">
              <p className="text-xs font-normal">
                © {new Date().getFullYear()} Yemnest Chocolatiers. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                Maintained and built by Forge Digital Technologies
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-4 text-xs font-normal rounded-none">
            <a href="#privacy" className="hover:text-white transition-colors rounded-none">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors rounded-none">Terms of Service</a>
            <a href="#sustainability" className="hover:text-white transition-colors rounded-none">Sustainability Commitments</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
