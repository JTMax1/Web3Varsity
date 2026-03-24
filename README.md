<p align="center">
  <img src="public/assets/w3v-logo.png" alt="Web3Varsity Logo" width="120" />
</p>

<h1 align="center">Web3Varsity</h1>

<p align="center">
  <strong>Learn Web3. Earn On-Chain. Build the Future.</strong><br/>
  A full-stack, interactive Web3 education platform built on <a href="https://hedera.com">Hedera Hashgraph</a>.
</p>

<p align="center">
  <a href="https://web3varsity.netlify.app">🌐 Live Demo</a> ·
  <a href="https://youtu.be/hCmlY6xzu-I">🎬 Demo Video</a> ·
  <a href="https://github.com/jtmax1/Web3Varsity">📦 GitHub Repo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Hedera-Testnet-blueviolet?style=for-the-badge&logo=hedera" alt="Hedera Testnet" />
  <img src="https://img.shields.io/badge/Track-Open%20Track-orange?style=for-the-badge" alt="Open Track" />
  <img src="https://img.shields.io/badge/Hackathon-Apex%202026-gold?style=for-the-badge" alt="Apex 2026" />
  <img src="https://img.shields.io/badge/deployed-Netlify-00C7B7?style=for-the-badge&logo=netlify" alt="Netlify" />
</p>

---

## 🌍 Vision

We envision a world where every Web3 developer's competence is **verifiable on-chain**. Web3Varsity is the first step toward a decentralized credentialing standard where learning achievements are portable, composable, and trustless — starting with Hedera, the most sustainable and enterprise-grade public ledger.

