import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { cvText, jobTitle, city } = await req.json();

    if (!cvText || typeof cvText !== "string" || !cvText.trim()) {
      return NextResponse.json(
        { error: "نص السيرة الذاتية مطلوب" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "مفتاح OpenAI غير معرّف في إعدادات الخادم" },
        { status: 500 }
      );
    }

    const userPrompt = `
المسمى الوظيفي المستهدف: ${jobTitle || "غير محدد"}
المدينة: ${city || "غير محددة"}

نص السيرة الذاتية:
${cvText}

حلل السيرة الذاتية وأعطني:
1. ملخص قصير للمرشح.
2. نقاط القوة.
3. نقاط الضعف والنواقص.
4. اقتراحات لتحسين السيرة.
5. أهم الكلمات المفتاحية الناقصة للمسمى المستهدف.
6. مقترحات لمسميات وظيفية مناسبة في المدينة المحددة.
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "أنت مستشار توظيف محترف. أجب باللغة العربية بشكل منظم وواضح.",
          },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "فشل الاتصال بخدمة التحليل، حاول مرة أخرى" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
