import { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenQuickstart: () => void;
}

const NAV_LINKS = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Live Demo', href: '#live-demo' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({ onOpenQuickstart }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b-[1.5px] border-[#0A0A0A] bg-[#FAF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single-element Brand wordmark */}
        <a
          href="#top"
          className="text-lg font-extrabold tracking-tight text-[#0A0A0A] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8BF5] rounded-sm"
        >
          RepoMind
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#3F3F46]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-[#0A0A0A] transition-colors duration-150 whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#0A0A0A] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8BF5] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            type="button"
            whileHover={{ x: -1.5, y: -1.5, boxShadow: '3px 3px 0px #4B8BF5' }}
            whileTap={{ x: 1, y: 1, boxShadow: '0px 0px 0px #4B8BF5' }}
            transition={{ duration: 0.12 }}
            onClick={onOpenQuickstart}
            className="hidden sm:inline-flex items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] px-5 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8BF5]"
          >
            Explore on GitHub
          </motion.button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center rounded-xl border-[1.5px] border-[#0A0A0A] bg-white p-2 text-[#0A0A0A] hover:bg-[#F9E87D] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="h-[2.5px] w-full bg-gradient-to-r from-[#4B8BF5] via-[#8FD0FA] to-[#F9E87D]"
      />

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b-[1.5px] border-[#0A0A0A] bg-[#FAF9F5] px-6 py-4"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1.5 text-sm font-medium text-[#27272A] hover:text-[#0A0A0A] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenQuickstart();
                }}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-[#0A0A0A] px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"
              >
                Explore on GitHub
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
