// app/api/images/[...path]/route.ts
import { createClient } from '@/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Define your bucket mapping
const BUCKET_MAPPINGS = {
  'o': 'project-images',
} as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const resolvedParams = await params
    const path = resolvedParams.path

    // Guard against undefined
    if (!path || path.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 400 })
    }

    const [category, ...fileParts] = path
    const fileName = fileParts.join('/')

    if (!category || !fileName) {
      return NextResponse.json({ error: 'Image not found' }, { status: 400 })
    }

    const bucketName = BUCKET_MAPPINGS[category as keyof typeof BUCKET_MAPPINGS]

    if (!bucketName) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }


    const supabase = await createClient()
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(fileName)

    if (error || !data) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const contentType = getContentType(fileName, data.type)

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function getContentType(fileName: string, blobType?: string): string {
  // Use blob type if available
  if (blobType) return blobType

  // Fall back to file extension
  const ext = fileName.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
  }

  return mimeTypes[ext || ''] || 'application/octet-stream'
}