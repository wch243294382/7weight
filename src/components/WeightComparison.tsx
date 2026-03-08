'use client';
import React, { useState, useEffect } from 'react';
import { WeightRecord } from '@/types';
import { calculateComparison, formatDateRange } from '@/lib/statsUtils';

interface WeightComparisonProps {
  weights: WeightRecord[];
}

export default function WeightComparison({ weights }: WeightComparisonProps) {
  const [comparison, setComparison] = useState(() => calculateComparison(weights));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // 使用setTimeout模拟异步计算，实际项目中可能需要从服务器获取更多数据
    const timer = setTimeout(() => {
      setComparison(calculateComparison(weights));
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [weights]);

  const getTrendClass = (difference: number) => {
    if (difference < 0) return 'text-green-600';
    if (difference > 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (difference: number) => {
    if (difference < 0) return '↓';
    if (difference > 0) return '↑';
    return '→';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">计算同期对比数据中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">同期对比分析</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 上周同期对比 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">上周同期</h4>
          <p className="text-sm text-gray-600 mb-3">{formatDateRange(comparison.lastWeek.range)}</p>
          {comparison.lastWeek.exists ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">平均体重</span>
                <span className="font-medium">{comparison.lastWeek.average.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">变化</span>
                <span className={`font-medium ${getTrendClass(comparison.lastWeek.difference)}`}>
                  {getTrendIcon(comparison.lastWeek.difference)} {Math.abs(comparison.lastWeek.difference).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">变化百分比</span>
                <span className={`font-medium ${getTrendClass(comparison.lastWeek.percentage)}`}>
                  {getTrendIcon(comparison.lastWeek.percentage)} {Math.abs(comparison.lastWeek.percentage).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              无上周同期数据
            </div>
          )}
        </div>

        {/* 上月同期对比 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">上月同期</h4>
          <p className="text-sm text-gray-600 mb-3">{formatDateRange(comparison.lastMonth.range)}</p>
          {comparison.lastMonth.exists ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">平均体重</span>
                <span className="font-medium">{comparison.lastMonth.average.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">变化</span>
                <span className={`font-medium ${getTrendClass(comparison.lastMonth.difference)}`}>
                  {getTrendIcon(comparison.lastMonth.difference)} {Math.abs(comparison.lastMonth.difference).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">变化百分比</span>
                <span className={`font-medium ${getTrendClass(comparison.lastMonth.percentage)}`}>
                  {getTrendIcon(comparison.lastMonth.percentage)} {Math.abs(comparison.lastMonth.percentage).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              无上月同期数据
            </div>
          )}
        </div>

        {/* 去年同期对比 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">去年同期</h4>
          <p className="text-sm text-gray-600 mb-3">{formatDateRange(comparison.lastYear.range)}</p>
          {comparison.lastYear.exists ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">平均体重</span>
                <span className="font-medium">{comparison.lastYear.average.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">变化</span>
                <span className={`font-medium ${getTrendClass(comparison.lastYear.difference)}`}>
                  {getTrendIcon(comparison.lastYear.difference)} {Math.abs(comparison.lastYear.difference).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">变化百分比</span>
                <span className={`font-medium ${getTrendClass(comparison.lastYear.percentage)}`}>
                  {getTrendIcon(comparison.lastYear.percentage)} {Math.abs(comparison.lastYear.percentage).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              无去年同期数据
            </div>
          )}
        </div>
      </div>

      {/* 详细对比表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">时期</th>
              <th className="py-2 px-4 border-b text-right">日期范围</th>
              <th className="py-2 px-4 border-b text-right">平均体重 (kg)</th>
              <th className="py-2 px-4 border-b text-right">最低体重 (kg)</th>
              <th className="py-2 px-4 border-b text-right">最高体重 (kg)</th>
              <th className="py-2 px-4 border-b text-right">与当前周期差值 (kg)</th>
              <th className="py-2 px-4 border-b text-right">变化百分比</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="py-2 px-4 border-b font-medium">当前周期</td>
              <td className="py-2 px-4 border-b text-right">{formatDateRange(comparison.current.range)}</td>
              <td className="py-2 px-4 border-b text-right font-medium">{comparison.current.average.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.current.min.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.current.max.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">-</td>
              <td className="py-2 px-4 border-b text-right">-</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">上周同期</td>
              <td className="py-2 px-4 border-b text-right">{formatDateRange(comparison.lastWeek.range)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastWeek.average.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastWeek.min.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastWeek.max.toFixed(1)}</td>
              <td className={`py-2 px-4 border-b text-right ${getTrendClass(comparison.lastWeek.difference)}`}>
                {comparison.lastWeek.difference.toFixed(1)}
              </td>
              <td className={`py-2 px-4 border-b text-right ${getTrendClass(comparison.lastWeek.percentage)}`}>
                {comparison.lastWeek.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-2 px-4 border-b">上月同期</td>
              <td className="py-2 px-4 border-b text-right">{formatDateRange(comparison.lastMonth.range)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastMonth.average.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastMonth.min.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastMonth.max.toFixed(1)}</td>
              <td className={`py-2 px-4 border-b text-right ${getTrendClass(comparison.lastMonth.difference)}`}>
                {comparison.lastMonth.difference.toFixed(1)}
              </td>
              <td className={`py-2 px-4 border-b text-right ${getTrendClass(comparison.lastMonth.percentage)}`}>
                {comparison.lastMonth.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">去年同期</td>
              <td className="py-2 px-4 border-b text-right">{formatDateRange(comparison.lastYear.range)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastYear.average.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastYear.min.toFixed(1)}</td>
              <td className="py-2 px-4 border-b text-right">{comparison.lastYear.max.toFixed(1)}</td>
              <td className={`py-2 px-4 border-b text-right ${getTrendClass(comparison.lastYear.difference)}`}>
                {comparison.lastYear.difference.toFixed(1)}
              </td>
              <td className={`py-2 px-4 border-b text-right ${getTrendClass(comparison.lastYear.percentage)}`}>
                {comparison.lastYear.percentage.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}