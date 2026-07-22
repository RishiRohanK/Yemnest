"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  {
    id: 1,
    title: "Cocoa Farms",
    subtitle: "The Canopy Cultivation",
    desc: "Our journey begins deep in the tropical canopy. We partner exclusively with certified carbon-neutral micro-lots where cocoa trees grow in harmony with the surrounding biodiversity.",
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(6).png", // Reusing luxury imagery
  },
  {
    id: 2,
    title: "Harvesting",
    subtitle: "Hand-Picked Precision",
    desc: "Only the ripest pods are selected. Our farmers carefully cut each pod by hand using specialized machetes to ensure the tree's delicate flower cushions are never damaged.",
    image: "https://ik.imagekit.io/dypkhqxip/collectiosn2?updatedAt=1784063410170",
  },
  {
    id: 3,
    title: "Fermentation",
    subtitle: "Unlocking the Flavor",
    desc: "The wet beans are scooped into wooden sweatboxes. Over 5 to 7 days of precise temperature control and turning, the raw bitterness transforms into rich, complex aromatic precursors.",
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(1).png",
  },
  {
    id: 4,
    title: "Drying",
    subtitle: "Sun-Kissed Beans",
    desc: "Spread across wooden trays, the beans bask in the equatorial sun. This slow, natural drying process stops fermentation and locks in the unique terroir of the micro-lot.",
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(3).png",
  },
  {
    id: 5,
    title: "Roasting",
    subtitle: "The Maillard Reaction",
    desc: "At our atelier, beans are roasted in small batches. We meticulously profile the roasting curve for each harvest, coaxing out deep chocolate notes without burning the delicate aromatics.",
    image: "https://ik.imagekit.io/dypkhqxip/collectiosn5",
  },
  {
    id: 6,
    title: "Grinding",
    subtitle: "The Cocoa Liquor",
    desc: "The roasted nibs are stone-ground for up to 72 hours. Friction melts the natural fats, transforming the gritty nibs into a silky, luxurious liquid known as cocoa mass.",
    image: "https://ik.imagekit.io/dypkhqxip/bis",
  },
  {
    id: 7,
    title: "Tempering",
    subtitle: "The Perfect Snap",
    desc: "We add 100% pure cocoa butter and slowly modulate the temperature. This critical step crystallizes the fats, giving our chocolate its signature glossy finish and sharp, satisfying snap.",
    image: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(2).png",
  },
  {
    id: 8,
    title: "Packaging",
    subtitle: "Ready for You",
    desc: "Each bar is hand-wrapped in eco-friendly, artisanal paper to protect its integrity. It is finally ready to begin its final journey—to your palate.",
    image: "https://ik.imagekit.io/dypkhqxip/yemnextols?updatedAt=1784063009812",
  },
];

export default function JourneyClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Progress Bar Animation
    gsap.to(".progress-bar-fill", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".journey-content",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    // 2. Stage Reveals
    const stages = gsap.utils.toArray<HTMLElement>(".stage-section");
    stages.forEach((stage, i) => {
      // Animate text sliding in
      gsap.fromTo(
        stage.querySelector(".stage-text"),
        { x: i % 2 === 0 ? 50 : -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stage,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate image masking
      gsap.fromTo(
        stage.querySelector(".stage-img"),
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: stage,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      
      // Node activation (circle on the progress bar)
      gsap.to(stage.querySelector(".stage-node"), {
        backgroundColor: "#106636",
        borderColor: "#106636",
        duration: 0.3,
        scrollTrigger: {
          trigger: stage,
          start: "top 50%",
          toggleActions: "play none none reverse",
        }
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans overflow-hidden">
      
      {/* Intro Hero */}
      <section className="relative pt-40 pb-24 px-4 text-center z-10">
        <span className="block text-[#724D26] text-xs uppercase tracking-[0.2em] mb-4">
          From Bean to Bar
        </span>
        <h1 className="text-4xl md:text-6xl font-light text-zinc-900 tracking-tight mb-6">
          The Cocoa Journey
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-zinc-600 font-normal leading-relaxed">
          Follow the meticulous 8-step process that transforms a humble tropical pod into an extraordinary luxury experience. We oversee every single detail.
        </p>
      </section>

      {/* Main Journey Content */}
      <section className="journey-content relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        
        {/* Central Vertical Progress Bar */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-200 transform md:-translate-x-1/2 z-0 hidden sm:block">
          <div className="progress-bar-fill w-full bg-[#106636] h-0 origin-top" />
        </div>

        <div className="space-y-24 md:space-y-40 relative z-10">
          {STAGES.map((stage, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={stage.id} className={`stage-section flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20 relative`}>
                
                {/* Node for Desktop Timeline */}
                <div className="stage-node absolute left-8 md:left-1/2 top-1/2 w-4 h-4 rounded-none border-2 border-zinc-300 bg-[#FAF9F6] transform -translate-y-1/2 md:-translate-x-1/2 z-20 hidden sm:block transition-colors" />

                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="stage-img relative aspect-[4/3] overflow-hidden bg-zinc-100 shadow-lg">
                    <Image
                      src={stage.image}
                      alt={stage.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#FEFEFD] px-3 py-1 text-xs font-semibold text-[#106636] z-10 rounded-none shadow-sm">
                      Stage 0{stage.id}
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className={`stage-text w-full md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10 md:text-right'}`}>
                  <span className="text-[#724D26] text-xs font-normal uppercase tracking-widest block mb-2">
                    {stage.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-normal text-zinc-900 mb-6">
                    {stage.title}
                  </h2>
                  <p className="text-zinc-600 text-sm leading-relaxed font-normal">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#FEFEFD] text-center border-t border-zinc-200">
        <h2 className="text-3xl font-light text-zinc-900 mb-6">Taste the Final Masterpiece</h2>
        <p className="text-zinc-500 text-sm mb-10 font-normal">
          Now that you've seen the journey, experience the destination.
        </p>
        <Link 
          href="/shop" 
          className="inline-block bg-[#106636] text-white text-xs uppercase tracking-widest py-4 px-10 hover:bg-zinc-900 transition-colors shadow-md rounded-none"
        >
          Visit the Shop
        </Link>
      </section>

    </div>
  );
}