> **Hedera Testnet Account:** `0.0.8335836` — [Verify on HashScan](https://hashscan.io/testnet/account/0.0.8335836)

---

## 📖 What is Web3Varsity?

**Web3Varsity** is a comprehensive, gamified learn-to-earn Web3 education platform purpose-built on Hedera Hashgraph. It takes users from zero blockchain knowledge to confidently deploying smart contracts, minting NFTs, trading on DEXes, and understanding DeFi — all through structured, interactive courses with real on-chain activity on Hedera Testnet.

Unlike traditional e-learning platforms that rely on videos and static text, Web3Varsity delivers **hands-on blockchain education** where every lesson culminates in a verifiable on-chain action: sending HBAR, submitting HCS messages, deploying Solidity contracts, minting NFT badges, or earning on-chain certificates.

---

## 🎯 Problem Statement

Web3 has an accessibility and education gap. The global blockchain education market is projected to reach **$18.6 billion by 2028**, yet millions of aspiring developers and non-technical enthusiasts — particularly across **Africa's 700M+ internet users under 30** — struggle to learn blockchain because:

1. **Existing education is fragmented** — YouTube videos, scattered docs, and text-heavy courses with no hands-on component.
2. **Blockchain interaction is intimidating** — New users are afraid to send transactions, deploy contracts, or interact with DeFi protocols for fear of losing real money.
3. **No credentialing standard** — Traditional certificates (PDFs, emails) are easily forged and carry no verifiable trust.
4. **The tooling learning curve is steep** — Setting up wallets, networks, and development environments creates friction before learning even begins.

---

## ✅ Our Solution

Web3Varsity solves this by providing a **safe, structured, gamified, and fully on-chain educational environment** built on Hedera's low-cost, high-throughput network:

| Problem | Web3Varsity Solution |
|---|---|
| Fragmented education | 30+ structured courses across Explorer & Developer tracks with prerequisite trees |
| Fear of real transactions | **In-course faucet** distributes testnet HBAR directly inside lesson components — users never leave the learning flow to get test tokens |
| Unverifiable credentials | NFT certificates minted on-chain via HTS, verifiable by anyone via public URL |
| Steep tooling setup | One-click wallet connect (MetaMask, HashPack, Blade) — instant onboarding |
| No guidance | AI-powered tutor chatbot (Gemini-backed) available on every page |
| No incentives to learn | XP system, leaderboards, badges, streak tracking, and level-up mechanics |

---

## 💡 Why This Is Innovative

Web3Varsity is not just another e-learning platform. It establishes **new capabilities** on Hedera that don't exist elsewhere in the ecosystem — or cross-chain:

| Dimension | Web3Varsity | Cross-Chain Competitors (Alchemy University, LearnWeb3, Buildspace) |
|---|---|---|
| **On-chain credentials** | NFT certificates minted via HTS, verifiable by anyone | PDF certificates or centralized badges |
| **Testnet sandbox** | Users interact with real Hedera Testnet (send HBAR, deploy contracts, submit HCS messages) | Read-only tutorials or Ethereum testnets |
| **In-course faucet** | Testnet HBAR distributed directly inside lesson components — zero friction | Users must leave the platform to get test tokens from external faucets |
| **AI course generation** | AI creates complete courses from natural language + quality scoring | Manual course authoring only |
| **DeFi simulation** | Bonzo Finance vault strategies with Keeper Agent logic | No DeFi education integration |
| **Agentic education** | AI Tutor registered on HOL Registry Broker via HCS-10 — other agents can query student credentials | No agentic architecture |
| **Live community** | HCS-powered decentralized message board | Centralized chat (Discord/Slack) |

> **To our knowledge, no existing Hedera application combines interactive education, on-chain credentialing, AI-driven tutoring, and DeFi simulation.** Web3Varsity establishes a new category on Hedera.

---

## 🔑 Why Web3? Why Not Web2?

This solution **requires blockchain** — a Web2 alternative cannot replicate its core value:

1. **Unforgeable credentials** — NFT certificates on HTS are cryptographically verifiable by anyone. PDFs and emails are trivially forged.
2. **User sovereignty** — Wallet-based authentication means users own their identity and credentials without depending on a centralized provider.
3. **Censorship-resistant community** — HCS message board cannot be censored, edited, or deleted by any single party.
4. **Real blockchain interaction** — Users sending real HBAR, deploying real contracts, and minting real NFTs on testnet builds genuine confidence. No Web2 simulation can replicate the experience of interacting with an actual distributed ledger.
5. **Composable credentials** — On-chain NFT certificates are portable across wallets, platforms, and even chains — they outlive any single platform.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React + TypeScript)      │
│  ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ Course View │ │ Playground   │ │ Faucet     │ │ AI Tutor   │ │
│  │ + 32 Inter- │ │ Smart Contrac│ │ Testnet    │ │ Gemini     │ │
│  │ active labs │ │ Deploy/Call  │ │ HBAR Dist. │ │ Chatbot    │ │
│  └──────┬─────┘ └──────┬───────┘ └──────┬─────┘ └──────┬─────┘ │
│         │              │               │              │         │
│  ┌──────▼──────────────▼───────────────▼──────────────▼─────┐  │
│  │          Wallet Context (EVM + Native Dual Wallet)        │  │
│  │     MetaMask · HashPack · Blade · WalletConnect v2        │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │     SUPABASE (Backend-as-a-Service)     │
         │  ┌────────────────────────────┐  │
         │  │  10 Edge Functions (Deno)  │  │
         │  │  wallet-login · mint-badge │  │
         │  │  ai-generate · nft-mint    │  │
         │  │  hcs-submit · faucet       │  │
         │  │  contract-deploy · cert    │  │
         │  └─────────────┬──────────────┘  │
         │  ┌─────────────▼──────────────┐  │
         │  │  PostgreSQL + RLS Policies  │  │
         │  │  Users · Courses · Badges   │  │
         │  │  Enrollments · Certificates │  │
         │  │  Leaderboard · Faucet Logs  │  │
         │  └────────────────────────────┘  │
         └────────────────┬────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │      HEDERA TESTNET (Layer 1)          │
         │  ┌─────────┐ ┌───────┐ ┌───────┐│
         │  │  HTS    │ │  HCS  │ │ HSCS  ││
         │  │NFT Certs│ │Msgs   │ │EVM    ││
         │  │& Badges │ │Board  │ │Deploy ││
         │  └─────────┘ └───────┘ └───────┘│
         │  ┌─────────┐ ┌───────────────┐  │
         │  │  HFS    │ │ Mirror Node   │  │
         │  │SVG/Meta │ │ Queries       │  │
         │  │Storage  │ │ & Validation  │  │
         │  └─────────┘ └───────────────┘  │
         └─────────────────────────────────┘
         ┌─────────────────────────────────┐
         │       MCP SERVER (FastMCP)             │
         │  AI Tutor Agent · Solidity Check│
         │  HOL Registry Broker Integration│
         └─────────────────────────────────┘
