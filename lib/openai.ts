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
            description: "The TOTAL amount actually charged/paid (the final amount that was debited from the card). Must include VAT, tax, and any fees. If the receipt shows both a subtotal (e.g. 20.00) and a total with VAT (e.g. 20.20), use the total (20.20), NOT the subtotal. Look for fields like 'Total', 'Amount paid', 'Total charged', 'Amount due' or similar.",
        },
        currency: {
            type: SchemaType.STRING,
            description: "3-letter currency code (e.g., USD or THB)",
        },
        billed_to: {
            type: SchemaType.STRING,
            description: "The name of the person or company the invoice is billed to (ใบเรียกเก็บเงินสำหรับ / Billed To). Return ONLY the name; omit any timezone prefix such as GMT+7, +12, GMT+12, etc.",
        },
    },
    required: ["date", "card_last_4", "amount", "currency", "billed_to"],
};

/** Strip timezone prefix (e.g. GMT+12, +7) from Billed To so we keep only the name. */
function normalizeBilledTo(raw: string): string {
    const s = (raw ?? "").trim();
    // Remove leading: optional "GMT", optional +/-, 1–2 digits, optional space
    return s.replace(/^\s*(?:GMT\s*)?[+-]?\d{1,2}\s*/i, "").trim();
}

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

Rules:
- If a value is truly missing, return an empty string or 0.
- For "billed_to": return ONLY the person or company name. If the PDF shows a timezone prefix (e.g. "GMT+12", "+7", "GMT+7") before the name, omit it and return just the name (e.g. "Yanto Rahim" not "GMT+12 Yanto Rahim").
- For "amount": use ONLY the final total amount that was actually charged/paid (the amount debited from the card). This must INCLUDE VAT, tax, and any fees. If you see both a subtotal (e.g. 20.00) and a total including VAT (e.g. 20.20), you MUST return the total (20.20), not the subtotal. Prefer fields labeled "Total", "Amount paid", "Total charged", "Amount due", or the final sum after adding tax/VAT.

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
            billed_to: normalizeBilledTo(parsed.billed_to ?? ""),
        };
    } catch (err) {
        console.error("Gemini Extraction Error:", err);
        return { date: "", card_last_4: "", amount: 0, currency: "USD", billed_to: "" };
    }
}
