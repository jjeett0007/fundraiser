// lib/heliusManager.ts
import { WebSocket as NodeWS } from "ws";
import { Server } from "http";
import { USDC_DEVNET_MINT } from "@/lib/constants";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const HELIUS_WS_URL = `wss://devnet.helius-rpc.com?api-key=${HELIUS_API_KEY}`;

// Global state to track clients and listeners
const walletClients = new Map<string, Set<WebSocket>>();
const walletSubscriptions = new Set<string>();

let heliusSocket: NodeWS;

function initHeliusSocket() {
    heliusSocket = new NodeWS(HELIUS_WS_URL);

    heliusSocket.on("open", () => {
        console.log("🔗 Connected to Helius WebSocket");
        for (const address of Array.from(walletSubscriptions)) {
            subscribeToAddress(address);
        }
    });

    heliusSocket.on("message", (data) => {
        const msg = JSON.parse(data.toString());
        const logs = msg?.params?.result?.transaction?.meta?.postTokenBalances || [];

        logs.forEach((entry: any) => {
            if (entry.mint === USDC_DEVNET_MINT) {
                const targetWallet = entry.owner;
                if (walletClients.has(targetWallet)) {
                    const clients = walletClients.get(targetWallet)!;
                    Array.from(clients).forEach(ws => {
                        ws.send(JSON.stringify({
                            type: "usdc_deposit",
                            wallet: targetWallet,
                            amount: entry.uiTokenAmount.uiAmountString,
                        }));
                    });
                }
            }
        });
    });

    heliusSocket.on("error", (err) => {
        console.error("🔴 Helius WS Error:", err);
    });

    heliusSocket.on("close", () => {
        console.warn("🛑 Helius WS closed. Reconnecting in 3s...");
        setTimeout(() => initHeliusSocket(), 3000);
    });
}

function subscribeToAddress(address: string) {
    if (heliusSocket.readyState !== NodeWS.OPEN) return;

    const sub = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "transactionSubscribe",
        params: [
            {
                mentions: [address],
            },
            {
                commitment: "confirmed",
                encoding: "jsonParsed",
            },
        ],
    };
    heliusSocket.send(JSON.stringify(sub));
}

export const HeliusManager = {
    subscribeToWallet(address: string) {
        if (!walletSubscriptions.has(address)) {
            walletSubscriptions.add(address);
            subscribeToAddress(address);
        }
    },

    addClient(address: string, ws: WebSocket) {
        if (!walletClients.has(address)) {
            walletClients.set(address, new Set());
        }
        walletClients.get(address)!.add(ws);
    },

    removeClient(address: string, ws: WebSocket) {
        walletClients.get(address)?.delete(ws);
    },
};

initHeliusSocket();
