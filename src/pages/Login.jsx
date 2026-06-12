import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveLoginData } from "../services/authService";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "admin@gmail.com",
    password: "123456",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await loginUser(formData.email, formData.password);

      saveLoginData(data);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>POS Login</h1>
        <p>Please login to continue</p>

        {errorMessage && <div className="login-error">{errorMessage}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;