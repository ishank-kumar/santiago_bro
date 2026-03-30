import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const image = user.imageUrl;

    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email,
        name,
        image,
      },
      create: {
        clerkId: user.id,
        email,
        name,
        image,
        role: 'USER' // Default role for all new logins
      }
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
