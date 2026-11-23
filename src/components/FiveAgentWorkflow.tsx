import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { FIVE_AGENTS } from '../data/repomindData';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

export function FiveAgentWorkflow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAgent = FIVE_AGENTS[activeIndex];
  const progressRatio = (activeIndex + 1) / FIVE_AGENTS.length;

  return (
    <section id="workflow" className="border-b-[1.5px] border-[#0A0A0A] bg-[#FAF9F5]">
      <ScrollInkRule accentColor="#4B8BF5" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold tracking-wide text-[#4B8BF5]"
            >
              Five-Agent Workflow · LangGraph Orchestration
            </motion.p>

            <MaskedHeadline
              text="Five specialized agents passing verified state across every query"
              className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Previous agent stage"
              onClick={() =>
                setActiveIndex((prev) => (prev === 0 ? FIVE_AGENTS.length - 1 : prev - 1))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#F9E87D] transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <span className="px-2 font-mono text-xs font-bold text-[#0A0A0A] tabular-nums">
              {activeIndex + 1} / {FIVE_AGENTS.length}
            </span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Next agent stage"
              onClick={() =>
                setActiveIndex((prev) => (prev === FIVE_AGENTS.length - 1 ? 0 : prev + 1))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#F9E87D] transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Animated Stage Progress Rail */}
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full border border-[#0A0A0A] bg-white">
          <motion.div
            animate={{ scaleX: progressRatio }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ transformOrigin: '0% 50%' }}
            className="h-full w-full bg-[#4B8BF5]"
          />
        </div>

        {/* Interactive 5-Agent Selector Strip */}
        <div
          role="tablist"
          aria-label="Five-agent workflow stages"
          className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {FIVE_AGENTS.map((agent, idx) => {
            const isSelected = idx === activeIndex;

            return (
              <motion.button
                key={agent.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.28, delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex flex-col items-start rounded-2xl border-[1.5px] border-[#0A0A0A] p-4 text-left transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? agent.accent === 'cyan'
                      ? 'bg-[#8FD0FA] shadow-[4px_4px_0px_#0A0A0A]'
                      : 'bg-[#F9E87D] shadow-[4px_4px_0px_#0A0A0A]'
                    : 'bg-white hover:bg-[#F6F5F0] shadow-[2px_2px_0px_#0A0A0A]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0A0A0A]">
                    {agent.step}.
                  </span>
                  {idx < FIVE_AGENTS.length - 1 && (
                    <ArrowRight className="hidden h-3.5 w-3.5 text-[#0A0A0A] lg:block" />
                  )}
                </div>
                <span className="mt-2.5 text-sm font-bold text-[#0A0A0A]">{agent.name}</span>
                <span className="mt-1 text-xs text-[#27272A]">{agent.role}</span>

                {isSelected && (
                  <motion.div
                    layoutId="workflowActiveBar"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="mt-3 h-1 w-full rounded-full bg-[#0A0A0A]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active Stage Inspector with Smooth Text Crossfade */}
        <div className="mt-7 grid grid-cols-1 gap-6 rounded-3xl border-[1.5px] border-[#0A0A0A] bg-white p-6 shadow-[5px_5px_0px_#0A0A0A] lg:grid-cols-12 lg:p-8">
          <div className="flex flex-col justify-between lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAgent.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B]">
                  <span className="font-mono font-bold text-[#4B8BF5]">
                    Agent {activeAgent.step}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeAgent.role}</span>
                </div>

                <h3 className="mt-3 text-xl font-extrabold text-[#0A0A0A]">{activeAgent.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3F3F46]">
                  {activeAgent.summary}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`meta-${activeAgent.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="mt-6 space-y-3 border-t-[1.5px] border-[#0A0A0A]/15 pt-5 text-xs"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-[#52525B]">Reads state</span>
                  <span className="font-mono font-semibold text-[#0A0A0A]">
                    {activeAgent.readsFrom}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-[#52525B]">Writes state</span>
                  <span className="font-mono font-semibold text-[#4B8BF5]">
                    {activeAgent.writesTo}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-[#52525B]">Bound tools</span>
                  <span className="font-mono font-semibold text-[#0A0A0A]">
                    {activeAgent.tools.join(' · ')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full overflow-hidden rounded-2xl border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] text-white">
              <div className="flex items-center justify-between border-b border-white/15 bg-[#141416] px-4 py-2.5 text-[11px] font-mono text-zinc-300">
                <span>LangGraph State Snapshot</span>
                <span className="text-[#8FD0FA]">{activeAgent.id}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={`json-${activeAgent.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-100"
                >
                  <code>{activeAgent.sampleState}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
