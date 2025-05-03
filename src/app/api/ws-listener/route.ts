// app/api/ws-listener/route.ts
import { NextRequest, NextResponse } from "next/server";
import { WebSocket as NodeWS } from "ws";
import { HeliusManager } from "@/lib/heliusmanager";

export async function POST(req: NextRequest) {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
        return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
    }

    HeliusManager.subscribeToWallet(walletAddress);

    return NextResponse.json({ status: "listening" });
}
