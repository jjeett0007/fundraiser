"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Wallet } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletConnectProps {
  onConnect?: (walletType: string, address: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function WalletConnect({
  onConnect = () => {},
  onClose = () => {},
  isOpen = false,
}: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletType: string) => {
    setSelectedWallet(walletType);
    setConnecting(true);
    setError(null);

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful connection
      const mockAddress =
        walletType === "phantom"
          ? "8xft7yuy3kM71oFm7r3q9pxTXuMA5rUJz7q7FbCY9h9Z"
          : "5Zzguz8bZ8GHvZmAiMnQHBJbWNPQ";

      setSuccess(true);
      setConnecting(false);

      // Notify parent component of successful connection
      setTimeout(() => {
        onConnect(walletType, mockAddress);
      }, 1000);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      setConnecting(false);
    }
  };

  const handleClose = () => {
    setConnecting(false);
    setError(null);
    setSuccess(false);
    setSelectedWallet(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to the fundraising platform
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">Successfully Connected!</h3>
              <p className="text-sm text-gray-500 mt-2">
                Your {selectedWallet} wallet is now connected
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <Card
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${selectedWallet === "phantom" && connecting ? "border-primary" : ""}`}
                onClick={() => !connecting && handleConnect("phantom")}
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <img
                      src="https://phantom.app/img/phantom-logo.svg"
                      alt="Phantom"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Phantom</h3>
                    <p className="text-sm text-gray-500">
                      Connect to Phantom wallet
                    </p>
                  </div>
                  {connecting && selectedWallet === "phantom" && (
                    <div className="ml-auto animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  )}
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${selectedWallet === "backpack" && connecting ? "border-primary" : ""}`}
                onClick={() => !connecting && handleConnect("backpack")}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Wallet className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Backpack</h3>
                    <p className="text-sm text-gray-500">
                      Connect to Backpack wallet
                    </p>
                  </div>
                  {connecting && selectedWallet === "backpack" && (
                    <div className="ml-auto animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-2">
          {!connecting && !success && (
            <p className="text-xs text-gray-500 text-center">
              By connecting your wallet, you agree to the Terms of Service and
              Privacy Policy
            </p>
          )}
          {success && (
            <Button onClick={handleClose} className="w-full">
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
