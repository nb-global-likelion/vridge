import { createAuthClient } from 'better-auth/react';

export const { useSession, signIn, signUp, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
