export interface HeroPreviewFile {
  id: string;
  path: string;
  language: string;
  summary: string;
  lines: { num: number; text: string; highlight?: boolean }[];
}

export interface CapabilityItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tools: string[];
  span: 'wide' | 'standard';
  snippetTitle: string;
  snippetLines: string[];
}

export interface AgentNodeSpec {
  id: string;
  step: string;
  name: string;
  role: string;
  summary: string;
  tools: string[];
  readsFrom: string;
  writesTo: string;
  sampleState: string;
  accent: 'cyan' | 'violet';
}

export interface ArchitectureToolNode {
  id: string;
  label: string;
  layer: string;
  purpose: string;
  connectedAgentIds: string[];
}

export interface DemoTraceStep {
  agentId: string;
  agentName: string;
  toolCall: string;
  finding: string;
  elapsedLabel: string;
  accent: 'cyan' | 'violet';
}

export interface DemoCitation {
  file: string;
  lineRange: string;
  symbol: string;
  excerpt: string;
}

export interface DemoScenario {
  id: string;
  category: string;
  title: string;
  repo: string;
  prompt: string;
  steps: DemoTraceStep[];
  answerSummary: string;
  impactedFiles: { path: string; reason: string; risk: 'Direct' | 'Indirect' | 'Test' }[];
  citations: DemoCitation[];
  codeFix: {
    file: string;
    language: string;
    lines: string[];
  };
}

