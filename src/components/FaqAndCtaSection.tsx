import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/repomindData';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

interface FaqAndCtaSectionProps {
  onOpenQuickstart: () => void;
}

export function FaqAndCtaSection({ onOpenQuickstart }: FaqAndCtaSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ctaRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ['start 90%', 'center 60%'],
  });
  const ctaScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <>
      {/* FAQ Section */}
      <section id="faq" className="border-b-[1.5px] border-[#0A0A0A] bg-[#FAF9F5]">
        <ScrollInkRule accentColor="#8FD0FA" />

        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-24">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold tracking-wide text-[#4B8BF5]"
            >
              Frequently Asked Questions
            </motion.p>

            <MaskedHeadline
              text="Architecture, indexing, and verification details"
              className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="mt-10 divide-y-[1.5px] divide-[#0A0A0A] overflow-hidden rounded-3xl border-[1.5px] border-[#0A0A0A] bg-white shadow-[5px_5px_0px_#0A0A0A]"
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors cursor-pointer ${
                      isOpen ? 'bg-[#8FD0FA]/35' : 'hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <span className="text-sm font-bold text-[#0A0A0A] sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#0A0A0A] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -4 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.18 }}
                          className="px-6 pb-5 pt-1 text-sm leading-relaxed text-[#3F3F46]"
                        >
                          {item.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section with Scroll Scale Choreography */}
      <section
        ref={ctaRef}
        className="border-b-[1.5px] border-[#0A0A0A] bg-[#F6F5F0] bg-paper-grid py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            style={{ scale: ctaScale }}
            className="overflow-hidden rounded-[28px] border-[2px] border-[#0A0A0A] bg-white shadow-[7px_7px_0px_#0A0A0A]"
          >
            <div className="border-b-[1.5px] border-[#0A0A0A] bg-[#F9E87D] px-8 py-3 text-xs font-bold text-[#0A0A0A]">
              Get Started Locally or via MCP
            </div>

            <div className="p-8 sm:p-12">
              <div className="max-w-2xl">
                <MaskedHeadline
                  text="Understand Any Codebase. Investigate Deeper. Ship With Confidence."
                  className="text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-4xl"
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="mt-4 text-base leading-relaxed text-[#3F3F46]"
                >
                  Clone the five-agent LangGraph workspace, connect your GitHub token and Qdrant
                  collection, and start asking evidence-backed engineering questions.
                </motion.p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ x: -2, y: -2, boxShadow: '4px 4px 0px #4B8BF5' }}
                    whileTap={{ x: 1, y: 1, boxShadow: '0px 0px 0px #4B8BF5' }}
                    onClick={onOpenQuickstart}
                    className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Explore on GitHub
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>

                  <motion.a
                    href="#live-demo"
                    whileHover={{ x: -2, y: -2, boxShadow: '3px 3px 0px #0A0A0A' }}
                    whileTap={{ x: 1, y: 1, boxShadow: '0px 0px 0px #0A0A0A' }}
                    className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#0A0A0A] bg-white px-5 py-3 text-sm font-semibold text-[#0A0A0A] whitespace-nowrap shrink-0"
                  >
                    See How It Works
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-[#FAF9F5] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-base font-extrabold tracking-tight text-[#0A0A0A]">
              RepoMind
            </span>
            <p className="mt-1 text-xs text-[#52525B]">
              Agentic RAG Codebase Assistant · Built with LangChain &amp; LangGraph
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#52525B]"
          >
            <a href="#capabilities" className="hover:text-[#0A0A0A] transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-[#0A0A0A] transition-colors">
              Workflow
            </a>
            <a href="#architecture" className="hover:text-[#0A0A0A] transition-colors">
              Architecture
            </a>
            <a href="#live-demo" className="hover:text-[#0A0A0A] transition-colors">
              Live Demo
            </a>
            <a href="#faq" className="hover:text-[#0A0A0A] transition-colors">
              FAQ
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
