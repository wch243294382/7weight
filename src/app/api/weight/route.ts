import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Weight from '@/models/Weight';
import jwt from 'jsonwebtoken';

interface WeightData {
  value: number;
  date: string;
}

function getUserIdFromToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return (decoded as any).userId;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data: WeightData = await request.json();
    const { value, date } = data;

    if (!value || !date) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const weight = new Weight({
      userId,
      value,
      date: new Date(date),
    });

    await weight.save();
    return NextResponse.json(weight, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const weights = await Weight.find({ userId }).sort({ date: 'asc' });
    return NextResponse.json(weights, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}