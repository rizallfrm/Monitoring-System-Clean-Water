"use client";
import React, { useState } from "react";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/LoginRegister/Logo";
import Button from "../components/LoginRegister/Button";
import FormInput from "../components/LoginRegister/FormInput";
import Checkbox from "../components/LoginRegister/CheckBox";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Handle login
        const { email, password } = formData;
        await login({ email, password });
        router.push("/user"); // Redirect ke user page setelah login
      } else {
        // Handle register
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        // if (!acceptTerms) {
        //   throw new Error("You must accept the terms and conditions");
        // }

        const response = await fetch(
          "http://localhost:3001/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email.trim(),
              password: formData.password,
              phone: formData.phone,
              role: "Warga", // Default role untuk registrasi
            }),
          }
        );

        if (!response.ok) {
          // Try logging the raw response before parsing
          const errorText = await response.text(); // Get response as text
          console.error("Error response:", errorText);
          throw new Error(errorText || "Registration failed");
        }

        const responseData = await response.json();
        console.log("Registration response:", responseData);

        // Auto login setelah registrasi berhasil
        await login({ email: formData.email, password: formData.password });
        router.push("/user"); // Redirect ke user page setelah registrasi
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <main className="flex flex-col items-center px-0 py-10 mx-auto max-w-none bg-blue-50 max-md:p-5 max-md:max-w-[991px] max-sm:p-4 max-sm:max-w-screen-sm">
        <section className="flex justify-center items-center mb-10 w-full max-w-md max-md:max-w-[400px] max-sm:max-w-[360px]">
          <div className="box-border p-8 w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)] max-md:p-6 max-sm:p-5">
            <Logo />
            <h2 className="mb-6 w-full text-xl font-bold text-center text-gray-900 max-md:text-lg max-sm:text-base">
              {isLogin ? "Sign in to your account" : "Create an account"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <FormInput
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              )}
              {!isLogin && (
                <FormInput
                  label="Phone"
                  name="phone"
                  placeholder="08*****"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              )}
              <FormInput
                label="Email"
                name="email"
                placeholder="name@company.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              {!isLogin && (
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              )}

              {isLogin ? (
                <div className="flex justify-between items-center">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                >
                  <span>I accept the </span>
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 cursor-pointer"
                  >
                    Terms and Conditions
                  </button>
                </Checkbox>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-sm font-light text-center text-gray-500">
                {isLogin
                  ? "Don't have an account yet?"
                  : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-base font-medium text-center text-blue-600 cursor-pointer max-md:text-base max-sm:text-sm"
                disabled={loading}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
