"use client";

const commitments = [
  {
    id: 1,
    title: "Farm to Home",
    description: "Directly sourced from single-origin micro-lot farms, preserving organic bean integrity straight to your doorstep.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636L11.25 9m-9 0v12m9-12v12" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "No Preservatives",
    description: "Handcrafted strictly without artificial stabilizers, colors, or shelf-extenders. Experience clean, honest cocoa.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Only Cocoa Butter",
    description: "Made using 100% pure cocoa butter. Absolutely zero palm oil, hydrogenated fats, or vegetable oil substitutes.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Always Fresh",
    description: "Poured, filled, and tempered daily in small batches, ensuring every selection arrives at peak aromatic freshness.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function PurityPromise() {
  return (
    <section className="mb-24 rounded-none">
      <div className="text-center mb-12 rounded-none">
        <span className="text-[#724D26] text-xs font-normal tracking-widest uppercase block mb-2 rounded-none">
          Our Purity Promise
        </span>
        <h2 className="text-3xl font-normal tracking-tight text-zinc-900 rounded-none">
          Handcrafted With Integrity
        </h2>
        <div className="w-12 h-[1px] bg-[#724D26] mx-auto mt-4 rounded-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 rounded-none">
        {commitments.map((item) => (
          <div
            key={item.id}
            className="group relative border border-zinc-200/50 bg-[#FEFEFD] p-8 text-center rounded-none shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center"
          >
            {/* Top decorative visual accent line */}
            <div className="absolute top-0 left-0 w-0 h-[3px] bg-[#724D26] group-hover:w-full transition-all duration-500 rounded-none" />
            
            {/* Icon Container with inverse hover colors */}
            <div className="w-14 h-14 flex items-center justify-center bg-[#FAF9F6] text-[#724D26] mb-6 border border-zinc-200/40 group-hover:bg-[#724D26] group-hover:text-[#FEFEFD] transition-colors duration-300 rounded-none">
              {item.icon}
            </div>

            <h3 className="text-lg font-normal tracking-wide text-zinc-900 mb-3 group-hover:text-[#724D26] transition-colors rounded-none">
              {item.title}
            </h3>
            
            <p className="text-sm font-normal text-zinc-500 leading-relaxed rounded-none">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
