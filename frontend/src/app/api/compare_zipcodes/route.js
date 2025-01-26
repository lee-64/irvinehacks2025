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
    pm25Pctl: 'pm2.5 pctl',
    dieselPctl: 'diesel pm pctl',
    pollutionScore: 'pollution burden score',
    asthmaPctl: 'asthma pctl',
    povertyPctl: 'poverty pctl',
    unemploymentPctl: 'unemployment pctl',
    educationPctl: 'education pctl',
    trafficPctl: 'traffic pctl',
  };

  // Map headers to indexes (case-insensitive matching)
  const headerIndexes = Object.fromEntries(
    Object.entries(validHeaders).map(([key, header]) => {
      const index = headers.findIndex((h) => h === header.toLowerCase());
      console.log(`Mapping header: "${header}" -> Index: ${index}`);
      if (index === -1) {
        throw new Error(
          `Required header "${header}" not found in dataset. Available headers: ${headers}`
        );
      }
      return [key, index];
    })
  );

  // Clean and normalize rows
const data = rows.slice(1).filter((row) => row.length === headers.length).map((row) => {
  return row.map((value) => value.trim());
});
console.log("First 5 Data Rows (Cleaned):", data.slice(0, 5));

// Helper function to find a row by ZIP code
const findRowByZip = (zip) => 
  {
  const sanitizedZip = zip.trim().slice(0, 5); // Extract 5 digits
  console.log("Searching for ZIP:", sanitizedZip);

  // Match the ZIP code in the data
  const match = data.find((row) => row[headerIndexes.zip]?.toString().trim() === sanitizedZip);
  
  if (!match) {
    console.log("No match found for ZIP:", sanitizedZip);
  } else {
    console.log("Match found for ZIP:", match);
  }

  return match;
};

  // Calculate score for a ZIP code
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
        parseFloat(row[headerIndexes.dieselPctl] || 0)) /
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
    const availableZips = data.map((row) => row[headerIndexes.zip]);
    return NextResponse.json(
      {
        error: `One or both ZIP codes not found.`,
        availableZips: availableZips.slice(0, 10), // Include a sample for debugging
      },
      { status: 400 }
    );
  }

  const zip1Score = calculateScore(zip1Row);
  const zip2Score = calculateScore(zip2Row);

  console.log("Calculated Scores:", { zip1Score, zip2Score });

  return NextResponse.json({
    zip1: { zip: zip1, score: zip1Score },
    zip2: { zip: zip2, score: zip2Score },
    comparison:
      zip1Score > zip2Score
        ? `${zip1} is rated higher with a score of ${zip1Score}/10`
        : `${zip2} is rated higher with a score of ${zip2Score}/10`,
  });
}