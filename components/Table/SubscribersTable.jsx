"use client";

import { formatDate } from "@/hooks/useFormatDate"; // Import the utility function directly
import { useSubscribers } from "@/services/queries";
import { FileUp } from "lucide-react";

const SubscribersTable = () => {
  const { data, isLoading, error } = useSubscribers();

  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    if (!data || !data.subscribers || data.subscribers.length === 0) return "";

    // Define CSV headers
    const headers = ["Email Address", "Date Joined"];
    const rows = data.subscribers.map((subscriber) => [
      subscriber.email,
      formatDate(subscriber.subscribedAt, { type: "full" }),
    ]);

    // Combine headers and rows into CSV format
    const csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    return csvContent;
  };

  // Function to trigger CSV download
  const handleExportCSV = () => {
    if (!data || !data.subscribers || data.subscribers.length === 0) {
      alert("No data to export.");
      return;
    }

    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "subscribers.csv";
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="text-red-500 h-dvh myFlex justify-center text-center py-10">
        Failed to load subscribers. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-dvh myFlex justify-center text-center py-10">
        Loading table ...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Add the Export CSV Button */}
      <div className="mb-4">
        <button
          onClick={handleExportCSV}
          className="bg-primary myFlex gap-3 text-white px-4 py-2 rounded hover:bg-primary-100"
        >
          <FileUp size={32} />
          Export as CSV
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-6 py-4 font-bold">Email Address</th>
            <th className="px-6 py-4 font-bold">Date Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#898989]">
          {data && data?.subscribers.length > 0 ? (
            data?.subscribers.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{row.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(row?.subscribedAt, { type: "full" })}
                </td>
              </tr>
            ))
          ) : (
            <div className="h-[20dvh] myFlex justify-center text-center py-10">
              No subscriber
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubscribersTable;
