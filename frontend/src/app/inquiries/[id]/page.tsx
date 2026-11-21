
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Inquiry = {
  id: string;
  customerName: string;
  contact: string;
  subject: string;
  description: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
};

function InquiryDetails() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Get inquiry details
  const fetchInquiry = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/inquiries/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load inquiry."
        );
      }

      setInquiry(result.data);

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

  useEffect(() => {
    fetchInquiry();
  }, [id]);

  // Update inquiry status
  const handleStatusUpdate = async (
    newStatus: "IN_PROGRESS" | "RESOLVED"
  ) => {
    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/inquiries/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update status."
        );
      }

      setInquiry(result.data);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700";

      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";

      case "RESOLVED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading inquiry...</p>
      </main>
    );
  }

  if (error && !inquiry) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-5 text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!inquiry) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-xl bg-white p-8 shadow-sm">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inquiry Details
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                ID: {inquiry.id}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(inquiry.status)}`}
            >
              {inquiry.status.replace("_", " ")}
            </span>

          </div>

          <div className="space-y-6">

            <div>
              <p className="text-sm text-gray-500">
                Customer Name
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {inquiry.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Contact Method
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {inquiry.contact}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Subject
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {inquiry.subject}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Description
              </p>

              <p className="mt-1 whitespace-pre-wrap text-gray-700">
                {inquiry.description}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-gray-900">
                {new Date(inquiry.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Last Updated
              </p>

              <p className="mt-1 text-gray-900">
                {new Date(inquiry.updatedAt).toLocaleString()}
              </p>
            </div>

          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">

            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Update Inquiry Status
            </h2>

            <div className="flex flex-wrap gap-3">

              {inquiry.status === "NEW" && (
                <button
                  onClick={() => handleStatusUpdate("IN_PROGRESS")}
                  disabled={updating}
                  className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Start Working"}
                </button>
              )}

              {inquiry.status === "IN_PROGRESS" && (
                <button
                  onClick={() => handleStatusUpdate("RESOLVED")}
                  disabled={updating}
                  className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Mark as Resolved"}
                </button>
              )}

              {inquiry.status === "RESOLVED" && (
                <button
                  onClick={() => handleStatusUpdate("IN_PROGRESS")}
                  disabled={updating}
                  className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Reopen Inquiry"}
                </button>
              )}

            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}

export default function InquiryDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-500">Loading inquiry...</p>
        </main>
      }
    >
      <InquiryDetails />
    </Suspense>
  );
}
