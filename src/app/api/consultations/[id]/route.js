import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth();

    // Verify admin access (basic check)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const updatedInquiry = await prisma.consultation.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, consultation: updatedInquiry });
  } catch (error) {
    console.error('Consultation Status Update Error:', error);
    return NextResponse.json({ error: 'Failed to update consultation status' }, { status: 500 });
  }
}
