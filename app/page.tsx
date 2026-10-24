'use client';

import { useState } from 'react';

export default function Home() {
  const [cvText, setCvText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  async function handleAnalyze() {
    setError('');
    setResult('');
    if (!cvText.trim()) {
      setError('الرجاء إدخال نص السيرة الذاتية أولاً');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobTitle, city }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">مِرْصاد AI</h1>
      <p className="text-gray-600 mb-6">حلل سيرتك الذاتية وابحث عن الوظائف المناسبة</p>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">نص السيرة الذاتية</label>
          <textarea
            className="w-full border rounded p-3 h-48"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="الصق نص سيرتك الذاتية هنا"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">المسمى الوظيفي المستهدف</label>
          <input
            className="w-full border rounded p-3"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="مثال: مهندس برمجيات"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">المدينة</label>
          <input
            className="w-full border rounded p-3"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="مثال: الرياض"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {loading ? 'جاري التحليل...' : 'تحليل السيرة الذاتية'}
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {result && (
          <div className="border rounded p-4 bg-white whitespace-pre-wrap">{result}</div>
        )}
      </div>
    </main>
  );
}
