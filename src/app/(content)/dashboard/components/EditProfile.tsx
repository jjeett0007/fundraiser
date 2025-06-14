"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";
import { setData } from "@/store/slice/userDataSlice";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Edit, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import AppInput from "@/components/customs/AppInput";
import { CountrySelector } from "@/components/customs/CountrySelection";

import { isValidInput, validateInputs } from "@/utils/formValidation";
import apiRequest from "@/utils/apiRequest";
import { ValidationErrors } from "@/utils/type";

const EditProfile = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const userData = useSelector((state: RootState) => state.userData);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarUpload, setAvatarUpload] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationErrors>({});

  useEffect(() => {
    if (open) {
      setFirstName(userData.profile?.firstName || "");
      setLastName(userData.profile?.lastName || "");
      setDisplayName(userData.profile?.displayName || "");
      setCountry(userData.address?.country || "");
      setState(userData.address?.state || "");
      setCity(userData.address?.city || "");
    }
  }, [open, userData]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Upload Error",
        description: "Please select an image file to upload",
      });
      return;
    }

    setAvatarLoading(true);

    try {
      const base64String = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const uploadResponse = await apiRequest("POST", "/upload/file", {
        file: base64String,
      });

      if (!uploadResponse.success) {
        toast({
          title: "Error",
          variant: "destructive",
          description: uploadResponse.message || "Failed to upload image",
        });
        return;
      }

      setAvatar(base64String);
      setAvatarUpload(uploadResponse.data.link);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        variant: "destructive",
        description: error.message || "Failed to update avatar",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleEditProfile = async () => {
    setIsLoading(true);
    try {
      const errors = validateInputs({
        displayName,
        country,
        state,
        city,
      });

      const requiredFields = ["displayName", "country", "state", "city"];
      if (!isValidInput(errors, requiredFields)) {
        setError(errors);
        setIsLoading(false);
        return;
      }

      setError({});

      const payload = {
        avatar: avatarUpload,
        profileInfo: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          displayName: displayName.trim(),
        },
        address: {
          country: country.trim(),
          state: state.trim(),
          city: city.trim(),
        },
      };

      const response = await apiRequest("PATCH", "/user", payload);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.message || "Profile updated successfully.",
        });

        const res = await apiRequest("GET", "/user");
        dispatch(setData(res.data));
        setOpen(false);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to update profile",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit className="h-4 w-4 mr-1" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[100dvh] md:max-w-[80%] lg:max-w-[60%] max-h-[100dvh] md:h-fit">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and address details.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto space-y-2">
          <div className="gap-4 w-full mb-2 flex flex-col md:flex-row items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border border-primaryGold overflow-hidden">
                <Image
                  src={
                    avatar ||
                    userData.profileImages?.avatar ||
                    "/placeholder.svg"
                  }
                  alt={userData.profile?.firstName || "User"}
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full"
                />
              </div>
              {avatarLoading ? (
                <div className="absolute flex items-center justify-center bottom-0 right-0 h-8 w-8 bg-primary border border-primaryGold rounded-full shadow-md">
                  <Loader2 className="w-5 h-5 text-primaryGold animate-spin" />
                </div>
              ) : (
                <div className="absolute flex items-center justify-center bottom-0 right-0 h-8 w-8 bg-primary border border-primaryGold rounded-full shadow-md">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatarUpload"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="avatarUpload" className="cursor-pointer">
                    <Edit className="h-4 w-4 text-primaryGold" />
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label
                htmlFor="firstName"
                className="flex items-center justify-between"
              >
                <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                  First Name
                </span>
                {firstName && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <AppInput
                id="firstName"
                placeholder="e.g John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={error.firstName}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label
                htmlFor="lastName"
                className="flex items-center justify-between"
              >
                <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                  Last Name
                </span>
                {lastName && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Label>
              <AppInput
                id="lastName"
                placeholder="e.g Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={error.lastName}
              />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label
              htmlFor="displayName"
              className="flex items-center justify-between"
            >
              <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                Display Name
              </span>
              {displayName && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </Label>
            <AppInput
              id="displayName"
              placeholder="e.g JohnDoe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={error.displayName}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-rajdhani mt-10 font-bold text-[#f2bd74]">
              Address Info
            </h2>

            <div className="space-y-2 w-full">
              <Label
                htmlFor="country"
                className="flex items-center justify-between"
              >
                <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                  Country
                </span>
                {country && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </Label>
              <CountrySelector
                value={country}
                onChange={setCountry}
                error={error.country}
              />
            </div>

            <div className="gap-4 mt-2 w-full flex flex-col md:flex-row items-center">
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="state"
                  className="flex items-center justify-between"
                >
                  <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                    State
                  </span>
                  {state && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <AppInput
                  id="state"
                  placeholder="e.g Lagos"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  error={error.state}
                />
              </div>

              <div className="space-y-2 w-full">
                <Label
                  htmlFor="city"
                  className="flex items-center justify-between"
                >
                  <span className="block text-sm font-medium text-[#f2bd74] font-rajdhani">
                    City
                  </span>
                  {city && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <AppInput
                  id="city"
                  placeholder="e.g Ikeja"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={error.city}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex item-center gap-2">
            <Button
              onClick={() => setOpen(false)}
              className="flex-1"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProfile}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
