import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, FolderGit2, X } from 'lucide-react';

interface QuickstartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = 'cli' | 'env' | 'mcp';

const TAB_SNIPPETS: Record<
  ModalTab,
  { label: string; title: string; code: string; note: string }
> = {
  cli: {
    label: 'CLI Setup',
    title: 'Clone & launch the Python LangGraph workspace',
    code: `git clone https://github.com/repomind-dev/repomind.git
cd repomind
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m repomind.cli index --repo owner/repository`,
    note: 'Requires Python 3.11+, ripgrep installed on PATH, and a running Qdrant instance.',
  },
  env: {
    label: '.env Config',
    title: 'Configure GitHub, vector store, and grounding keys',
    code: `GITHUB_TOKEN=ghp_your_github_token
QDRANT_URL=http://localhost:6333
LANGCHAIN_API_KEY=your_langchain_key
EXA_API_KEY=your_exa_key
FIRECRAWL_API_KEY=your_firecrawl_key
CONTEXT7_API_KEY=your_context7_key`,
    note: 'Never commit .env secrets. Exa, Firecrawl, and Context7 can be toggled per investigation node.',
  },
  mcp: {
    label: 'MCP Server',
    title: 'Register RepoMind as a Model Context Protocol server',
    code: `{
  "mcpServers": {
    "repomind": {
      "command": "python",
      "args": ["-m", "repomind.mcp_server"],
      "env": {
        "QDRANT_URL": "http://localhost:6333"
      }
    }
  }
}`,
    note: 'Exposes explore_repository, investigate_trace, and analyze_impact directly to MCP-compatible IDEs.',
  },
};

export function QuickstartModal({ isOpen, onClose }: QuickstartModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('cli');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeSnippet = TAB_SNIPPETS[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quickstart-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[26px] border-[2px] border-[#0A0A0A] bg-white shadow-[8px_8px_0px_#0A0A0A]"
          >
            {/* Sky Blue Header */}
            <div className="flex items-center justify-between border-b-[1.5px] border-[#0A0A0A] bg-[#8FD0FA] px-6 py-3.5">
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="h-5 w-5 text-[#0A0A0A]" />
                <h2 id="quickstart-modal-title" className="text-base font-extrabold text-[#0A0A0A]">
                  RepoMind Quickstart &amp; Clone CLI
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close quickstart modal"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F9E87D] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="bg-[#FAF9F5] p-6">
              <div
                role="tablist"
                aria-label="Quickstart setup tabs"
                className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-[#0A0A0A] bg-white p-1"
              >
                {(Object.keys(TAB_SNIPPETS) as ModalTab[]).map((tabKey) => {
                  const tab = TAB_SNIPPETS[tabKey];
                  const isSelected = activeTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      role="tab"
                      type="button"
                      aria-selected={isSelected}
                      onClick={() => {
                        setActiveTab(tabKey);
                        setCopied(false);
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-[#0A0A0A] text-white'
                          : 'text-[#3F3F46] hover:bg-[#F9E87D] hover:text-[#0A0A0A]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-sm font-bold text-[#0A0A0A]">{activeSnippet.title}</p>

              <div className="mt-3 overflow-hidden rounded-2xl border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] text-white">
                <div className="flex items-center justify-between border-b border-white/15 bg-[#141416] px-4 py-2">
                  <span className="font-mono text-[11px] text-[#8FD0FA]">
                    {activeSnippet.label}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#8FD0FA]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-100">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#52525B]">{activeSnippet.note}</p>

              <div className="mt-6 flex items-center justify-between border-t border-[#0A0A0A]/15 pt-4 text-xs text-[#52525B]">
                <span className="font-mono">src/repomind · 5 LangGraph Agents</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border-[1.5px] border-[#0A0A0A] bg-white px-5 py-2 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F9E87D] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
