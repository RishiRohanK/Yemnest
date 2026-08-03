"use client";

import Link from "next/link";
import Image from "next/image";

export default function CollectionsClient() {
  const lookbookSections = [
    {
      id: "diwali",
      title: "The Diwali Collection",
      description: "Celebrate the festival of lights with our hand-crafted festive boxes.",
      image: "/images/themes/diwali/image1.png",
      href: "/shop?category=Gift+Boxes"
    },
    {
      id: "anniversary",
      title: "The Anniversary Collection",
      description: "Mark your special milestones with decadent sweetness.",
      image: "/images/themes/anniversary/open.jpg",
      href: "/shop?category=Gift+Boxes"
    },
    {
      id: "birthday",
      title: "The Birthday Collection",
      description: "Make every birthday sweeter with curated assortments.",
      image: "/images/themes/birthday/open.jpg",
      href: "/shop?category=Gift+Boxes"
    },
    {
      id: "raksha",
      title: "Raksha Bandhan Exclusive",
      description: "Celebrate the eternal sibling bond with our signature boxes.",
      image: "/images/themes/raksha-bandhan/open.jpg",
      href: "/shop?category=Gift+Boxes"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/collectionshero.png"
          alt="Collections Hero"
          fill
          className="object-cover opacity-90 brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-light text-white mb-6 uppercase tracking-widest drop-shadow-md">
            The Collections
          </h1>
          <p className="text-lg md:text-2xl text-[#F5E6C4] font-serif italic drop-shadow-md">
            Curated assortments for every celebration.
          </p>
        </div>
      </section>

      {/* Signature Kunafa Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-sm uppercase tracking-[0.2em] text-[#8A6F54] font-semibold">Atelier Signature</h2>
            <h3 className="text-4xl md:text-5xl font-light text-zinc-900 leading-tight">
              The Kunafa Bites
            </h3>
            <p className="text-zinc-600 text-lg leading-relaxed font-light">
              Experience the perfect harmony of crispy shredded phyllo pastry and rich, decadent chocolate. Our signature Kunafa bites are crafted with premium ingredients sourced globally, bringing an authentic Middle Eastern texture to modern chocolate artistry.
            </p>
            <Link
              href="/shop?category=Kunafa+Bars"
              className="inline-block mt-8 bg-zinc-900 text-white px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-[#106636] transition-colors"
            >
              Explore Kunafa Bites
            </Link>
          </div>
          <div className="w-full md:w-1/2 relative h-[500px] rounded-2xl overflow-hidden group">
            <Image
              src="https://ik.imagekit.io/dypkhqxip/collectiosn5"
              alt="Pistachio Kunafa"
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Lookbook Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-t border-zinc-200/60 pt-24">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-[0.2em] text-[#8A6F54] font-semibold mb-3">Gifting &amp; Occasions</h2>
          <h3 className="text-3xl md:text-5xl font-light text-zinc-900">
            Curated Gift Boxes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {lookbookSections.map((section, idx) => (
            <Link
              href={section.href}
              key={section.id}
              className="group block overflow-hidden rounded-2xl relative bg-zinc-100"
            >
              <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-2xl md:text-3xl font-light text-white mb-3 tracking-wide">
                    {section.title}
                  </h4>
                  <p className="text-zinc-300 font-serif italic mb-6">
                    {section.description}
                  </p>
                  <span className="text-xs text-[#F5E6C4] uppercase tracking-[0.2em] border-b border-[#F5E6C4] pb-1 inline-block">
                    Shop The Collection
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Call to action */}
      <section className="py-24 px-6 text-center bg-zinc-900 mt-24">
        <h2 className="text-2xl md:text-4xl font-light text-white mb-6">Can't decide?</h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-light">
          Browse our entire catalog of artisanal chocolates, premium kunafa bites, and exclusive gift boxes.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-zinc-900 px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-[#F5E6C4] transition-colors"
        >
          View All Products
        </Link>
      </section>
    </div>
  );
}
