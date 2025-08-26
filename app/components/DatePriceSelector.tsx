import React from "react";

export default function DatePriceSelector({ prices, selectedDate, onSelect }: {
  prices: { date: string; price: number }[];
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto py-4 mb-6">
      {prices.map(({ date, price }) => (
        <button
          key={date}
          className={`flex flex-col items-center px-4 py-2 rounded-lg border transition min-w-[90px] ${selectedDate === date ? "bg-orange-500 text-white border-orange-600" : "bg-white text-gray-800 border-gray-300 hover:bg-orange-100"}`}
          onClick={() => onSelect(date)}
        >
          <span className="font-bold text-lg">£{price}</span>
          <span className="text-xs mt-1">{new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
        </button>
      ))}
    </div>
  );
}
