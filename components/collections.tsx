import Image from "next/image";
import Link from "next/link";

export default function Collections() {
  const products = [
    {
      id: 1,
      name: "Pistachio Filling Kunafa",
      image: "https://ik.imagekit.io/dypkhqxip/collectiosn5",
      tag: "Viral Favorite",
      description: "Crispy toasted kataifi threads mixed with premium pistachio cream, encased in luxury milk chocolate.",
    },
    {
      id: 2,
      name: "Biscoff Filling Kunafa",
      image: "https://ik.imagekit.io/dypkhqxip/bis",
      tag: "Caramel Crunch",
      description: "Crunchy shredded kataifi pastry blended with smooth Biscoff cookie spread in a milk chocolate shell.",
    },
    {
      id: 3,
      name: "Hazelnut Filling Kunafa",
      image: "https://ik.imagekit.io/dypkhqxip/collectiosn2?updatedAt=1784063410170",
      tag: "Dark Signature",
      description: "Shredded toasted kunafa threads mixed with rich hazelnut praline inside a high-percentage dark chocolate block.",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-[#724D26] text-xs font-normal tracking-widest uppercase block mb-2">
          Artisanal Varieties
        </span>
        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900">
          Chocolate Collections
        </h2>
        <div className="w-12 h-[1px] bg-[#724D26] mx-auto mt-4" />
      </div>

      {/* Standard 3-Column Card Grid (Borderless, clean styling) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 rounded-none items-stretch">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative group overflow-hidden bg-zinc-100 rounded-none h-[420px] flex flex-col justify-end p-6 shadow-sm"
          >
            {/* Bright, clean full-bleed image (No opacity filters or black gradient shade overlay) */}
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-none select-none"
            />

            {/* Float Label showing Name in normal state (No black shading / borders) */}
            <div className="relative z-10 w-full bg-[#FEFEFD] py-3.5 px-4 text-center shadow-md rounded-none border border-zinc-100/60 transform group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-300">
              <span className="text-[#724D26] text-[9px] uppercase tracking-widest block mb-1">
                {product.tag}
              </span>
              <h3 className="text-sm font-normal uppercase tracking-wider text-zinc-900">
                {product.name}
              </h3>
            </div>

            {/* Hover Details Panel (Smoothly slides up from bottom) */}
            <div className="absolute inset-0 bg-[#FEFEFD] p-8 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 rounded-none">
              <div>
                <span className="text-[#724D26] text-[10px] uppercase tracking-widest block mb-2">
                  {product.tag}
                </span>
                <h4 className="text-zinc-900 text-base font-normal uppercase tracking-wider mb-4 leading-snug">
                  {product.name}
                </h4>
                <p className="text-xs font-normal text-zinc-500 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <Link
                href="/shop"
                className="block w-full text-center bg-zinc-900 text-white text-xs uppercase tracking-wider py-3.5 rounded-none hover:bg-zinc-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
