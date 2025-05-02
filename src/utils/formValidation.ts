export const validateEmail = (
  email: string
): { isValid: boolean; message?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email.trim()) {
    return { isValid: false, message: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  return { isValid: true };
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  message?: string;
  strength?: "weak" | "medium" | "strong";
} => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
      strength: "weak",
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    const missing = [];
    if (!hasUpperCase) missing.push("uppercase letter");
    if (!hasLowerCase) missing.push("lowercase letter");
    if (!hasNumber) missing.push("number");
    if (!hasSpecialChar) missing.push("special character");

    const missingStr = missing.join(", ");
    return {
      isValid: false,
      message: `Password must include at least one ${missingStr}`,
      strength: missing.length > 2 ? "weak" : "medium",
    };
  }

  return { isValid: true, strength: "strong" };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true };
};

export const validateName = (
  name: string,
  fieldName: string = "Name"
): { isValid: boolean; message?: string } => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: `${fieldName} contains invalid characters`,
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      message: `${fieldName} is too long (maximum 50 characters)`,
    };
  }

  return { isValid: true };
};

export const validateOTP = (
  otp: string,
  length: number = 6
): { isValid: boolean; message?: string } => {
  if (!otp) {
    return { isValid: false, message: "Verification code is required" };
  }

  if (otp.length !== length) {
    return {
      isValid: false,
      message: `Please enter the complete ${length}-digit verification code`,
    };
  }

  if (!/^\d+$/.test(otp)) {
    return {
      isValid: false,
      message: "Verification code must contain only numbers",
    };
  }

  return { isValid: true };
};

export const validateURL = (
  url: string
): { isValid: boolean; message?: string } => {
  if (!url.trim()) {
    return { isValid: false, message: "URL is required" };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};

export const validatePhone = (
  phone: string
): { isValid: boolean; message?: string } => {
  if (!phone.trim()) {
    return { isValid: false, message: "Phone number is required" };
  }

  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Please enter a valid phone number" };
  }

  return { isValid: true };
};

export const validateDate = (
  date: string
): { isValid: boolean; message?: string } => {
  if (!date.trim()) {
    return { isValid: false, message: "Date is required" };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: "Please enter a valid date" };
  }

  return { isValid: true };
};

export const validateAmount = (
  amount: string
): { isValid: boolean; message?: string } => {
  if (!amount.trim()) {
    return { isValid: false, message: "Amount is required" };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, message: "Please enter a valid amount" };
  }

  if (numAmount <= 0) {
    return { isValid: false, message: "Amount must be greater than zero" };
  }

  return { isValid: true };
};

export const validateForm = (validations: {
  [key: string]: { isValid: boolean; message?: string };
}): {
  isValid: boolean;
  errors: { [key: string]: string };
} => {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  Object.entries(validations).forEach(([field, validation]) => {
    if (!validation.isValid) {
      errors[field] = validation.message || `Invalid ${field}`;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value.trim() === "";
};

export const validateRequired = (
  value: string,
  fieldName: string
): { isValid: boolean; message?: string } => {
  if (isEmpty(value)) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};
