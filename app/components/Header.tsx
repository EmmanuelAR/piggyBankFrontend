"use client";

import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Header({ onLogin, onRegister }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Piggy Bank
                </span>
              </div>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {user ? (
              <>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Dashboard
                </Link>
                <a
                  href="/new-savings"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  New Savings
                </a>
              </>
            ) : (
              <>
                <a
                  href="#benefits"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Benefits
                </a>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  About
                </a>
              </>
            )}
          </nav>
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-gray-300 text-sm">
                    {userProfile?.email || user.email}
                  </div>
                  {userProfile?.wallet_address && (
                    <div className="text-green-400 text-xs font-mono">
                      {formatWalletAddress(userProfile.wallet_address)}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-gray-300 hover:text-green-400 transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={onRegister}
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 font-medium"
                >
                  Register
                </button>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-800">
              <a
                href="#benefits"
                className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                Benefits
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                About
              </a>
              {user && (
                <a
                  href="/new-savings"
                  className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  New Savings
                </a>
              )}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-gray-300">
                      <div>{userProfile?.email || user.email}</div>
                      {userProfile?.wallet_address && (
                        <div className="text-green-400 text-xs font-mono">
                          {formatWalletAddress(userProfile.wallet_address)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onLogin}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-400 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={onRegister}
                      className="block w-full text-left px-3 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
