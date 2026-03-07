'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import AuthForm from '@/components/AuthForm';
import WeightForm from '@/components/WeightForm';
import WeightList from '@/components/WeightList';
import WeightChart from '@/components/WeightChart';

interface WeightRecord {
  _id: string;
  value: number;
  date: string;
}

export default function Home() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token, logout } = useAuth();

  const fetchWeights = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch('/api/weight', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWeights(data);
      }
    } catch (error) {
      console.error('Error fetching weights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, [token]);

  const handleAddWeight = async (value: number, date: string) => {
    if (!token) return;
    try {
      const response = await fetch('/api/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value, date }),
      });
      if (response.ok) {
        fetchWeights();
      }
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const handleUpdateWeight = async (id: string, value: number, date: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/weight/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value, date }),
      });
      if (response.ok) {
        fetchWeights();
      }
    } catch (error) {
      console.error('Error updating weight:', error);
    }
  };

  const handleDeleteWeight = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/weight/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchWeights();
      }
    } catch (error) {
      console.error('Error deleting weight:', error);
    }
  };

  const calculateStats = () => {
    if (weights.length === 0) return { min: 0, max: 0, average: 0, change: 0 };

    const values = weights.map(w => w.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const change = values[values.length - 1] - values[0];

    return { min, max, average, change };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">7Weight</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                退出
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <AuthForm
              mode={mode}
              onSwitchMode={() => setMode(mode === 'login' ? 'register' : 'login')}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">体重管理</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WeightForm onAddWeight={handleAddWeight} />
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">体重统计</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-gray-600">最低体重</p>
                      <p className="text-xl font-semibold">{stats.min.toFixed(1)} kg</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-gray-600">最高体重</p>
                      <p className="text-xl font-semibold">{stats.max.toFixed(1)} kg</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-gray-600">平均体重</p>
                      <p className="text-xl font-semibold">{stats.average.toFixed(1)} kg</p>
                    </div>
                    <div className={`bg-${stats.change < 0 ? 'green' : 'red'}-100 p-4 rounded-md`}>
                      <p className="text-sm text-gray-600">总体变化</p>
                      <p className={`text-xl font-semibold text-${stats.change < 0 ? 'green' : 'red'}-600`}>
                        {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <WeightChart weights={weights} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              {loading ? (
                <div className="text-center py-8">加载中...</div>
              ) : (
                <WeightList
                  weights={weights}
                  onUpdateWeight={handleUpdateWeight}
                  onDeleteWeight={handleDeleteWeight}
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">健康建议</h3>
              <div className="prose">
                <p>1. 保持规律的饮食习惯，避免暴饮暴食</p>
                <p>2. 每天进行适量的运动，如散步、跑步或游泳</p>
                <p>3. 保证充足的睡眠时间，建议每天7-8小时</p>
                <p>4. 定期测量体重，记录变化趋势</p>
                <p>5. 保持良好的心态，避免压力过大</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white shadow-inner mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p>© 2026 7Weight - 体重记录与分析应用</p>
        </div>
      </footer>
    </div>
  );
}