export interface TechStackItem {
  name: string;
  category: 'Orchestration' | 'Code Indexing' | 'External Context';
  role: string;
  detail: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const HERO_PREVIEW_FILES: HeroPreviewFile[] = [
  {
    id: 'workflow',
    path: 'src/repomind/graph/workflow.py',
    language: 'Python',
    summary: 'LangGraph StateGraph wiring the five specialized investigation nodes.',
    lines: [
      { num: 41, text: 'builder = StateGraph(CodebaseInvestigationState)' },
      { num: 42, text: 'builder.add_node("repo_explorer", repository_explorer_node)' },
      { num: 43, text: 'builder.add_node("code_understanding", understanding_node)' },
      { num: 44, text: 'builder.add_node("investigator", investigation_node)', highlight: true },
      { num: 45, text: 'builder.add_node("impact_analysis", impact_analysis_node)', highlight: true },
      { num: 46, text: 'builder.add_node("verifier", response_verification_node)' },
      { num: 47, text: 'builder.add_conditional_edges("investigator", route_impact_or_verify)' },
    ],
  },
  {
    id: 'investigator',
    path: 'src/repomind/agents/investigator.py',
    language: 'Python',
    summary: 'Combines ripgrep symbol search with Tree-sitter call graphs.',
    lines: [
      { num: 18, text: 'async def investigation_node(state: InvestigationState) -> dict:' },
      { num: 19, text: '    symbols = await treesitter_extract_call_sites(state["query"])', highlight: true },
      { num: 20, text: '    matches = await ripgrep_search(repo_root=state["repo_path"],' },
      { num: 21, text: '                                   pattern=symbols.entry_point)' },
      { num: 22, text: '    vectors = await qdrant_client.hybrid_query(state["query"], top_k=12)' },
      { num: 23, text: '    return {"evidence": merge_verified_spans(matches, vectors)}' },
    ],
  },
  {
    id: 'impact',
    path: 'src/repomind/tools/impact_graph.py',
    language: 'Python',
    summary: 'Maps reverse imports and test suites touched by candidate edits.',
    lines: [
      { num: 62, text: 'def compute_blast_radius(symbol_id: str, ast_index: ASTIndex) -> ImpactReport:' },
      { num: 63, text: '    callers = ast_index.reverse_edges(symbol_id, depth=3)', highlight: true },
      { num: 64, text: '    test_files = [n.path for n in callers if n.is_test_module]', highlight: true },
      { num: 65, text: '    return ImpactReport(' },
      { num: 66, text: '        affected_modules=[n.path for n in callers if not n.is_test_module],' },
      { num: 67, text: '        affected_tests=sorted(set(test_files)),' },
      { num: 68, text: '    )' },
    ],
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'exploration',
    index: '01',
    title: 'Repository Exploration',
    subtitle: 'GitHub API · Tree-sitter · Qdrant',
    description:
      'Connect GitHub repositories and intelligently crawl directory trees, module boundaries, lockfiles, and entry points into a structured index.',
    tools: ['GitHub API', 'Tree-sitter', 'Qdrant'],
    span: 'wide',
    snippetTitle: 'repo_crawler.crawl("acme/payments-core", ref="main")',
    snippetLines: [
      '├── services/ledger/processor.py      [AST: 14 functions · 3 classes]',
      '├── services/auth/session_store.py    [AST: 9 functions · Redis]',
      '├── workers/reconcile_queue.py        [AST: 6 async tasks]',
      '└── tests/integration/test_ledger.py  [Linked via reverse imports]',
    ],
  },
  {
    id: 'understanding',
    index: '02',
    title: 'Code Understanding',
    subtitle: 'LangChain · Tree-sitter · Context7',
    description:
      'Ask natural-language questions about architecture, data models, function signatures, and framework behavior across unfamiliar repositories.',
    tools: ['LangChain', 'Tree-sitter', 'Context7'],
    span: 'standard',
    snippetTitle: 'Query: How are idempotency keys validated?',
    snippetLines: [
      'validate_idempotency_key() → middleware/idempotency.py:L28',
      'Backed by Redis SETNX lock with 300s TTL before ledger commit.',
    ],
  },
  {
    id: 'investigation',
    index: '03',
    title: 'Engineering Investigation',
    subtitle: 'LangGraph · ripgrep · AST Trace',
    description:
      'Investigate bugs and race conditions by tracing multi-file execution paths, call hierarchies, and exception handlers with concrete evidence.',
    tools: ['LangGraph', 'ripgrep', 'Python'],
    span: 'standard',
    snippetTitle: 'Trace: handle_webhook() → verify_sig() → dispatch()',
    snippetLines: [
      'ripgrep: 4 call sites matched across services/webhooks/',
      'Unawaited retry branch found at handlers.py:L114',
    ],
  },
  {
    id: 'impact',
    index: '04',
    title: 'Impact Analysis',
    subtitle: 'AST Dependency Graph · Test Mapping',
    description:
      'Identify downstream callers, shared schemas, public API contracts, and affected test suites before touching a single line of code.',
    tools: ['Tree-sitter', 'Qdrant', 'MCP'],
    span: 'standard',
    snippetTitle: 'Target: SessionPayload.tenant_id',
    snippetLines: [
      'Direct callers: 4 modules · Indirect: 7 modules',
      'Tests to run: tests/auth/test_token_claims.py',
    ],
  },
  {
    id: 'verified',
    index: '05',
    title: 'Verified Responses',
    subtitle: 'Source Verification · Exa · Firecrawl',
    description:
      'Every answer passes through a verification node that checks file paths, symbol names, and external documentation links before rendering.',
    tools: ['Verification Agent', 'Exa', 'Firecrawl'],
    span: 'wide',
    snippetTitle: 'Verification Check: 3/3 citations confirmed against HEAD',
    snippetLines: [
      '[VERIFIED] src/auth/jwt_refresh.py:L84-L102  (AST symbol: rotate_refresh_token)',
      '[VERIFIED] src/storage/redis_pool.py:L19-L41  (AST symbol: acquire_lock)',
      '[GROUNDED] Context7 · redis-py 5.x async lock release semantics',
    ],
  },
];

export const FIVE_AGENTS: AgentNodeSpec[] = [
  {
    id: 'repo_explorer',
    step: '01',
    name: 'Repository Explorer',
    role: 'Structural Mapping & Ingestion',
    summary:
      'Connects to the GitHub API, maps directory topology, filters noise directories, and builds an AST-aware manifest with Tree-sitter.',
    tools: ['GitHub API', 'Tree-sitter', 'Qdrant'],
    readsFrom: 'repo_url · git_ref · user_query',
    writesTo: 'repo_manifest · candidate_directories',
    sampleState: `{
  "node": "repository_explorer",
  "repo": "acme/auth-gateway",
  "indexed_files": 184,
  "candidate_paths": [
    "src/auth/token_service.py",
    "src/middleware/session.py"
  ]
}`,
    accent: 'cyan',
  },
  {
    id: 'code_understanding',
    step: '02',
    name: 'Code Understanding Agent',
    role: 'Semantic & Syntactic Synthesis',
    summary:
      'Combines Qdrant hybrid vector retrieval with Tree-sitter symbol trees and Context7 / Exa docs to explain how modules and abstractions work.',
    tools: ['LangChain', 'Qdrant', 'Context7', 'Exa'],
    readsFrom: 'candidate_directories · ast_symbols',
    writesTo: 'architectural_context · symbol_map',
    sampleState: `{
  "node": "code_understanding",
  "resolved_symbols": ["TokenService.refresh", "RedisLock"],
  "external_docs": ["Context7:pyjwt@2.9", "Exa:oauth2-rfc6749"]
}`,
    accent: 'violet',
  },
  {
    id: 'engineering_investigation',
    step: '03',
    name: 'Engineering Investigation Agent',
    role: 'Execution Path & Root-Cause Tracing',
    summary:
      'Runs targeted ripgrep pattern queries and steps through call chains, state mutations, and error paths to surface concrete bug evidence.',
    tools: ['LangGraph', 'ripgrep', 'Firecrawl', 'Python'],
    readsFrom: 'symbol_map · user_query',
    writesTo: 'execution_trace · collected_evidence',
    sampleState: `{
  "node": "engineering_investigation",
  "ripgrep_hits": 11,
  "trace_path": [
    "api/v1/refresh.py:42",
    "auth/token_service.py:118",
    "storage/session_repo.py:73"
  ]
}`,
    accent: 'cyan',
  },
  {
    id: 'impact_analysis',
    step: '04',
    name: 'Impact Analysis Agent',
    role: 'Blast Radius & Test Surface Discovery',
    summary:
      'Walks reverse AST import graphs and schema references to pinpoint every caller, downstream service, and test file affected by a change.',
    tools: ['Tree-sitter', 'ripgrep', 'MCP'],
    readsFrom: 'execution_trace · ast_index',
    writesTo: 'impacted_modules · impacted_tests',
    sampleState: `{
  "node": "impact_analysis",
  "direct_dependents": ["api/v1/refresh.py", "workers/cleanup.py"],
  "affected_tests": [
    "tests/auth/test_refresh_concurrency.py",
    "tests/e2e/test_session_lifecycle.py"
  ]
}`,
    accent: 'violet',
  },
  {
    id: 'response_verification',
    step: '05',
    name: 'Response & Verification Agent',
    role: 'Citation Grounding & Final Output',
    summary:
      'Cross-checks every cited file path, line range, and code snippet against retrieved repository spans before assembling the final developer response.',
    tools: ['LangChain', 'Python', 'Tree-sitter'],
    readsFrom: 'collected_evidence · impacted_modules',
    writesTo: 'verified_response · source_citations',
    sampleState: `{
  "node": "response_verification",
  "citations_checked": 4,
  "unverified_claims_dropped": 0,
  "status": "VERIFIED_WITH_SOURCES"
}`,
    accent: 'cyan',
  },
];

export const ARCHITECTURE_TOOLS: ArchitectureToolNode[] = [
  {
    id: 'github_api',
    label: 'GitHub API',
    layer: 'Source & Metadata',
    purpose: 'Fetches repository trees, commit SHAs, pull requests, and file blobs without manual cloning.',
    connectedAgentIds: ['repo_explorer'],
  },
  {
    id: 'treesitter',
    label: 'Tree-sitter',
    layer: 'AST & Call Graph',
    purpose: 'Parses functions, classes, imports, and call expressions across Python, TypeScript, and Go.',
    connectedAgentIds: ['repo_explorer', 'code_understanding', 'impact_analysis', 'response_verification'],
  },
  {
    id: 'ripgrep',
    label: 'ripgrep',
    layer: 'Exact Symbol Search',
    purpose: 'Executes millisecond regex and literal symbol lookups across entire repositories.',
    connectedAgentIds: ['engineering_investigation', 'impact_analysis'],
  },
  {
    id: 'qdrant',
    label: 'Qdrant',
    layer: 'Vector Retrieval',
    purpose: 'Stores AST-chunked code embeddings and metadata filters for fast semantic retrieval.',
    connectedAgentIds: ['repo_explorer', 'code_understanding'],
  },
  {
    id: 'context7',
    label: 'Context7',
    layer: 'Library Docs',
    purpose: 'Resolves up-to-date library APIs and framework signatures referenced inside repository imports.',
    connectedAgentIds: ['code_understanding'],
  },
  {
    id: 'exa',
    label: 'Exa',
    layer: 'Technical Search',
    purpose: 'Retrieves relevant RFCs, issue discussions, and specification references when codebase context requires external grounding.',
    connectedAgentIds: ['code_understanding'],
  },
  {
    id: 'firecrawl',
    label: 'Firecrawl',
    layer: 'Doc Extraction',
    purpose: 'Extracts clean markdown from external API documentation and linked architecture specs.',
    connectedAgentIds: ['engineering_investigation'],
  },
  {
    id: 'mcp',
    label: 'MCP',
    layer: 'Protocol Bridge',
    purpose: 'Exposes RepoMind investigation tools and impact graphs directly to external developer clients via Model Context Protocol.',
    connectedAgentIds: ['impact_analysis'],
  },
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'bug-trace',
    category: 'Bug Investigation',
    title: 'Trace JWT refresh race condition',
    repo: 'acme/auth-gateway',
    prompt: 'Why do concurrent API requests fail with 401 right after a refresh token rotation?',
    steps: [
      {
        agentId: 'repo_explorer',
        agentName: 'Repository Explorer',
        toolCall: 'github_api.fetch_tree("acme/auth-gateway") · treesitter.scan("src/auth/")',
        finding: 'Mapped 42 auth modules; prioritized token_service.py, session_repo.py, and middleware/jwt.py.',
        elapsedLabel: 'Step 1 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'code_understanding',
        agentName: 'Code Understanding Agent',
        toolCall: 'qdrant.search("refresh token rotation") · context7.docs("pyjwt")',
        finding: 'Identified single-use refresh tokens invalidated immediately inside TokenService.rotate().',
        elapsedLabel: 'Step 2 of 5',
        accent: 'violet',
      },
      {
        agentId: 'engineering_investigation',
        agentName: 'Engineering Investigation Agent',
        toolCall: 'ripgrep("rotate_refresh_token", path="src/")',
        finding: 'Found unserialized read-then-revoke sequence at src/auth/token_service.py:L118-L134 with no distributed lock.',
        elapsedLabel: 'Step 3 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'impact_analysis',
        agentName: 'Impact Analysis Agent',
        toolCall: 'impact_graph.reverse_edges("TokenService.rotate", depth=3)',
        finding: 'Detected 3 dependent endpoints and 2 concurrency test suites requiring lock coverage.',
        elapsedLabel: 'Step 4 of 5',
        accent: 'violet',
      },
      {
        agentId: 'response_verification',
        agentName: 'Response & Verification Agent',
        toolCall: 'verifier.validate_citations(spans=3)',
        finding: 'Confirmed all file paths, symbol signatures, and line spans against repository state.',
        elapsedLabel: 'Step 5 of 5',
        accent: 'cyan',
      },
    ],
    answerSummary:
      'Concurrent requests collide inside TokenService.rotate() because the existing refresh token is marked revoked at line 124 before an atomic lock is acquired. When two parallel requests arrive within the same millisecond, the second request reads the already-revoked token state and triggers a 401 rejection.',
    impactedFiles: [
      { path: 'src/auth/token_service.py', reason: 'Unserialized token revocation in rotate()', risk: 'Direct' },
      { path: 'src/api/v1/refresh_route.py', reason: 'Calls TokenService.rotate() per request', risk: 'Direct' },
      { path: 'src/middleware/auth_guard.py', reason: 'Retries failed upstream bearer verification', risk: 'Indirect' },
      { path: 'tests/auth/test_refresh_concurrency.py', reason: 'Requires parallel asyncio.gather regression test', risk: 'Test' },
    ],
    citations: [
      {
        file: 'src/auth/token_service.py',
        lineRange: 'L118-L134',
        symbol: 'TokenService.rotate',
        excerpt: 'token_record = await self.repo.get(token_id); await self.repo.revoke(token_id)',
      },
      {
        file: 'src/storage/redis_lock.py',
        lineRange: 'L22-L39',
        symbol: 'acquire_token_mutex',
        excerpt: 'async with self.redis.lock(f"refresh:{family_id}", timeout=5):',
      },
    ],
    codeFix: {
      file: 'src/auth/token_service.py',
      language: 'python',
      lines: [
        'async def rotate(self, token_id: str, family_id: str) -> TokenPair:',
        '    async with self.lock_manager.acquire_token_mutex(family_id):',
        '        cached = await self.repo.get_recent_rotation(token_id)',
        '        if cached is not None:',
        '            return cached',
        '        record = await self.repo.get(token_id)',
        '        await self.repo.revoke(token_id)',
        '        return await self.repo.issue_next_pair(record)',
      ],
    },
  },
  {
    id: 'impact-schema',
    category: 'Impact Analysis',
    title: 'Assess changing SessionStore.tenant_id type',
    repo: 'acme/workspace-api',
    prompt: 'What modules and tests are impacted if we migrate SessionStore.tenant_id from int to UUID?',
    steps: [
      {
        agentId: 'repo_explorer',
        agentName: 'Repository Explorer',
        toolCall: 'treesitter.index_models("SessionStore") · github_api.get_paths()',
        finding: 'Located SessionStore definition in src/models/session.py and 4 serialization schemas.',
        elapsedLabel: 'Step 1 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'code_understanding',
        agentName: 'Code Understanding Agent',
        toolCall: 'qdrant.search("tenant_id serialization") · treesitter.resolve_types()',
        finding: 'Mapped integer assumptions in Pydantic validators and SQLAlchemy integer column definitions.',
        elapsedLabel: 'Step 2 of 5',
        accent: 'violet',
      },
      {
        agentId: 'engineering_investigation',
        agentName: 'Engineering Investigation Agent',
        toolCall: 'ripgrep("tenant_id", type_filter=["py", "sql"])',
        finding: 'Found 14 direct field accesses, including a raw int() cast inside cache_key_builder.py:L47.',
        elapsedLabel: 'Step 3 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'impact_analysis',
        agentName: 'Impact Analysis Agent',
        toolCall: 'impact_graph.trace_schema_propagation("SessionStore.tenant_id")',
        finding: 'Identified 4 direct modules, 2 Alembic migration targets, and 3 test fixtures.',
        elapsedLabel: 'Step 4 of 5',
        accent: 'violet',
      },
      {
        agentId: 'response_verification',
        agentName: 'Response & Verification Agent',
        toolCall: 'verifier.validate_citations(spans=4)',
        finding: 'Verified all affected files, line ranges, and test suite paths.',
        elapsedLabel: 'Step 5 of 5',
        accent: 'cyan',
      },
    ],
    answerSummary:
      'Migrating SessionStore.tenant_id from int to UUID affects four backend modules beyond the database model. Specifically, cache_key_builder.py forces an int(tenant_id) conversion that will raise ValueError on UUID strings, and two JWT claim parsers validate tenant_id as an integer.',
    impactedFiles: [
      { path: 'src/models/session.py', reason: 'Primary Column(Integer) definition', risk: 'Direct' },
      { path: 'src/cache/cache_key_builder.py', reason: 'Explicit int(tenant_id) cast on L47', risk: 'Direct' },
      { path: 'src/auth/claims_validator.py', reason: 'Pydantic strict int schema check', risk: 'Indirect' },
      { path: 'tests/fixtures/session_factory.py', reason: 'Generates sequential integer tenant_ids', risk: 'Test' },
    ],
    citations: [
      {
        file: 'src/cache/cache_key_builder.py',
        lineRange: 'L45-L51',
        symbol: 'build_tenant_prefix',
        excerpt: 'return f"tenant:{int(session.tenant_id)}:sessions"',
      },
      {
        file: 'src/models/session.py',
        lineRange: 'L14-L21',
        symbol: 'SessionStore',
        excerpt: 'tenant_id: Mapped[int] = mapped_column(Integer, index=True)',
      },
    ],
    codeFix: {
      file: 'src/cache/cache_key_builder.py',
      language: 'python',
      lines: [
        'from uuid import UUID',
        '',
        'def build_tenant_prefix(tenant_id: UUID | str) -> str:',
        '    normalized = UUID(str(tenant_id))',
        '    return f"tenant:{normalized}:sessions"',
      ],
    },
  },
  {
    id: 'arch-onboard',
    category: 'Codebase Onboarding',
    title: 'Explain LangGraph agent routing',
    repo: 'repomind/core-engine',
    prompt: 'How does the LangGraph orchestrator decide when to loop back for deeper investigation vs proceed to verification?',
    steps: [
      {
        agentId: 'repo_explorer',
        agentName: 'Repository Explorer',
        toolCall: 'github_api.read_dir("src/repomind/graph")',
        finding: 'Identified state.py, workflow.py, and router.py inside the orchestration package.',
        elapsedLabel: 'Step 1 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'code_understanding',
        agentName: 'Code Understanding Agent',
        toolCall: 'context7.docs("langgraph") · treesitter.parse("workflow.py")',
        finding: 'Mapped StateGraph conditional edge bindings on InvestigationState.evidence_sufficient.',
        elapsedLabel: 'Step 2 of 5',
        accent: 'violet',
      },
      {
        agentId: 'engineering_investigation',
        agentName: 'Engineering Investigation Agent',
        toolCall: 'ripgrep("route_after_investigation", path="src/repomind")',
        finding: 'Traced max_hops=3 guard in router.py:L29 preventing infinite agent loops.',
        elapsedLabel: 'Step 3 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'impact_analysis',
        agentName: 'Impact Analysis Agent',
        toolCall: 'impact_graph.reverse_edges("InvestigationState")',
        finding: 'Confirmed shared state schema across all 5 nodes and streaming SSE event emitters.',
        elapsedLabel: 'Step 4 of 5',
        accent: 'violet',
      },
      {
        agentId: 'response_verification',
        agentName: 'Response & Verification Agent',
        toolCall: 'verifier.validate_citations(spans=2)',
        finding: 'Verified router conditions and state key names against workflow.py.',
        elapsedLabel: 'Step 5 of 5',
        accent: 'cyan',
      },
    ],
    answerSummary:
      'The orchestrator evaluates InvestigationState after the Engineering Investigation Agent completes. If referenced symbols remain unresolved and hop_count < 3, route_after_investigation() loops back with refined ripgrep patterns; otherwise it advances to Impact Analysis and Verification.',
    impactedFiles: [
      { path: 'src/repomind/graph/workflow.py', reason: 'Defines StateGraph nodes and conditional edges', risk: 'Direct' },
      { path: 'src/repomind/graph/router.py', reason: 'Implements route_after_investigation() hop guard', risk: 'Direct' },
      { path: 'tests/graph/test_routing_bounds.py', reason: 'Asserts loop termination at max_hops=3', risk: 'Test' },
    ],
    citations: [
      {
        file: 'src/repomind/graph/router.py',
        lineRange: 'L26-L36',
        symbol: 'route_after_investigation',
        excerpt: 'if not state["unresolved_symbols"] or state["hop_count"] >= 3: return "impact_analysis"',
      },
      {
        file: 'src/repomind/graph/workflow.py',
        lineRange: 'L52-L58',
        symbol: 'compile_graph',
        excerpt: 'builder.add_conditional_edges("investigator", route_after_investigation)',
      },
    ],
    codeFix: {
      file: 'src/repomind/graph/router.py',
      language: 'python',
      lines: [
        'def route_after_investigation(state: InvestigationState) -> str:',
        '    if state["hop_count"] >= state["max_hops"]:',
        '        return "impact_analysis"',
        '    if state["unresolved_symbols"]:',
        '        return "investigator"',
        '    return "impact_analysis"',
      ],
    },
  },
];

