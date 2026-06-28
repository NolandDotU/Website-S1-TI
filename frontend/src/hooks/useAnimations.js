import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins globally
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hook for a simple fade-in animation on mount.
 */
export const useFadeIn = (ref, options = {}) => {
  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out', ...options }
    );
  }, { scope: ref });
};

/**
 * Hook for sliding up and fading in elements.
 * Often used with ScrollTrigger for elements entering the viewport.
 */
export const useSlideUp = (ref, options = {}) => {
  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger,
        },
        ...options,
      }
    );
  }, { scope: ref });
};

/**
 * Hook for staggering children elements.
 */
export const useStagger = (containerRef, selector = '.stagger-item', options = {}) => {
  useGSAP(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      selector,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger,
        },
        ...options,
      }
    );
  }, { scope: containerRef });
};

export default { useFadeIn, useSlideUp, useStagger };
