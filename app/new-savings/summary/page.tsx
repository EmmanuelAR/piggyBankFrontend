"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import { userUidAtom } from "../../../contexts/userUidAtom";
import { useAtom } from "jotai";
import { supabase } from "../../../lib/supabase";
import axios from "axios";
import { useState } from "react";

export default function SavingsSummary() {
  const router = useRouter();
  const params = useSearchParams();
  const [uid] = useAtom(userUidAtom);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Obtén los datos del query string
  const amount = params.get("amount");
  const days = params.get("days");
  const minutes = params.get("minutes");
  const targetDate = params.get("targetDate");
  const openAuthModal = (mode: "login" | "register") => {
    // Redirect to login if not authenticated
    console.log("openAuthModal", mode);
    router.push("/");
  };

  const handleWithdraw = async () => {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .single();
      console.log(error);

      const timestamp = new Date().getTime();
      console.log("timestamp", timestamp);

      const responseDeposit = await axios.post("/api/contract", {
        targetContractAddress: process.env.NEXT_PUBLIC_PIGGY_BANK_CONTRACT,
        entrypoint: "withdraw",
        calldata: [timestamp.toString()],
        userAddress: user.wallet_address,
        userHashedPk: user.private_pk,
      });
      setWithdrawSuccess(responseDeposit.data.result.transactionHash);
    } catch (error) {
      console.log(error);
      setWithdrawError(
        "Oops! The piggy bank is holding your savings hostage. Try again later!"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header
        onLogin={() => openAuthModal("login")}
        onRegister={() => openAuthModal("register")}
      />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Savings created successfully!
          </h2>
          <div className="text-gray-800 text-left mb-4">
            <p>
              <strong>Amount:</strong> ${amount}
            </p>
            <p>
              <strong>Duration:</strong> {days} days, {minutes} minutes
            </p>
            <p>
              <strong>Target date:</strong>{" "}
              {targetDate ? new Date(targetDate).toLocaleString("en-US") : ""}
            </p>
          </div>
          <button
            onClick={handleWithdraw}
            className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Withdraw
          </button>
        </div>
      </div>
      {withdrawSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md border border-green-700 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-400 text-2xl"
              onClick={() => {
                setWithdrawSuccess(null);
                router.push("/");
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              Withdraw Success!
            </h2>
            <p className="mb-4 text-gray-300 break-all">
              Transaction Hash:{" "}
              <a
                href={`https://sepolia.voyager.online/tx/${withdrawSuccess}`}
                className="text-green-400 underline break-all hover:text-green-300 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                {`https://sepolia.voyager.online/tx/${withdrawSuccess}`}
              </a>
            </p>
            <button
              className="mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition"
              onClick={() => {
                setWithdrawSuccess(null);
                router.push("/");
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      )}
      {withdrawError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md border border-red-500 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
              onClick={() => setWithdrawError(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Withdraw Failed
            </h2>
            <p className="mb-4 text-gray-300">{withdrawError}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              onClick={() => setWithdrawError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
