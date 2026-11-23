import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { FiveAgentWorkflow } from './components/FiveAgentWorkflow';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { LiveDemoSimulator } from './components/LiveDemoSimulator';
import { TechStackIntegrations } from './components/TechStackIntegrations';
import { FaqAndCtaSection } from './components/FaqAndCtaSection';
import { QuickstartModal } from './components/QuickstartModal';

export default function App() {
  const [isQuickstartOpen, setIsQuickstartOpen] = useState(false);

  const openQuickstart = () => setIsQuickstartOpen(true);
  const closeQuickstart = () => setIsQuickstartOpen(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F6F5F0] text-[#0A0A0A]">
        <Navbar onOpenQuickstart={openQuickstart} />

        <main>
          <HeroSection onOpenQuickstart={openQuickstart} />
          <ProblemSolutionSection />
          <CapabilitiesSection />
          <FiveAgentWorkflow />
          <ArchitectureGraph />
          <LiveDemoSimulator />
          <TechStackIntegrations />
          <FaqAndCtaSection onOpenQuickstart={openQuickstart} />
        </main>

        <QuickstartModal isOpen={isQuickstartOpen} onClose={closeQuickstart} />
      </div>
    </MotionConfig>
  );
}
