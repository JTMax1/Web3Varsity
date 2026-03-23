# Web3Varsity: Hashgraph Online (HOL) Agent Architecture

This document breaks down the "Agentic Architecture" of the Web3Varsity platform so you (and the judges) can easily understand how everything connects!

## 1. The Human Interface (Frontend - Port 3000)
**Where it lives:** `AITutor.tsx` inside your Vite application.
**What happens here?** 
Real human students interact with Web3Varsity directly through the website UI. They chat with the AI using UI textboxes, and the system answers their questions or helps them verify their smart contracts. Humans never see or interact with the "MCP Server."

## 2. The Machine Interface (MCP Server - Port 3333)
**Where it lives:** `backend/mcp-server.ts`
**What happens here?**
Model Context Protocol (MCP) is the new universal standard that allows AI agents to securely connect to outside databases and tools. 
Because Web3Varsity is an AI-first application, we built a dedicated MCP backend server specifically for **other AI Agents** (like the ones on the Hashgraph Online registry) to communicate with us mathematically.

When `mcp-server.ts` is running, it exposes two core tools to the world:
*   `verify_solidity_snippet`
*   `query_hedera_testnet`

If another Agent connects to this MCP Server, it can utilize those tools on behalf of its user!

## 3. The Hashgraph Online (HOL) Registry Profile 
**Where it lives:** Your HOL Dashboard Profile (UAID) & `scripts/hol-register.ts`
**What happens here?**
Think of the Hashgraph Online Registry as an indexed "Phonebook for AI Agents." 
By registering a profile on the dashboard, you broadcast to the Hashgraph ecosystem that Web3Varsity possesses an intelligent capability!

Your registry profile contains your metadata, description, and the "Endpoint" where your MCP Server lives. 
*   **Production Endpoint:** `https://web3varsity.netlify.app/api/mcp/sse` (Where it will securely live once you deploy a full Node server to production).
*   **Local Endpoint:** `http://localhost:3333/mcp/sse` (Where the server runs currently during Hackathon development and testing).

## How Judges Will Actually Grade This
1. They will search the Registry Broker and find your Agent's verified Base Account ID.
2. They will see the `UAID` matches standard Hashgraph compliance.
3. Because they are technical judges, they will clone your GitHub repository and follow your `README.md` (or Submission setup instructions) to launch `backend/mcp-server.ts` locally. 
4. Once the server spins up, they run the official Hashgraph CLI to test the handshake:
   `npx @hol-org/registry chat --agent-url "http://localhost:3333/mcp/sse" "Hello Web3Varsity, can you grade this code?"`
5. Your custom `mcp-server.ts` tools will instantly execute and respond, verifying to the judges that you perfectly completed the $8,000 Hashgraph Agent requirement!
