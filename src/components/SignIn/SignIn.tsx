import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SignIn.scss";

interface LocationState {
  phoneId?: string;
  phoneBrand?: string;
  phoneModel?: string;
  selectedColor?: string;
  selectedStorage?: string;
  tradeInOffer?: {
    tradeinValue: number;
    tradeinPromotion: number;
    tradeinPhoneBrand: string;
    tradeinModel: string;
  } | null;
}

interface SignInFormData {
  username: string;
  password: string;
  staySignedIn: boolean;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: "",
    staySignedIn: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Store user credentials temporarily in sessionStorage
      const userInfo = {
        username: formData.username,
        password: formData.password,
        isAuthenticated: true,
        staySignedIn: formData.staySignedIn,
      };

      // Save to sessionStorage for temporary storage during the session
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Navigate to identity protection with all previous state plus user info
      navigate("/mobile/identity-protection", {
        state: {
          ...state,
          userInfo,
        },
      });
    }, 1000);
  };

  const handleCreateUsername = () => {
    // Navigate to create account page
    navigate("/mobile/create-account", { state });
  };

  const handleForgotCredentials = () => {
    // Navigate to forgot password page or open in new tab
    window.open("https://www.spectrum.net/forgot-credentials", "_blank");
  };

  const handleGoBack = () => {
    navigate("/mobile/customer-check", { state });
  };

  return (
    <div className="sign-in">
      <div className="sign-in__header-links">
        <button className="sign-in__link sign-in__link--feedback">
          Leave Feedback
        </button>
        <button className="sign-in__link sign-in__link--language">
          En español
        </button>
      </div>

      <div className="sign-in__container">
        <h1 className="sign-in__title">Sign In to Get Started</h1>

        <div className="sign-in__divider">
          <span className="sign-in__divider-text">or</span>
        </div>

        <button
          className="sign-in__create-username"
          onClick={handleCreateUsername}
        >
          Create a Username
        </button>

        <form className="sign-in__form" onSubmit={handleSignIn}>
          <div className="sign-in__field">
            <label htmlFor="username" className="sign-in__label">
              Username
              <button
                type="button"
                className="sign-in__info-icon"
                title="Your username is typically your email address ending with @spectrum.net"
              >
                ⓘ
              </button>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`sign-in__input ${
                errors.username ? "sign-in__input--error" : ""
              }`}
              placeholder="username@spectrum.net"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
            />
            {errors.username && (
              <span className="sign-in__error">{errors.username}</span>
            )}
          </div>

          <div className="sign-in__field">
            <label htmlFor="password" className="sign-in__label">
              Password
            </label>
            <div className="sign-in__password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`sign-in__input ${
                  errors.password ? "sign-in__input--error" : ""
                }`}
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="sign-in__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className="sign-in__error">{errors.password}</span>
            )}
          </div>

          <div className="sign-in__checkbox-field">
            <input
              type="checkbox"
              id="staySignedIn"
              name="staySignedIn"
              className="sign-in__checkbox"
              checked={formData.staySignedIn}
              onChange={handleInputChange}
            />
            <label htmlFor="staySignedIn" className="sign-in__checkbox-label">
              Stay Signed In on This Device
              <button
                type="button"
                className="sign-in__info-icon"
                title="Keep me signed in on this device for faster access"
              >
                ⓘ
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="sign-in__submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <button
          className="sign-in__forgot-link"
          onClick={handleForgotCredentials}
        >
          Forgot Username or Password?
        </button>

        <button className="sign-in__back-link" onClick={handleGoBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default SignIn;
