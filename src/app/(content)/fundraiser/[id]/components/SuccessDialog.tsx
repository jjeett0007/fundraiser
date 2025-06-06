"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";

const SuccessDialog = ({
  isOpen,
  onClose,
  fundraiserTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  fundraiserTitle: string;
}) => {
  if (!isOpen) return null;

 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-full max-w-md">
        <DialogTitle></DialogTitle>
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#bd0e2b]/20 to-[#f2bd74]/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-[#f2bd74]" />
          </div>

          <h2 className="text-2xl font-rajdhani font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f2bd74]">
            Donation Successful!
          </h2>

          <p className="text-gray-300 mb-4">
            Thank you for your generous contribution to "{fundraiserTitle}".
          </p>

          <div className="w-full p-4 bg-[#0a1a2f]/50 rounded-lg border border-[#f2bd74]/20 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status</span>
              <span className="text-green-400 flex items-center">
                <Zap className="h-4 w-4 mr-1" /> Confirmed
              </span>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={onClose} 
            variant={"outline"}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
