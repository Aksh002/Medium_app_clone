// Generate a random salt
export function generateSalt(length = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function arrayBufferToHex(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray)
      .map((byte) => byte.toString(16).padStart(2, '0')) // Convert each byte to hex
      .join('');
  }
  
export async function hashPswd(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt); // Combine password with salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash the data
    return `${salt}:${arrayBufferToHex(hashBuffer)}`; // Combine salt and hash
  }
  
  // Hash the password with salt
//   async function hashPswd(password: string, salt: string): Promise<string> {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(password + salt); // Combine password with salt
//     const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash the data
//     return `${salt}:${Buffer.from(hashBuffer).toString('hex')}`; // Combine salt and hash
//   }
  


export async function verifyPswd(storedHash: string, inputPassword: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':'); // Extract salt and stored hash
  if (!salt || !hash) {
    console.error("Invalid stored hash format");
    return false; // Ensure the stored hash has the correct format
  }

  const inputHash = await hashPswd(inputPassword, salt); // Hash the input password with the same salt

  console.log(`Stored Hash: ${storedHash}`);
  console.log(`Input Hash: ${inputHash}`);
  
  return inputHash === storedHash; // Compare hashes
}

  

