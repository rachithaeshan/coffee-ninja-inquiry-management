
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewInquiryPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName,
          contact,
          subject,
          description
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to create inquiry."
        );
      }

      router.push("/dashboard");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Create New Inquiry
        </h1>

        <p className="mb-8 mt-2 text-gray-500">
          Enter the customer's information below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Customer Name
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Contact Method
            </label>

            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number or email"
              required
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter inquiry subject"
              required
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the customer's inquiry..."
              required
              maxLength={1000}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Inquiry"}
          </button>

        </form>

      </div>

    </main>
  );
}
