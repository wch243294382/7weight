import {
  getCurrentDateRange,
  getLastWeekDateRange,
  getLastMonthDateRange,
  getLastYearDateRange,
  filterWeightsByDateRange,
  calculateWeightStats,
  findClosestWeight,
  calculateComparison,
  formatDate,
  formatDateRange
} from './statsUtils';
import { WeightRecord } from '@/types';

// 模拟体重记录数据
const mockWeights: WeightRecord[] = [
  { _id: '1', value: 70.5, date: '2026-03-01' },
  { _id: '2', value: 71.0, date: '2026-03-02' },
  { _id: '3', value: 70.8, date: '2026-03-03' },
  { _id: '4', value: 70.6, date: '2026-03-04' },
  { _id: '5', value: 70.4, date: '2026-03-05' },
  { _id: '6', value: 70.2, date: '2026-03-06' },
  { _id: '7', value: 70.0, date: '2026-03-07' },
  // 上周数据
  { _id: '8', value: 71.5, date: '2026-02-28' },
  { _id: '9', value: 71.3, date: '2026-02-27' },
  { _id: '10', value: 71.1, date: '2026-02-26' },
  { _id: '11', value: 71.0, date: '2026-02-25' },
  { _id: '12', value: 70.9, date: '2026-02-24' },
  { _id: '13', value: 70.8, date: '2026-02-23' },
  { _id: '14', value: 70.7, date: '2026-02-22' },
  // 上月数据
  { _id: '15', value: 72.0, date: '2026-02-07' },
  { _id: '16', value: 71.8, date: '2026-02-06' },
  { _id: '17', value: 71.6, date: '2026-02-05' },
  { _id: '18', value: 71.4, date: '2026-02-04' },
  { _id: '19', value: 71.2, date: '2026-02-03' },
  { _id: '20', value: 71.0, date: '2026-02-02' },
  { _id: '21', value: 70.8, date: '2026-02-01' },
  // 去年数据
  { _id: '22', value: 75.0, date: '2025-03-07' },
  { _id: '23', value: 74.8, date: '2025-03-06' },
  { _id: '24', value: 74.6, date: '2025-03-05' },
  { _id: '25', value: 74.4, date: '2025-03-04' },
  { _id: '26', value: 74.2, date: '2025-03-03' },
  { _id: '27', value: 74.0, date: '2025-03-02' },
  { _id: '28', value: 73.8, date: '2025-03-01' },
];

describe('statsUtils', () => {
  describe('Date Range Calculations', () => {
    test('getCurrentDateRange should return last 7 days', () => {
      const range = getCurrentDateRange();
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      expect(range.end.getDate()).toBe(today.getDate());
      expect(range.start.getDate()).toBe(sevenDaysAgo.getDate());
    });

    test('getLastWeekDateRange should return last week same period', () => {
      const range = getLastWeekDateRange();
      const lastWeekEnd = new Date();
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekStart.getDate() - 6);

      expect(range.end.getDate()).toBe(lastWeekEnd.getDate());
      expect(range.start.getDate()).toBe(lastWeekStart.getDate());
    });

    test('getLastMonthDateRange should return last month same period', () => {
      const range = getLastMonthDateRange();
      const lastMonthEnd = new Date();
      lastMonthEnd.setMonth(lastMonthEnd.getMonth() - 1);
      const lastMonthStart = new Date(lastMonthEnd);
      lastMonthStart.setDate(lastMonthStart.getDate() - 6);

      expect(range.end.getMonth()).toBe(lastMonthEnd.getMonth());
      expect(range.start.getMonth()).toBe(lastMonthStart.getMonth());
    });

    test('getLastYearDateRange should return last year same period', () => {
      const range = getLastYearDateRange();
      const lastYearEnd = new Date();
      lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
      const lastYearStart = new Date(lastYearEnd);
      lastYearStart.setDate(lastYearStart.getDate() - 6);

      expect(range.end.getFullYear()).toBe(lastYearEnd.getFullYear());
      expect(range.start.getFullYear()).toBe(lastYearStart.getFullYear());
    });
  });

  describe('Data Filtering', () => {
    test('filterWeightsByDateRange should filter weights within date range', () => {
      const start = new Date('2026-03-01');
      const end = new Date('2026-03-03');
      const filtered = filterWeightsByDateRange(mockWeights, { start, end });
      expect(filtered.length).toBe(3);
      expect(filtered[0].date).toBe('2026-03-01');
      expect(filtered[filtered.length - 1].date).toBe('2026-03-03');
    });
  });

  describe('Stats Calculation', () => {
    test('calculateWeightStats should calculate correct stats', () => {
      const weights = mockWeights.slice(0, 7); // Current week
      const stats = calculateWeightStats(weights);
      expect(stats.average).toBeCloseTo(70.5, 1);
      expect(stats.min).toBe(70.0);
      expect(stats.max).toBe(71.0);
    });

    test('calculateWeightStats should return zero for empty weights', () => {
      const stats = calculateWeightStats([]);
      expect(stats.average).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
    });
  });

  describe('Closest Weight Finding', () => {
    test('findClosestWeight should find exact match', () => {
      const targetDate = new Date('2026-03-01');
      const closest = findClosestWeight(mockWeights, targetDate);
      expect(closest).not.toBeNull();
      expect(closest?.date).toBe('2026-03-01');
    });

    test('findClosestWeight should find closest previous weight when no exact match', () => {
      const targetDate = new Date('2026-03-08'); // No data for this date
      const closest = findClosestWeight(mockWeights, targetDate);
      expect(closest).not.toBeNull();
      expect(closest?.date).toBe('2026-03-07');
    });

    test('findClosestWeight should return null when no weights', () => {
      const targetDate = new Date('2026-03-01');
      const closest = findClosestWeight([], targetDate);
      expect(closest).toBeNull();
    });
  });

  describe('Comparison Calculation', () => {
    test('calculateComparison should calculate all periods', () => {
      const comparison = calculateComparison(mockWeights);
      expect(comparison.current).toBeDefined();
      expect(comparison.lastWeek).toBeDefined();
      expect(comparison.lastMonth).toBeDefined();
      expect(comparison.lastYear).toBeDefined();
    });

    test('calculateComparison should handle missing data', () => {
      // 创建一个只有今天数据的数组
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const limitedWeights: WeightRecord[] = [
        { _id: '1', value: 70.5, date: todayStr }
      ];
      const comparison = calculateComparison(limitedWeights);
      // 验证上周、上月、去年的数据是否不存在
      expect(comparison.lastWeek.exists).toBe(false);
      expect(comparison.lastMonth.exists).toBe(false);
      expect(comparison.lastYear.exists).toBe(false);
    });
  });

  describe('Formatting', () => {
    test('formatDate should format date correctly', () => {
      const date = new Date('2026-03-07');
      const formatted = formatDate(date);
      expect(formatted).toBe('2026-03-07');
    });

    test('formatDateRange should format range correctly', () => {
      const start = new Date('2026-03-01');
      const end = new Date('2026-03-07');
      const formatted = formatDateRange({ start, end });
      expect(formatted).toBe('2026-03-01 至 2026-03-07');
    });
  });
});