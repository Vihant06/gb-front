import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TECH_STACK, type TechStackItem } from '../data/repomindData';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

type CategoryFilter = 'All' | TechStackItem['category'];

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Orchestration',
  'Code Indexing',
  'External Context',
];

export function TechStackIntegrations() {
  const [filter, setFilter] = useState<CategoryFilter>('All');

  const visibleItems =
    filter === 'All'
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === filter);

  return (
    <section className="border-b-[1.5px] border-[#0A0A0A] bg-[#F6F5F0] bg-paper-grid">
      <ScrollInkRule accentColor="#4B8BF5" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold tracking-wide text-[#4B8BF5]"
            >
              Integrations &amp; Technology Stack
            </motion.p>

            <MaskedHeadline
              text="Open-source developer infrastructure under the hood"
              className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.38, delay: 0.12 }}
              className="mt-3 text-base leading-relaxed text-[#52525B]"
            >
              Built on proven orchestration, AST parsing, vector storage, and external knowledge
              protocols—every component inspects real repository state.
            </motion.p>
          </div>

          {/* Interactive Filter Controls with layoutId pill */}
          <div
            role="tablist"
            aria-label="Filter technology stack by layer"
            className="flex flex-wrap items-center gap-1 rounded-full border-[1.5px] border-[#0A0A0A] bg-white p-1.5 shadow-[3px_3px_0px_#0A0A0A] self-start lg:self-auto"
          >
            {CATEGORIES.map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setFilter(category)}
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'text-white' : 'text-[#3F3F46] hover:text-[#0A0A0A]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="techFilterPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[#0A0A0A]"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ x: -2, y: -3, boxShadow: '5px 5px 0px #0A0A0A' }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.025, 0.15) }}
                className="rounded-2xl border-[1.5px] border-[#0A0A0A] bg-white p-5 shadow-[3px_3px_0px_#0A0A0A]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-mono text-sm font-extrabold text-[#0A0A0A]">{item.name}</h3>
                  <span className="text-xs font-medium text-[#52525B]">{item.category}</span>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-[#4B8BF5]">{item.role}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#3F3F46]">{item.detail}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
