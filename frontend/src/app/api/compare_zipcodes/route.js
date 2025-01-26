import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const { zip1, zip2 } = await request.json();

  const datasetPath = path.resolve('cali_dataset.csv');
  console.log("Dataset Path:", datasetPath);

  // Check if the dataset file exists
  if (!fs.existsSync(datasetPath)) {
    console.error("Dataset file not found.");
    return NextResponse.json(
      { error: 'Dataset file not found at expected location.' },
      { status: 500 }
    );
  }

  // Read and parse the dataset
  const csvData = fs.readFileSync(datasetPath, 'utf-8');
  const rows = csvData
    .split('\n')
    .filter((row) => row.trim() !== '') // Remove blank rows
    .map((row) => row.split(',').map((value) => value.trim().replace(/"/g, '')));

  // Normalize headers
  const headers = rows[0].map((header) => header.trim().toLowerCase());
  console.log("Normalized Headers in Dataset:", headers);

  const validHeaders = {
    zip: 'zip',
    county: 'california county',
    pm25Pctl: 'pm2.5 pctl',
    dieselPctl: 'diesel pm pctl',
    pollutionScore: 'pollution burden score',
    asthmaPctl: 'asthma pctl',
    povertyPctl: 'poverty pctl',
    unemploymentPctl: 'unemployment pctl',
    educationPctl: 'education pctl',
    trafficPctl: 'traffic pctl',
  };

  // Map headers to indexes
  const headerIndexes = Object.fromEntries(
    Object.entries(validHeaders).map(([key, header]) => {
      const index = headers.findIndex((h) => h.includes(header));
      if (index === -1) {
        throw new Error(`Required header "${header}" not found in dataset.`);
      }
      return [key, index];
    })
  );

  // Helper function to find a row by ZIP code
  const findRowByZip = (zip) => {
    const sanitizedZip = zip.trim().slice(0, 5); // Extract 5 digits
    return rows.find((row) => row[headerIndexes.zip] === sanitizedZip);
  };

  const calculateScore = (row) => {
    const weights = {
      pollution: 0.3,
      health: 0.3,
      socioeconomic: 0.3,
      accessibility: 0.1,
    };

    const pollutionScore =
      100 -
      (
        parseFloat(row[headerIndexes.pm25Pctl] || 0) +
        parseFloat(row[headerIndexes.dieselPctl] || 0)
      ) /
        2;

    const healthScore = 100 - parseFloat(row[headerIndexes.asthmaPctl] || 0);

    const socioeconomicScore =
      100 -
      (parseFloat(row[headerIndexes.povertyPctl] || 0) +
        parseFloat(row[headerIndexes.unemploymentPctl] || 0)) /
        2;

    const accessibilityScore = 100 - parseFloat(row[headerIndexes.trafficPctl] || 0);

    const totalScore =
      pollutionScore * weights.pollution +
      healthScore * weights.health +
      socioeconomicScore * weights.socioeconomic +
      accessibilityScore * weights.accessibility;

    return Math.round(totalScore) / 10; // Scale to 0-10
  };

  const zip1Row = findRowByZip(zip1);
  const zip2Row = findRowByZip(zip2);

  if (!zip1Row || !zip2Row) {
    return NextResponse.json(
      { error: `One or both ZIP codes not found.` },
      { status: 400 }
    );
  }

  const zip1Score = calculateScore(zip1Row);
  const zip2Score = calculateScore(zip2Row);

  return NextResponse.json({
    zip1: { zip: zip1, county: zip1Row[headerIndexes.county], score: zip1Score },
    zip2: { zip: zip2, county: zip2Row[headerIndexes.county], score: zip2Score },
    comparison:
      zip1Score > zip2Score
        ? `${zip1} is rated higher with a score of ${zip1Score}/10`
        : `${zip2} is rated higher with a score of ${zip2Score}/10`,
  });
}