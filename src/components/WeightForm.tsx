'use client';
import React, { useState } from 'react';

interface WeightFormProps {
  onAddWeight: (value: number, date: string) => void;
}

export default function WeightForm({ onAddWeight }: WeightFormProps) {
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const weightValue = parseFloat(value);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('请输入有效的体重值');
      return;
    }

    onAddWeight(weightValue, date);
    setValue('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold">添加体重记录</h3>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            体重 (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            step="0.1"
            min="0"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            日期
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          添加记录
        </button>
      </form>
    </div>
  );
}