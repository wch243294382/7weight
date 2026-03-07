import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Weight from '@/models/Weight';
import jwt from 'jsonwebtoken';

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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    const weight = await Weight.findOne({ _id: id, userId });
    if (!weight) {
      return NextResponse.json({ error: 'Weight record not found' }, { status: 404 });
    }

    if (data.value) weight.value = data.value;
    if (data.date) weight.date = new Date(data.date);

    await weight.save();
    return NextResponse.json(weight, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const weight = await Weight.findOneAndDelete({ _id: id, userId });
    if (!weight) {
      return NextResponse.json({ error: 'Weight record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Weight record deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}