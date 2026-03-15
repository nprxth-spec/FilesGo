"use client";

import { useState } from "react";

type ScopeResult = {
  ok: boolean;
  granted: string[];
  missing: string[];
  message: string;
  error?: string;
};

const SCOPE_LABELS: Record<string, string> = {
  "https://www.googleapis.com/auth/drive.readonly": "Drive (อ่าน)",
  "https://www.googleapis.com/auth/drive.file": "Drive (สร้าง/อัปโหลด)",
  "https://www.googleapis.com/auth/spreadsheets": "Google Sheets",
};

function scopeLabel(url: string): string {
  return SCOPE_LABELS[url] ?? url;
}

export default function AdminUserScopesCell({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScopeResult | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/scopes`);
      const data = await res.json();
      setResult({
        ok: data.ok ?? false,
        granted: data.granted ?? [],
        missing: data.missing ?? [],
        message: data.message ?? (data.ok ? "สโคปครบ" : "สโคปไม่ครบ"),
        error: data.error,
      });
    } catch {
      setResult({
        ok: false,
        granted: [],
        missing: [],
        message: "เรียก API ไม่ได้",
        error: "network",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleCheck}
        disabled={loading}
        className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 disabled:opacity-50 w-fit"
      >
        {loading ? "กำลังตรวจ..." : "ตรวจสอบสิทธิ์"}
      </button>
      {result && (
        <div className="text-xs max-w-[280px]">
          {result.ok ? (
            <span className="text-emerald-600 font-medium">✓ สโคปครบ</span>
          ) : (
            <div className="text-amber-700 space-y-0.5">
              <span className="font-medium">✗ สโคปไม่ครบ</span>
              {result.missing.length > 0 && (
                <ul className="list-disc list-inside mt-0.5 text-slate-600">
                  {result.missing.map((s) => (
                    <li key={s}>{scopeLabel(s)}</li>
                  ))}
                </ul>
              )}
              {result.message && (
                <p className="text-slate-500 mt-0.5">{result.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
