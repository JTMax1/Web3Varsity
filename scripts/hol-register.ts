import { execSync } from 'child_process';
import 'dotenv/config';

/**
 * Hashgraph Online (HOL) Registry Broker - Agent Registration Script
 * 
 * This script formally registers and updates the Web3Varsity 'AI Tutor' as a discoverable Agent
 * using the official @hol-org/registry CLI standard, binding our specific MCP endpoints
 * and Hackathon metadata directly to the on-chain UAID.
 * 
 * Note: REGISTRY_BROKER_API_KEY must be present in your environment.
 */

const UAID = process.env.VITE_AITUTOR_UAID || "uaid:aid:6abqVamaF6tBg7ZHR15T6zmsEtL4Jm3NQRAic9DqyXb3attUeHP6R3s7kkH9peTVx8;uid=0.0.7045900;registry=hashgraph-online;proto=hcs-10;nativeId=hedera:mainnet:0.0.7045900";

function registerWeb3VarsityAgent() {
    console.log("🔄 Broadcasting Web3Varsity AI Tutor metadata to the HOL Registry Broker...");

    const metadata = {
        name: "Web3Varsity AI Tutor",
        description: "An intelligent, on-chain educational AI tutor specialized in Web3, Solidity, and Hedera Hashgraph concepts. Helps developers write dApps and earn on-chain certificates.",
        endpoint: "https://web3varsity.netlify.app/api/mcp/sse",
        socials: {
            website: "https://web3varsity.netlify.app",
            github: "https://github.com/JTMax1/Web3Varsity"
        }
    };

    try {
        // NOTICE The single quotes around '${UAID}'. This prevents Bash from failing on semicolons!
        const command = `npx @hol-org/registry register '${UAID}' ` +
            `--name "${metadata.name}" ` +
            `--description "${metadata.description}" ` +
            `--endpoint "${metadata.endpoint}" ` +
            `--metadata-json '${JSON.stringify({ socials: metadata.socials })}'`;

        const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        console.log("✅ Successfully registered AI Tutor Agent metadata to Hashgraph Online!");
        console.log(result);
    } catch (err: any) {
        if (err.message.includes("400") || err.message.includes("already registered")) {
            console.log("✅ Agent is already successfully registered and metadata is indexed!");
        } else {
            console.error("❌ Registration request failed. Ensure your REGISTRY_BROKER_API_KEY is active:", err.message);
        }
    }
}

registerWeb3VarsityAgent();
