import { NextRequest, NextResponse } from 'next/server'

const CLOUDINARY_CLOUD_NAME = 'dzeolercm'
const CLOUDINARY_API_KEY = '248128115261764'
const CLOUDINARY_API_SECRET = 'AYH0NW-BQufgNZ91L8kg1Ns2czg'

async function generateSignature(params: Record<string, string>) {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  const toSign = sorted + CLOUDINARY_API_SECRET

  const encoder = new TextEncoder()
  const data = encoder.encode(toSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUri = `data:image/png;base64,${base64}`

    const timestamp = Math.round(Date.now() / 1000).toString()
    const folder = 'sign-designs'

    const params: Record<string, string> = {
      folder,
      timestamp,
    }

    const signature = await generateSignature(params)

    const cloudinaryForm = new FormData()
    cloudinaryForm.append('file', dataUri)
    cloudinaryForm.append('api_key', CLOUDINARY_API_KEY)
    cloudinaryForm.append('timestamp', timestamp)
    cloudinaryForm.append('signature', signature)
    cloudinaryForm.append('folder', folder)

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudinaryForm }
    )

    if (!cloudinaryRes.ok) {
      const errorData = await cloudinaryRes.json()
      console.error('[v0] Cloudinary upload error:', errorData)
      return NextResponse.json(
        { error: 'Cloudinary upload failed', details: errorData },
        { status: 500 }
      )
    }

    const result = await cloudinaryRes.json()

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      filename: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
