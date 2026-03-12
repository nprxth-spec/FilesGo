"use client";

import { useEffect, useState } from "react";
import {
    ExternalLink,
    FileText,
    Loader2,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
} from "lucide-react";

interface LogEntry {
    id: string;
    filename: string;
    invoiceDate: string | null;
    cardLast4: string | null;
    amount: number | null;
    currency: string | null;
    driveLink: string | null;
    status: string;
    createdAt: string;
}

export default function HistoryPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const res = await fetch(`/api/history?page=${page}&limit=${limit}`);
            const data = await res.json();
            setLogs(data.logs ?? []);
            setTotal(data.total ?? 0);
            setLoading(false);
        };
        fetchLogs();
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Invoice History</h1>
                <p className="text-slate-500">
                    {total} invoice{total !== 1 ? "s" : ""} processed
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                            <FileText className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-700 mb-1">No invoices yet</p>
                        <p className="text-slate-400 text-sm">Upload your first invoice to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {["Filename", "Invoice Date", "Card", "Amount", "Status", "File"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, i) => (
                                    <tr
                                        key={log.id}
                                        className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                            }`}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                                                </div>
                                                <span
                                                    className="font-medium text-slate-800 max-w-[180px] truncate"
                                                    title={log.filename}
                                                >
                                                    {log.filename}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {log.invoiceDate ?? (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600 font-mono">
                                            {log.cardLast4 ? `•••• ${log.cardLast4}` : <span className="text-slate-300">—</span>}
                                        </td>
                                        <td className="px-5 py-4 text-slate-800 font-semibold">
                                            {log.amount != null ? (
                                                <>
                                                    <span className="text-slate-400 font-normal text-xs mr-1">
                                                        {log.currency}
                                                    </span>
                                                    {log.amount.toLocaleString()}
                                                </>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${log.status === "success"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-600"
                                                    }`}
                                            >
                                                {log.status === "error" && (
                                                    <AlertCircle className="w-3 h-3" />
                                                )}
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            {log.driveLink ? (
                                                <a
                                                    href={log.driveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                >
                                                    View <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
