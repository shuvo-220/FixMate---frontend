"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import { authClient } from "../../lib/auth-client"
import api from "../../lib/axios";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState("loading");
  const [sessionId, setSessionId] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");

    if (!id) {
      setStatus("invalid");
      return;
    }

    setSessionId(id);
    verifyPayment(id);
  }, []);

  const verifyPayment = async (id) => {
    try {
      setChecking(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        setStatus("pending");
        return;
      }

      const response = await api.get("/api/payments/my-payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payments =
        response.data.payments ||
        response.data.data ||
        [];

      const payment = payments.find(
        (item) => item.stripeSessionId === id
      );

      if (payment?.paymentStatus?.toLowerCase() === "paid") {
        setStatus("success");
      } else {
        setStatus("pending");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("pending");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-100">

        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <FiRefreshCw className="text-4xl text-blue-600 animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Checking Payment...
            </h1>

            <p className="mt-3 text-slate-500">
              Please wait while we verify your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle className="text-5xl text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Payment Successful!
            </h1>

            <p className="mt-3 text-slate-500">
              Your payment has been successfully completed.
              Thank you for choosing FixMate!
            </p>

            <div className="mt-7 rounded-xl bg-green-50 p-4 text-left">
              <p className="text-sm font-semibold text-green-700">
                Payment Status
              </p>
              <p className="mt-1 font-bold text-green-600">
                Paid Successfully
              </p>
            </div>

            <Link
              href="/dashboard"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Dashboard
              <FiArrowRight />
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
              <FiClock className="text-5xl text-yellow-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Payment Processing
            </h1>

            <p className="mt-3 text-slate-500">
              Your payment is being confirmed. Please refresh
              the status after a few moments.
            </p>

            <button
              onClick={() => verifyPayment(sessionId)}
              disabled={checking}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              <FiRefreshCw className={checking ? "animate-spin" : ""} />
              {checking ? "Checking..." : "Refresh Payment Status"}
            </button>

            <Link
              href="/dashboard"
              className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <FiAlertCircle className="text-5xl text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Invalid Payment Session
            </h1>

            <p className="mt-3 text-slate-500">
              We could not find the payment session information.
              Please check your payment history.
            </p>

            <Link
              href="/dashboard"
              className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {sessionId && (
          <p className="mt-6 break-all text-xs text-slate-400">
            Transaction Reference: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
