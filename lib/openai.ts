import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export interface InvoiceData {
    date: string;
    card_last_4: string;
    amount: number;
    currency: string;
    billed_to: string;
}

// Define the exact JSON schema Gemini must return
const invoiceSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        date: {
            type: SchemaType.STRING,
            description: "Invoice date or Billing Date in YYYY-MM-DD format",
        },
        card_last_4: {
            type: SchemaType.STRING,
            description: "Exactly the last 4 digits of the payment card (e.g., '1234' from 'MasterCard *1234' or 'Visa *1234')",
        },
        amount: {
            type: SchemaType.NUMBER,
            description: "The total payment amount across the invoice, numeric value only",
        },
        currency: {
            type: SchemaType.STRING,
            description: "3-letter currency code (e.g., USD or THB)",
        },
        billed_to: {
            type: SchemaType.STRING,
            description: "The name of the person or company the invoice is billed to (ใบเรียกเก็บเงินสำหรับ / Billed To).",
        },
    },
    required: ["date", "card_last_4", "amount", "currency", "billed_to"],
};

export async function extractInvoiceData(pdfText: string): Promise<InvoiceData> {
    // Truncate to first 3000 chars — key info in Facebook PDF is always near the top
    const trimmedText = pdfText.slice(0, 3000);

    const model = ai.getGenerativeModel({
        model: "gemini-2.0-flash", // Free tier is 1,500 requests per day!
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: invoiceSchema,
            temperature: 0, // Deterministic, no hallucination
        },
    });

    const prompt = `Extract the exact payment information from this Facebook Ads billing receipt. 
If a value is truly missing, return an empty string or 0.

--- RECEIPT TEXT ---
${trimmedText}`;

    try {
        const result = await model.generateContent(prompt);
        const responseJson = result.response.text();
        const parsed = JSON.parse(responseJson) as InvoiceData;

        return {
            date: parsed.date ?? "",
            card_last_4: parsed.card_last_4?.replace(/\D/g, "").slice(-4) ?? "",
            amount: Number(parsed.amount) || 0,
            currency: parsed.currency ?? "USD",
            billed_to: parsed.billed_to ?? "",
        };
    } catch (err) {
        console.error("Gemini Extraction Error:", err);
        return { date: "", card_last_4: "", amount: 0, currency: "USD", billed_to: "" };
    }
}
