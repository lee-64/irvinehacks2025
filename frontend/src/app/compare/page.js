'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function CompareLocations() {
  const [zip1, setZip1] = useState('');
  const [zip2, setZip2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isValidZip = (zip) => /^\d{5}$/.test(zip.trim()); // Validate 5-digit ZIP codes

  const handleCompare = async () => {
    setError(null); // Reset error

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

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error ||
            'Failed to fetch location scores. Please try again.' +
              (errorData.availableZips
                ? ` Available ZIPs: ${errorData.availableZips.join(', ')}` : '')
        );
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const renderPieChart = (score, zip, county, isHigher) => {
    const data = [
      { name: 'Score', value: score },
      { name: 'Remaining', value: 10 - score },
    ];

    const COLORS = isHigher ? ['#4CAF50', '#E0E0E0'] : ['#F44336', '#E0E0E0'];

    return (
      <div className="flex flex-col items-center">
        <h2 className={`text-xl font-bold ${isHigher ? 'text-green-600' : 'text-red-600'}`}>
          {zip}, {county}, CA
        </h2>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className={`text-xl font-semibold ${isHigher ? 'text-green-600' : 'text-red-600'}`}>
          {score}/10
        </p>
      </div>
    );
  };

  const renderMetrics = (metrics) => {
    if (!metrics || Object.keys(metrics).length === 0) {
      return <p className="text-gray-500">No metrics available.</p>;
    }
  
    return (
      <ul className="mt-4 text-left">
        {Object.entries(metrics).map(([category, value]) => (
          <li key={category} className="text-gray-700">
            <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong> {Math.round(value)}/100
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="h-screen p-10">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = "/"; // Redirect and refresh
        }}
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg shadow"
      >
        Back
      </Link>
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
        <div className="mt-10 flex justify-center items-center w-full gap-x-40">
        <div className="flex flex-col items-center">
          {renderPieChart(result.zip1.score, result.zip1.zip, result.zip1.county, result.zip1.score > result.zip2.score)}
          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-800">Metrics for {result.zip1.zip}</h3>
            {renderMetrics(result.zip1.metrics)}
          </div>
        </div>
        <span className="text-2xl font-bold text-black">vs</span>
        <div className="flex flex-col items-center">
          {renderPieChart(result.zip2.score, result.zip2.zip, result.zip2.county, result.zip2.score > result.zip1.score)}
          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-800">Metrics for {result.zip2.zip}</h3>
            {renderMetrics(result.zip2.metrics)}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}