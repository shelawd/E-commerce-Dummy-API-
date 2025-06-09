import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutHistory")) || [];
    setHistory(data.reverse()); // terbaru di atas
  }, []);

  if (history.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">📦 Purchase History</h2>
        <p>No transactions have been made yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        📦 Purchase History
      </h2>
      {history.map((entry) => (
        <div
          key={entry.id}
          className="border p-4 rounded mb-4 shadow-sm bg-white"
        >
          <p className="text-sm text-gray-600 mb-2">Tanggal: {entry.date}</p>
          <p className="mb-2">
            <strong>Name:</strong> {entry.formData.name}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> {entry.formData.phone}
          </p>
          <p className="mb-2">
            <strong>Address:</strong> {entry.formData.address}
          </p>

          <ul className="divide-y divide-gray-200 mt-3">
            {entry.items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>
                  {item.title} (x{item.quantity})
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {/* Show only total (subtotal + shipping + tax) */}
          <div className="mt-2 text-right font-bold text-gray-900">
            {(() => {
              const subtotal = entry.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const total = subtotal + 5 + 2.5;
              return <p>Total: ${total.toFixed(2)}</p>;
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;
