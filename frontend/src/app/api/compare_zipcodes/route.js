import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const { zip1, zip2 } = await request.json();

  // Load the dataset
  const datasetPath = path.join(
    '/Users/danielyang/VSCodeProjects/irvinehacks2025/frontend/src/app/compare',
    'cali_dataset.csv'
  );
  const csvData = fs.readFileSync(datasetPath, 'utf-8');

  // Parse rows from the dataset
  const rows = csvData
    .split('\n')
    .filter((row) => row.trim() !== '')
    .map((row) => row.split(',').map((value) => value.trim().replace(/"/g, '')));

  // Extract headers and normalize
  const headers = rows[0].map((header) => header.toLowerCase());
  console.log('Headers:', headers);

  // Update validHeaders to match available headers in the dataset
  const validHeaders = {
    zip: 'zip',
    population: 'total population',
  };

  const headerIndexes = Object.fromEntries(
    Object.entries(validHeaders).map(([key, header]) => {
      const index = headers.findIndex((h) => h.includes(header.toLowerCase()));
      if (index === -1) {
        throw new Error(`Required header "${header}" not found in dataset. Available headers: ${headers}`);
      }
      return [key, index];
    })
  );

  // Parse rows into data
  const data = rows.slice(1).filter((row) => row.length === headers.length);

  // Helper function to find a row by ZIP code
  const findRowByZip = (zip) => data.find((row) => row[headerIndexes.zip] === zip);

  const zip1Row = findRowByZip(zip1);
  const zip2Row = findRowByZip(zip2);

  if (!zip1Row || !zip2Row) {
    return NextResponse.json(
      { error: `One or both ZIP codes not found. (${!zip1Row ? zip1 : ''}${!zip2Row ? zip2 : ''})` },
      { status: 400 }
    );
  }

  // Compare population
  const zip1Population = parseInt(zip1Row[headerIndexes.population], 10) || 0;
  const zip2Population = parseInt(zip2Row[headerIndexes.population], 10) || 0;

  return NextResponse.json({
    zip1: { zip: zip1, population: zip1Population },
    zip2: { zip: zip2, population: zip2Population },
    comparison: zip1Population > zip2Population ? `${zip1} has a larger population` : `${zip2} has a larger population`,
  });
}