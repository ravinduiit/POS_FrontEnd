// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser, saveLoginData } from "../services/authService";
// import "../styles/login.css";

// function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "admin@gmail.com",
//     password: "123456",
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//     setErrorMessage("");
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       setErrorMessage("");

//       const data = await loginUser(formData.email, formData.password);

//       saveLoginData(data);

//       navigate("/dashboard");
//     } catch (error) {
//       console.log(error);

//       const message =
//         error.response?.data?.message || "Login failed. Please try again.";

//       setErrorMessage(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h1>POS Login</h1>
//         <p>Please login to continue</p>

//         {errorMessage && <div className="login-error">{errorMessage}</div>}

//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="login-btn" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveLoginData } from "../services/authService";

import wavePosLogo from "../assets/wavepos-logo.png";
import codeWavesLogo from "../assets/codewaves-logo.png";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await loginUser(
        formData.email.trim(),
        formData.password
      );

      saveLoginData(data, rememberMe);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      const apiMessage = error.response?.data?.message;

      const message = Array.isArray(apiMessage)
        ? apiMessage[0]
        : apiMessage || "Login failed. Please check your credentials.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wavepos-login-page">
      {/* Left branding section */}
      <section className="login-brand-section">
        <div className="brand-grid" aria-hidden="true" />
        <div className="red-glow red-glow-one" aria-hidden="true" />
        <div className="red-glow red-glow-two" aria-hidden="true" />

        <div className="company-brand">
          <div className="company-logo-wrapper">
            <img
              src={codeWavesLogo}
              alt="CodeWaves"
              className="company-logo"
            />
          </div>

          <span className="company-divider" />

          <p>CODEWAVES IT SOLUTIONS</p>
        </div>

        <div className="brand-content">
          <div className="product-logo-wrapper">
            <img
              src={wavePosLogo}
              alt="WavePOS"
              className="product-logo"
            />
          </div>

          <span className="brand-badge">
            Smart point-of-sale platform
          </span>

          <h1>
            Powering smarter
            <span> business operations.</span>
          </h1>

          <p className="brand-description">
            Manage sales, inventory, customers, employees, and reports
            from one secure and easy-to-use platform.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-check">
                <CheckIcon />
              </span>

              <div>
                <strong>Real-time business insights</strong>
                <p>Make informed decisions with accurate reports.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-check">
                <CheckIcon />
              </span>

              <div>
                <strong>Secure cloud-based access</strong>
                <p>Access your business securely from any device.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-check">
                <CheckIcon />
              </span>

              <div>
                <strong>Built for growing businesses</strong>
                <p>Flexible tools that grow together with your business.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="brand-footer">
          <span>© {new Date().getFullYear()} CodeWaves</span>
          <span className="footer-dot" />
          <span>WavePOS Business Solutions</span>
        </footer>
      </section>

      {/* Right login section */}
      <section className="login-form-section">
        <div className="mobile-company-brand">
          <div className="mobile-company-logo-wrapper">
            <img src={codeWavesLogo} alt="CodeWaves" />
          </div>

          <span>WavePOS</span>
        </div>

        <div className="login-form-container">
          <div className="login-heading">
            <span className="login-heading-icon">
              <TerminalIcon />
            </span>

            <p>Secure business portal</p>
          </div>

          <div className="login-title">
            <h2>Welcome back</h2>
            <p>Sign in to access your WavePOS dashboard.</p>
          </div>

          {errorMessage && (
            <div className="login-error" role="alert">
              <span className="error-icon">!</span>

              <div>
                <strong>Unable to sign in</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <EmailIcon />
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">
                  <LockIcon />
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <label className="remember-option">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                disabled={loading}
              />

              <span className="custom-checkbox">
                <CheckIcon />
              </span>

              <span>Keep me signed in on this device</span>
            </label>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>
                {loading ? "Signing you in..." : "Sign in to WavePOS"}
              </span>

              {loading ? (
                <span className="button-spinner" aria-hidden="true" />
              ) : (
                <ArrowRightIcon />
              )}
            </button>
          </form>

          <div className="security-message">
            <ShieldIcon />

            <p>
              Your connection is protected with secure authentication.
            </p>
          </div>
        </div>

        <div className="login-help">
          <p>
            Need assistance?{" "}
            <a href="mailto:support@codewaves.lk">
              Contact WavePOS support
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

/* Inline SVG icons */

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16.2 16.2 0 0 1-2.2 2.9" />
      <path d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a9.8 9.8 0 0 0 3.1-.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 8 4 4-4 4" />
      <path d="M12 16h7" />
    </svg>
  );
}

export default Login;