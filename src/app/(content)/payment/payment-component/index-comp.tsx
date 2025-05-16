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
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getAccount,
} from "@solana/spl-token";
import apiRequest from "@/utils/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { GetDonorInfoData } from "@/utils/type";
import { Skeleton } from "@/components/ui/skeleton";

// USDC mint address on Solana devnet
const USDC_DEVNET_MINT = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
);

export default function PaymentPageComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publicKey, wallet, connected, sendTransaction, signTransaction } =
    useWallet();
  const { connection } = useConnection();

  // State variables
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);

  const [manualPaymentLoading, setManualPaymentLoading] = useState(false);
  const [donateId, setDonateId] = useState("");

  const [fundraiser, setFundraiser] = useState({
    title: "",
    imageUrl: "",
    fundraiserId: "",
  });

  const [donorInfo, setDonorInfo] = useState<GetDonorInfoData>({
    walletAddress: "",
    amount: 0,
    note: "",
    name: "",
    _id: "",
    email: "",
    anonymous: false,
  });

  const handleReRoutePaymentComplete = async () => {
    if (paymentCompleted && fundraiser.fundraiserId) {
      const timer = setTimeout(() => {
        router.push(`/fundraiser/${fundraiser.fundraiserId}`);

        localStorage.removeItem("fundraiserDetails");
        localStorage.removeItem("donateId");
        localStorage.setItem("paymentCompleted", 'true');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }

  useEffect(() => {
    const donateIdFromStorage = localStorage.getItem("donateId");
    const donateIdFromParams = searchParams.get("donateId");
    const idToUse = donateIdFromParams || donateIdFromStorage;

    if (idToUse) {
      setDonateId(idToUse);
      if (donateIdFromParams && !donateIdFromStorage) {
        localStorage.setItem("donateId", donateIdFromParams);
      }
    }

    const storedDetails = localStorage.getItem("fundraiserDetails");

    if (storedDetails) {
      try {
        const fundraiserDetails = JSON.parse(storedDetails);
        setFundraiser({
          title: fundraiserDetails.title || "",
          imageUrl: fundraiserDetails.imageUrl || "",
          fundraiserId: fundraiserDetails.fundraiserId || "",
        });
      } catch (e) {
        console.error("Error parsing fundraiser details:", e);
      }
    }
  }, [searchParams]);

  const fetchDonorInfo = async () => {
    if (!donateId) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        "GET",
        `/fundraise/donate/info/${donateId}`
      );

      if (response.success) {
        setDonorInfo(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch fundraiser details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching fundraiser details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    await Promise.all([fetchDonorInfo()]);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted && fundraiser.fundraiserId && donateId) {
      initializeData();
    }
    return () => {
      mounted = false;
    };
  }, [fundraiser.fundraiserId, donateId]);

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

  const handlePaymentComplete = async () => {
    setManualPaymentLoading(true);
    try {
      const response = await apiRequest("GET", `/fundraise/donate/check/${donateId}`,);
      console.log(response)

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Payment confirmed successfully",
        });
        setPaymentCompleted(true);
        handleReRoutePaymentComplete()
        localStorage.setItem(`paymentCompleted_${donateId}`, 'true');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to confirm payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      setManualPaymentLoading(false);
      toast({
        title: "Error",
        description: "An error occurred while confirming payment",
      })
    } finally { setManualPaymentLoading(false); }
  };

  const sendUSDC = async () => {
    try {
      setPaymentProcessing(true);

      if (!connected || !publicKey || !signTransaction) {
        throw new Error("Wallet not connected");
      }

      const senderPublicKey = publicKey;
      const recipientPublicKey = new PublicKey(donorInfo.walletAddress);

      const senderATA = getAssociatedTokenAddressSync(
        USDC_DEVNET_MINT,
        senderPublicKey
      );

      const recipientATA = getAssociatedTokenAddressSync(
        USDC_DEVNET_MINT,
        recipientPublicKey
      );

      const createRecipientATAIx = createAssociatedTokenAccountInstruction(
        senderPublicKey, // payer
        recipientATA, // ATA to create
        recipientPublicKey, // owner of the new ATA
        USDC_DEVNET_MINT
      );

      const transferIx = createTransferInstruction(
        senderATA,
        recipientATA,
        senderPublicKey,
        Number(donorInfo.amount) * 1_000_000 // USDC has 6 decimals
      );

      let recipientAccountInfo = await connection.getAccountInfo(recipientATA);

      const latestBlockhash = await connection.getLatestBlockhash();
      const tx = new Transaction({
        feePayer: senderPublicKey,
        recentBlockhash: latestBlockhash.blockhash,
      });

      // Only add the create ATA instruction if the account does not exist
      if (!recipientAccountInfo) {
        tx.add(createRecipientATAIx);
      }

      tx.add(transferIx);

      const signedTx = await signTransaction(tx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txid, "confirmed");

      console.log("✅ Sent USDC on devnet! Tx ID:", txid);
      localStorage.setItem("paymentCompleted", 'true');
      setPaymentProcessing(false);
      handlePaymentComplete()
      return txid;
    } catch (error) {
      console.error("Transaction failed", error);
      setPaymentProcessing(false);
    }
  };

  //   const sendSolFun = async () => {
  //   try {
  //     if (!publicKey) {
  //       console.error("Wallet not connected");
  //       return;
  //     }

  //     setPaymentProcessing(true);

  //     const recipientPubKey = new PublicKey(donorInfo.walletAddress);
  //     const senderPublicKey = publicKey;

  //     const senderATA = await getAssociatedTokenAddress(
  //       USDC_DEVNET_MINT,
  //       senderPublicKey
  //     );
  //     const recipientATA = await getAssociatedTokenAddress(
  //       USDC_DEVNET_MINT,
  //       recipientPubKey
  //     );

  //     const transferIx = createTransferInstruction(
  //       senderATA,
  //       recipientATA,
  //       senderPublicKey,
  //       50 * 1_000_000
  //     );

  //     const transaction = new Transaction().add(transferIx);

  //     const signature = await sendTransaction(transaction, connection);
  //     console.log(`Transaction signature: ${signature}`);
  //     setPaymentProcessing(false);

  //   } catch (error) {
  //     console.error("Transaction failed", error);
  //   }
  // };

  const ContentSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4 bg-[#f2bd74]/10" />
      <Skeleton className="h-4 w-1/2 bg-[#f2bd74]/10" />
      <Skeleton className="h-4 w-5/6 bg-[#f2bd74]/10" />
    </div>
  );

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
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-md bg-[#f2bd74]/10" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-[#f2bd74]/10" />
                      <Skeleton className="h-4 w-1/2 bg-[#f2bd74]/10" />
                    </div>
                  </div>
                ) : (
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
                          ${donorInfo.amount} USDC
                        </span>
                      </p>
                    </div>
                  </div>
                )}
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
                {loading ? (
                  <ContentSkeleton />
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white line-clamp-1">
                        {donorInfo.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white line-clamp-1">
                        {donorInfo.email}
                      </span>
                    </div>
                    {donorInfo.note && (
                      <div className="pt-2">
                        <span className="text-gray-400 block mb-1">Note:</span>
                        <p className="text-sm bg-[#0a1a2f] p-3 rounded-md border border-[#f2bd74]/10 text-white/80">
                          "{donorInfo.note}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-[#0a1a2f]/70 border border-[#f2bd74]/20 backdrop-blur-sm text-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-rajdhani font-medium text-[#f2bd74]">
                    Payment Method
                  </h2>
                  <Badge className="bg-gradient-to-r from-[#bd0e2b]/80 to-[#f2bd74]/80 text-white border-0">
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
                        ${donorInfo.amount} USDC
                      </span>{" "}
                      to the following address:
                    </p>
                    {loading ? (
                      <Skeleton className="h-12 w-full bg-[#f2bd74]/10" />
                    ) : (
                      <div className="bg-[#0a1a2f] p-3 rounded-md flex items-center justify-between border border-[#f2bd74]/20">
                        <code className="text-xs md:text-sm break-all text-white/80">
                          {donorInfo.walletAddress}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-[#f2bd74] hover:text-white hover:bg-[#f2bd74]/10"
                          onClick={() =>
                            copyToClipboard(donorInfo.walletAddress)
                          }
                        >
                          {copiedAddress ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
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
                                `https://explorer.solana.com/address/${donorInfo.walletAddress}?cluster=devnet`,
                                "_blank"
                              )
                            }
                            disabled={loading || !donorInfo.walletAddress}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Address on Explorer
                          </Button>

                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => {
                              sendUSDC();
                            }}
                            disabled={
                              paymentProcessing ||
                              loading ||
                              !donorInfo.walletAddress
                            }
                          >
                            {paymentProcessing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                Send ${donorInfo.amount} USDC{" "}
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
                            disabled={loading}
                          >
                            {manualPaymentLoading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                I've Made the Payment{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
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
                              Redirecting you back to the fundraiser in 5 seconds...
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
