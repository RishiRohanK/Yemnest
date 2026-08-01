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

export default function StoryClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Cinematic Hero Reveal
    gsap.fromTo(
      ".hero-el",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );

    // 2. Editorial Text Fade-Ups
    const fadeUps = gsap.utils.toArray<HTMLElement>(".fade-up");
    fadeUps.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 3. Values Stagger
    const values = gsap.utils.toArray<HTMLElement>(".value-card");
    gsap.fromTo(
      values,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".values-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 4. Timeline Milestones Reveal
    const milestones = gsap.utils.toArray<HTMLElement>(".timeline-node");
    milestones.forEach((node, i) => {
      gsap.fromTo(
        node,
        { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 5. Signature Cards Stagger
    const signatures = gsap.utils.toArray<HTMLElement>(".signature-card");
    gsap.fromTo(
      signatures,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".signatures-grid",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // 6. Testimonials Stagger
    const testimonials = gsap.utils.toArray<HTMLElement>(".testimonial-card");
    gsap.fromTo(
      testimonials,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".testimonials-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="story-container relative bg-[#FAF9F6] text-zinc-900 font-sans overflow-hidden selection:bg-[#106636] selection:text-white">

      {/* Intro Hero (Matches Cocoa Journey Style) */}
      <section className="relative h-[40vh] md:h-[50vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/ourstoryhero.png"
          alt="Our Legacy"
          fill
          className="object-cover opacity-90 brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <span className="hero-el block text-[#F5E6C4] text-xs uppercase tracking-[0.2em] mb-4 drop-shadow-md font-semibold">
            Our Legacy
          </span>
          <h1 className="hero-el text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-6 drop-shadow-lg">
            The Art of Honest Chocolate
          </h1>
          <p className="hero-el max-w-2xl mx-auto text-base md:text-lg text-zinc-100 font-light leading-relaxed drop-shadow-md">
            Born from a passion for purity. We reject preservatives and hidden sugars to bring you chocolate the way it was meant to be experienced.
          </p>
        </div>
      </section>

      {/* 2. Why Yemnest Exists (Founders Story & Vision) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="fade-up text-xs text-[#724D26] uppercase tracking-[0.3em] mb-4 font-semibold">The Vision</h2>
              <p className="fade-up text-2xl md:text-4xl font-light text-zinc-900 leading-tight">
                &quot;Yemnest was born from a simple realization: the world&apos;s most luxurious ingredient had been diluted by mass production.&quot;
              </p>
            </div>

            <div className="fade-up w-12 h-[1px] bg-[#724D26]" />

            <div className="fade-up space-y-6 text-zinc-600 font-light leading-relaxed text-sm md:text-base">
              <p>
                We set out to strip away the artificial and return chocolate to its purest, most breathtaking form. Our founders traveled the globe studying traditional refining methods, only to realize that true innovation required a return to basics.
              </p>
              <p>
                By utilizing 100% pure cocoa butter and sourcing directly from ethical micro-lots, Yemnest was built on a foundation of uncompromising integrity. Our mission is to elevate chocolate from a mere confection to a curated sensory masterpiece.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative fade-up">
            <div className="relative h-[500px] md:h-[650px] w-full rounded-2xl overflow-hidden group shadow-xl">
              <Image
                src="/collectionshero.png"
                alt="Founders Vision"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#F5E6C4] rounded-full hidden md:block -z-10 blur-2xl opacity-50" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#724D26] rounded-full hidden md:block -z-10 blur-2xl opacity-20" />
          </div>
        </div>
      </section>

      {/* 3. The Timeline (Milestones) */}
      <section className="py-24 bg-[#FAF9F6] px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-3xl font-light text-zinc-900">The Genesis</h2>
            <div className="w-8 h-[1px] bg-[#724D26] mx-auto mt-6" />
          </div>

          <div className="relative w-full max-w-4xl mx-auto pb-8">
            {/* The vertical lines */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-200 -translate-x-1/2" />
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-px bg-zinc-200" />

            <div className="space-y-16">
              {[
                { year: "2024", title: "The idea born", desc: "A passionate journey begins in a home kitchen, rejecting anything artificial." },
                { year: "2024", title: "Recipe development", desc: "Months of testing shape recipes free from added sugar and preservatives." },
                { year: "2025", title: "The first collection", desc: "Yemnest launches, sharing honest, handmade chocolate with the world." },
                { year: "2026", title: "Growing today", desc: "A small home kitchen grows into a trusted name for honest, clean chocolate." },
                { year: "Future", title: "A vision of purity", desc: "Growing further while staying true to our no added sugar, no preservatives promise." },
              ].map((node, idx) => (
                <div key={idx} className="timeline-node relative w-full pl-10 md:pl-0">

                  {/* Dot */}
                  <div className="absolute left-[-6px] top-1.5 md:left-1/2 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 w-3 h-3 bg-[#FEFEFD] border-2 border-[#106636] rounded-full z-10" />

                  {/* Desktop Layout using flex */}
                  <div className="hidden md:flex w-full items-center justify-between">
                    {/* Left Panel */}
                    <div className={`w-[45%] text-right pr-8 ${idx % 2 !== 0 ? 'invisible' : ''}`}>
                      <span className="text-[#106636] font-semibold text-xl mb-1 inline-block">{node.year}</span>
                      <h4 className="text-2xl font-light text-zinc-900">{node.title}</h4>
                      <p className="text-base text-zinc-600 mt-2 leading-relaxed">{node.desc}</p>
                    </div>

                    {/* Right Panel */}
                    <div className={`w-[45%] text-left pl-8 ${idx % 2 === 0 ? 'invisible' : ''}`}>
                      <span className="text-[#106636] font-semibold text-xl mb-1 inline-block">{node.year}</span>
                      <h4 className="text-2xl font-light text-zinc-900">{node.title}</h4>
                      <p className="text-base text-zinc-600 mt-2 leading-relaxed">{node.desc}</p>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden w-full text-left">
                    <span className="text-[#106636] font-semibold text-xl block mb-1">{node.year}</span>
                    <h4 className="text-2xl font-light text-zinc-900">{node.title}</h4>
                    <p className="text-base text-zinc-600 mt-2 leading-relaxed">{node.desc}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-up">
          <span className="text-[#724D26] text-[10px] uppercase tracking-widest block mb-2">Our Core Pillars</span>
          <h2 className="text-3xl font-light text-zinc-900">Brand Values</h2>
        </div>

        <div className="values-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Uncompromising Quality", desc: "We source only the top 1% of raw materials. No shortcuts, no compromises.", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
            { title: "Master Craftsmanship", desc: "Tempered by hand in small batches to ensure the perfect snap and absolute gloss.", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
            { title: "Absolute Purity", desc: "100% pure cocoa butter. Zero artificial additives. Zero preservatives.", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
            { title: "Ethical Sustainability", desc: "We partner exclusively with carbon-neutral micro-lots that protect biodiversity.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
            { title: "No Preservatives", desc: "Crafted fresh upon order, ensuring peak flavor profiles without chemical shelf-stabilizers.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Luxury Packaging", desc: "Presented in museum-grade, eco-friendly artisanal boxes designed for the perfect unboxing.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
          ].map((val, idx) => (
            <div key={idx} className="value-card bg-white p-8 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <svg className="w-8 h-8 text-[#106636] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={val.icon} />
              </svg>
              <h4 className="text-base font-medium text-zinc-900 mb-2">{val.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Certifications & Credentials */}
      <section className="py-24 bg-zinc-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <span className="text-[#724D26] text-[10px] uppercase tracking-widest block mb-2">Our Credentials</span>
            <h2 className="text-3xl font-light text-zinc-900">Certifications & Expertise</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
              We uphold the highest standards of quality, safety, and culinary excellence. Our continuous pursuit of chocolate mastery is reflected in our official registrations and professional qualifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* FSSAI (PDF Link) */}
            <a href="/images/certs/fssai.pdf" target="_blank" rel="noopener noreferrer" className="bg-white p-4 border border-zinc-100 shadow-sm rounded-xl hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-full aspect-[4/3] bg-zinc-100 mb-4 rounded-lg overflow-hidden relative flex items-center justify-center">
                <svg className="w-16 h-16 text-zinc-400 group-hover:scale-110 group-hover:text-[#106636] transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="absolute bottom-4 text-xs font-medium text-zinc-500 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">View PDF</span>
              </div>
              <h4 className="text-sm font-medium text-zinc-900 mb-1">FSSAI Registered</h4>
              <p className="text-xs text-zinc-500">Certified by the Food Safety and Standards Authority of India.</p>
            </a>

            {/* GST */}
            <a href="/images/certs/gst.jpg" target="_blank" rel="noopener noreferrer" className="bg-white p-4 border border-zinc-100 shadow-sm rounded-xl hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-full aspect-[4/3] bg-zinc-100 mb-4 rounded-lg overflow-hidden relative">
                <img src="/images/certs/gst.jpg" alt="GST Registered" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="text-sm font-medium text-zinc-900 mb-1">GST Registered</h4>
              <p className="text-xs text-zinc-500">Officially registered under the Goods and Services Tax framework.</p>
            </a>

            {/* Craft Chocolate */}
            <a href="/images/certs/craft-chocolate.jpg" target="_blank" rel="noopener noreferrer" className="bg-white p-4 border border-zinc-100 shadow-sm rounded-xl hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-full aspect-[4/3] bg-zinc-100 mb-4 rounded-lg overflow-hidden relative">
                <img src="/images/certs/craft-chocolate.jpg" alt="Craft Chocolate Mastery" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="text-sm font-medium text-zinc-900 mb-1">Craft Chocolate Mastery</h4>
              <p className="text-xs text-zinc-500">Certified by the Art Chocolat Academy of Chocolate Arts.</p>
            </a>

            {/* Panning Dragees */}
            <a href="/images/certs/panning-dragees.jpg" target="_blank" rel="noopener noreferrer" className="bg-white p-4 border border-zinc-100 shadow-sm rounded-xl hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-full aspect-[4/3] bg-zinc-100 mb-4 rounded-lg overflow-hidden relative">
                <img src="/images/certs/panning-dragees.jpg" alt="Panning Dragees" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="text-sm font-medium text-zinc-900 mb-1">Panning Dragees</h4>
              <p className="text-xs text-zinc-500">Advanced qualification from the Art Chocolat Academy.</p>
            </a>
          </div>
        </div>
      </section>
      <section className="py-24 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up space-y-6">
              <span className="text-[#F5E6C4] text-[10px] uppercase tracking-widest font-semibold">The Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-light leading-tight">
                Crafted Without Compromise
              </h2>
              <div className="space-y-4 text-sm text-zinc-400 font-light leading-relaxed">
                <p>
                  At Yemnest, craftsmanship is not a buzzword; it is our religion. From the moment we source our raw, single-origin botanical beans to the final hand-wrapped bow on our gift boxes, every step is strictly monitored.
                </p>
                <p>
                  We believe that adding preservatives, emulsifiers, or vegetable oils is an insult to the cacao bean. Our master chocolatiers rely purely on friction, time, and temperature to achieve our signature velvety texture.
                </p>
                <p>
                  Each recipe is tested hundreds of times. The viral Kunafa bar, for instance, required 47 iterations to perfect the exact ratio of toasted kataifi crunch to creamy pistachio emulsion. That is the Yemnest standard.
                </p>
              </div>
            </div>

            <div className="fade-up grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="/images/themes/raksha-bandhan/6image2.png" alt="Crafting" fill className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700" />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-12">
                <Image src="https://ik.imagekit.io/dypkhqxip/collectiosn5" alt="Crafting" fill className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Signature Products Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-up">
          <h2 className="text-3xl font-light text-zinc-900">Meet Our Masterpieces</h2>
          <div className="w-8 h-[1px] bg-[#724D26] mx-auto mt-6" />
        </div>

        <div className="signatures-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "The Viral Kunafa Collection", desc: "Toasted kataifi, premium pistachio cream, encased in luxury chocolate.", img: "https://ik.imagekit.io/dypkhqxip/collectiosn2?updatedAt=1784063410170" },
            { name: "The Festive Series", desc: "Exquisite hand-crafted assortments curated for your most cherished celebrations.", img: "/images/themes/diwali/image1.png" },
          ].map((prod, idx) => (
            <div key={idx} className="signature-card group relative h-[50vh] overflow-hidden bg-black flex items-end">
              <Image src={prod.img} alt={prod.name} fill className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 z-0" />
              <div className="relative z-10 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl text-white font-light mb-2">{prod.name}</h3>
                <p className="text-sm text-zinc-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{prod.desc}</p>
                <Link href="/collections" className="inline-block border-b border-white pb-1 text-[10px] text-white uppercase tracking-widest hover:text-[#F5E6C4] hover:border-[#F5E6C4] transition-colors">
                  Explore Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Customer Love (Testimonials) */}
      <section className="py-24 bg-[#FAF9F6] border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light text-zinc-900 mb-12 fade-up">Adored by Connoisseurs</h2>
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "The most luxurious chocolate I have ever tasted. The Kunafa crunch is out of this world.", author: "Sarah Jenkins" },
              { quote: "You can immediately taste the absence of artificial emulsifiers. It melts beautifully.", author: "Michael T." },
              { quote: "Exquisite packaging and even better flavor. It feels like a true luxury experience.", author: "Elena R." },
            ].map((t, idx) => (
              <div key={idx} className="testimonial-card bg-white p-8 shadow-sm border border-zinc-100">
                <div className="text-[#106636] mb-4 text-lg">★★★★★</div>
                <p className="text-sm text-zinc-600 italic mb-6 leading-relaxed">"{t.quote}"</p>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">— {t.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