```

---

## 🔗 Deep Hedera Integration

Web3Varsity leverages **5 core Hedera network services**, creating one of the deepest integrations in the ecosystem:

### 1. Hedera Token Service (HTS)
- **NFT Certificate Collection** — Completion certificates are minted as NFTs on HTS with custom metadata
- **NFT Badge System** — Achievement badges (Common → Legendary) minted on-chain when earned
- **Token Association** — Users associate with token collections before receiving NFTs
- `src/lib/hedera/hts-service.ts` · `src/lib/hedera/nft-certificates.ts`

### 2. Hedera Consensus Service (HCS)
- **Community Message Board** — Real-time decentralized messaging via HCS Topic `0.0.7180075`
- **On-Chain Activity Log** — All community messages are immutably recorded with consensus timestamps
- **Topic Subscription** — Polling-based real-time message feed from Mirror Node
- `src/lib/hedera/hcs-service.ts` · `src/components/course/practical/HCSMessageBoard.tsx`

### 3. Hedera Smart Contract Service (HSCS)
- **Smart Contract Playground** — Deploy real Solidity contracts (Counter, MessageStorage, Voting) to Hedera testnet
- **Contract Interaction** — Execute functions and query state on deployed contracts
- **Bytecode Compilation** — Pre-compiled bytecodes using `solc 0.8.20` with London EVM compatibility
- `src/lib/hedera/contracts-service.ts` · `compile-contracts.cjs`

### 4. Hedera File Service (HFS)
- **Certificate SVG Storage** — Generated SVG certificate images uploaded to HFS (a creative, novel use of this typically underutilized service)
- **Metadata JSON Storage** — NFT metadata stored on-chain with chunked uploads for files >4KB
- **Mirror Node Retrieval** — Files fetched for verification without HBAR cost
- `src/lib/hedera/certificate-generator.ts`

### 5. HBAR Transactions
- **Send HBAR Lessons** — Users send real testnet HBAR in practical lessons
- **In-Course Faucet** — A purpose-built testnet faucet (`request-faucet` Edge Function) is embedded directly inside practical lesson components (e.g., WalletCreator). When a student reaches a step that requires HBAR, they click "Get Testnet HBAR" without leaving the lesson. Rate-limited to 10 HBAR/day per user with full transaction tracking in a dedicated `faucet_requests` database table.
- **Standalone Faucet Page** — Dedicated `/faucet` page with eligibility checks, cooldown timers, amount selection, and complete faucet history
- **Transaction History** — Full history queryable via Mirror Node API with type filtering (send, receive, faucet)
- `src/lib/hedera/transactions.ts` · `src/lib/hedera/faucet.ts` · `supabase/functions/request-faucet/`

### Ecosystem Partners Used
- **Bonzo Finance** — DeFi simulator with Bonzo vault yield optimization strategies and Keeper Agent logic
- **Hashgraph Online (HOL)** — AI Tutor registered as a discoverable agent on the HOL Registry Broker via HCS-10 protocol
- **Hedera Wallet Connect** — Native wallet connectivity for HashPack, Blade, and other Hedera-native wallets
- **Hedera Mirror Node** — Account lookups, balance queries, transaction verification, NFT metadata retrieval

---

## ✨ Key Features

### Why These MVP Features?

We prioritized features that generate the **most Hedera network activity per user**: wallet onboarding (account creation), course completion (NFT minting), community messaging (HCS transactions), and smart contract deployment (HSCS). Every feature interaction results in verifiable on-chain activity.

### 📚 Course System
- **30+ Interactive Courses** spanning Explorer (non-technical) and Developer (hands-on) tracks
- **Prerequisite Trees** — Courses enforce completion order for structured learning paths
- **32 Interactive Components** — BlockchainBuilder, ConsensusAnimation, NFTMarketplace, PhishingSimulator, DeFiConcepts, YieldCalculator, and more
- **13 Practical Labs** — Every lab generates real on-chain activity:
  - **TransactionSender** — Send real HBAR via wallet signature
  - **HCSMessageBoard** — Post messages to HCS Topic `0.0.7180075` with consensus timestamps
  - **NFTMinterStudio** — Design metadata and mint real NFTs on HTS
  - **SmartContractPlayground** — Deploy Counter, MessageStorage, and Voting contracts to HSCS
  - **WalletCreator** — Generate ECDSA keypair + create testnet account + in-course faucet funding
  - **DEXSwapper** — Swap tokens with real HBAR transfers to treasury
  - **BonzoDeFiSimulator** — Deposit into Bonzo vaults with real HBAR and Keeper Agent logic
  - **BonzoIntentAgent** — Chat-based intent agent that executes DeFi plans via wallet-signed transactions
  - **BonzoRAGHarvester** — RAG-powered yield harvester that sends real harvest transactions
  - **DeFiSimulator** — Liquidity pool simulation with real HBAR deposits
  - **TransactionDetective** — Gamified blockchain forensics querying real Mirror Node data
  - **WalletInvestigation** — Forensic wallet analysis using live Mirror Node API
  - **ExplorerNavigation** — Gamified HashScan tutorial with real testnet challenges

### 🤖 AI-Powered Learning
- **AI Tutor Chatbot** — Persistent chat widget (Gemini-backed via Supabase Edge Functions) with conversation history, session management, and feedback collection
- **AI Course Generator** — Generate complete courses from natural language prompts with quality scoring
- **AI Quiz Generator** — Dynamically generate quiz questions from lesson content
- **MCP Server** — Model Context Protocol server exposing Solidity analysis and Hedera testnet queries to external AI agents (Cursor, Claude Desktop, HOL Broker)

### 🏆 Gamification Engine
- **XP & Leveling System** — Earn XP for lesson completions, quizzes, and on-chain activities
- **Streak Calendar** — Daily learning streak tracking with visual calendar
- **Leaderboard** — Real-time competitive rankings (All Time, Weekly, Monthly) with animated podium
- **Badge/Achievement System** — Multi-rarity badges (Common, Rare, Epic, Legendary) earned automatically

### 🎓 NFT Certificates
- **On-Chain Verifiable** — SVG certificates with embedded QR codes, minted as HTS NFTs
- **Public Verification Page** — Anyone can verify at `/verify` using certificate number or Token ID + Serial
- **Platform Signature** — HMAC-SHA256 signatures for anti-forgery verification
- **HFS + IPFS Storage** — Dual storage strategy (Hedera File Service primary, IPFS/Pinata fallback)

### 👛 Dual Wallet Architecture
- **EVM Wallets** — MetaMask, Rabby, or any EIP-1193 compatible wallet
- **Native Hedera Wallets** — HashPack, Blade via EIP-6963 discovery and WalletConnect v2 fallback
- **Unified Provider Interface** — Abstraction layer (`IWalletProvider`) normalizes EVM and native Hedera signing
- **Signature-Based Auth** — Passwordless login: sign a message → Supabase JWT issued

### 💧 Integrated Testnet Faucet System
- **In-Course Funding** — The faucet is embedded directly inside practical lesson components (`WalletCreator`). When a student creates their first wallet, they can instantly request testnet HBAR without navigating away — eliminating the #1 friction point in blockchain education ("how do I get test tokens?")
- **Standalone Faucet Page** — Dedicated `/faucet` page with configurable amount selection, eligibility checks, cooldown timers, and transaction history
- **Rate-Limited via Edge Function** — The `request-faucet` Supabase Edge Function enforces per-user daily limits (10 HBAR/day) and cooldown periods (24 hours). All requests are logged to the `faucet_requests` table for admin analytics
- **Mirror Node Verification** — After faucet distribution, the component queries the Hedera Mirror Node to verify the new balance in real time, teaching students how on-chain state confirmation works
- **Admin Dashboard Integration** — Faucet statistics (total distributed, unique users, daily usage) are visible in the admin dashboard for platform monitoring

### 🛠️ Course Creation CMS
- **Multi-Step Wizard** — 5-step course creation: Metadata → Objectives → Lessons → Preview → Publish
- **Lesson Editor** — Rich editor for text, interactive components, quizzes, and practical labs
- **Quality Monitor** — Real-time validation scoring for course completeness
- **Admin Review** — Courses go through approval workflow before publishing

### 📊 Admin Dashboard
- **Analytics** — Platform statistics, user growth, course metrics
- **User Management** — Role-based access control (admin, moderator, user)
- **Course Management** — Approve/reject submissions, manage published courses
- **Badge Management** — Configure and assign achievement badges

---

## 🏗️ Key Design Decisions

| Decision | Rationale |
|---|---|
| **Supabase over custom backend** | Rapid iteration with built-in Auth, PostgreSQL, and Edge Functions. Row-Level Security (RLS) enforces user-scoped data access without custom middleware. Allowed a solo developer to build a production-grade backend in weeks, not months. |
| **Dual wallet architecture (EVM + Native Hedera)** | Maximizes user reach. MetaMask users (the largest Web3 wallet base) can connect immediately, while HashPack/Blade users get a first-class native experience. The `IWalletProvider` abstraction normalizes signing across both. |
| **Zustand over Redux for state management** | Simpler API with less boilerplate for the course creation wizard. Zustand's `persist` middleware gives free localStorage draft saving. React Query handles all server state, so Zustand only manages local UI state. |
| **Server-side Hedera operator keys** | All Hedera private keys are stored exclusively in Supabase Edge Function secrets — never exposed to the client. This prevents key extraction from browser dev tools and follows security best practices. |
| **HFS for certificate storage (not IPFS-only)** | HFS keeps certificate images fully on Hedera's network — no external dependency on IPFS pinning services. IPFS/Pinata is used as a fallback for redundancy. |
| **AI via Supabase Edge Functions (not client-side)** | Gemini API keys are kept server-side. Rate limiting (5 generations/hour, 20 chats/hour) is enforced in the Edge Function, preventing abuse. |
| **Solidity pre-compilation** | Educational contracts are pre-compiled to bytecode using `solc 0.8.20` with London EVM compatibility. This removes the need for users to install Solidity toolchain and ensures consistent deployments. |

---

## 🎨 User Experience & Accessibility

- **Mobile-responsive design** — Tailwind CSS responsive breakpoints ensure usability across phones, tablets, and desktops
- **Accessible UI primitives** — Built on Radix UI, which provides ARIA-compliant components out of the box (focus management, keyboard navigation, screen reader support)
- **Animated engagement** — Framer Motion micro-animations on transitions, modals, and page loads create a premium feel that encourages exploration
- **Progressive disclosure** — Course creation wizard breaks complex tasks into 5 digestible steps; lesson content loads incrementally
- **One-click wallet onboarding** — Users connect MetaMask or HashPack in a single click; no manual network configuration needed (auto-switches to Hedera Testnet)
- **Low-bandwidth friendly** — Africa-focused design avoids heavy media; SVG-based certificates and emoji avatars keep payload minimal

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS 4, Framer Motion |
| **UI Components** | Radix UI Primitives, Lucide Icons, Recharts, Sonner Toasts |
| **State Management** | Zustand (course creation), React Query / TanStack Query (server state) |
| **Routing** | React Router DOM v7 |
| **Backend** | Supabase (PostgreSQL, Edge Functions, Row-Level Security, Auth) |
| **Blockchain** | Hedera Hashgraph SDK v2.75, Ethers.js v6, Hedera Wallet Connect v2 |
| **AI** | Google Gemini (via `@google/genai`), FastMCP server |
| **DeFi** | Bonzo Finance Plugin (`@bonzofinancelabs/hak-bonzo-plugin`) |
| **Agent Registry** | Hashgraph Online Standards Agent Kit, HOL Registry CLI |
| **Smart Contracts** | Solidity 0.8.20, `solc` compiler |
| **Deployment** | Netlify (frontend), Supabase Cloud (backend) |

---

## 📈 Hedera Network Impact

Web3Varsity is a **Hedera account onboarding engine**. Every user who joins creates a Hedera testnet account and generates an unprecedented volume of on-chain activity through 8 wallet-signed practical components and 4 server-signed Edge Functions.

### Per-User Transaction Footprint (Single Course with Labs)

| Step | Component | Hedera Service | Transactions |
|---|---|---|---|
| Wallet creation lesson | WalletCreator | AccountCreate + Faucet | **2** |
| Send HBAR lesson | TransactionSender | HBAR Transfer | **1** |
| HCS messaging lesson | HCSMessageBoard | HCS Submit (×2 messages) | **2** |
| NFT minting lesson | NFTMinterStudio | HTS Mint | **1** |
| Smart contract lesson | SmartContractPlayground | HSCS Deploy + Execute (×3) | **4** |
| DEX/DeFi lesson | DEXSwapper or BonzoDeFi | HBAR Transfer | **1** |
| Agent lesson | BonzoIntentAgent or RAGHarvester | HBAR Transfer | **1** |
| Course certificate claim | mint-certificate Edge Function | HFS Upload + HTS Mint + NFT Transfer | **3** |
| Achievement badge earned | mint-badge Edge Function | HTS Mint + NFT Transfer | **2** |
| **Total per lab course** | | | **15–17** |

### Full Platform Journey

| Metric | Estimate |
|---|---|
| Courses with on-chain practical labs | ~10 of 30+ |
| Transactions per lab course | ~15–17 |
| Transactions per theory course (cert + badge only) | ~3 |
| Additional faucet claims | ~3–5 |
| Community HCS messages | ~10–20 |
| **Total per active user (full platform)** | **~100–200 Hedera transactions** |

### Projected Scale (Post-Hackathon)

| Milestone | Timeline | New Accounts | Monthly Transactions |
|---|---|---|---|
| 100 monthly active learners | Month 1–2 | 100 | ~10,000–20,000 |
| 500 monthly active learners | Month 3–4 | 500 | ~50,000–100,000 |
| 1,000 monthly active learners | Month 6 | 1,000 | ~100,000–200,000 |
| 5,000 monthly active learners | Year 1 | 5,000 | ~500,000–1,000,000 |

> **8 practical components generate wallet-signed transactions.** 4 Edge Functions generate server-signed transactions. 3 components query real Mirror Node data. Every completed course mints an NFT. Every community post writes to HCS. Every smart contract lesson deploys to HSCS. **Web3Varsity converts learning into Hedera network activity at a rate no other education platform achieves — 100–200 transactions per active user.**

---

## 💼 Business Model

| Element | Description |
|---|---|
| **Value Proposition** | Verifiable Web3 credentials + AI-powered adaptive learning on Hedera's low-cost network |
| **Customer Segments** | (1) Web3 newcomers in emerging markets, (2) African developers seeking verifiable credentials, (3) Enterprises needing blockchain-trained talent, (4) Universities integrating Web3 curricula |
| **Revenue Streams** | (1) **Free tier** with on-chain certificates (growth driver), (2) **Premium courses** with advanced DeFi/smart contract labs, (3) **B2B institutional licenses** for enterprise training, (4) **Certificate verification API** for employers to programmatically verify credentials |
| **Cost Structure** | Supabase hosting (~$25/mo), Hedera testnet fees (negligible at ~$0.0001/tx), Gemini AI API (free tier: 1,500 req/day), Netlify CDN (free tier) |
| **Channels** | African Web3 communities (Web3 Bridge, AYA HQ, DevFest Africa), blockchain university clubs, Hedera developer relations, organic SEO via AI-generated courses |
| **Key Partners** | Hedera Foundation (grants), Bonzo Finance (DeFi education), Hashgraph Online (agent ecosystem) |
| **Unfair Advantage** | On-chain credentials are composable and portable — they outlive the platform. No competitor offers NFT-based certificates minted on a Layer 1 with <$0.0001 transaction fees. |

---

## 🚀 Go-To-Market Strategy

### Phase 1: Community-Led Growth (Month 1–3)
- Partner with **Web3 Bridge Nigeria**, **AYA HQ**, and **DevFest Africa** blockchain communities to onboard first 500 learners
- Leverage **"Share your NFT certificate on LinkedIn"** viral loop — each certificate includes a verifiable link that drives organic traffic
- Submit to **Hedera Foundation ecosystem grants** program for sustained development funding

### Phase 2: Content-Driven Organic Growth (Month 3–6)
- Use AI Course Generator to rapidly produce **trending topic courses** (DePIN, RWA tokenization, AI + Blockchain) driving SEO traffic
- Launch **course creator program** — community members create courses using the CMS, expanding content without centralized effort
- Integrate with **Hedera dev community** meetups as an official education resource

### Phase 3: Institutional Expansion (Month 6–12)
- Offer **B2B packages** for enterprises needing blockchain-literate employees
- Partner with **African universities** to integrate Web3Varsity as supplementary curricula
- Launch **verification API** — employers programmatically check candidate credentials via Token ID

### Viral Loop
```
User completes course → Earns NFT certificate → Shares on LinkedIn/Twitter
→ Peers click verification link → Land on Web3Varsity → Create account
→ Start learning → Complete course → Share certificate → Loop continues
```

---

## ✅ Validation & Traction

### Feedback Collection Mechanisms
- **AI Tutor feedback** — Every chatbot response includes 👍/👎 buttons for session-level sentiment
- **Course completion ratings** — Users rate courses after earning certificates (1–5 stars)
- **Discord community** — Dedicated #feedback channel for feature requests and bug reports
- **In-app analytics** — Course drop-off rates, lesson completion times, and faucet usage tracked via Supabase

### Feedback Cycles During Hackathon
1. **Alpha testing (Week 2)** — 5 developers from Web3 Bridge Nigeria tested wallet onboarding and initial course flow. Key feedback: "Need more visual explanations for beginners" → Added 32 interactive components (animations, simulators)
2. **Beta testing (Week 3)** — 10 testers across Nigeria and Kenya evaluated the full course, quiz, and certificate flow. Key feedback: "Certificate verification is impressive" and "DeFi section needs more context" → Added DeFi simulation with Bonzo Finance
3. **Live demo (Week 4)** — Presented during Workshop session. Community response was positive: "This is exactly what Hedera needs for adoption"

### Current Metrics
| Metric | Value |
|---|---|
| Live deployed platform | ✅ [web3varsity.netlify.app](https://web3varsity.netlify.app) |
| Hedera testnet account activity | ✅ Verifiable at [HashScan](https://hashscan.io/testnet/account/0.0.8335836) |
| Courses available | 30+ (Explorer + Developer tracks) |
| Interactive components built | 32 interactive + 13 practical labs |
| NFT collections deployed | 2 (Certificates: `0.0.7103275`, Badges: `0.0.8311700`) |
| HCS topic active | 1 (Community Board: `0.0.7180075`) |
| AI Tutor conversations | Active with per-session history |
| Edge Functions deployed | 10 (production-ready on Supabase) |

### Market Sentiment
Early testers have validated that:
- The **one-click wallet onboarding** dramatically reduces friction compared to other blockchain learning platforms
- **On-chain NFT certificates** are perceived as significantly more valuable than PDF certificates
- The **AI Tutor** reduces the "I'm stuck" dropout rate by providing instant contextual help
- The **gamification (XP, streaks, leaderboard)** drives repeated engagement and daily returns

---

## 🔐 Security Design

- **Wallet-Based Authentication** — No passwords; sign-in via wallet signature verification
- **Supabase Row-Level Security (RLS)** — All database tables protected with user-scoped policies
- **Server-Side Key Management** — Hedera operator keys stored exclusively in Supabase Edge Function secrets
- **Rate Limiting** — Faucet limited to 10 HBAR/day/user; AI generation limited to 5/hour
- **HMAC Certificate Signatures** — Platform-signed certificates prevent forgery

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (package manager)
- **MetaMask** or **HashPack** browser extension
- A Hedera Testnet account ([portal.hedera.com](https://portal.hedera.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/jtmax1/Web3Varsity.git
cd Web3Varsity

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase and Hedera credentials
```

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hedera Network Configuration
VITE_HEDERA_NETWORK=testnet
VITE_HEDERA_MIRROR_NODE=https://testnet.mirrornode.hedera.com
VITE_HEDERA_RPC_URL=https://testnet.hashio.io/api

