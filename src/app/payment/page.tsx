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
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import WalletConnect from "@/components/wallet/WalletConnect";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Get parameters from URL
  const amount = searchParams.get("amount") || "0";
  const fundraiserId = searchParams.get("fundraiserId") || "";
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const note = searchParams.get("note") || "";
  const isAnonymous = searchParams.get("isAnonymous") === "true";

  // Mock fundraiser data - in a real app, you would fetch this based on fundraiserId
  const fundraiser = {
    title: "Medical Emergency Support for Sarah",
    walletAddress: "8xj7dkE9JDkf82jS6Qgp2H7K5uyJM9N1X2L",
    imageUrl:
      "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800&q=80",
  };

  const handleWalletConnect = (type: string, address: string) => {
    setWalletConnected(true);
    setWalletType(type);
    setWalletAddress(address);
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);

    // In a real app, you would send the payment confirmation to your backend here

    // Redirect to fundraiser page after 2 seconds
    setTimeout(() => {
      router.push(`/fundraiser/${fundraiserId}`);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Complete Your Contribution</h1>

        <div className="grid gap-6">
          {/* Fundraiser Summary */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-medium">Fundraiser Details</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={fundraiser.imageUrl}
                    alt={fundraiser.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{fundraiser.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Contribution Amount:{" "}
                    <span className="font-semibold text-primary">
                      ${amount}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donor Information */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-medium">Donor Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{isAnonymous ? "Anonymous" : name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{email}</span>
                </div>
                {note && (
                  <div className="pt-2">
                    <span className="text-muted-foreground block mb-1">
                      Note:
                    </span>
                    <p className="text-sm bg-muted/30 p-2 rounded-md">
                      "{note}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-medium">Payment Method</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Badge className="mb-2">USDC</Badge>
                  <p className="text-sm text-muted-foreground mb-2">
                    Send exactly{" "}
                    <span className="font-semibold">${amount} USDC</span> to the
                    following address:
                  </p>
                  <div className="bg-muted/30 p-3 rounded-md flex items-center justify-between">
                    <code className="text-xs md:text-sm break-all">
                      {fundraiser.walletAddress}
                    </code>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {!walletConnected ? (
                  <div>
                    <p className="text-sm mb-2">
                      Connect your wallet to make the payment:
                    </p>
                    <WalletConnect onConnect={handleWalletConnect} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-3 rounded-md flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm">
                        Connected to{" "}
                        {walletType.charAt(0).toUpperCase() +
                          walletType.slice(1)}{" "}
                        wallet
                      </p>
                    </div>

                    {!paymentCompleted ? (
                      <div className="space-y-4">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `https://explorer.solana.com/address/${fundraiser.walletAddress}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Address on Explorer
                        </Button>

                        <Button
                          className="w-full bg-[#FF3A20] hover:bg-[#FF3A20]/90"
                          onClick={handlePaymentComplete}
                        >
                          I've Made the Payment
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                        <h3 className="font-medium">
                          Thank You for Your Contribution!
                        </h3>
                        <p className="text-sm text-center text-muted-foreground mt-1">
                          Redirecting you back to the fundraiser...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <p>
                Note: Please ensure you send the exact amount from your
                connected wallet. Transactions may take a few minutes to
                process.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
