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

## 📖 What is Web3Varsity?

**Web3Varsity** is a comprehensive, gamified learn-to-earn Web3 education platform purpose-built on Hedera Hashgraph. It takes users from zero blockchain knowledge to confidently deploying smart contracts, minting NFTs, trading on DEXes, and understanding DeFi — all through structured, interactive courses with real on-chain activity on Hedera Testnet.

Unlike traditional e-learning platforms that rely on videos and static text, Web3Varsity delivers **hands-on blockchain education** where every lesson culminates in a verifiable on-chain action: sending HBAR, submitting HCS messages, deploying Solidity contracts, minting NFT badges, or earning on-chain certificates.

> **Hedera Testnet Account:** `0.0.8335836`

---

## 🎯 Problem Statement

Web3 has an accessibility and education gap. Millions of aspiring developers and non-technical enthusiasts — particularly in emerging markets — struggle to learn blockchain because:

1. **Existing education is fragmented** — YouTube videos, scattered docs, and text-heavy courses with no hands-on component.
2. **Blockchain interaction is intimidating** — New users are afraid to send transactions, deploy contracts, or interact with DeFi protocols for fear of losing real money.
3. **No credentialing standard** — Traditional certificates (PDFs, emails) are easily forged and carry no verifiable trust.
4. **The tooling learning curve is steep** — Setting up wallets, networks, and development environments creates friction.

---

## ✅ Our Solution

Web3Varsity solves this by providing a **safe, structured, gamified, and fully on-chain educational environment** built on Hedera's low-cost, high-throughput network:

| Problem | Web3Varsity Solution |
|---|---|
| Fragmented education | 30+ structured courses across Explorer & Developer tracks with prerequisite trees |
| Fear of real transactions | Built-in HBAR Faucet + Hedera Testnet sandbox — users transact for free |
| Unverifiable credentials | NFT certificates minted on-chain via HTS, verifiable by anyone via public URL |
| Steep tooling setup | One-click wallet connect (MetaMask, HashPack, Blade) — instant onboarding |
| No guidance | AI-powered tutor chatbot (Gemini-backed) available on every page |
| No incentives to learn | XP system, leaderboards, badges, streak tracking, and level-up mechanics |

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
- **Certificate SVG Storage** — Generated SVG certificate images uploaded to HFS
- **Metadata JSON Storage** — NFT metadata stored on-chain with chunked uploads for files >4KB
- **Mirror Node Retrieval** — Files fetched for verification without HBAR cost
- `src/lib/hedera/certificate-generator.ts`

### 5. HBAR Transactions
- **Send HBAR Lessons** — Users send real testnet HBAR in practical lessons
- **Testnet Faucet** — Rate-limited (10 HBAR/day) distribution with full transaction tracking
- **Transaction History** — Full history queryable via Mirror Node API
- `src/lib/hedera/transactions.ts` · `src/lib/hedera/faucet.ts`

### Ecosystem Partners Used
- **Bonzo Finance** — DeFi simulator with Bonzo vault yield optimization strategies and Keeper Agent logic
- **Hashgraph Online (HOL)** — AI Tutor registered as a discoverable agent on the HOL Registry Broker via HCS-10 protocol
- **Hedera Wallet Connect** — Native wallet connectivity for HashPack, Blade, and other Hedera-native wallets
- **Hedera Mirror Node** — Account lookups, balance queries, transaction verification, NFT metadata retrieval

---

## ✨ Key Features

### 📚 Course System
- **30+ Interactive Courses** spanning Explorer (non-technical) and Developer (hands-on) tracks
- **Prerequisite Trees** — Courses enforce completion order for structured learning paths
- **32 Interactive Components** — BlockchainBuilder, ConsensusAnimation, NFTMarketplace, PhishingSimulator, DeFiConcepts, YieldCalculator, and more
- **13 Practical Labs** — Real on-chain lessons: TransactionSender, NFTMinterStudio, SmartContractPlayground, HCSMessageBoard, WalletCreator, BonzoDeFiSimulator, etc.

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

## 🔐 Security Design

- **Wallet-Based Authentication** — No passwords; sign-in via wallet signature verification
- **Supabase Row-Level Security (RLS)** — All database tables protected with user-scoped policies
- **Server-Side Key Management** — Hedera operator keys stored exclusively in Supabase Edge Function secrets
- **Rate Limiting** — Faucet limited to 10 HBAR/day/user; AI generation limited per hour
- **HMAC Certificate Signatures** — Platform-signed certificates prevent forgery

---

## 📈 Impact & Traction

- **Deployed on Testnet** — Active Hedera testnet account `0.0.8335836` with verifiable on-chain activity
- **Live Production URL** — [web3varsity.netlify.app](https://web3varsity.netlify.app)
- **Targets Emerging Markets** — Built with African developers and Web3 explorers in mind
- **Drives Hedera Adoption** — Every user creates a Hedera account; every completed course mints an NFT; community messages go through HCS

---

## 🗺️ Future Roadmap

| Phase | Features |
|---|---|
| **Phase 1** (Post-Hackathon) | Mainnet deployment, IPFS certificate pinning, mobile PWA |
| **Phase 2** | Hedera Agent Kit deep integration for automated AI-driven on-chain actions |
| **Phase 3** | DAO governance for course curation, HBAR staking rewards for course completion |
| **Phase 4** | Multi-language support (French, Portuguese, Arabic), institutional partnerships |
| **Phase 5** | Decentralized credential verification protocol, cross-chain certificate portability |

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