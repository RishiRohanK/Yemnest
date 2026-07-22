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
    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

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
    <div ref={containerRef} className="story-container relative bg-[#FEFEFD] text-zinc-900 font-sans overflow-hidden selection:bg-[#106636] selection:text-white">
      
      {/* 1. Cinematic Hero */}
      <section className="hero-section relative h-[80vh] flex flex-col justify-center items-center text-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ik.imagekit.io/dypkhqxip/banner1.1%20(6).png"
            alt="The Yemnest Story"
            fill
            priority
            className="hero-bg object-cover opacity-40 select-none"
          />
        </div>
        <div className="relative z-10 px-4 max-w-3xl">
          <span className="hero-el block text-[#F5E6C4] text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
            Our Legacy
          </span>
          <h1 className="hero-el text-5xl md:text-7xl font-light text-white tracking-tight mb-8">
            Our Story
          </h1>
          <p className="hero-el text-sm md:text-base text-zinc-300 font-normal leading-relaxed">
            Redefining luxury through absolute purity, obsessive craftsmanship, and a visionary approach to modern chocolate making.
          </p>
        </div>
      </section>

      {/* 2. Why Yemnest Exists (Founders Story & Vision) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="fade-up text-xs text-[#724D26] uppercase tracking-[0.3em] mb-6 font-semibold">The Vision</h2>
        <p className="fade-up text-xl md:text-3xl font-light text-zinc-900 leading-relaxed mb-10">
          &quot;Yemnest was born from a simple realization: the world&apos;s most luxurious ingredient had been diluted by mass production. We set out to strip away the artificial and return chocolate to its purest, most breathtaking form.&quot;
        </p>
        <div className="fade-up w-12 h-[1px] bg-zinc-300 mx-auto mb-10" />
        <p className="fade-up text-sm text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Our founders traveled the globe studying traditional refining methods, only to realize that true innovation required a return to basics. By utilizing 100% pure cocoa butter and sourcing directly from ethical micro-lots, Yemnest was built on a foundation of uncompromising integrity. Our mission is to elevate chocolate from a mere confection to a curated sensory masterpiece.
        </p>
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
                { year: "2022", title: "The Idea Born", desc: "A passionate pursuit begins in a small kitchen. The founders experiment with raw cacao, rejecting every commercial emulsifier." },
                { year: "2023", title: "Global Research", desc: "Traveling to Swiss ateliers and Middle Eastern souks to understand the delicate balance of tempering and exotic flavor infusions." },
                { year: "2024", title: "Recipe Development", desc: "Months of meticulous testing leads to the creation of the signature Viral Kunafa Bar, blending toasted kataifi with premium chocolate." },
                { year: "2025", title: "The First Collection", desc: "Yemnest officially launches its inaugural luxury collection, redefining the modern gifting experience." },
                { year: "Future", title: "A Vision of Purity", desc: "Continuing to push the boundaries of botanical flavors while maintaining our strict 100% pure cocoa butter standard." },
              ].map((node, idx) => (
                <div key={idx} className="timeline-node relative w-full pl-10 md:pl-0">
                  
                  {/* Dot */}
                  <div className="absolute left-[-6px] top-1.5 md:left-1/2 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 w-3 h-3 bg-[#FEFEFD] border-2 border-[#106636] rounded-full z-10" />

                  {/* Desktop Layout using flex */}
                  <div className="hidden md:flex w-full items-center justify-between">
                    {/* Left Panel */}
                    <div className={`w-[45%] text-right pr-8 ${idx % 2 !== 0 ? 'invisible' : ''}`}>
                      <span className="text-[#106636] font-semibold text-lg mb-1 inline-block">{node.year}</span>
                      <h4 className="text-xl font-light text-zinc-900">{node.title}</h4>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{node.desc}</p>
                    </div>

                    {/* Right Panel */}
                    <div className={`w-[45%] text-left pl-8 ${idx % 2 === 0 ? 'invisible' : ''}`}>
                      <span className="text-[#106636] font-semibold text-lg mb-1 inline-block">{node.year}</span>
                      <h4 className="text-xl font-light text-zinc-900">{node.title}</h4>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{node.desc}</p>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden w-full text-left">
                    <span className="text-[#106636] font-semibold text-lg block mb-1">{node.year}</span>
                    <h4 className="text-xl font-light text-zinc-900">{node.title}</h4>
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{node.desc}</p>
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

      {/* 5. Editorial Craftsmanship */}
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
                <Image src="https://ik.imagekit.io/dypkhqxip/banner1.1%20(2).png" alt="Crafting" fill className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700" />
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
            { name: "Atelier Dark Series", desc: "Single-origin botanical notes delicately tempered with pure cocoa butter.", img: "https://ik.imagekit.io/dypkhqxip/banner1.1%20(1).png" },
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

      {/* 8. Final CTA */}
      <section className="py-32 bg-[#106636] text-center px-4 relative z-10 overflow-hidden">
        <div className="max-w-2xl mx-auto fade-up">
          <span className="text-[#F5E6C4] text-[10px] uppercase tracking-widest font-semibold block mb-4">The Next Chapter</span>
          <h2 className="text-3xl sm:text-5xl font-light text-[#FEFEFD] mb-6">&quot;Less, but better.&quot;</h2>
          <Link 
            href="/collections" 
            className="inline-block text-[10px] uppercase tracking-widest text-[#106636] bg-white px-10 py-4 hover:bg-[#F5E6C4] transition-colors shadow-xl"
          >
            Shop The Collection
          </Link>
        </div>
      </section>

    </div>
  );
}
