"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertCircle,
  Shield,
  ArrowRight,
  QrCode,
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
import QRCodeStyling from "qr-code-styling";
import apiRequest from "@/utils/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { GetDonorInfoData } from "@/utils/type";
import { Skeleton } from "@/components/ui/skeleton";
import CountDownIllustration from "@/components/customs/CountDownIllustration";
import QRCode from "react-qr-code";

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

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const [manualPaymentLoading, setManualPaymentLoading] = useState(false);
  const [donateId, setDonateId] = useState("");

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

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

  const qrValue = donorInfo.walletAddress;

  useEffect(() => {
    if (paymentCompleted && fundraiser.fundraiserId) {
      const timer = setTimeout(() => {
        router.push(
          `/fundraiser/${fundraiser.fundraiserId}?paymentSuccessful=true`
        );

        localStorage.removeItem("fundraiserDetails");
        localStorage.removeItem("donateId");
        localStorage.removeItem("walletName");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentCompleted, fundraiser.fundraiserId, router]);

  useEffect(() => {
    localStorage.removeItem("walletName");
  }, []);

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
      const response = await apiRequest(
        "GET",
        `/fundraise/donate/check/${donateId}`
      );

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Payment confirmed successfully",
        });
        setPaymentCompleted(true);
        // Removed the direct call to handleReRoutePaymentComplete
        // The redirect will now be handled by the useEffect above
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to confirm payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while confirming payment",
        variant: "destructive",
      });
    } finally {
      setManualPaymentLoading(false);
    }
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
        senderPublicKey,
        recipientATA,
        recipientPublicKey,
        USDC_DEVNET_MINT
      );

      const transferIx = createTransferInstruction(
        senderATA,
        recipientATA,
        senderPublicKey,
        Number(donorInfo.amount) * 1_000_000
      );

      let recipientAccountInfo = await connection.getAccountInfo(recipientATA);

      const latestBlockhash = await connection.getLatestBlockhash();
      const tx = new Transaction({
        feePayer: senderPublicKey,
        recentBlockhash: latestBlockhash.blockhash,
      });

      if (!recipientAccountInfo) {
        tx.add(createRecipientATAIx);
      }

      tx.add(transferIx);

      const signedTx = await signTransaction(tx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txid, "confirmed");
      setTransactionHash(txid);

      // Show countdown before completing payment
      setShowCountdown(true);
      setCountdown(15);

      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowCountdown(false);
            setPaymentProcessing(false);
            handlePaymentComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return txid;
    } catch (error) {
      console.error("Transaction failed", error);
      setPaymentProcessing(false);
      setShowCountdown(false);
    }
  };

  const ContentSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4 bg-[#f2bd74]/10" />
      <Skeleton className="h-4 w-1/2 bg-[#f2bd74]/10" />
      <Skeleton className="h-4 w-5/6 bg-[#f2bd74]/10" />
    </div>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
                          {formatCurrency(donorInfo.amount)} USDC
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
                        {formatCurrency(donorInfo.amount)} USDC
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
                        <div className="flex gap-2 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#f2bd74] hover:text-white hover:bg-[#f2bd74]/10"
                            onClick={() => setQrDialogOpen(true)}
                            disabled={!donorInfo.walletAddress}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#f2bd74] hover:text-white hover:bg-[#f2bd74]/10"
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
                      {showCountdown ? (
                        <CountDownIllustration countdown={countdown} />
                      ) : !paymentCompleted ? (
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
                                Processing Transaction...
                              </>
                            ) : (
                              <>
                                Send {formatCurrency(donorInfo.amount)} USDC{" "}
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

                            <p className="text-sm font-rajdhani font-medium text-white">
                              Redirecting you back to the fundraiser in 5
                              seconds...
                            </p>
                            <div className="flex justify-center space-x-1 mt-2">
                              <div className="w-2 h-2 bg-[#f2bd74] rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-[#f2bd74] rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-[#f2bd74] rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                        I've Made the Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
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

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="md:max-w-[50%] max-w-[90%] lg:max-w-[30%] bg-[#0a1a2f] border border-[#f2bd74]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#f2bd74] font-rajdhani">
              Payment QR Code
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Scan this QR code with your Solana wallet to send{" "}
              {formatCurrency(donorInfo.amount)} USDC
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCode
                value={qrValue}
                size={200}
                level="H"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
            <div className="w-full bg-[#0c2240] p-3 rounded-md border border-[#f2bd74]/20">
              <p className="text-xs text-gray-400 mb-1">Wallet Address:</p>
              <div className="flex items-center justify-between">
                <code className="text-xs break-all text-white/80 mr-2">
                  {donorInfo.walletAddress}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#f2bd74] hover:text-white hover:bg-[#f2bd74]/10 flex-shrink-0"
                  onClick={() => copyToClipboard(donorInfo.walletAddress)}
                >
                  {copiedAddress ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#f2bd74] font-semibold">
                Amount: {formatCurrency(donorInfo.amount)} USDC
              </p>
              <p className="text-xs text-white/60 mt-1">
                Please send the exact amount to complete your contribution
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
