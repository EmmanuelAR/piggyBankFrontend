"use client";

import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
}

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const { signIn, signUp } = useAuthContext();
  const [formData, setFormData] = useState({
    wallet_address: "",
    email: "",
    password: "",
    private_pk: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const { error } = await signUp(formData.email, formData.password);

        if (error) throw error;

        onClose();
      } else {
        const { error } = await signIn(formData.email, formData.password);

        if (error) throw error;

        onClose();
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-green-400"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {mode === "login" ? "Login to Piggy Bank" : "Register for Piggy Bank"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-600 bg-gray-900 text-white rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border border-gray-600 bg-gray-900 text-white rounded-lg px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cargando..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="text-green-400 hover:underline"
                onClick={() => onSwitchMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-green-400 hover:underline"
                onClick={() => onSwitchMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
