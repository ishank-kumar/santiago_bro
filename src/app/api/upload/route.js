import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.name.replace(/\s+/g, '-').toLowerCase();
    const savedFilename = `${uniqueSuffix}-${filename}`;

    const publicDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    const path = join(publicDir, savedFilename);
    
    // Save to public directory
    await writeFile(path, buffer);

    // Return the public URL
    return NextResponse.json({ url: `/uploads/${savedFilename}` });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
