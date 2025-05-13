"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AppInput from "@/components/customs/AppInput";

const UserInfoDialog = ({
  isOpen,
  onClose,
  onSubmit,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userInfo: {
    name: string;
    email: string;
    note: string;
    isAnonymous: boolean;
    amount: number;
  }) => void;
  userData: { profile: { displayName: string }; email: string } | null;
}) => {
  const [name, setName] = useState(userData?.profile?.displayName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [note, setNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 w-full max-w-md">

        <DialogHeader >
          <DialogTitle >
            User Information
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Please provide your information to proceed with the donation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#f2bd74]">
              Name
            </label>
            <AppInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#f2bd74]">
              Email
            </label>
            <AppInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#f2bd74]">
              Note (Optional)
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note"
              className="bg-[#0a1a2f]/50 border-[#f2bd74]/30 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2 accent-[#f2bd74]"
            />
            <label htmlFor="anonymous" className="text-gray-300">
              Make donation anonymous
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6 relative z-10">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#f2bd74]/30 text-[#f2bd74] hover:bg-[#f2bd74]/10 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({ name, email, note, isAnonymous, amount: 0 })
            }
          >
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoDialog;