export const TECH_STACK: TechStackItem[] = [
  {
    name: 'LangChain',
    category: 'Orchestration',
    role: 'Tool abstractions & prompt chains',
    detail: 'Standardizes structured tool bindings, document loaders, and model-agnostic LLM invocations across agents.',
  },
  {
    name: 'LangGraph',
    category: 'Orchestration',
    role: 'Stateful multi-agent StateGraph',
    detail: 'Coordinates conditional routing, bounded investigation loops, and shared state transitions across all five agents.',
  },
  {
    name: 'Python',
    category: 'Orchestration',
    role: 'Core async agent runtime',
    detail: 'Powers concurrent repository ingestion, AST parsing pipelines, and FastAPI / CLI execution.',
  },
  {
    name: 'GitHub API',
    category: 'Code Indexing',
    role: 'Repository & tree ingestion',
    detail: 'Streams repository file trees, commit refs, and pull request diffs directly from connected GitHub repos.',
  },
  {
    name: 'Qdrant',
    category: 'Code Indexing',
    role: 'Hybrid vector + payload store',
    detail: 'Indexes AST-aware code chunks with file path, language, and symbol metadata filters for precision recall.',
  },
  {
    name: 'Tree-sitter',
    category: 'Code Indexing',
    role: 'Incremental AST & symbol parser',
    detail: 'Extracts exact function bounds, class hierarchies, and cross-file import edges instead of blind line splits.',
  },
  {
    name: 'ripgrep',
    category: 'Code Indexing',
    role: 'High-speed regex & symbol search',
    detail: 'Locates exact call sites, configuration keys, and string literals across large repositories.',
  },
  {
    name: 'Exa',
    category: 'External Context',
    role: 'Technical web & spec retrieval',
    detail: 'Finds relevant engineering specs, RFCs, and ecosystem context when codebase symbols reference external standards.',
  },
  {
    name: 'Firecrawl',
    category: 'External Context',
    role: 'Clean documentation scraping',
    detail: 'Converts external API reference pages linked in repositories into structured markdown context.',
  },
  {
    name: 'Context7',
    category: 'External Context',
    role: 'Version-matched library docs',
    detail: 'Supplies accurate framework signatures for dependencies declared in package.json or pyproject.toml.',
  },
  {
    name: 'MCP',
    category: 'External Context',
    role: 'Model Context Protocol server',
    detail: 'Exposes RepoMind investigation, impact analysis, and citation tools to compatible editors and AI clients.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How is RepoMind different from standard single-prompt code chat?',
    answer:
      'Single-prompt code chat relies on flat text chunks and a single LLM pass, which frequently misses cross-file callers or hallucinates symbol names. RepoMind separates exploration, AST understanding, ripgrep investigation, impact analysis, and citation verification into distinct LangGraph nodes.',
  },
  {
    question: 'Why combine Tree-sitter, ripgrep, and Qdrant together?',
    answer:
      'Each retrieval method solves a different engineering problem. Qdrant captures conceptual similarity when you do not know exact symbol names; Tree-sitter preserves syntactic boundaries and dependency edges; ripgrep verifies exact string and symbol occurrences across the repository.',
  },
  {
    question: 'How does the Response & Verification Agent prevent ungrounded answers?',
    answer:
      'Before returning a final response, the fifth agent cross-checks every referenced file path, line span, and symbol name against the evidence collected by earlier agents. Statements without matching repository or external documentation spans are stripped or flagged.',
  },
  {
    question: 'Can RepoMind connect to external editors via MCP?',
    answer:
      'Yes. RepoMind exposes its repository exploration, investigation trace, and impact analysis tools through a Model Context Protocol (MCP) server so compatible IDEs and CLI workflows can query the same five-agent graph.',
  },
  {
    question: 'How are external libraries and third-party APIs grounded?',
    answer:
      'When your codebase imports external frameworks or calls external APIs, the Code Understanding and Investigation agents can query Context7 for version-specific library documentation, Exa for technical references, and Firecrawl for linked API docs.',
  },
];

