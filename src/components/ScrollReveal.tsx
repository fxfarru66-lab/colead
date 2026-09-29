import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number; // ms, default 500
  distance?: number; // px, default 24
  blur?: boolean;
  scale?: boolean;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 550,
  distance = 24,
  blur = true,
  scale = false,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && elementRef.current) {
              observer.unobserve(elementRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [once]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    
    let x = 0;
    let y = 0;
    if (direction === 'up') y = distance;
    if (direction === 'down') y = -distance;
    if (direction === 'left') x = distance;
    if (direction === 'right') x = -distance;

    const scaleVal = scale ? 0.96 : 1;
    return `translate3d(${x}px, ${y}px, 0) scale(${scaleVal})`;
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    filter: blur ? (isVisible ? 'blur(0px)' : 'blur(8px)') : 'none',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform, filter',
  };

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  );
};

interface AnimatedCounterProps {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 1400,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

interface KineticTextProps {
  text: string;
  className?: string;
  tagline?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({ text, className = '', tagline }) => {
  const words = text.split(' ');

  return (
    <div className={`space-y-2 ${className}`}>
      {tagline && (
        <ScrollReveal direction="up" delay={50}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B8A48D]/60 bg-[#E8DED2]/80 text-[11px] font-mono tracking-widest text-[#5B5045] uppercase font-semibold">
            <span>CoLead</span>
            <span aria-hidden="true">·</span>
            <span>{tagline}</span>
          </div>
        </ScrollReveal>
      )}

      <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#342F2A] flex flex-wrap justify-center gap-x-3 gap-y-1">
        {words.map((word, idx) => (
          <ScrollReveal
            key={idx}
            direction="up"
            delay={100 + idx * 45}
            duration={500}
            distance={16}
            blur={true}
            className="inline-block"
          >
            {word}
          </ScrollReveal>
        ))}
      </h1>
    </div>
  );
};
