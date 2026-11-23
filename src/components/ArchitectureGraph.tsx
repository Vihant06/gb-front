import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ARCHITECTURE_TOOLS, FIVE_AGENTS } from '../data/repomindData';
import { MaskedHeadline, ScrollInkRule } from './MotionPrimitives';

type Selection =
  | { type: 'agent'; id: string }
  | { type: 'tool'; id: string };

export function ArchitectureGraph() {
  const [selection, setSelection] = useState<Selection>({
    type: 'agent',
    id: 'engineering_investigation',
  });

  const isAgentHighlighted = (agentId: string) => {
    if (selection.type === 'agent') return selection.id === agentId;
    const tool = ARCHITECTURE_TOOLS.find((t) => t.id === selection.id);
    return tool ? tool.connectedAgentIds.includes(agentId) : false;
  };

  const isToolHighlighted = (toolId: string) => {
    if (selection.type === 'tool') return selection.id === toolId;
    const tool = ARCHITECTURE_TOOLS.find((t) => t.id === toolId);
    return tool ? tool.connectedAgentIds.includes(selection.id) : false;
  };

  const selectedAgent =
    selection.type === 'agent'
      ? FIVE_AGENTS.find((a) => a.id === selection.id) ?? FIVE_AGENTS[0]
      : null;

  const selectedTool =
    selection.type === 'tool'
      ? ARCHITECTURE_TOOLS.find((t) => t.id === selection.id) ?? ARCHITECTURE_TOOLS[0]
      : null;

  const agentCoords = [
    { id: 'repo_explorer', x: 100, y: 62 },
    { id: 'code_understanding', x: 300, y: 62 },
    { id: 'engineering_investigation', x: 500, y: 62 },
    { id: 'impact_analysis', x: 700, y: 62 },
    { id: 'response_verification', x: 900, y: 62 },
  ];

  const toolCoords = ARCHITECTURE_TOOLS.map((tool, index) => ({
    ...tool,
    x: 68 + index * 123,
    y: 238,
  }));

  return (
    <section
      id="architecture"
      className="border-b-[1.5px] border-[#0A0A0A] bg-[#F6F5F0] bg-paper-grid"
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
            Architecture Visualization · LangGraph Topology
          </motion.p>

          <MaskedHeadline
            text="Inspect how agents, parsers, and retrieval layers connect"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0A0A] sm:text-3xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.38, delay: 0.12 }}
            className="mt-3 text-base leading-relaxed text-[#52525B]"
          >
            Click any agent node or infrastructure tool below to trace data bindings and animated
            execution paths across the LangGraph StateGraph.
          </motion.p>
        </div>

        {/* Interactive Graph Tablet Shell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 overflow-hidden rounded-[26px] border-[2px] border-[#0A0A0A] bg-white shadow-[6px_6px_0px_#0A0A0A]"
        >
          {/* Sky Blue Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-[1.5px] border-[#0A0A0A] bg-[#8FD0FA] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]">
            <span>StateGraph Topology · Click any node or tool to trace bindings</span>
            <span className="font-mono text-[11px]">Conditional loop-back enabled</span>
          </div>

          <div className="p-5 sm:p-7">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[780px]">
                <svg
                  viewBox="0 0 1000 300"
                  className="h-auto w-full select-none"
                  role="img"
                  aria-label="Interactive five-agent LangGraph architecture diagram"
                >
                  {/* Animated horizontal agent pipeline connectors */}
                  {agentCoords.slice(0, -1).map((node, i) => {
                    const next = agentCoords[i + 1];
                    return (
                      <g key={`${node.id}-${next.id}`}>
                        <line
                          x1={node.x + 76}
                          y1={node.y}
                          x2={next.x - 76}
                          y2={next.y}
                          stroke="#0A0A0A"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <motion.line
                          x1={node.x + 76}
                          y1={node.y}
                          x2={next.x - 76}
                          y2={next.y}
                          stroke="#4B8BF5"
                          strokeWidth="2"
                          strokeDasharray="6 14"
                          initial={{ strokeDashoffset: 20 }}
                          animate={{ strokeDashoffset: 0 }}
                          transition={{ repeat: Infinity, duration: 1.3, ease: 'linear' }}
                        />
                      </g>
                    );
                  })}

                  {/* Conditional loop-back arc */}
                  <motion.path
                    d="M 500 32 C 460 5, 340 5, 300 32"
                    fill="none"
                    stroke="#4B8BF5"
                    strokeWidth="1.75"
                    strokeDasharray="5 4"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 18 }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                  />
                  <text
                    x="400"
                    y="15"
                    textAnchor="middle"
                    className="fill-[#4B8BF5] text-[10px] font-mono font-bold"
                  >
                    refine if unresolved (max 3 hops)
                  </text>

                  {/* Animated ink & cobalt paths between Agents and Tools */}
                  {toolCoords.map((tool) =>
                    tool.connectedAgentIds.map((agentId) => {
                      const agent = agentCoords.find((a) => a.id === agentId);
                      if (!agent) return null;

                      const active =
                        (selection.type === 'agent' && selection.id === agentId) ||
                        (selection.type === 'tool' && selection.id === tool.id);

                      const pathD = `M ${agent.x} ${agent.y + 30} C ${agent.x} ${150}, ${tool.x} ${150}, ${tool.x} ${tool.y - 24}`;

                      return (
                        <g key={`${agentId}-${tool.id}`}>
                          <path
                            d={pathD}
                            fill="none"
                            stroke={active ? '#0A0A0A' : 'rgba(10,10,10,0.16)'}
                            strokeWidth={active ? 2 : 1}
                          />
                          {active && (
                            <motion.path
                              d={pathD}
                              fill="none"
                              stroke="#4B8BF5"
                              strokeWidth="2.8"
                              strokeDasharray="7 13"
                              initial={{ strokeDashoffset: 40 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.1,
                                ease: 'linear',
                              }}
                            />
                          )}
                        </g>
                      );
                    })
                  )}

                  {/* Agent Nodes */}
                  {FIVE_AGENTS.map((agent, i) => {
                    const coord = agentCoords[i];
                    const active = isAgentHighlighted(agent.id);

                    return (
                      <motion.g
                        key={agent.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelection({ type: 'agent', id: agent.id })}
                        className="cursor-pointer"
                      >
                        <rect
                          x={coord.x - 82}
                          y={coord.y - 28}
                          width={164}
                          height={56}
                          rx={14}
                          fill={
                            active
                              ? agent.accent === 'cyan'
                                ? '#8FD0FA'
                                : '#F9E87D'
                              : '#FAF9F5'
                          }
                          stroke="#0A0A0A"
                          strokeWidth={active ? 2.2 : 1.5}
                        />
                        <text
                          x={coord.x}
                          y={coord.y - 5}
                          textAnchor="middle"
                          className="fill-[#0A0A0A] text-[11px] font-bold"
                        >
                          {agent.name.replace(' Agent', '')}
                        </text>
                        <text
                          x={coord.x}
                          y={coord.y + 13}
                          textAnchor="middle"
                          className="fill-[#3F3F46] text-[10px] font-mono font-semibold"
                        >
                          Node {agent.step}
                        </text>
                      </motion.g>
                    );
                  })}

                  {/* Tool Nodes */}
                  {toolCoords.map((tool) => {
                    const active = isToolHighlighted(tool.id);
                    return (
                      <motion.g
                        key={tool.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelection({ type: 'tool', id: tool.id })}
                        className="cursor-pointer"
                      >
                        <rect
                          x={tool.x - 54}
                          y={tool.y - 22}
                          width={108}
                          height={44}
                          rx={12}
                          fill={active ? '#0A0A0A' : '#FFFFFF'}
                          stroke="#0A0A0A"
                          strokeWidth={active ? 2 : 1.5}
                        />
                        <text
                          x={tool.x}
                          y={tool.y + 4}
                          textAnchor="middle"
                          className={`text-[11px] font-mono font-bold ${
                            active ? 'fill-white' : 'fill-[#0A0A0A]'
                          }`}
                        >
                          {tool.label}
                        </text>
                      </motion.g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Inspector Readout with Smooth Text Crossfade */}
            <div className="mt-4 rounded-2xl border-[1.5px] border-[#0A0A0A] bg-[#FAF9F5] p-5">
              <AnimatePresence mode="wait">
                {selectedAgent ? (
                  <motion.div
                    key={`agent-${selectedAgent.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-[#4B8BF5]">
                        Selected Agent Node · {selectedAgent.step}
                      </p>
                      <h3 className="mt-1 text-base font-extrabold text-[#0A0A0A]">
                        {selectedAgent.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#3F3F46]">{selectedAgent.summary}</p>
                    </div>
                    <div className="shrink-0 font-mono text-xs text-[#52525B]">
                      Tools:{' '}
                      <span className="font-semibold text-[#0A0A0A]">
                        {selectedAgent.tools.join(' · ')}
                      </span>
                    </div>
                  </motion.div>
                ) : selectedTool ? (
                  <motion.div
                    key={`tool-${selectedTool.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-[#4B8BF5]">
                        Selected Tool · {selectedTool.layer}
                      </p>
                      <h3 className="mt-1 text-base font-extrabold text-[#0A0A0A]">
                        {selectedTool.label}
                      </h3>
                      <p className="mt-1 text-sm text-[#3F3F46]">{selectedTool.purpose}</p>
                    </div>
                    <div className="shrink-0 font-mono text-xs text-[#52525B]">
                      Bound to:{' '}
                      <span className="font-semibold text-[#0A0A0A]">
                        {selectedTool.connectedAgentIds
                          .map((id) =>
                            FIVE_AGENTS.find((a) => a.id === id)?.name.replace(' Agent', '')
                          )
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
