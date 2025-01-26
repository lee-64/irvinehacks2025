'use client';

import { useState } from 'react';

export default function CompareLocations() {
  const [zip1, setZip1] = useState('');
  const [zip2, setZip2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isValidZip = (zip) => /^\d{5}$/.test(zip.trim()); // Validate 5-digit ZIP codes

  const handleCompare = async () => {
    setError(null); // Reset error
    setResult(null);

    const sanitizedZip1 = zip1.trim().slice(0, 5);
    const sanitizedZip2 = zip2.trim().slice(0, 5);

    if (!isValidZip(sanitizedZip1) || !isValidZip(sanitizedZip2)) {
      setError('Please enter valid 5-digit ZIP codes.');
      return;
    }

    try {
      const response = await fetch('/api/compare_zipcodes', {
        method: 'POST',
        body: JSON.stringify({ zip1: sanitizedZip1, zip2: sanitizedZip2 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log('API Response:', data); // Debugging

      if (!response.ok) {
        setError(data.error || 'An error occurred.');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('An error occurred while fetching data.');
    }
  };

  return (
    <div className="h-screen p-10">
      <h1 className="text-4xl font-bold text-center text-gray-900">Compare Locations</h1>
      <p className="text-center text-gray-600 mt-4">
        Compare various locations based on metrics like pollution, unemployment, and more.
      </p>
      <div className="mt-10 flex flex-col items-center">
        <input
          type="text"
          value={zip1}
          onChange={(e) => setZip1(e.target.value)}
          placeholder="Enter ZIP Code 1"
          className="border rounded-lg p-2 w-64 mb-4"
        />
        <input
          type="text"
          value={zip2}
          onChange={(e) => setZip2(e.target.value)}
          placeholder="Enter ZIP Code 2"
          className="border rounded-lg p-2 w-64 mb-4"
        />
        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
        >
          Compare
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold">Comparison Results</h2>
          <p className="mt-4">
            ZIP Code {result.zip1.zip}: {result.zip1.score}/10
          </p>
          <p className="mt-2">
            ZIP Code {result.zip2.zip}: {result.zip2.score}/10
          </p>
          <p className="mt-4 font-semibold">{result.comparison}</p>
        </div>
      )}
    </div>
  );
}