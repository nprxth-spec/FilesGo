import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LogsRangeSelect from "./LogsRangeSelect";

const PAGE_SIZE = 50;

type DateRangePreset = "today" | "yesterday" | "this_week" | "this_month" | "last_month" | "this_year";

function getDateRange(range: DateRangePreset): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);
  let from = new Date(now);
  from.setHours(0, 0, 0, 0);

  switch (range) {
    case "today":
      break;
    case "yesterday": {
      from.setDate(from.getDate() - 1);
      to.setTime(from.getTime());
      to.setHours(23, 59, 59, 999);
      break;
    }
    case "this_week": {
      const day = from.getDay();
      const monday = day === 0 ? -6 : 1 - day;
      from.setDate(from.getDate() + monday);
      break;
    }
    case "this_month":
      from.setDate(1);
      break;
    case "last_month": {
      from.setMonth(from.getMonth() - 1);
      from.setDate(1);
      to.setTime(from.getTime());
      to.setMonth(to.getMonth() + 1);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      break;
    }
    case "this_year":
      from.setMonth(0, 1);
      break;
    default:
      return { from: new Date(0), to: new Date(8640000000000000) };
  }
  return { from, to };
}

const RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "this_year", label: "This year" },
];

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; range?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const range = (params.range ?? "all") as DateRangePreset | "all";
  const skip = (page - 1) * PAGE_SIZE;

  const where: { createdAt?: { gte: Date; lte: Date } } = {};
  const validPresets: DateRangePreset[] = [
    "today",
    "yesterday",
    "this_week",
    "this_month",
    "last_month",
    "this_year",
  ];
  if (range && range !== "all" && validPresets.includes(range)) {
    const { from, to } = getDateRange(range);
    where.createdAt = { gte: from, lte: to };
  }

  const [logs, total] = await Promise.all([
    prisma.processingLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.processingLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const rangeLabel = RANGE_OPTIONS.find((o) => o.value === range)?.label ?? "All time";
  const baseQuery = range && range !== "all" ? `range=${range}` : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-900">Processing logs</h1>
        <LogsRangeSelect currentRange={range} />
      </div>
      <p className="text-sm text-slate-500">
        {total} log{total !== 1 ? "s" : ""} in this period
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-2 font-medium text-slate-600">Processed</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">User</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Filename</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Invoice Date</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Amount</th>
                <th className="text-left px-4 py-2 font-medium text-slate-600">Drive</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100">
                  <td className="px-4 py-2 text-slate-600 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-slate-700">{log.user?.email ?? log.userId}</span>
                  </td>
                  <td className="px-4 py-2 text-slate-700 truncate max-w-[200px]" title={log.filename}>
                    {log.filename}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        log.status === "success"
                          ? "text-emerald-600 font-medium"
                          : "text-amber-600"
                      }
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{log.invoiceDate ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {log.amount != null ? `${log.amount} ${log.currency ?? ""}` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {log.driveLink ? (
                      <a
                        href={log.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        Link
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
              {range !== "all" && ` · ${rangeLabel}`}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/logs?page=${page - 1}${baseQuery ? `&${baseQuery}` : ""}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/logs?page=${page + 1}${baseQuery ? `&${baseQuery}` : ""}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
