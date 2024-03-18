function isValidEmail(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
  }
  
  // Example usage:
  const email1 = "user@example.com";
  const email2 = "invalid-email";
  console.log(isValidEmail(email1)); // Output: true
  console.log(isValidEmail(email2));