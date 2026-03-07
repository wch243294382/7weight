'use client';
import React, { useState } from 'react';

interface WeightRecord {
  _id: string;
  value: number;
  date: string;
}

interface WeightListProps {
  weights: WeightRecord[];
  onUpdateWeight: (id: string, value: number, date: string) => void;
  onDeleteWeight: (id: string) => void;
}

export default function WeightList({ weights, onUpdateWeight, onDeleteWeight }: WeightListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDate, setEditDate] = useState('');

  const handleEdit = (weight: WeightRecord) => {
    setEditingId(weight._id);
    setEditValue(weight.value.toString());
    setEditDate(new Date(weight.date).toISOString().split('T')[0]);
  };

  const handleSave = (id: string) => {
    const value = parseFloat(editValue);
    if (isNaN(value) || value <= 0) return;

    onUpdateWeight(id, value, editDate);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">体重记录</h3>
      {weights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无体重记录
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">日期</th>
                <th className="py-2 px-4 border-b">体重 (kg)</th>
                <th className="py-2 px-4 border-b">操作</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((weight) => (
                <tr key={weight._id}>
                  {editingId === weight._id ? (
                    <>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          step="0.1"
                          min="0"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(weight._id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            保存
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
                          >
                            取消
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 border-b">
                        {new Date(weight.date).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="py-2 px-4 border-b">{weight.value}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(weight)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onDeleteWeight(weight._id)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}