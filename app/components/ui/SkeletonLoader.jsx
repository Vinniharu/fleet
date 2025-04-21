"use client";

import React from "react";

export function TableRowSkeleton({ columns = 7 }) {
  return (
    <tr className="animate-pulse border-b border-gray-800">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-700 rounded"></div>
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 7 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-900/70 rounded-xl border border-yellow-500/20 shadow-lg">
        <thead>
          <tr className="border-b border-yellow-500/20">
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-4 w-20 bg-gray-700 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900/70 rounded-xl p-5 border border-yellow-500/20 shadow-lg animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 w-28 bg-gray-700 rounded"></div>
        <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
      </div>
      <div className="h-4 w-32 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3 mb-4">
        <div className="h-3 w-20 bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-3 w-20 bg-gray-700 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="h-3 w-16 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-12 bg-gray-700 rounded"></div>
        </div>
        <div>
          <div className="h-3 w-16 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="mt-2">
        <div className="h-6 w-full bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export function GridSkeleton({ cards = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(cards)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-900/70 rounded-xl p-4 border border-yellow-500/20 shadow-lg">
          <div className="h-3 w-24 bg-gray-700 rounded mb-2"></div>
          <div className="h-7 w-12 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function FlightLogsSkeleton({ view = "grid" }) {
  return (
    <div>
      <StatsSkeleton />
      {view === "grid" ? <GridSkeleton /> : <TableSkeleton />}
    </div>
  );
} 