# Hedera Agent Kit Configuration
VITE_OPENAI_API_KEY=your_openai_key
VITE_AGENT_ACCOUNT_ID=your_agent_account_id
VITE_AGENT_PRIVATE_KEY=your_agent_private_key

# Protocol Configurations
VITE_BONZO_TREASURY=0.0.12345
VITE_BONZO_MARKET_ID=your_market_id
```

### Running Locally

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start MCP server (optional, for AI agent integration)
npx tsx backend/mcp-server.ts
```

### Compiling Smart Contracts

```bash
# Compile educational Solidity contracts to bytecodes
node compile-contracts.cjs
```

---

## 📂 Project Structure

```
Web3Varsity/
├── src/
│   ├── App.tsx                    # Root application with routing
│   ├── main.tsx                   # Entry point
│   ├── components/
│   │   ├── pages/                 # 14 page components (Landing, Dashboard, Courses, etc.)
│   │   ├── course/
│   │   │   ├── interactive/       # 32 interactive learning components
│   │   │   └── practical/         # 13 practical on-chain lab components
│   │   ├── ai/                    # AI Tutor + Course Generator components
│   │   ├── admin/                 # Admin dashboard + management tabs
│   │   ├── course-creation/       # Course creation wizard + editors
│   │   ├── dashboard/             # Dashboard widgets
│   │   └── ui/                    # 48 Radix-based UI components
│   ├── lib/
│   │   ├── hedera/                # 11 Hedera service modules (HTS, HCS, HSCS, HFS, etc.)
│   │   ├── ai/                    # AI service, Gemini client, quality checker
│   │   ├── defi/                  # Bonzo simulator, DeFi protocol simulator
│   │   ├── auth/                  # Wallet signature authentication
│   │   ├── api/                   # 10 API modules (badges, courses, enrollment, etc.)
│   │   ├── wallet/                # Unified wallet provider interface
│   │   ├── supabase/              # Supabase client, types, error handling
│   │   └── schemas/               # Zod course/lesson validation schemas
│   ├── hooks/                     # 13 React Query hooks
│   ├── contexts/                  # WalletContext (dual EVM + native)
│   ├── stores/                    # Zustand course creation store
│   └── config/                    # Environment configuration
├── supabase/
│   ├── functions/                 # 10 Deno Edge Functions
│   └── migrations/                # 6 SQL migration files
├── backend/
│   └── mcp-server.ts              # FastMCP server for AI agent integration
├── scripts/                       # HOL registration, badge/NFT setup scripts
├── compile-contracts.cjs          # Solidity compiler for educational contracts
├── mcp_config.json                # MCP server configuration
├── netlify.toml                   # Netlify deployment config
└── package.json
```

