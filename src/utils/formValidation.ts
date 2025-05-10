import { ValidationErrors } from "./type";

export const validateInputs = (data: {
  email?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
  oldPassword?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  code?: string;

  displayName?: string;
  avatar?: string;
  country?: string;
  state?: string;
  city?: string;

  goalAmount?: string;
  title?: string;
  description?: string;
  walletAddress?: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if ("email" in data) {
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }
  }

  if ("password" in data) {
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(data.password)
    ) {
      errors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }
  }
  if ("newPassword" in data) {
    if (!data.newPassword) {
      errors.newPassword = "New password is required";
    } else if (data.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters long";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(data.newPassword)
    ) {
      errors.newPassword =
        "New password must include uppercase, lowercase, number, and special character";
    }
  }
  if ("confirmPassword" in data) {
    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (data.confirmPassword.length < 8) {
      errors.confirmPassword =
        "Confirm password must be at least 8 characters long";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(
        data.confirmPassword
      )
    ) {
      errors.confirmPassword =
        "Confirm password must include uppercase, lowercase, number, and special character";
    }
  }
  if ("newPassword" in data) {
    if (!data.newPassword) {
      errors.newPassword = "New password is required";
    } else if (data.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters long";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(data.newPassword)
    ) {
      errors.newPassword =
        "New password must include uppercase, lowercase, number, and special character";
    }
  }
  if ("oldPassword" in data) {
    if (!data.oldPassword) {
      errors.oldPassword = "Old password is required";
    } else if (data.oldPassword.length < 8) {
      errors.oldPassword = "Old password must be at least 8 characters long";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(data.oldPassword)
    ) {
      errors.oldPassword =
        "Old password must include uppercase, lowercase, number, and special character";
    }
  }

  if ("firstName" in data) {
    if (!data.firstName) {
      errors.firstName = "First name is required";
    } else if (data.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters long";
    }
  }

  if ("lastName" in data) {
    if (!data.lastName) {
      errors.lastName = "Last name is required";
    } else if (data.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters long";
    }
  }

  if ("username" in data) {
    if (!data.username) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    } else if (/[,+=@!]/.test(data.username)) {
      errors.username = "Username cannot contain the characters: , + @ !";
    }
  }

  if ("code" in data) {
    if (!data.code) {
      errors.code = "OTP is required";
    } else if (data.code.length !== 6) {
      errors.code = "OTP must be 6 characters long";
    }
  }

  if ("displayName" in data) {
    if (!data.displayName) {
      errors.displayName = "Display name is required";
    }
  }
  if ("country" in data) {
    if (!data.country) {
      errors.country = "Country is required";
    }
  }
  if ("state" in data) {
    if (!data.state) {
      errors.state = "State is required";
    }
  }
  if ("city" in data) {
    if (!data.city) {
      errors.city = "City is required";
    }
  }

  if ("city" in data) {
    if (!data.city) {
      errors.city = "City is required";
    }
  }

  if ("goalAmount" in data) {
    if (!data.goalAmount) {
      errors.goalAmount = "Goal amount is required";
    }
  }

  if ("title" in data) {
    if (!data.title) {
      errors.title = "Title is required";
    } else if (data.title.length < 5) {
      errors.title = "Title must be at least 5 characters long";
    }
  }
  if ("description" in data) {
    if (!data.description) {
      errors.description = "Description is required";
    } else if (data.description.length < 10) {
      errors.description = "Description must be at least 10 characters long";
    }
  }
  if ("walletAddress" in data) {
    if (!data.walletAddress) {
      errors.walletAddress = "Wallet address is required";
    }
  }

  return errors;
};

export const isValidInput = (
  errors: ValidationErrors,
  requiredFields: string[]
): boolean => {
  const relevantErrors = Object.keys(errors).filter((key) =>
    requiredFields.includes(key)
  );
  return relevantErrors.length === 0;
};
