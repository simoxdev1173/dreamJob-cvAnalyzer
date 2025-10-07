// components/HeroCarousel.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroCarousel() {
  const ringRef = useRef<HTMLDivElement>(null);
  // A ref to hold the autoplay timeline so we can pause/resume it
  const autoplayTimeline = useRef<gsap.core.Timeline | null>(null);

  // Helper function to calculate the parallax effect on the background image
  const getBgPos = (i: number): string => {
    const ring = ringRef.current;
    if (!ring) return '0px 0px';
    const rotationY = gsap.getProperty(ring, 'rotationY') as number;
    const wrappedRotation = gsap.utils.wrap(0, 360, rotationY - 180 - i * 36);
    return `${100 - (wrappedRotation / 360) * 500}px 0px`;
  };

  // This useEffect hook runs once to set up the scene and the autoplay.
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const imgs = ring.children;
    
    // --- Initial Setup ---
    gsap.set(ring, { rotationY: 180, cursor: 'grab' });
    gsap.set(imgs, {
      rotateY: (i) => -i * 36,
      transformOrigin: '50% 50% 500px',
      z: -500,
      backgroundImage: (i) => `url(https://picsum.photos/id/${32 + i}/600/400/)`,
      backgroundPosition: (i) => getBgPos(i),
      backfaceVisibility: 'hidden',
    });

    // --- Entrance Animation ---
    gsap.from(imgs, {
      duration: 1.5,
      y: 200,
      opacity: 0,
      stagger: 0.1,
      ease: 'expo.out',
    });

    // --- Autoplay Timeline ---
    autoplayTimeline.current = gsap.timeline({ repeat: -1 }) // Loops indefinitely
      .to(ring, {
        rotationY: '+=360', // Rotates a full 360 degrees
        duration: 40,      // Over 40 seconds
        ease: 'none',
        onUpdate: () => {
          // Keep the parallax effect updated during autoplay
          gsap.set(imgs, { backgroundPosition: (i) => getBgPos(i) });
        },
      });

    // --- Hover Effects ---
    const handleMouseEnter = (e: Event) => {
      const current = e.currentTarget as HTMLElement;
      gsap.to(imgs, { opacity: (i, t) => (t === current ? 1 : 0.5), ease: 'power3' });
    };
    const handleMouseLeave = () => {
      gsap.to(imgs, { opacity: 1, ease: 'power2.inOut' });
    };

    Array.from(imgs).forEach(img => {
      img.addEventListener('mouseenter', handleMouseEnter);
      img.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup function
    return () => {
      autoplayTimeline.current?.kill(); // Important: kill the timeline on unmount
      Array.from(imgs).forEach(img => {
        img.removeEventListener('mouseenter', handleMouseEnter);
        img.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // This useEffect hook handles the drag interaction.
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    let xPos = 0;

    const dragStart = (e: MouseEvent | TouchEvent) => {
      // Pause autoplay on user interaction
      autoplayTimeline.current?.pause();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      xPos = Math.round(clientX);
      gsap.set(ring, { cursor: 'grabbing' });
      window.addEventListener('mousemove', drag);
      window.addEventListener('touchmove', drag);
    };

    const drag = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = (Math.round(clientX) - xPos) % 360;

      gsap.to(ring, {
        rotationY: `-=${delta}`,
        onUpdate: () => {
          gsap.set(ring.children, { backgroundPosition: (i) => getBgPos(i) });
        },
      });
      
      xPos = Math.round(clientX);
    };

    const dragEnd = () => {
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('touchmove', drag);
      gsap.set(ring, { cursor: 'grab' });

      // Resume autoplay after a brief delay for a smoother transition
      autoplayTimeline.current?.resume(0.5);
    };

    ring.addEventListener('mousedown', dragStart);
    ring.addEventListener('touchstart', dragStart, { passive: true });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    
    // Cleanup
    return () => {
      ring.removeEventListener('mousedown', dragStart);
      ring.removeEventListener('touchstart', dragStart);
      window.removeEventListener('mouseup', dragEnd);
      window.removeEventListener('touchend', dragEnd);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none">
      <div className="relative w-[300px] h-[400px]" style={{ perspective: '2000px' }}>
        <div
          ref={ringRef}
          className="absolute w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[300px] h-[400px] bg-cover bg-no-repeat rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