export function buildCustomScenario(query: string): DemoScenario {
  const cleanQuery = query.trim() || 'Explain how the repository modules handle errors and dependencies.';
  const lower = cleanQuery.toLowerCase();
  const focusHint = lower.includes('test')
    ? 'test suite coverage and fixture dependencies'
    : lower.includes('auth') || lower.includes('token')
      ? 'authentication middleware and token handlers'
      : lower.includes('api') || lower.includes('route')
        ? 'API route handlers and request validation'
        : 'core module boundaries and execution flow';

  return {
    id: 'custom-query',
    category: 'Custom Query',
    title: 'Custom Investigation Trace',
    repo: 'connected/repository',
    prompt: cleanQuery,
    steps: [
      {
        agentId: 'repo_explorer',
        agentName: 'Repository Explorer',
        toolCall: 'github_api.fetch_tree() · treesitter.map_modules()',
        finding: `Mapped repository structure and prioritized directories relevant to ${focusHint}.`,
        elapsedLabel: 'Step 1 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'code_understanding',
        agentName: 'Code Understanding Agent',
        toolCall: `qdrant.hybrid_query("${cleanQuery.slice(0, 42)}")`,
        finding: 'Retrieved semantically matching AST chunks and resolved module docstrings and signatures.',
        elapsedLabel: 'Step 2 of 5',
        accent: 'violet',
      },
      {
        agentId: 'engineering_investigation',
        agentName: 'Engineering Investigation Agent',
        toolCall: 'ripgrep.search_call_sites() · trace_execution_path()',
        finding: `Traced cross-file call graph across primary entry points for ${focusHint}.`,
        elapsedLabel: 'Step 3 of 5',
        accent: 'cyan',
      },
      {
        agentId: 'impact_analysis',
        agentName: 'Impact Analysis Agent',
        toolCall: 'impact_graph.reverse_edges(depth=2)',
        finding: 'Identified downstream consumers, shared schemas, and corresponding test modules.',
        elapsedLabel: 'Step 4 of 5',
        accent: 'violet',
      },
      {
        agentId: 'response_verification',
        agentName: 'Response & Verification Agent',
        toolCall: 'verifier.validate_citations(spans=2)',
        finding: 'Verified file paths and symbol spans before synthesizing the structured answer.',
        elapsedLabel: 'Step 5 of 5',
        accent: 'cyan',
      },
    ],
    answerSummary: `For "${cleanQuery}", RepoMind routed through all five LangGraph nodes—mapping ${focusHint}, tracing callers via Tree-sitter and ripgrep, calculating downstream impact, and verifying file-path citations prior to output.`,
    impactedFiles: [
      { path: 'src/core/orchestrator.py', reason: 'Primary entry point matched by Tree-sitter AST', risk: 'Direct' },
      { path: 'src/handlers/pipeline.py', reason: 'Downstream caller resolved via reverse imports', risk: 'Indirect' },
      { path: 'tests/unit/test_pipeline.py', reason: 'Targeted unit test suite covering modified symbol', risk: 'Test' },
    ],
    citations: [
      {
        file: 'src/core/orchestrator.py',
        lineRange: 'L34-L52',
        symbol: 'execute_pipeline',
        excerpt: 'result = await agent_graph.ainvoke({"query": query, "repo": repo_ref})',
      },
      {
        file: 'src/handlers/pipeline.py',
        lineRange: 'L19-L31',
        symbol: 'validate_and_dispatch',
        excerpt: 'verified_spans = verifier.check_paths(collected_evidence)',
      },
    ],
    codeFix: {
      file: 'src/core/orchestrator.py',
      language: 'python',
      lines: [
        'async def execute_pipeline(query: str, repo_ref: str) -> VerifiedAnswer:',
        '    initial_state = {"query": query, "repo": repo_ref, "hop_count": 0}',
        '    final_state = await compiled_langgraph.ainvoke(initial_state)',
        '    return final_state["verified_response"]',
      ],
    },
  };
}
