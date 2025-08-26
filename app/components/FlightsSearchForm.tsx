"use client";
import { useState } from "react";
import { airports } from "./airports";

export default function FlightsSearchForm({ onSearch }: {
  onSearch: (params: { origin: string; destination: string; departureDate: string; returnDate: string; adults: number }) => void;
}) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originDropdown, setOriginDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ origin, destination, departureDate, returnDate, adults });
  }

  return (
    <form className="flex flex-row gap-4 items-end bg-white rounded-xl shadow px-6 py-4 mb-8" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Origin</label>
        <input
          type="text"
          className="w-32 border rounded px-3 py-2"
          value={origin}
          onChange={e => { setOrigin(e.target.value.toUpperCase()); setOriginDropdown(true); }}
          onFocus={() => setOriginDropdown(true)}
          onBlur={() => setTimeout(() => setOriginDropdown(false), 150)}
          placeholder="e.g. DXB"
          required
          autoComplete="off"
        />
        {originDropdown && origin.length > 0 && (
          <ul className="absolute left-0 right-0 top-full bg-white border rounded shadow z-10 max-h-56 overflow-y-auto">
            {airports.filter(a =>
              a.code.includes(origin) ||
              a.city.toUpperCase().includes(origin) ||
              a.name.toUpperCase().includes(origin)
            ).slice(0, 8).map(a => (
              <li
                key={a.code}
                className="px-3 py-2 cursor-pointer hover:bg-orange-100"
                onMouseDown={() => { setOrigin(a.code); setOriginDropdown(false); }}
              >
                <span className="font-bold">{a.code}</span> - {a.city} ({a.name})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Destination</label>
        <input
          type="text"
          className="w-32 border rounded px-3 py-2"
          value={destination}
          onChange={e => { setDestination(e.target.value.toUpperCase()); setDestinationDropdown(true); }}
          onFocus={() => setDestinationDropdown(true)}
          onBlur={() => setTimeout(() => setDestinationDropdown(false), 150)}
          placeholder="e.g. LHR"
          required
          autoComplete="off"
        />
        {destinationDropdown && destination.length > 0 && (
          <ul className="absolute left-0 right-0 top-full bg-white border rounded shadow z-10 max-h-56 overflow-y-auto">
            {airports.filter(a =>
              a.code.includes(destination) ||
              a.city.toUpperCase().includes(destination) ||
              a.name.toUpperCase().includes(destination)
            ).slice(0, 8).map(a => (
              <li
                key={a.code}
                className="px-3 py-2 cursor-pointer hover:bg-orange-100"
                onMouseDown={() => { setDestination(a.code); setDestinationDropdown(false); }}
              >
                <span className="font-bold">{a.code}</span> - {a.city} ({a.name})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Departure</label>
        <input type="date" className="w-32 border rounded px-3 py-2" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Return</label>
        <input type="date" className="w-32 border rounded px-3 py-2" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Adults</label>
        <input type="number" className="w-20 border rounded px-3 py-2" min={1} max={9} value={adults} onChange={e => setAdults(Number(e.target.value))} required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold">Search</button>
    </form>
  );
}
