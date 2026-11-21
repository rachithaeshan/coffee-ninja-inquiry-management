
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Inquiry = {
  id: string;
  customerName: string;
  contact: string;
  subject: string;
  description: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get inquiries from the backend
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (status) {
        params.append("status", status);
      }

      const response = await fetch(
        `${API_URL}/inquiries?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load inquiries."
        );
      }

      setInquiries(result.data);

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

  // Load inquiries when the page first opens
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Logout employee
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  // Display status with different colors
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

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Navigation */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold text-gray-900">
            Coffee Ninja
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Dashboard content */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Inquiry Dashboard
            </h2>

            <p className="mt-2 text-gray-500">
              Manage and track customer inquiries.
            </p>
          </div>

          <button
            onClick={() => router.push("/inquiries/new")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + New Inquiry
          </button>

        </div>

        {/* Search and filter */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or subject..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
          >
            <option value="">All statuses</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <button
            onClick={fetchInquiries}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Search
          </button>

        </div>

        {/* Inquiry count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Total inquiries: <strong>{inquiries.length}</strong>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading inquiries...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-100 p-5 text-red-700">
            <p>{error}</p>

            <button
              onClick={fetchInquiries}
              className="mt-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && inquiries.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">

            <h3 className="text-xl font-semibold text-gray-800">
              No inquiries found
            </h3>

            <p className="mt-2 text-gray-500">
              There are no inquiries matching your search.
            </p>

          </div>
        )}

        {/* Inquiry list */}
        {!loading && !error && inquiries.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      onClick={() => router.push(`/inquiries/${inquiry.id}`)}
                      className="cursor-pointer hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {inquiry.customerName}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {inquiry.subject}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {inquiry.contact}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(inquiry.status)}`}
                        >
                          {inquiry.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
