// app/api/ws/route.ts
import { HeliusManager } from "@/lib/heliusmanager";

export const config = {
    unstable_allowDynamic: true,
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");
    const { socket, response } = Deno.upgradeWebSocket!(req);

    if (!wallet) {
        socket.close(1008, "Wallet address required");
        return;
    }

    socket.onopen = () => {
        HeliusManager.addClient(wallet, socket);
        console.log(`✅ WebSocket client connected for wallet ${wallet}`);
    };

    socket.onclose = () => {
        HeliusManager.removeClient(wallet, socket);
        console.log(`❌ WebSocket client disconnected for wallet ${wallet}`);
    };

    return response;
}