---

## 🗺️ Future Roadmap

| Phase | Timeline | Features | Success Metrics |
|---|---|---|---|
| **Phase 1** | Month 1–2 | Mainnet deployment, IPFS certificate pinning, mobile PWA | 100 MAU, 50 certificates minted |
| **Phase 2** | Month 3–4 | Hedera Agent Kit deep integration, certification verification API | 500 MAU, 3 enterprise pilot customers |
| **Phase 3** | Month 6–9 | DAO governance for course curation, HBAR staking rewards | 1,000 MAU, community-created courses |
| **Phase 4** | Month 9–12 | Multi-language (French, Portuguese, Arabic), institutional partnerships | 5,000 MAU, 2 university partnerships |
| **Phase 5** | Year 2 | Cross-chain certificate portability, decentralized credential protocol | 10,000 MAU, industry standard for Web3 credentials |

---

## 👥 Team

| Member | Role |
|---|---|
| **JTMax** | Full-Stack Developer & Project Lead |

---

## 📜 License

This project is open-source and was built for the [Hedera Hello Future Apex Hackathon 2026](https://hellofuturehackathon.dev/).

---

## 🔗 Links

- 🌐 **Live Demo:** [web3varsity.netlify.app](https://web3varsity.netlify.app)
- 🎬 **Demo Video:** [youtu.be/hCmlY6xzu-I](https://youtu.be/hCmlY6xzu-I)
- 📦 **GitHub:** [github.com/jtmax1/Web3Varsity](https://github.com/jtmax1/Web3Varsity)
- 🔍 **Testnet Explorer:** [hashscan.io/testnet/account/0.0.8335836](https://hashscan.io/testnet/account/0.0.8335836)
- 🏢 **Hackathon:** [hellofuturehackathon.dev](https://hellofuturehackathon.dev/)