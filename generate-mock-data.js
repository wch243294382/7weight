const fetch = require('node-fetch');

// 生成一年的模拟体重数据
function generateMockWeights() {
  const weights = [];
  const startDate = new Date('2025-03-08');
  const endDate = new Date('2026-03-08');
  
  // 初始体重
  let currentWeight = 75.0;
  
  // 模拟体重变化趋势：先下降，然后稳定，最后略有上升
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    // 随机波动范围
    const randomChange = (Math.random() - 0.5) * 0.5;
    
    // 前3个月：稳步下降
    if (date <= new Date('2025-06-08')) {
      currentWeight = Math.max(70.0, currentWeight - 0.1 + randomChange);
    }
    // 中间6个月：相对稳定
    else if (date <= new Date('2025-12-08')) {
      currentWeight = Math.max(68.0, currentWeight + randomChange);
    }
    // 最后3个月：略有上升
    else {
      currentWeight = Math.min(70.0, currentWeight + 0.05 + randomChange);
    }
    
    weights.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentWeight.toFixed(1))
    });
  }
  
  return weights;
}

// 注册用户
async function registerUser() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '测试用户',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('注册结果:', data);
    return data.token;
  } catch (error) {
    console.error('注册失败:', error);
    return null;
  }
}

// 登录用户
async function loginUser() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('登录结果:', data);
    return data.token;
  } catch (error) {
    console.error('登录失败:', error);
    return null;
  }
}

// 添加体重数据
async function addWeights(token, weights) {
  try {
    for (const weight of weights) {
      const response = await fetch('http://localhost:3001/api/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(weight)
      });
      
      if (!response.ok) {
        console.error('添加体重数据失败:', await response.json());
      }
    }
    console.log('成功添加', weights.length, '条体重数据');
  } catch (error) {
    console.error('添加体重数据失败:', error);
  }
}

// 主函数
async function main() {
  console.log('生成模拟体重数据...');
  const weights = generateMockWeights();
  console.log('生成了', weights.length, '条体重数据');
  
  console.log('尝试登录用户...');
  let token = await loginUser();
  
  if (!token) {
    console.log('登录失败，尝试注册新用户...');
    token = await registerUser();
  }
  
  if (token) {
    console.log('开始添加体重数据...');
    await addWeights(token, weights);
    console.log('模拟数据生成完成！');
  } else {
    console.error('无法获取认证令牌，数据添加失败');
  }
}

main();
