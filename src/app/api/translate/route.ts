import { NextRequest, NextResponse } from "next/server";
import {
  translateToEnglish,
  translateBatch,
  checkUsage,
  DeepLQuotaExceededError,
  DeepLApiError,
} from "@/lib/deepl";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// Verify admin authentication
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

/**
 * POST /api/translate
 * Translate text from Indonesian to English
 *
 * Body:
 * - text: string (single text to translate)
 * - texts: string[] (multiple texts to translate in batch)
 *
 * Returns:
 * - { translatedText: string } for single text
 * - { translatedTexts: string[] } for batch
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, texts } = body;

    // Batch translation
    if (texts && Array.isArray(texts)) {
      const translatedTexts = await translateBatch(texts);
      return NextResponse.json({ translatedTexts });
    }

    // Single text translation
    if (text && typeof text === "string") {
      const translatedText = await translateToEnglish(text);
      return NextResponse.json({ translatedText });
    }

    return NextResponse.json(
      { error: "Request harus menyertakan 'text' atau 'texts'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Translation API error:", error);

    if (error instanceof DeepLQuotaExceededError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "QUOTA_EXCEEDED",
        },
        { status: 429 }
      );
    }

    if (error instanceof DeepLApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "API_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menerjemahkan." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/translate?action=usage
 * Get DeepL usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "usage") {
      const usage = await checkUsage();
      return NextResponse.json({ usage });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Usage check error:", error);

    if (error instanceof DeepLApiError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Gagal mengecek penggunaan DeepL." },
      { status: 500 }
    );
  }
}
