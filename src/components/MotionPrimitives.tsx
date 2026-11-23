import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface MaskedHeadlineProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  immediate?: boolean;
  delay?: number;
}

/**
 * Editorial kinetic headline reveal: each word slides upward out of an overflow mask
 * with crisp settling curves and balanced text wrapping.
 */
export function MaskedHeadline({
  text,
  className = '',
  as = 'h2',
  immediate = false,
  delay = 0,
}: MaskedHeadlineProps) {
  const words = text.split(' ');
  const MotionTag = as === 'h1' ? motion.h1 : as === 'h3' ? motion.h3 : motion.h2;

  return (
    <MotionTag
      style={{ textWrap: 'balance' }}
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, amount: 0.35 } })}
    >
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom pb-[0.06em] mr-[0.24em] last:mr-0"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '108%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  duration: 0.48,
                  delay: delay + idx * 0.032,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

interface ScrollInkRuleProps {
  accentColor?: string;
}

/**
 * Scroll-driven horizontal ink accent rule that draws across the section top edge
 * as the section enters the viewport.
 */
export function ScrollInkRule({ accentColor = '#4B8BF5' }: ScrollInkRuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'start 35%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress, transformOrigin: '0% 50%', backgroundColor: accentColor }}
        className="h-[3px] w-full"
      />
    </div>
  );
}

interface ScrollParallaxPanelProps {
  children: ReactNode;
  className?: string;
  yRange?: [number, number];
}

export function ScrollParallaxPanel({
  children,
  className = '',
  yRange = [18, -14],
}: ScrollParallaxPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
