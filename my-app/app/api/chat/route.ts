
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { groq } from '@ai-sdk/groq';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';


// 🔹 Load relevant CSV data (same as before)
function loadRelevantCSVData(query: string): Promise<string> {
  return new Promise((resolve) => {
    let result = '';
    let count = 0;

    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', (row) => {
        const text = JSON.stringify(row).toLowerCase();

        if (text.includes(query.toLowerCase()) && count < 3) {
          const cleanRow = `
Drug: ${row.drug_name}
Used for: ${row.medical_condition}
Type: ${row.drug_classes}
Common Side Effects: ${row.side_effects?.split(',').slice(0, 3).join(', ')}
`;
          result += cleanRow + '\n';
          count++;
        }
      })
      .on('end', () => resolve(result));
  });
}

// // 🔹 NEW: Load prescription text (DL model output)
// function loadPrescription(): string {
//   try {
//     // const data = fs.readFileSync('output.txt', 'utf-8');


//     const filePath = path.join(process.cwd(), '..', 'output1.txt');
//     const data = fs.readFileSync(filePath, 'utf-8');
//     return data;
//   } catch {
//     return '';
//   }
// }

export async function POST(req: Request) {
const { messages, ocrText }: { messages: UIMessage[], ocrText: string[] } = await req.json();
  // 🔹 Get latest user query
  const lastMessage =
    messages[messages.length - 1]?.parts
      ?.map((p: any) => (p.type === 'text' ? p.text : ''))
      .join('') || '';

  // 🔹 Load sources
  const csvData = await loadRelevantCSVData(lastMessage);
  const prescriptionData = ocrText?.join('\n') || '';
  // 🔥 SYSTEM PROMPT (SMART + SAFE)
const systemPrompt = `
You are MedAssist AI, a highly intelligent and safety-focused medical assistant.

KNOWLEDGE SOURCES:
1. Prescription text (may contain OCR/DL errors)
2. Medicine dataset (trusted)
3. General medical knowledge

INTELLIGENT BEHAVIOR (VERY IMPORTANT):
- Treat prescription text as NOISY and potentially incorrect.
- NEVER blindly trust prescription values (especially duration, dosage).
- Cross-check all medicine info with general knowledge.

ERROR HANDLING:
- If something looks unrealistic (e.g., "Paracetamol for 50 days"):
  → Correct it silently using medical knowledge.
  → Give a safe and realistic interpretation.
- If medicine name is slightly wrong (OCR error):
  → Try to infer correct medicine name intelligently.

DATA USAGE:
- If dataset info matches → use it.
- If dataset not sufficient → use general knowledge.
- Combine both seamlessly.

STRICT RULES:
- NEVER say "data not available"
- NEVER mention "dataset", "OCR", or "prescription errors"
- NEVER expose internal reasoning

RESPONSE STYLE:
- Use Markdown
- Use ## headings
- Use bullet points
- Be clean and structured

SAFETY:
- You are NOT a doctor
- Do NOT give strict dosage instructions
- For suspicious or risky prescriptions → gently warn user
- Encourage doctor consultation when needed

TONE:
- Professional
- Reassuring
- Intelligent
- Helpful
`;


  const result = streamText({
    model: groq('llama-3.1-8b-instant'),

    system:
      systemPrompt +
      (prescriptionData
        ? "\n\nPrescription Context:\n" + prescriptionData
        : '') +
      (csvData ? "\n\nRelevant Medicine Data:\n" + csvData : ''),

    messages: await convertToModelMessages(messages),
  });

   const text = await result.text;
    // return Response.json({ output: text });

    console.log("OCR TEXT RECEIVED:", ocrText);
    console.log("FINAL TEXT:", text);
// return new Response(
//   JSON.stringify({ output: text }),
//   {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }
// );

return new Response(
  JSON.stringify({
    success: true,
    output: text
  }),
  {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  }
);


    // return result.toUIMessageStreamResponse();
}