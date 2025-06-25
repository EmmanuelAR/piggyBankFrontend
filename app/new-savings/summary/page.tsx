"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import { userUidAtom } from "../../../contexts/userUidAtom";
import { useAtom } from "jotai";
import { supabase } from "../../../lib/supabase";
import axios from "axios";

export default function SavingsSummary() {
  const router = useRouter();
  const params = useSearchParams();
  const [uid] = useAtom(userUidAtom);

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

      const timestamp = new Date().getTime();
      console.log("timestamp", timestamp);

      const responseDeposit = await axios.post("/api/contract", {
        targetContractAddress: process.env.NEXT_PUBLIC_PIGGY_BANK_CONTRACT,
        entrypoint: "withdraw",
        calldata: [timestamp.toString()],
        userAddress: user.wallet_address,
        userHashedPk: user.private_pk,
      });
      console.log(
        "responseTransfer",
        responseDeposit.data.result.transaction_hash
      );

      alert("Withdraw successful!");
      // Aquí puedes redirigir o actualizar el estado si lo necesitas
    } catch (error) {
      alert("Withdraw failed!");
      console.error(error);
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
    </div>
  );
}
