import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import Papa from "papaparse";
import { cache } from "react";

const REGION = process.env.AWS_REGION!;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
const BUCKET = process.env.AWS_S3_BUCKET!;

const CATEGORY_KEY_MAP = {
  people: process.env.S3_PEOPLE_KEY!,
  values: process.env.S3_VALUES_KEY!,
  government: process.env.S3_GOVERNMENT_KEY!,
  beliefs: process.env.S3_BELIEFS_KEY!,
};

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function getCsvFromS3(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const response = await s3.send(command);
  const stream = response.Body as NodeJS.ReadableStream;
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", chunk => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}

function parseQuestions(csv: string, category: string) {
  // Remove empty lines before parsing
  const sanitizedCsv = csv
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

  const { data, errors } = Papa.parse(sanitizedCsv, { header: true, skipEmptyLines: true });

  // Only throw if all rows are bad, otherwise just log
  if (errors.length > 0) {
    const fatal = errors.find(e => e.code === 'TooFewFields' && e.row === data.length);
    if (fatal) throw new Error("CSV parse error: " + errors[0].message);
    // else: just log
    console.warn("Non-fatal CSV parse errors:", errors);
  }

  // Filter out rows that are completely empty or missing required fields
  return data
    .filter((row: any) => row && row["Question"] && row["Option 1"] && row["Correct Answer"])
    .map((row: any) => ({
      question: row["Question"],
      options: [row["Option 1"], row["Option 2"], row["Option 3"]].filter(Boolean),
      answer: row["Correct Answer"],
      category,
      explanation: row["Note"] || "",
    }));
}

export const fetchQuestionsFromS3 = cache(async (category: keyof typeof CATEGORY_KEY_MAP) => {
  const key = CATEGORY_KEY_MAP[category];
  if (!key) throw new Error("Invalid category or missing S3 key");
  const csv = await getCsvFromS3(key);
  return parseQuestions(csv, category);
}); 