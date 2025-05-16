"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Edit } from "lucide-react";
import { isValidInput, validateInputs } from "@/utils/formValidation";
import apiRequest from "@/utils/apiRequest";
import AppInput from "@/components/customs/AppInput";
import { ValidationErrors } from "@/utils/type";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setData } from "@/store/slice/userDataSlice";
import { CountrySelector } from "@/components/customs/CountrySelection";

const EditProfile = () => {
  const [error, setError] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const userData = useSelector((state: RootState) => state.userData);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

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
          description:
            response.message || "Your profile has been updated successfully.",
        });
        const res = await apiRequest("GET", "/user");

        dispatch(
          setData({
            ...res.data,
          })
        );
        setOpen(false);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message || "Failed to update profile",
        });
        setIsLoading(false);
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
    <div>
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
                  type="text"
                  error={error.firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
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
                  type="text"
                  error={error.lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
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
                type="text"
                error={error.displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
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
                  {country && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
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
                    {state && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </Label>
                  <AppInput
                    id="state"
                    placeholder="e.g Lagos"
                    type="text"
                    error={error.state}
                    onChange={(e) => setState(e.target.value)}
                    value={state}
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
                    {city && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </Label>
                  <AppInput
                    id="city"
                    placeholder="e.g Ikeja"
                    type="text"
                    error={error.city}
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
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
    </div>
  );
};

export default EditProfile;
