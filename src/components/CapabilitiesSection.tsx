import { motion } from 'motion/react';
import { CAPABILITIES } from '../data/repomindData';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

export function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className="border-b-[1.5px] border-[#0A0A0A] bg-[#F6F5F0] bg-paper-grid"
    >
      <ScrollInkRule accentColor="#F9E87D" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold tracking-wide text-[#4B8BF5]"
          >
            Core Capabilities · Five Pillars
          </motion.p>

          <MaskedHeadline
            text="Built for deep repository comprehension from first commit to refactor"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.38, delay: 0.12 }}
            className="mt-3 text-base leading-relaxed text-[#52525B]"
          >
            Every capability maps directly to a dedicated LangGraph workflow stage and real code
            inspection tooling.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {CAPABILITIES.map((cap, idx) => {
            const gridSpan =
              idx === 0
                ? 'lg:col-span-7'
                : idx === 1
                  ? 'lg:col-span-5'
                  : idx === 2
                    ? 'lg:col-span-6'
                    : idx === 3
                      ? 'lg:col-span-6'
                      : 'lg:col-span-12';

            const headerAccent =
              idx === 0
                ? 'bg-[#8FD0FA]'
                : idx === 1
                  ? 'bg-[#F9E87D]'
                  : idx === 2
                    ? 'bg-white'
                    : idx === 3
                      ? 'bg-[#8FD0FA]/60'
                      : 'bg-[#F9E87D]';

            return (
              <motion.article
                key={cap.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ x: -2, y: -3, boxShadow: '6px 6px 0px #0A0A0A' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.32, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`${gridSpan} group flex flex-col justify-between overflow-hidden rounded-3xl border-[1.5px] border-[#0A0A0A] bg-white shadow-[4px_4px_0px_#0A0A0A]`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-[#0A0A0A] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A] ${headerAccent}`}
                >
                  <span className="font-mono font-bold">
                    {cap.index}. {cap.title}
                  </span>
                  <span className="font-mono text-[11px] text-[#18181B]">{cap.subtitle}</span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <p className="text-sm leading-relaxed text-[#3F3F46]">{cap.description}</p>

                  <div className="mt-5 overflow-hidden rounded-2xl border-[1.5px] border-[#0A0A0A] bg-[#FAF9F5] p-4 font-mono text-xs transition-colors duration-200 group-hover:bg-[#F3F1EA]">
                    <div className="mb-2 border-b border-[#0A0A0A]/15 pb-2 text-[11px] font-bold text-[#4B8BF5]">
                      {cap.snippetTitle}
                    </div>
                    <div className="space-y-1 text-[#18181B]">
                      {cap.snippetLines.map((line, lineIdx) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -6 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.24, delay: 0.08 + lineIdx * 0.05 }}
                          className="overflow-x-auto whitespace-pre text-[11px] leading-relaxed"
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
