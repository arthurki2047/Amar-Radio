
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  return signInAnonymously(authInstance)
    .then(() => {})
    .catch(error => {
      throw error;
    });
}

/** 
 * Initiate email/password sign-up (non-blocking). 
 * Automatically sends a verification email upon success and signs the user out 
 * until they verify their email.
 */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, displayName?: string): Promise<void> {
  return createUserWithEmailAndPassword(authInstance, email, password)
    .then(async (userCredential) => {
      if (userCredential.user) {
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        // Send verification email
        await sendEmailVerification(userCredential.user);
        // Immediately sign out. The user cannot be "active" until they verify.
        await signOut(authInstance);
      }
    })
    .catch((error) => {
      throw error;
    });
}

/** 
 * Initiate email/password sign-in (non-blocking). 
 * Checks if the email is verified before allowing the session to continue.
 */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  return signInWithEmailAndPassword(authInstance, email, password)
    .then(async (userCredential) => {
      if (userCredential.user && !userCredential.user.emailVerified) {
        // Sign out if not verified
        await signOut(authInstance);
        const error = new Error("Please verify your email address before signing in.") as any;
        error.code = 'auth/email-not-verified';
        throw error;
      }
    })
    .catch((error) => {
      throw error;
    });
}

/** Initiate Google sign-in (using popup for better compatibility and immediate feedback). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  // Ensure we are using popup for the login experience
  return signInWithPopup(authInstance, provider)
    .then(() => {})
    .catch((error) => {
      throw error;
    });
}

/** Initiate password reset email. */
export function initiatePasswordReset(authInstance: Auth, email: string): Promise<void> {
  return sendPasswordResetEmail(authInstance, email)
    .catch((error) => {
      throw error;
    });
}

/** Initiate sign-out (non-blocking). */
export function initiateSignOut(authInstance: Auth): Promise<void> {
  return signOut(authInstance)
    .catch(error => {
      throw error;
    });
}
