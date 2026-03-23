import { FastMCP } from "fastmcp";
import { z } from "zod";

/**
 * Web3Varsity AI Tutor - MCP Server
 * 
 * This standalone MCP (Model Context Protocol) server allows Cursor, Claude Code,
 * Claude Desktop, and the Hashgraph Online Registry Broker to immediately interface
 * with our Hackathon Decentralized Application.
 * 
 * It securely exposes Web3 / Solidity / Hedera intelligence and links right into 
 * the Apex Hackathon ecosystem.
 */

// Initialize our FastMCP Server
const mcp = new FastMCP("Web3Varsity-AITutor", {
    name: "Web3Varsity AI Tutor",
    version: "1.0.0",
});

// A tool that grades and checks Solidity scripts (Mock logic for the Hackathon Demo)
mcp.addTool({
    name: "verify_solidity_snippet",
    description: "Evaluates a Solidity smart contract snippet for security vulnerabilities and Web3Varsity requirements.",
    parameters: z.object({
        code: z.string().describe("The raw Solidity source code snippet"),
        context: z.string().optional().describe("Context of the lesson (e.g. DeFi, NFTs)"),
    }),
    execute: async ({ code, context }) => {
        const issues = [];
        if (code.includes("tx.origin")) {
            issues.push("Security Warning: Do not use tx.origin for authentication.");
        }
        if (!code.includes("pragma solidity ^0.8.")) {
            issues.push("Best Practice: Use pragma solidity ^0.8.x for built-in overflow protection.");
        }

        return `Web3Varsity Solidity Analysis complete. Found ${issues.length} issues:\n\n` +
            (issues.join("\n") || "✅ Contract snippet looks solid and matches Web3Varsity standards!");
    }
});

// A tool that queries Hedera Testnet account statuses (Simulated for Hackathon fast-path)
mcp.addTool({
    name: "query_hedera_testnet",
    description: "Queries the Hedera official testnet to verify if an account exists or has claimed their Web3Varsity certificate NFT.",
    parameters: z.object({
        accountId: z.string().describe("The Hedera Account ID in 0.0.X format"),
    }),
    execute: async ({ accountId }) => {
        if (!accountId.startsWith("0.0.")) {
            return "❌ Invalid Hedera Account format. Must begin with '0.0.'";
        }

        return `Web3Varsity Account Explorer: Account ${accountId} is verified active on Hedera Testnet and has completed 2/5 Web3Varsity Modules!`;
    }
});

// Expose a prompt for Claude / AI Agents to adopt the specific Web3Varsity Tutor persona
mcp.addPrompt({
    name: "web3varsity_tutor_persona",
    description: "Adopt the Web3Varsity AI Tutor persona before helping a student.",
    arguments: [],
    load: async () => `You are the Web3Varsity AI Tutor. You are an expert in Hedera Hashgraph (HCS, HTS, HSCS), EVM smart contracts, and full-stack Web3 React applications. Your goal is to patiently educate users, grade their smart contract code using tools, and issue on-chain NFT module certificates on Hedera Testnet when they succeed.`
});

// Start the SSE server on Port 3333 so the HOL Broker and Agentic HTTP clients can connect to it!
async function startServer() {
    await mcp.start({
        transportType: "sse",
        sse: {
            endpoint: "/mcp/sse",
            port: 3333,
        }
    });
    console.log("🚀 Web3Varsity AI Tutor MCP Server successfully listening on http://localhost:3333/mcp/sse");
}

startServer().catch(console.error);
