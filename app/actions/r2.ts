// app/actions/r2.ts
'use server'

import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.R2_PUBLIC_URL!

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

/**
 * Upload image to R2
 * @param formData - Must contain 'file', 'id', and 'directory' (e.g., 'projects', 'posts')
 */
export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  const id = formData.get('id') as string
  const directory = formData.get('directory') as string  // 'projects' or 'posts'

  if (!file || !id || !directory) {
    throw new Error('File, id, and directory are required')
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.')
  }

  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 2MB.')
  }

  const sanitizedFilename = sanitizeFilename(file.name)
  const key = `${directory}/${id}/${sanitizedFilename}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  )

  const imageUrl = `${PUBLIC_URL}/${key}`
  return imageUrl
}

/**
 * Delete image(s) from R2
 * @param options.url - Delete specific image by URL
 * @param options.id - Delete entire folder by ID
 * @param options.directory - Required when using id (e.g., 'projects', 'posts')
 */
export async function deleteImage(options: {
  url?: string
  id?: string
  directory?: string
}) {
  const { url, id, directory } = options

  if (url) {
    // Only delete if URL is from our R2 bucket
    if (!url.startsWith(PUBLIC_URL)) {
      return
    }

    const key = url.replace(`${PUBLIC_URL}/`, '')

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    )
  } else if (id && directory) {
    const prefix = `${directory}/${id}/`

    const listResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      })
    )

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      await Promise.all(
        listResponse.Contents.map((obj) =>
          s3Client.send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: obj.Key,
            })
          )
        )
      )
    }
  }
}