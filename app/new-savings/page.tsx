"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

import React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userProfileAtom } from "../../contexts/userUidAtom";
import { formatAmount } from "../../lib/util";
import { savingsSummaryAtom } from "../../contexts/savingsSummaryAtom";

export default function NewSavings() {
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const [userProfile] = useAtom(userProfileAtom);
  const [summary, setSummary] = useAtom(savingsSummaryAtom);

  // Function to convert days and minutes to timestamp in milliseconds
  const convertToTimestamp = (days: number, minutes: number): number => {
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.getTime() + days * 24 * 60 * 60 * 1000 + minutes * 60 * 1000
    );
    return futureDate.getTime();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const amountNumber = parseFloat(amount);
      const daysNumber = parseInt(days);
      const minutesNumber = parseInt(minutes) || 0;

      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Amount must be a valid number greater than 0");
      }

      if (
        isNaN(daysNumber) ||
        daysNumber < 0 ||
        isNaN(minutesNumber) ||
        minutesNumber < 0
      ) {
        throw new Error(
          "Days and minutes must be valid numbers (0 or greater)"
        );
      }

      if (daysNumber === 0 && minutesNumber === 0) {
        throw new Error(
          "You must specify at least days or minutes greater than 0"
        );
      }

      if (!userProfile) {
        router.push("/");
        return;
      }

      const timestamp = convertToTimestamp(daysNumber, minutesNumber);

      const newSavings = {
        amount: amountNumber,
        days: daysNumber,
        minutes: minutesNumber,
        timestamp: timestamp,
        createdAt: new Date().toISOString(),
        targetDate: new Date(timestamp).toISOString(),
        userId: userProfile.user?.id,
      };
      console.log("newSavings", newSavings);

      const formattedAmount = formatAmount(amountNumber, 6);
      console.log("formattedAmount", formattedAmount);
      const responseTransfer = await axios.post("/api/contract", {
        targetContractAddress:
          "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        entrypoint: "transfer",
        calldata: [
          process.env.NEXT_PUBLIC_PIGGY_BANK_CONTRACT,
          formattedAmount.low,
          0,
        ],
        userAddress: userProfile.userProfile.wallet_address,
        userHashedPk: userProfile.userProfile.private_pk,
      });
      console.log("responseTransfer", responseTransfer);

      const responseDeposit = await axios.post("/api/contract", {
        targetContractAddress: process.env.NEXT_PUBLIC_PIGGY_BANK_CONTRACT,
        entrypoint: "deposit",
        calldata: [amountNumber.toString(), "0", timestamp.toString()],
        userAddress: userProfile.userProfile.wallet_address,
        userHashedPk: userProfile.userProfile.private_pk,
      });

      console.log("responseDeposit", responseDeposit);

      // Guarda los datos en el átomo antes de navegar
      setSummary({
        amount: amount,
        days: days,
        minutes: minutes,
        targetDate: newSavings.targetDate,
      });
      router.push(`/new-savings/summary`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating savings");
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (mode: "login" | "register") => {
    // Redirect to login if not authenticated
    console.log("openAuthModal", mode);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header
        onLogin={() => openAuthModal("login")}
        onRegister={() => openAuthModal("register")}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create New Savings
          </h1>
          <p className="text-xl text-gray-300">
            Define your savings goal and the time to reach it
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount field */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Amount to save ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Days field */}
              <div>
                <label
                  htmlFor="days"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Number of days to save
                </label>
                <input
                  type="number"
                  id="days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Minutes field */}
              <div>
                <label
                  htmlFor="minutes"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Number of minutes to save
                </label>
                <input
                  type="number"
                  id="minutes"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Timestamp information */}
              {amount &&
                (days || minutes) &&
                !isNaN(parseFloat(amount)) &&
                (!days || !isNaN(parseInt(days))) &&
                (!minutes || !isNaN(parseInt(minutes))) && (
                  <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-400 mb-2">
                      Savings Summary:
                    </h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>
                        Target amount: ${parseFloat(amount).toLocaleString()}
                      </p>
                      <p>
                        Duration: {parseInt(days) || 0} days,{" "}
                        {parseInt(minutes) || 0} minutes
                      </p>
                      <p>
                        Target date:{" "}
                        {new Date(
                          convertToTimestamp(
                            parseInt(days) || 0,
                            parseInt(minutes) || 0
                          )
                        ).toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        Timestamp:{" "}
                        {convertToTimestamp(
                          parseInt(days) || 0,
                          parseInt(minutes) || 0
                        )}{" "}
                        ms
                      </p>
                    </div>
                  </div>
                )}

              {/* Error message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Savings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
