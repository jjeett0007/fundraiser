"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// USDC mint address on Solana devnet
const USDC_DEVNET_MINT = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

export default function PaymentPageComponent() {
  const router = useRouter();
  const { publicKey, wallet, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const searchParams = useSearchParams();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const userData = useSelector((state: RootState) => state.userData);

  // Get parameters from URL
  const amount = searchParams.get("amount") || "0";
  const fundraiserId = searchParams.get("fundraiserId") || "";
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const note = searchParams.get("note") || "";
  const isAnonymous = searchParams.get("isAnonymous") === "true";

  // Mock fundraiser data - in a real app, you would fetch this based on fundraiserId
  const [fundraiser, setFundraiser] = useState({
    title: "Medical Emergency Support for Sarah",
    walletAddress: "H1pyQiBHh34PxpcKqtHV5MbJkfgx31Uj9bEsFp6Js2Bz",
    imageUrl:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=80",
  });

  useEffect(() => {
    if (!publicKey) {
      setWalletConnected(false);
      setWalletType("");
      setWalletAddress("");
    }

    if (publicKey) {
      setWalletConnected(true);
      setWalletType(wallet?.adapter.name || "");
      setWalletAddress(publicKey.toString());
    }
  }, [publicKey, wallet]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);

    // In a real app, you would send the payment confirmation to your backend here

    // Redirect to fundraiser page after 3 seconds
    setTimeout(() => {
      router.push(`/fundraiser/${fundraiserId}`);
    }, 3000);
  };

  const sendUSDC = async () => {
    try {
      setPaymentProcessing(true);

      if (!publicKey) {
        console.error("Wallet not connected");
        return;
      }

      const recipientPubKey = new PublicKey(fundraiser.walletAddress);
      const senderPublicKey = publicKey;

      const senderATA = await getAssociatedTokenAddress(
        USDC_DEVNET_MINT,
        senderPublicKey
      );
      const recipientATA = await getAssociatedTokenAddress(
        USDC_DEVNET_MINT,
        recipientPubKey
      );

      const transferIx = createTransferInstruction(
        senderATA,
        recipientATA,
        senderPublicKey,
        Number(amount) * 1_000_000 // USDC has 6 decimals
      );

      const transaction = new Transaction().add(transferIx);

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
      setTransactionHash(signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      if (confirmation) {
        setPaymentProcessing(false);
        setPaymentCompleted(true);

        // Redirect to fundraiser page after 3 seconds
        setTimeout(() => {
          router.push(`/fundraiser/${fundraiserId}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Transaction failed", error);
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#bd0e2b] to-[#f2bd74] opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#4338CA] to-[#6366F1] opacity-5 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-10 lg:px-14 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-rajdhani md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#f2bd74]">
            Complete Your Contribution
          </h1>

          <div className="grid gap-6">
            {/* Fundraiser Summary */}
            <Card className="bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-medium font-rajdhani text-[#f2bd74]">
                  Fundraiser Details
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-[#f2bd74]/30">
                    <Image
                      src={fundraiser.imageUrl || "/placeholder.svg"}
                      alt={fundraiser.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      {fundraiser.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      Contribution Amount:{" "}
                      <span className="font-semibold text-[#f2bd74]">
                        ${amount} USDC
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donor Information */}
            <Card className="bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-rajdhani font-medium text-[#f2bd74]">
                  Donor Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white  line-clamp-1">
                      {userData.profile.firstName} {userData.profile.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white line-clamp-1">{userData.email}</span>
                  </div>
                  {note && (
                    <div className="pt-2">
                      <span className="text-gray-400 block mb-1">Note:</span>
                      <p className="text-sm bg-[#0a1a2f] p-3 rounded-md border border-[#f2bd74]/10 text-white/80">
                        "{note}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-rajdhani font-medium text-[#f2bd74]">
                    Payment Method
                  </h2>
                  <Badge className=" bg-gradient-to-r from-[#bd0e2b]/80 to-[#f2bd74]/80 text-white border-0">
                    USDC
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-2">
                      Send exactly{" "}
                      <span className="font-semibold text-[#f2bd74]">
                        ${amount} USDC
                      </span>{" "}
                      to the following address:
                    </p>
                    <div className="bg-[#0a1a2f] p-3 rounded-md flex items-center justify-between border border-[#f2bd74]/20">
                      <code className="text-xs md:text-sm break-all text-white/80">
                        {fundraiser.walletAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-[#f2bd74] hover:text-white hover:bg-[#f2bd74]/10"
                        onClick={() =>
                          copyToClipboard(fundraiser.walletAddress)
                        }
                      >
                        {copiedAddress ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-[#f2bd74]/20" />

                  <div>
                    <p className="text-sm mb-4 text-white/80">
                      Connect your wallet to make the payment:
                    </p>
                    <div className="bg-[#0a1a2f] p-4 rounded-lg border border-[#f2bd74]/20 mb-4">
                      <div className="flex items-center text-[#f2bd74] mb-2">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="text-sm font-rajdhani font-medium">
                          Secure Blockchain Transaction
                        </span>
                      </div>
                      <p className="text-xs text-white/70">
                        Your contribution will be sent directly to the
                        recipient's wallet through a secure blockchain
                        transaction.
                      </p>
                    </div>
                    <div className="flex gap-2 flex-col md:flex-row ">
                      <WalletMultiButton
                        style={{
                          background: "#0a1a2f",
                          color: "#f2bd74",
                          border: "1px solid #f2bd74",
                          padding: "0px 15px",
                          borderRadius: "0.5rem",
                          fontSize: "14px",
                          margin: 0,
                          width: "100%",
                        }}
                      />

                      {connected && (
                        <div className="bg-[#0a1a2f] p-3.5 rounded-md flex items-center border border-[#f2bd74]/30">
                          <CheckCircle2 className="h-5 w-5 text-[#f2bd74] mr-2" />
                          <p className="text-sm text-white">
                            Connected to{" "}
                            <span className="font-medium text-[#f2bd74]">
                              {wallet?.adapter.name}
                            </span>{" "}
                            wallet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {connected && (
                    <div className="space-y-4">
                      {!paymentCompleted ? (
                        <div className="space-y-4">
                          <Button
                            className="w-full bg-[#0a1a2f] hover:bg-[#0a1a2f]/80 text-[#f2bd74] border border-[#f2bd74]/30 hover:text-white"
                            onClick={() =>
                              window.open(
                                `https://explorer.solana.com/address/${fundraiser.walletAddress}?cluster=devnet`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Address on Explorer
                          </Button>

                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={sendUSDC}
                            disabled={paymentProcessing}
                          >
                            {paymentProcessing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                Send ${amount} USDC{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>

                          <div className="relative w-full flex items-center justify-center py-4">
                            <div className="border-b w-full border-[#60606093]"></div>
                            <div className="absolute px-[1rem] bg-primary rounded-full border border-[#60606093] text-[13px] w-fit font-medium text-[#888]">
                              OR
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={handlePaymentComplete}
                          >
                            I've Made the Payment Manually
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-[#0a1a2f] to-[#0c2240] p-6 rounded-xl border border-[#f2bd74]/20">
                          <div className="flex flex-col items-center justify-center py-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 flex items-center justify-center mb-4">
                              <CheckCircle2 className="h-8 w-8 text-[#f2bd74]" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-[#f2bd74]">
                              Thank You for Your Contribution!
                            </h3>
                            <p className="text-sm text-center text-white/80 mb-4">
                              Your support will make a real difference.
                            </p>

                            {transactionHash && (
                              <div className="w-full bg-[#0a1a2f] p-3 rounded-md text-xs text-white/70 mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span>Transaction Hash:</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-[#f2bd74]"
                                    onClick={() =>
                                      copyToClipboard(transactionHash)
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                                <code className="break-all">
                                  {transactionHash}
                                </code>
                              </div>
                            )}

                            <p className="text-sm text-white/60">
                              Redirecting you back to the fundraiser...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-400 border-t border-[#f2bd74]/20 pt-4">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#f2bd74] mt-0.5 flex-shrink-0" />
                  <p>
                    Please ensure you send the exact amount from your connected
                    wallet. Transactions may take a few minutes to process on
                    the blockchain.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
