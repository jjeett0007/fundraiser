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
import SubHeading from "@/components/customs/SubHeading";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setData } from "@/store/slice/userDataSlice";

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
        <DialogTrigger>
          <Button
            variant="secondary"
            className="absolute flex m-3 gap-2 top-0 right-0"
          >
            <Edit className="h-4 w-4" /> Edit Profile
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
            <div className="gap-2 w-full flex flex-col md:flex-row items-center">
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="firstName"
                  className="flex items-center justify-between"
                >
                  <span>First Name</span>
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
                  disabled
                />
              </div>
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="lastName"
                  className="flex items-center justify-between"
                >
                  <span>Last Name</span>
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
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label
                htmlFor="displayName"
                className="flex items-center justify-between"
              >
                <span>Display Name</span>
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

            <div className="flex flex-col gap-2">
              <SubHeading label={"EDIT ADDRESS"} />

              <div className="space-y-2 w-full">
                <Label
                  htmlFor="country"
                  className="flex items-center justify-between"
                >
                  <span>Country</span>
                  {country && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Label>
                <AppInput
                  id="country"
                  placeholder="e.g Nigeria"
                  type="text"
                  error={error.country}
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                />
              </div>
              <div className="gap-2 w-full flex flex-col md:flex-row items-center">
                <div className="space-y-2 w-full">
                  <Label
                    htmlFor="state"
                    className="flex items-center justify-between"
                  >
                    <span>State</span>
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
                    <span>City</span>
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
