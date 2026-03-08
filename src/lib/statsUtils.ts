import { WeightRecord } from '@/types';

// 日期范围接口
export interface DateRange {
  start: Date;
  end: Date;
}

// 对比结果接口
export interface ComparisonResult {
  current: {
    range: DateRange;
    average: number;
    min: number;
    max: number;
  };
  lastWeek: {
    range: DateRange;
    average: number;
    min: number;
    max: number;
    difference: number;
    percentage: number;
    exists: boolean;
  };
  lastMonth: {
    range: DateRange;
    average: number;
    min: number;
    max: number;
    difference: number;
    percentage: number;
    exists: boolean;
  };
  lastYear: {
    range: DateRange;
    average: number;
    min: number;
    max: number;
    difference: number;
    percentage: number;
    exists: boolean;
  };
}

// 计算当前日期范围（最近7天）
export function getCurrentDateRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6); // 7天范围
  return { start, end };
}

// 计算上周同期日期范围
export function getLastWeekDateRange(): DateRange {
  const end = new Date();
  end.setDate(end.getDate() - 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return { start, end };
}

// 计算上月同期日期范围
export function getLastMonthDateRange(): DateRange {
  const end = new Date();
  end.setMonth(end.getMonth() - 1);
  // 处理月份天数不同的情况
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return { start, end };
}

// 计算去年同期日期范围
export function getLastYearDateRange(): DateRange {
  const end = new Date();
  end.setFullYear(end.getFullYear() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return { start, end };
}

// 过滤指定日期范围内的体重记录
export function filterWeightsByDateRange(weights: WeightRecord[], range: DateRange): WeightRecord[] {
  return weights.filter(weight => {
    const weightDate = new Date(weight.date);
    return weightDate >= range.start && weightDate <= range.end;
  });
}

// 计算体重记录的统计数据
export function calculateWeightStats(weights: WeightRecord[]) {
  if (weights.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0
    };
  }

  const values = weights.map(w => w.value);
  return {
    average: values.reduce((sum, val) => sum + val, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

// 智能日期匹配，当找不到对应日期时，自动匹配更前一天的数据
export function findClosestWeight(weights: WeightRecord[], targetDate: Date): WeightRecord | null {
  const targetDateStr = targetDate.toISOString().split('T')[0];
  
  // 首先尝试精确匹配
  const exactMatch = weights.find(w => {
    const weightDateStr = new Date(w.date).toISOString().split('T')[0];
    return weightDateStr === targetDateStr;
  });
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // 如果没有精确匹配，查找最接近的前一天数据
  let closestWeight: WeightRecord | null = null;
  let closestDays = Infinity;
  
  weights.forEach(weight => {
    const weightDate = new Date(weight.date);
    const daysDiff = (targetDate.getTime() - weightDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 0 && daysDiff < closestDays) {
      closestDays = daysDiff;
      closestWeight = weight;
    }
  });
  
  return closestWeight;
}

// 计算同期对比结果
export function calculateComparison(weights: WeightRecord[]): ComparisonResult {
  // 过滤异常数据
  const validWeights = weights.filter(w => w.value > 0 && w.value < 500);
  
  // 计算各日期范围
  const currentRange = getCurrentDateRange();
  const lastWeekRange = getLastWeekDateRange();
  const lastMonthRange = getLastMonthDateRange();
  const lastYearRange = getLastYearDateRange();
  
  // 过滤各日期范围的体重记录
  const currentWeights = filterWeightsByDateRange(validWeights, currentRange);
  const lastWeekWeights = filterWeightsByDateRange(validWeights, lastWeekRange);
  const lastMonthWeights = filterWeightsByDateRange(validWeights, lastMonthRange);
  const lastYearWeights = filterWeightsByDateRange(validWeights, lastYearRange);
  
  // 计算各时期的统计数据
  const currentStats = calculateWeightStats(currentWeights);
  const lastWeekStats = calculateWeightStats(lastWeekWeights);
  const lastMonthStats = calculateWeightStats(lastMonthWeights);
  const lastYearStats = calculateWeightStats(lastYearWeights);
  
  // 计算差值和百分比
  const lastWeekDiff = currentStats.average - lastWeekStats.average;
  const lastWeekPercentage = lastWeekStats.average > 0 ? (lastWeekDiff / lastWeekStats.average) * 100 : 0;
  
  const lastMonthDiff = currentStats.average - lastMonthStats.average;
  const lastMonthPercentage = lastMonthStats.average > 0 ? (lastMonthDiff / lastMonthStats.average) * 100 : 0;
  
  const lastYearDiff = currentStats.average - lastYearStats.average;
  const lastYearPercentage = lastYearStats.average > 0 ? (lastYearDiff / lastYearStats.average) * 100 : 0;
  
  return {
    current: {
      range: currentRange,
      ...currentStats
    },
    lastWeek: {
      range: lastWeekRange,
      ...lastWeekStats,
      difference: lastWeekDiff,
      percentage: lastWeekPercentage,
      exists: lastWeekWeights.length > 0
    },
    lastMonth: {
      range: lastMonthRange,
      ...lastMonthStats,
      difference: lastMonthDiff,
      percentage: lastMonthPercentage,
      exists: lastMonthWeights.length > 0
    },
    lastYear: {
      range: lastYearRange,
      ...lastYearStats,
      difference: lastYearDiff,
      percentage: lastYearPercentage,
      exists: lastYearWeights.length > 0
    }
  };
}

// 格式化日期为字符串
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// 格式化日期范围为字符串
export function formatDateRange(range: DateRange): string {
  return `${formatDate(range.start)} 至 ${formatDate(range.end)}`;
}