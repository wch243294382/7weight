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

    // 计算7日平均值
    const dates = weights.map(w => new Date(w.date).toLocaleDateString('zh-CN'));
    const values = weights.map(w => w.value);
    const sevenDayAverages = [];

    for (let i = 0; i < weights.length; i++) {
      if (i < 6) {
        sevenDayAverages.push(null);
      } else {
        const sum = weights.slice(i - 6, i + 1).reduce((acc, w) => acc + w.value, 0);
        sevenDayAverages.push(sum / 7);
      }
    }

    const option = {
      title: {
        text: '体重变化趋势',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
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
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: 'value',
        name: '体重 (kg)',
      },
      series: [
        {
          name: '体重',
          type: 'line',
          data: values,
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
          data: sevenDayAverages,
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

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [weights]);

  return (
    <div className="w-full h-80">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}