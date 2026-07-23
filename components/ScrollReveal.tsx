"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    let fromVars: gsap.TweenVars = { opacity: 0 };
    let toVars: gsap.TweenVars = { opacity: 1, duration, delay, ease: "power3.out" };

    if (animation === "fade-up") {
      fromVars = { ...fromVars, y: 50 };
      toVars = { ...toVars, y: 0 };
    } else if (animation === "slide-left") {
      fromVars = { ...fromVars, x: 50 };
      toVars = { ...toVars, x: 0 };
    } else if (animation === "slide-right") {
      fromVars = { ...fromVars, x: -50 };
      toVars = { ...toVars, x: 0 };
    }

    toVars.scrollTrigger = {
      trigger: containerRef.current,
      start: "top 85%", // Triggers when the top of the element hits 85% of the viewport height
      toggleActions: "play none none reverse", // Plays forward on enter, reverses on leave back
    };

    gsap.fromTo(containerRef.current, fromVars, toVars);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
