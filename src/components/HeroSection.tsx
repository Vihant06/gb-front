import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  FileCode2,
  GitBranch,
  Home,
  MessageSquare,
  Search,
  Send,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { HERO_PREVIEW_FILES } from '../data/repomindData';
import { MaskedHeadline } from './MotionPrimitives';

interface HeroSectionProps {
  onOpenQuickstart: () => void;
}

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'chat', label: 'Investigate', icon: MessageSquare },
  { id: 'impact', label: 'Impact', icon: GitBranch },
  { id: 'config', label: 'Settings', icon: Settings },
] as const;

const ROTATING_FOCUS = [
  'Map unfamiliar repository architecture with Tree-sitter AST parsing',
  'Trace multi-file bug execution paths using ripgrep & Qdrant hybrid retrieval',
  'Assess downstream change impact and affected test suites before editing',
  'Ground every answer with source-verified file paths and line citations',
];

export function HeroSection({ onOpenQuickstart }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [selectedFileId, setSelectedFileId] = useState<string>(HERO_PREVIEW_FILES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarTab, setSidebarTab] = useState<string>('chat');
  const [inspectedTrigger, setInspectedTrigger] = useState<boolean>(false);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % ROTATING_FOCUS.length);
    }, 3400);
    return () => window.clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const tabletY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const tabletScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 18]);

  const activeFile =
    HERO_PREVIEW_FILES.find((file) => file.id === selectedFileId) ?? HERO_PREVIEW_FILES[0];

  const filteredFiles = HERO_PREVIEW_FILES.filter(
    (file) =>
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative overflow-hidden border-b-[1.5px] border-[#0A0A0A] bg-[#F6F5F0] bg-paper-grid"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Kinetic Typographic Hero & CTAs */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-col justify-center lg:col-span-5"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 text-xs font-semibold tracking-wide text-[#4B8BF5]"
            >
              Agentic RAG Codebase Assistant · LangChain &amp; LangGraph
            </motion.p>

            <MaskedHeadline
              as="h1"
              immediate
              text="Understand Any Codebase. Investigate Deeper. Ship With Confidence."
              className="text-[clamp(2.2rem,3.8vw,3.35rem)] font-extrabold leading-[1.07] tracking-tight text-[#0A0A0A]"
            />

            {/* Smooth Rotating Capability Sub-Headline */}
            <div className="mt-5 min-h-[3.25rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={focusIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base leading-relaxed text-[#3F3F46]"
                >
                  {ROTATING_FOCUS[focusIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-wrap items-center gap-3.5"
            >
              <motion.button
                type="button"
                whileHover={{ x: -2, y: -2, boxShadow: '4px 4px 0px #4B8BF5' }}
                whileTap={{ x: 1, y: 1, boxShadow: '0px 0px 0px #4B8BF5' }}
                transition={{ duration: 0.12 }}
                onClick={onOpenQuickstart}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8BF5]"
              >
                Explore on GitHub
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.a
                href="#workflow"
                whileHover={{ x: -2, y: -2, boxShadow: '3px 3px 0px #0A0A0A' }}
                whileTap={{ x: 1, y: 1, boxShadow: '0px 0px 0px #0A0A0A' }}
                transition={{ duration: 0.12 }}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#0A0A0A] bg-white px-5 py-3 text-sm font-semibold text-[#0A0A0A] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8BF5]"
              >
                See How It Works
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.36 }}
              className="mt-8 border-t-[1.5px] border-[#0A0A0A]/15 pt-5"
            >
              <p className="text-xs font-medium text-[#52525B]">
                Built for software developers, engineering teams, open-source contributors, and
                onboarding engineers
              </p>
              <p className="mt-1.5 font-mono text-xs text-[#0A0A0A]/75">
                LangChain · LangGraph · Tree-sitter · ripgrep · Qdrant · MCP
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Tablet UI with Parallax & LayoutId Animations */}
          <motion.div
            style={{ y: tabletY, scale: tabletScale }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden rounded-[26px] border-[2px] border-[#0A0A0A] bg-[#FAF9F5] shadow-[8px_8px_0px_#0A0A0A]">
              {/* Sky-Blue Device Status Bar */}
              <div className="flex items-center justify-between border-b-[1.5px] border-[#0A0A0A] bg-[#8FD0FA] px-5 py-2 text-xs font-semibold text-[#0A0A0A]">
                <span className="font-mono tabular-nums">repomind/core-engine</span>
                <span className="font-mono text-[11px]">5-Agent StateGraph · main</span>
              </div>

              {/* Inner Header Row with Butter-Yellow Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-[#0A0A0A]/15 bg-[#FAF9F5] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-white font-mono text-xs font-bold text-[#0A0A0A]">
                    RM
                  </div>
                  <span className="text-sm font-bold text-[#0A0A0A]">RepoMind Assistant</span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#F9E87D] px-3.5 py-1.5 shadow-[2px_2px_0px_#0A0A0A]"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter symbols or files..."
                      aria-label="Filter preview files"
                      className="w-36 bg-transparent text-xs font-medium text-[#0A0A0A] placeholder:text-[#0A0A0A]/65 focus:outline-none sm:w-44"
                    />
                    <Search className="h-3.5 w-3.5 text-[#0A0A0A]" />
                  </motion.div>
                  <motion.button
                    type="button"
                    whileHover={{ rotate: 12, scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label="Verification status"
                    onClick={() => setInspectedTrigger((v) => !v)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#8FD0FA] transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Tablet Body */}
              <div className="flex gap-3 p-3 sm:p-4">
                {/* Vertical Pill Sidebar */}
                <div className="hidden sm:flex flex-col items-center justify-between rounded-full border-[1.5px] border-[#0A0A0A] bg-white px-2 py-4">
                  <div className="flex flex-col items-center gap-4">
                    {SIDEBAR_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = sidebarTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSidebarTab(item.id)}
                          aria-label={item.label}
                          className={`relative flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition-colors cursor-pointer ${
                            active ? 'text-white' : 'text-[#52525B] hover:text-[#0A0A0A]'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="heroSidebarPill"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              className="absolute inset-0 rounded-xl bg-[#0A0A0A]"
                            />
                          )}
                          <Icon className="relative z-10 h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-[#52525B]">AST</span>
                </div>

                {/* Main Split Workspace Container */}
                <div className="grid flex-1 grid-cols-1 overflow-hidden rounded-2xl border-[1.5px] border-[#0A0A0A] bg-white md:grid-cols-12">
                  {/* Left Pane: Crawled Files List with Sliding Sky-Blue Highlight */}
                  <div className="border-b-[1.5px] border-[#0A0A0A] md:col-span-5 md:border-b-0 md:border-r-[1.5px]">
                    <div className="border-b border-[#0A0A0A]/15 px-3.5 py-2.5 text-xs font-bold text-[#0A0A0A]">
                      Indexed Modules
                    </div>

                    <div className="divide-y divide-[#0A0A0A]/10">
                      {(filteredFiles.length > 0 ? filteredFiles : HERO_PREVIEW_FILES).map(
                        (file) => {
                          const isSelected = file.id === activeFile.id;
                          const shortName = file.path.split('/').pop() ?? file.path;
                          return (
                            <button
                              key={file.id}
                              type="button"
                              onClick={() => {
                                setSelectedFileId(file.id);
                                setInspectedTrigger(false);
                              }}
                              className="relative flex w-full items-start gap-2.5 px-3.5 py-3 text-left transition-colors cursor-pointer hover:bg-[#F6F5F0]/70"
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="heroActiveFileRow"
                                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                  className="absolute inset-0 bg-[#8FD0FA]"
                                />
                              )}
                              <div className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-white text-[#0A0A0A]">
                                <FileCode2 className="h-3.5 w-3.5" />
                              </div>
                              <div className="relative z-10 min-w-0 flex-1">
                                <div className="truncate font-mono text-xs font-bold text-[#0A0A0A]">
                                  {shortName}
                                </div>
                                <div className="mt-0.5 truncate text-[11px] text-[#27272A]">
                                  {file.summary}
                                </div>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Right Pane: Chat-Style Investigation Thread */}
                  <div className="flex flex-col justify-between bg-[#FAF9F5] md:col-span-7">
                    <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 bg-white px-4 py-2.5">
                      <div className="min-w-0">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeFile.path}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.16 }}
                            className="truncate font-mono text-xs font-bold text-[#0A0A0A]"
                          >
                            {activeFile.path}
                          </motion.div>
                        </AnimatePresence>
                        <div className="text-[11px] text-[#52525B]">
                          Response &amp; Verification Agent · Grounded
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#0A0A0A] bg-[#F9E87D] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0A0A0A]">
                        {activeFile.language}
                      </span>
                    </div>

                    {/* Speech Bubbles + Inline File Card */}
                    <div className="space-y-3 p-3.5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`bubble-${activeFile.id}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.2 }}
                          className="ml-auto max-w-[88%] rounded-2xl border-[1.5px] border-[#0A0A0A] bg-white px-3.5 py-2 text-xs font-medium text-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
                        >
                          Inspect how{' '}
                          <span className="font-mono font-bold">
                            {activeFile.path.split('/').pop()}
                          </span>{' '}
                          connects to the LangGraph workflow.
                        </motion.div>
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`card-${activeFile.id}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="relative max-w-[95%] overflow-hidden rounded-2xl border-[1.5px] border-[#0A0A0A] bg-white p-3 shadow-[3px_3px_0px_#0A0A0A]"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[#0A0A0A]/10 pb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCode2 className="h-4 w-4 shrink-0 text-[#4B8BF5]" />
                              <span className="truncate font-mono text-xs font-bold text-[#0A0A0A]">
                                {activeFile.path.split('/').pop()}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-[#52525B] tabular-nums">
                              L{activeFile.lines[0]?.num}–L
                              {activeFile.lines[activeFile.lines.length - 1]?.num}
                            </span>
                          </div>

                          <div className="relative mt-2 space-y-0.5 overflow-hidden rounded-lg bg-[#F6F5F0] p-2 font-mono text-[10px] leading-relaxed text-[#18181B]">
                            {activeFile.lines.slice(0, 4).map((line, lineIdx) => (
                              <motion.div
                                key={line.num}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.18, delay: lineIdx * 0.04 }}
                                className={`flex gap-2 rounded px-1 ${
                                  line.highlight ? 'bg-[#8FD0FA]/55 font-semibold' : ''
                                }`}
                              >
                                <span className="select-none text-[#71717A] tabular-nums">
                                  {line.num}
                                </span>
                                <span className="truncate">{line.text}</span>
                              </motion.div>
                            ))}

                            {/* Animated verification sweep */}
                            {inspectedTrigger && (
                              <motion.div
                                aria-hidden="true"
                                initial={{ y: '-100%' }}
                                animate={{ y: '220%' }}
                                transition={{ duration: 0.75, ease: 'easeInOut' }}
                                className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-[#4B8BF5]/25 to-transparent"
                              />
                            )}
                          </div>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => setInspectedTrigger(true)}
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#4B8BF5] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3A7AE4] cursor-pointer"
                          >
                            {inspectedTrigger ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Citations Verified Against HEAD
                              </>
                            ) : (
                              'Verify Source & Trace Impact'
                            )}
                          </motion.button>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Composer Input Row */}
                    <div className="border-t border-[#0A0A0A]/15 bg-white p-2.5">
                      <a
                        href="#live-demo"
                        className="group flex items-center justify-between rounded-full border-[1.5px] border-[#0A0A0A] bg-[#FAF9F5] px-3.5 py-1.5 text-xs text-[#52525B] hover:bg-[#F9E87D]/55 transition-colors"
                      >
                        <span>Ask a follow-up in the interactive simulator...</span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A0A0A] text-white transition-transform duration-150 group-hover:translate-x-0.5">
                          <Send className="h-3 w-3" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
