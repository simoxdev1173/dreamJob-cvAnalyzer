// components/HeroCarouselArc.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const cvImages = [
  '/cvs/cv1.jpg', '/cvs/cv2.jpg', '/cvs/cv3.jpg',
  '/cvs/cv4.jpg', '/cvs/cv5.jpg', '/cvs/cv6.jpg',
];

export default function HeroCarouselArc() {
  const ringRef = useRef<HTMLDivElement>(null);
  const autoplayTimeline = useRef<gsap.core.Timeline | null>(null);

  // The core function that creates the arc effect
  const applyArcEffect = () => {
    const ring = ringRef.current;
    if (!ring) return;
    const items = ring.children;
    const ringRotation = gsap.getProperty(ring, 'rotationY') as number;

    gsap.set(items, {
      scale: (i) => {
        const angle = ringRotation - (i * 36);
        const wrappedAngle = Math.abs(gsap.utils.wrap(-180, 180, angle));
        // Scale down from 1 to 0.6 based on distance from center
        return 1 - (wrappedAngle / 180) * 0.4;
      },
      x: (i) => {
        const angle = ringRotation - (i * 36);
        const wrappedAngle = gsap.utils.wrap(-180, 180, angle);
        // Push items horizontally to create the arc; 200 is the arc width
        return Math.sin(gsap.utils.DEG_TO_RAD * wrappedAngle) * 200;
      },
      opacity: (i) => {
        const angle = ringRotation - (i * 36);
        const wrappedAngle = Math.abs(gsap.utils.wrap(-180, 180, angle));
        // Fade out from 1 to 0.2 based on distance from center
        return 1 - (wrappedAngle / 180) * 0.8;
      }
    });
  };

  // Setup and Autoplay Hook
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const imgs = ring.children;

    gsap.set(ring, { rotationY: 180, cursor: 'grab' });
    gsap.set(imgs, {
      rotateY: (i) => -i * 36,
      transformOrigin: '50% 50% 480px',
      z: -480,
      backgroundImage: (i) => `url(${cvImages[i % cvImages.length]})`,
      backfaceVisibility: 'hidden',
    });

    gsap.from(imgs, { duration: 1.5, y: 200, opacity: 0, stagger: 0.1, ease: 'expo.out' });

    autoplayTimeline.current = gsap.timeline({ repeat: -1 })
      .to(ring, {
        rotationY: '+=360',
        duration: 30, // Faster for a more dynamic feel
        ease: 'none',
        onUpdate: applyArcEffect,
      });

    const handleMouseEnter = () => autoplayTimeline.current?.pause();
    const handleMouseLeave = () => autoplayTimeline.current?.resume();
    
    ring.addEventListener('mouseenter', handleMouseEnter);
    ring.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      autoplayTimeline.current?.kill();
      ring.removeEventListener('mouseenter', handleMouseEnter);
      ring.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Drag Interaction Hook
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    let xPos = 0;

    const dragStart = (e: MouseEvent | TouchEvent) => {
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
        onUpdate: applyArcEffect,
      });
      xPos = Math.round(clientX);
    };

    const dragEnd = () => {
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('touchmove', drag);
      gsap.set(ring, { cursor: 'grab' });
      autoplayTimeline.current?.resume(0.5);
    };
    
    ring.addEventListener('mousedown', dragStart);
    ring.addEventListener('touchstart', dragStart, { passive: true });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

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
        <div ref={ringRef} className="absolute w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute w-[300px] h-[400px] bg-cover bg-center bg-no-repeat rounded-lg"/>
          ))}
        </div>
      </div>
    </div>
  );
}
