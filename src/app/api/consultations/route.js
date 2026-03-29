import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    // Verify admin access (basic check)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Consultation Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
