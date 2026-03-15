"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type UserOption = {
  id: string;
  label: string;
};

export function UserFilterClient({
  users,
  currentUserId,
  basePath,
  currentRange,
}: {
  users: UserOption[];
  currentUserId?: string;
  basePath: string;
  currentRange: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChangeUser = (userId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (userId) {
      params.set("userId", userId);
    } else {
      params.delete("userId");
    }
    if (currentRange && currentRange !== "all") {
      params.set("range", currentRange);
    }
    startTransition(() => {
      router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  const handleDeleteLogs = async () => {
    if (!currentUserId) return;
    const confirmed = window.confirm("Delete all processing logs for this user? This cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/logs/${currentUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to delete logs");
        return;
      }
      alert(`Deleted ${data.deleted ?? 0} logs for this user.`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete logs");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <select
        value={currentUserId ?? ""}
        onChange={(e) => handleChangeUser(e.target.value)}
        className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        disabled={isPending}
      >
        <option value="">All users</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleDeleteLogs}
        disabled={!currentUserId || isPending}
        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Delete logs for user
      </button>
    </div>
  );
}

