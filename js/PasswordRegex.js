function isValidPassword(password) {
    // Regular expression pattern for validating password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }
  
  // Example usage:
  const password1 = "StrongPassword123!";
  const password2 = "weakpass"; // Does not meet the criteria
  console.log(isValidPassword(password1)); // Output: true
  console.log(isValidPassword(password2)); // Output: false