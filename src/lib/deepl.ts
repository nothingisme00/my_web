/**
 * DeepL Translation Helper
 * Provides functions for translating text using DeepL API (Free version)
 * Auto-translates from Indonesian to English
 */

// DeepL Free API endpoint
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const DEEPL_USAGE_URL = "https://api-free.deepl.com/v2/usage";

// Quota warning threshold (490,000 out of 500,000)
const QUOTA_WARNING_THRESHOLD = 490000;

export interface DeepLUsage {
  character_count: number;
  character_limit: number;
  percentage: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
}

export class DeepLQuotaExceededError extends Error {
  constructor() {
    super(
      "Kuota DeepL telah habis. Silakan tunggu hingga bulan depan atau upgrade ke plan berbayar."
    );
    this.name = "DeepLQuotaExceededError";
  }
}

export class DeepLQuotaNearLimitError extends Error {
  usage: DeepLUsage;

  constructor(usage: DeepLUsage) {
    super(
      `Peringatan: Kuota DeepL hampir habis (${usage.character_count.toLocaleString()}/${usage.character_limit.toLocaleString()} karakter).`
    );
    this.name = "DeepLQuotaNearLimitError";
    this.usage = usage;
  }
}

export class DeepLApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeepLApiError";
  }
}

interface DeepLTranslation {
  detected_source_language: string;
  text: string;
}

interface DeepLResponse {
  translations: DeepLTranslation[];
}

/**
 * Get DeepL API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new DeepLApiError(
      "DEEPL_API_KEY belum dikonfigurasi di environment variables."
    );
  }
  return apiKey;
}

/**
 * Check DeepL API usage/quota
 */
export async function checkUsage(): Promise<DeepLUsage> {
  const apiKey = getApiKey();

  const response = await fetch(DEEPL_USAGE_URL, {
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new DeepLApiError("API Key DeepL tidak valid.");
    }
    throw new DeepLApiError(
      `Gagal mengecek penggunaan DeepL: ${response.status}`
    );
  }

  const data = await response.json();
  const percentage = Math.round(
    (data.character_count / data.character_limit) * 100
  );

  return {
    character_count: data.character_count,
    character_limit: data.character_limit,
    percentage,
    isNearLimit: data.character_count >= QUOTA_WARNING_THRESHOLD,
    isOverLimit: data.character_count >= data.character_limit,
  };
}

/**
 * Translate text from Indonesian to English
 */
export async function translateToEnglish(text: string): Promise<string> {
  const apiKey = getApiKey();

  if (!text || text.trim().length === 0) {
    return text;
  }

  // Check quota first
  const usage = await checkUsage();
  if (usage.isOverLimit) {
    throw new DeepLQuotaExceededError();
  }

  try {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("source_lang", "ID");
    params.append("target_lang", "EN");
    params.append("preserve_formatting", "1");

    // Handle HTML content (like TipTap editor output)
    if (text.includes("<") && text.includes(">")) {
      params.append("tag_handling", "html");
    }

    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepL API Error:", response.status, errorText);

      if (response.status === 403) {
        throw new DeepLApiError("API Key DeepL tidak valid.");
      } else if (response.status === 456) {
        throw new DeepLQuotaExceededError();
      } else if (response.status === 429) {
        throw new DeepLApiError(
          "Terlalu banyak request. Silakan coba lagi dalam beberapa detik."
        );
      } else {
        throw new DeepLApiError(`Gagal menerjemahkan: ${response.status}`);
      }
    }

    const data: DeepLResponse = await response.json();

    if (data.translations && data.translations.length > 0) {
      // Check if near limit after successful translation
      const newUsage = await checkUsage();
      if (newUsage.isNearLimit && !usage.isNearLimit) {
        console.warn(
          `DeepL quota warning: ${newUsage.character_count}/${newUsage.character_limit} characters used`
        );
      }

      return data.translations[0].text;
    }

    return text;
  } catch (error) {
    if (
      error instanceof DeepLQuotaExceededError ||
      error instanceof DeepLQuotaNearLimitError ||
      error instanceof DeepLApiError
    ) {
      throw error;
    }
    console.error("Translation error:", error);
    throw new DeepLApiError(
      "Terjadi kesalahan saat menerjemahkan. Silakan coba lagi."
    );
  }
}

/**
 * Translate multiple texts at once (batch translation)
 * More efficient than calling translateToEnglish multiple times
 */
export async function translateBatch(texts: string[]): Promise<string[]> {
  const apiKey = getApiKey();

  // Filter out empty texts but keep track of their positions
  const textMap = texts.map((text, index) => ({
    text,
    index,
    isEmpty: !text || text.trim().length === 0,
  }));
  const nonEmptyTexts = textMap.filter((t) => !t.isEmpty);

  if (nonEmptyTexts.length === 0) {
    return texts;
  }

  // Check quota first
  const usage = await checkUsage();
  if (usage.isOverLimit) {
    throw new DeepLQuotaExceededError();
  }

  try {
    const params = new URLSearchParams();
    nonEmptyTexts.forEach((t) => params.append("text", t.text));
    params.append("source_lang", "ID");
    params.append("target_lang", "EN");
    params.append("preserve_formatting", "1");

    // Check if any text contains HTML
    const hasHtml = nonEmptyTexts.some(
      (t) => t.text.includes("<") && t.text.includes(">")
    );
    if (hasHtml) {
      params.append("tag_handling", "html");
    }

    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      if (response.status === 456) {
        throw new DeepLQuotaExceededError();
      }
      throw new DeepLApiError(`Gagal menerjemahkan batch: ${response.status}`);
    }

    const data: DeepLResponse = await response.json();

    // Map translations back to original positions
    const results = [...texts];
    nonEmptyTexts.forEach((t, i) => {
      if (data.translations[i]) {
        results[t.index] = data.translations[i].text;
      }
    });

    return results;
  } catch (error) {
    if (
      error instanceof DeepLQuotaExceededError ||
      error instanceof DeepLApiError
    ) {
      throw error;
    }
    console.error("Batch translation error:", error);
    throw new DeepLApiError(
      "Terjadi kesalahan saat menerjemahkan. Silakan coba lagi."
    );
  }
}

/**
 * Translate object fields from Indonesian to English
 * Useful for translating multiple fields of a form at once
 */
export async function translateFields<
  T extends Record<string, string | undefined>
>(fields: T): Promise<T> {
  const keys = Object.keys(fields) as (keyof T)[];
  const values = keys.map((k) => fields[k] || "");

  const translatedValues = await translateBatch(values);

  const result = { ...fields };
  keys.forEach((key, index) => {
    if (fields[key]) {
      result[key] = translatedValues[index] as T[keyof T];
    }
  });

  return result;
}
