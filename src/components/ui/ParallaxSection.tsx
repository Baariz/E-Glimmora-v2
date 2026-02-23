'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * GPU-accelerated parallax section.
 *
 * How it works:
 * - The background image is 130% the height of the container, offset -15% top
 * - On scroll, translate3d shifts the image at a fraction of the scroll speed
 * - requestAnimationFrame + passive listener = zero main-thread blocking
 * - translate3d + will-change: transform = GPU compositor layer (no repaints)
 * - Direct DOM manipulation via refs = zero React re-renders
 */
export function ParallaxSection({
  imageUrl,
  className,
  speed = 0.3,
  children,
}: {
  imageUrl: string;
  className?: string;
  speed?: number;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let ticking = false;

    const update = () => {
      const rect = container.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        img.style.transform = `translate3d(0, ${rect.top * speed}px, 0)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div
        ref={imgRef}
        className="absolute inset-x-0 -top-[15%] h-[130%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      {children}
    </div>
  );
}
