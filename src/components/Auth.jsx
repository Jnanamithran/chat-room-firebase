import { auth, provider } from "../firebase-config.jsx";
import { signInWithPopup } from "firebase/auth";
import "../styles/Auth.css";
import Cookies from "universal-cookie";
import { useState } from "react";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-hero">
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
          alt="Chat community" 
          className="hero-image"
          loading="lazy"
        />
        <div className="hero-overlay"></div>
        <h1 className="hero-title">Chat Room</h1>
        <p className="hero-subtitle">Connect & Chat with Anyone, Anywhere</p>
      </div>
      
      <div className="auth-form-wrapper">
        <div className="auth">
          <div className="auth-icon">💬</div>
          <h2>Welcome Back!</h2>
          <p>Sign in to start chatting with your friends</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <button 
            onClick={signInWithGoogle}
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Signing in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{marginRight: '8px'}}>
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In With Google
              </>
            )}
          </button>

          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Real-Time Chat</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌐</span>
              <span>Cloud Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
