'use client';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface WeightRecord {
  _id: string;
  value: number;
  date: string;
}

interface WeightChartProps {
  weights: WeightRecord[];
}

export default function WeightChart({ weights }: WeightChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    if (weights.length === 0) {
      chart.setOption({
        title: {
          text: '体重变化趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
          name: '体重 (kg)',
        },
        series: [],
      });
      return;
    }

    // 按日期正序排序（从旧到新）
    const sortedWeights = [...weights].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // 计算所有数据的7日平均值（精确到小数点后两位）
    const allDates = sortedWeights.map(w => new Date(w.date).toLocaleDateString('zh-CN'));
    const allValues = sortedWeights.map(w => w.value);
    const allSevenDayAverages = [];

    for (let i = 0; i < sortedWeights.length; i++) {
      if (i < 6) {
        allSevenDayAverages.push(null);
      } else {
        const sum = sortedWeights.slice(i - 6, i + 1).reduce((acc, w) => acc + w.value, 0);
        allSevenDayAverages.push(parseFloat((sum / 7).toFixed(2)));
      }
    }

    // 只取最近30天的数据用于默认显示
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentWeights = sortedWeights.filter(w => {
      return new Date(w.date) >= thirtyDaysAgo;
    });

    const dates = recentWeights.map(w => new Date(w.date).toLocaleDateString('zh-CN'));
    const values = recentWeights.map(w => w.value);
    const sevenDayAverages = allSevenDayAverages.slice(-recentWeights.length);

    // 计算Y轴动态范围
    const visibleValues = values.filter(val => val !== null && val !== undefined);
    if (visibleValues.length > 0) {
      const min = Math.min(...visibleValues);
      const max = Math.max(...visibleValues);
      const padding = (max - min) * 0.1;
      const yMin = min - padding;
      const yMax = max + padding;

      // 计算默认显示的范围（最近30天）
      const totalDataPoints = sortedWeights.length;
      const recentDataPoints = recentWeights.length;
      const defaultStart = Math.max(0, (totalDataPoints - recentDataPoints) / totalDataPoints * 100);

      const option = {
        title: {
          text: '体重变化趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            let result = params[0].name + '<br/>';
            params.forEach((item: any) => {
              const value = item.value !== null ? item.value.toFixed(item.seriesName === '7日平均' ? 2 : 1) : '-';
              result += item.marker + item.seriesName + ': ' + value + ' kg<br/>';
            });
            return result;
          },
        },
        legend: {
          data: ['体重', '7日平均'],
          top: 30,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'inside',
            start: defaultStart,
            end: 100,
            minValueSpan: 5,
            maxValueSpan: 50,
          },
          {
            start: defaultStart,
            end: 100,
            height: 20,
            bottom: 0,
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: allDates,
        },
        yAxis: {
          type: 'value',
          name: '体重 (kg)',
          min: yMin,
          max: yMax,
          axisLabel: {
            formatter: '{value} kg',
          },
          axisPointer: {
            label: {
              formatter: (params: any) => {
                return `体重: ${params.value.toFixed(1)} kg`;
              },
            },
          },
        },
        series: [
          {
            name: '体重',
            type: 'line',
            data: allValues,
            smooth: true,
            lineStyle: {
              width: 2,
            },
            itemStyle: {
              color: '#1890ff',
            },
          },
          {
            name: '7日平均',
            type: 'line',
            data: allSevenDayAverages,
            smooth: true,
            lineStyle: {
              width: 2,
              type: 'dashed',
            },
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      };

      chart.setOption(option);

      // 监听缩放事件，动态调整Y轴范围
      chart.on('dataZoom', function(params: any) {
        const start = params.start;
        const end = params.end;
        const startIndex = Math.floor((allValues.length - 1) * start / 100);
        const endIndex = Math.floor((allValues.length - 1) * end / 100);
        const visibleValues = allValues.slice(startIndex, endIndex + 1).filter(val => val !== null && val !== undefined);
        
        if (visibleValues.length > 0) {
          const min = Math.min(...visibleValues);
          const max = Math.max(...visibleValues);
          const padding = (max - min) * 0.1;
          const yMin = min - padding;
          const yMax = max + padding;

          chart.setOption({
            yAxis: {
              min: yMin,
              max: yMax,
            },
          });
        }
      });

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [weights]);

  return (
    <div className="w-full h-80">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}