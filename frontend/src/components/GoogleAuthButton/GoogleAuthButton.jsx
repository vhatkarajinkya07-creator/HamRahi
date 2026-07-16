// Shared "Continue with Google" control used by Login and Register.
// Wraps @react-oauth/google's GoogleLogin in the app's dark glass theme
// instead of shipping Google's default light button.

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({ onSuccess, onError, className = "" }) {
  const clientIdConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  if (!clientIdConfigured) {
    return null;
  }

  return (
    <div
      className={`google-auth-button overflow-hidden rounded-full border border-white/14 bg-white/[0.06] transition-colors duration-300 hover:border-white/24 hover:bg-white/[0.1] ${className}`}
    >
      <GoogleLogin
        theme="filled_black"
        shape="pill"
        size="large"
        text="continue_with"
        onSuccess={(response) => {
          if (response?.credential) {
            onSuccess?.(response.credential);
          } else {
            onError?.("Google did not return a credential. Please try again.");
          }
        }}
        onError={() => onError?.("Google login failed. Please try again.")}
      />
    </div>
  );
}
