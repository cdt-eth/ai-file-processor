import { NextRequest } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

// Create a Privy client for server-side authentication
const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
  process.env.PRIVY_APP_SECRET || ''
);

// Get the user from the request
export async function getUser(req: NextRequest) {
  console.log("Checking authentication...");
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No valid auth header found");
      return null;
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log("No token found in auth header");
      return null;
    }

    console.log("Verifying token with Privy...");
    // Verify the token with Privy
    const claims = await privy.verifyAuthToken(token);
    console.log("Token verified, user ID:", claims.userId);
    
    // Return a user object with the userId
    return {
      id: claims.userId,
      // Add any other user properties you need
    };
  } catch (error) {
    console.error("Error verifying Privy token:", error);
    return null;
  }
}

// Check if the user is authenticated
export async function isAuthenticated(req: NextRequest) {
  const user = await getUser(req);
  return !!user;
} 