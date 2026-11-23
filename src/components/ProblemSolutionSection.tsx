import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

const FRAGMENTED_ISSUES = [
  {
    title: 'Blind keyword grep misses call context',
    detail:
      'Flat text search matches unrelated comments and strings without understanding AST function scopes or import aliases.',
  },
  {
    title: 'Single-prompt code chat guesses file paths',
    detail:
      'Naive vector chunking loses cross-file execution order, leading to ungrounded explanations and invented symbol signatures.',
  },
  {
    title: 'Risky changes without blast-radius checks',
    detail:
      'Editing a shared schema or auth helper without tracing reverse callers leaves downstream endpoints and test suites broken.',
  },
];

const REPOMIND_SOLUTIONS = [
  {
    title: 'Tree-sitter AST + ripgrep + Qdrant hybrid retrieval',
    detail:
      'Combines syntactic call graphs, exact symbol lookups, and semantic embeddings so retrieval respects real module boundaries.',
  },
  {
    title: 'Dedicated investigation & verification agents',
    detail:
      'LangGraph routes queries through specialized agents that trace execution paths and verify every file path before answering.',
  },
  {
    title: 'Automated reverse-dependency impact analysis',
    detail:
      'Maps direct callers, indirect consumers, and affected test files prior to modifying code so teams ship with confidence.',
  },
];

export function ProblemSolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'center 52%'],
  });

  const leftCardX = useTransform(scrollYProgress, [0, 1], [-18, 0]);
  const rightCardX = useTransform(scrollYProgress, [0, 1], [18, 0]);

  return (
    <section
      ref={sectionRef}
      className="border-b-[1.5px] border-[#0A0A0A] bg-[#FAF9F5] overflow-hidden"
    >
      <ScrollInkRule accentColor="#8FD0FA" />

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold tracking-wide text-[#4B8BF5]"
          >
            Why Agentic RAG · Codebase Intelligence
          </motion.p>

          <MaskedHeadline
            text="From brittle code search to structured engineering investigation"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.38, delay: 0.12 }}
            className="mt-3 text-base leading-relaxed text-[#52525B]"
          >
            Large repositories break single-pass RAG. RepoMind separates structural crawling,
            execution tracing, impact analysis, and citation checking into explicit graph nodes.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Crisp White Ink-Outlined Card */}
          <motion.div
            style={{ x: leftCardX }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0px #0A0A0A' }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border-[1.5px] border-[#0A0A0A] bg-white p-7 shadow-[4px_4px_0px_#0A0A0A]"
          >
            <div className="flex items-center justify-between border-b-[1.5px] border-[#0A0A0A]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-[#EA580C]" />
                <h3 className="text-base font-bold text-[#0A0A0A]">
                  Traditional Code Search &amp; Naive Chat
                </h3>
              </div>
              <span className="font-mono text-xs font-medium text-[#52525B]">
                Single-pass lookup
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {FRAGMENTED_ISSUES.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                >
                  <h4 className="text-sm font-bold text-[#0A0A0A]">{item.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#52525B]">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stark Black Inverted Contrast Card */}
          <motion.div
            style={{ x: rightCardX }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0px #4B8BF5' }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] p-7 text-white shadow-[4px_4px_0px_#8FD0FA]"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#8FD0FA]" />
                <h3 className="text-base font-bold text-white">
                  RepoMind Five-Agent Investigation
                </h3>
              </div>
              <span className="font-mono text-xs font-medium text-[#F9E87D]">
                LangGraph StateGraph
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {REPOMIND_SOLUTIONS.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                >
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
