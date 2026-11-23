import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  CheckCircle2,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Send,
  StepForward,
} from 'lucide-react';
import {
  buildCustomScenario,
  DEMO_SCENARIOS,
  type DemoScenario,
} from '../data/repomindData';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

function StreamingSummary({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <p className="text-sm leading-relaxed text-[#18181B]">
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, delay: idx * 0.015 }}
          className="inline-block mr-[0.26em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export function LiveDemoSimulator() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [customInput, setCustomInput] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number>(DEMO_SCENARIOS[0].steps.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;

    if (completedSteps >= activeScenario.steps.length) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCompletedSteps((prev) => Math.min(prev + 1, activeScenario.steps.length));
    }, 760);

    return () => window.clearTimeout(timer);
  }, [isPlaying, completedSteps, activeScenario.steps.length]);

  const startScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setCompletedSteps(1);
    setIsPlaying(true);
  };

  const handleRunCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const custom = buildCustomScenario(customInput);
    startScenario(custom);
  };

  const handleReplay = () => {
    setCompletedSteps(1);
    setIsPlaying(true);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCompletedSteps((prev) => Math.min(prev + 1, activeScenario.steps.length));
  };

  const handleCopyCode = async () => {
    const codeText = activeScenario.codeFix.lines.join('\n');
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setCopiedCode(false);
    }
  };

  const isFinished = completedSteps >= activeScenario.steps.length;
  const traceProgress = completedSteps / activeScenario.steps.length;

  return (
    <section id="live-demo" className="border-b-[1.5px] border-[#0A0A0A] bg-[#FAF9F5]">
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
            Interactive Live Demo · Deterministic Multi-Agent Trace Simulator
          </motion.p>

          <MaskedHeadline
            text="Watch all five agents investigate a repository step by step"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.38, delay: 0.12 }}
            className="mt-3 text-base leading-relaxed text-[#52525B]"
          >
            Choose an engineering investigation preset or submit your own question to step through
            how RepoMind crawls, traces, assesses impact, and verifies sources.
          </motion.p>
        </div>

        {/* Scenario Tabs & Butter-Yellow Composer Bar */}
        <div className="mt-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {DEMO_SCENARIOS.map((scenario) => {
              const isSelected = activeScenario.id === scenario.id;
              return (
                <motion.button
                  key={scenario.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startScenario(scenario)}
                  className={`relative rounded-full border-[1.5px] border-[#0A0A0A] px-4 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#8FD0FA] text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]'
                      : 'bg-white text-[#27272A] hover:bg-[#F9E87D]'
                  }`}
                >
                  {scenario.category}: {scenario.title}
                </motion.button>
              );
            })}
          </div>

          <form onSubmit={handleRunCustom} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask an investigation question (e.g., How does auth middleware validate sessions?)"
              aria-label="Custom codebase investigation prompt"
              className="flex-1 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#F9E87D]/70 px-5 py-3 text-sm font-medium text-[#0A0A0A] placeholder:text-[#3F3F46] shadow-[3px_3px_0px_#0A0A0A] focus:bg-[#F9E87D] focus:outline-none transition-colors"
            />
            <motion.button
              type="submit"
              whileHover={{ x: -1.5, y: -1.5, boxShadow: '4px 4px 0px #4B8BF5' }}
              whileTap={{ x: 1, y: 1, boxShadow: '0px 0px 0px #4B8BF5' }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] px-6 py-3 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Run Trace
            </motion.button>
          </form>
        </div>

        {/* Simulator Tablet Shell */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
          className="mt-7 overflow-hidden rounded-[26px] border-[2px] border-[#0A0A0A] bg-white shadow-[7px_7px_0px_#0A0A0A]"
        >
          {/* Sky Blue Top Window Chrome */}
          <div className="border-b-[1.5px] border-[#0A0A0A] bg-[#8FD0FA]">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0A0A0A]">
                  <span className="font-mono">{activeScenario.repo}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {completedSteps} / {activeScenario.steps.length} agents complete
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeScenario.prompt}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-0.5 truncate text-sm font-bold text-[#0A0A0A]"
                  >
                    {activeScenario.prompt}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (isFinished) {
                      handleReplay();
                    } else {
                      setIsPlaying((p) => !p);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#0A0A0A] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A] hover:bg-[#F9E87D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      Pause
                    </>
                  ) : isFinished ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Replay
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      Play
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStepForward}
                  disabled={isFinished}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#0A0A0A] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F6F5F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <StepForward className="h-3.5 w-3.5" />
                  Step
                </motion.button>
              </div>
            </div>

            {/* Animated Execution Progress Hairline */}
            <div className="h-1 w-full bg-[#0A0A0A]/15">
              <motion.div
                animate={{ scaleX: traceProgress }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                style={{ transformOrigin: '0% 50%' }}
                className="h-full w-full bg-[#0A0A0A]"
              />
            </div>
          </div>

          {/* Dual Pane Body */}
          <div className="grid grid-cols-1 divide-y-[1.5px] divide-[#0A0A0A] lg:grid-cols-12 lg:divide-x-[1.5px] lg:divide-y-0">
            {/* Left: Five-Agent Execution Log */}
            <div className="space-y-3 bg-[#FAF9F5] p-5 lg:col-span-6">
              <div className="text-xs font-bold text-[#0A0A0A]">
                LangGraph Agent Execution Trace
              </div>

              <div className="space-y-3">
                {activeScenario.steps.map((step, idx) => {
                  const unlocked = idx < completedSteps;
                  return (
                    <motion.div
                      key={`${activeScenario.id}-${step.agentId}`}
                      initial={false}
                      animate={{
                        opacity: unlocked ? 1 : 0.4,
                        y: unlocked ? 0 : 4,
                        scale: unlocked ? 1 : 0.99,
                      }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`rounded-2xl border-[1.5px] border-[#0A0A0A] p-3.5 ${
                        unlocked
                          ? 'bg-white shadow-[3px_3px_0px_#0A0A0A]'
                          : 'bg-[#F6F5F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-[#0A0A0A]">{step.agentName}</span>
                        <span className="font-mono text-[11px] font-semibold text-[#52525B] tabular-nums">
                          {step.elapsedLabel}
                        </span>
                      </div>

                      {unlocked ? (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mt-1.5 font-mono text-[11px] font-semibold text-[#4B8BF5] break-all">
                            {step.toolCall}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-[#27272A]">
                            {step.finding}
                          </p>
                        </motion.div>
                      ) : (
                        <p className="mt-1.5 font-mono text-[11px] text-[#71717A]">
                          Waiting for upstream LangGraph state...
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Verified Engineering Output & Impact Map */}
            <div className="flex flex-col justify-between bg-white p-5 lg:col-span-6">
              <AnimatePresence mode="wait">
                {isFinished ? (
                  <motion.div
                    key={`${activeScenario.id}-verified`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B8BF5]">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified Engineering Answer
                      </span>
                      <span className="font-mono text-[11px] font-medium text-[#52525B]">
                        {activeScenario.citations.length} source citations checked
                      </span>
                    </div>

                    <StreamingSummary text={activeScenario.answerSummary} />

                    {/* Impact Analysis Breakdown */}
                    <div className="rounded-2xl border-[1.5px] border-[#0A0A0A] bg-[#FAF9F5] p-4">
                      <div className="text-xs font-bold text-[#0A0A0A]">
                        Impact Analysis Surface
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {activeScenario.impactedFiles.map((item, idx) => (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 + idx * 0.05 }}
                            className="flex flex-col justify-between gap-1 border-b border-[#0A0A0A]/15 pb-2 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                          >
                            <div className="min-w-0">
                              <div className="truncate font-mono text-xs font-bold text-[#0A0A0A]">
                                {item.path}
                              </div>
                              <div className="text-xs text-[#52525B]">{item.reason}</div>
                            </div>
                            <span
                              className={`font-mono text-[11px] font-bold shrink-0 ${
                                item.risk === 'Direct'
                                  ? 'text-[#DC2626]'
                                  : item.risk === 'Test'
                                    ? 'text-[#4B8BF5]'
                                    : 'text-[#D97706]'
                              }`}
                            >
                              {item.risk}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Stark Black Code Patch Block */}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.2 }}
                      className="overflow-hidden rounded-2xl border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] text-white"
                    >
                      <div className="flex items-center justify-between border-b border-white/15 bg-[#141416] px-4 py-2">
                        <span className="font-mono text-[11px] text-[#8FD0FA]">
                          {activeScenario.codeFix.file}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="h-3 w-3 text-[#8FD0FA]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-100">
                        <code>{activeScenario.codeFix.lines.join('\n')}</code>
                      </pre>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pending-verification"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[#0A0A0A]/35 bg-[#FAF9F5] p-8 text-center"
                  >
                    <p className="font-mono text-xs font-bold text-[#4B8BF5]">
                      Executing step {completedSteps} of {activeScenario.steps.length}
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-[#52525B]">
                      Final code citations and impact surfaces appear once the Response &amp;
                      Verification Agent confirms every referenced file path.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
