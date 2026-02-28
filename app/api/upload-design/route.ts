import { NextRequest, NextResponse } from 'next/server'

const API_VERSION = '2025-01'
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

type GraphQLError = { message?: string }
type UserError = { field?: string[]; message?: string }
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function adminGraphql<T>(
  storeDomain: string,
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`https://${storeDomain}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(`Shopify Admin API request failed (${res.status})`)
  }
  if (Array.isArray(json?.errors) && json.errors.length > 0) {
    const msg = (json.errors as GraphQLError[]).map((e) => e.message).filter(Boolean).join('; ')
    throw new Error(msg || 'Shopify Admin API GraphQL error')
  }
  return json.data as T
}

function getFileUrl(fileNode: any): string | null {
  if (!fileNode || typeof fileNode !== 'object') return null
  if (typeof fileNode.url === 'string' && fileNode.url) return fileNode.url
  if (typeof fileNode?.image?.url === 'string' && fileNode.image.url) return fileNode.image.url
  if (typeof fileNode?.preview?.image?.url === 'string' && fileNode.preview.image.url) return fileNode.preview.image.url
  return null
}

async function waitForFileUrl(
  storeDomain: string,
  accessToken: string,
  fileId: string,
  attempts = 24,
  delayMs = 1000
) {
  const fileNodeQuery = `
    query fileNode($id: ID!) {
      node(id: $id) {
        __typename
        ... on GenericFile { id url }
        ... on MediaImage { id status image { url } preview { image { url } } }
      }
    }
  `

  for (let i = 0; i < attempts; i++) {
    const nodeData = await adminGraphql<{ node: any }>(storeDomain, accessToken, fileNodeQuery, { id: fileId })
    const url = getFileUrl(nodeData?.node)
    if (url) return url
    if (i < attempts - 1) await sleep(delayMs)
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE || ''
    const accessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || ''

    if (!storeDomain || !accessToken) {
      return NextResponse.json(
        { error: 'Missing Shopify env vars: SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_API_ACCESS_TOKEN are required.' },
        { status: 500, headers: CORS_HEADERS }
      )
    }

    const contentType = request.headers.get('content-type') || ''

    let file: File | null = null
    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}))
      const dataUrl =
        typeof body?.imageBase64 === 'string' ? body.imageBase64 :
        typeof body?.image === 'string' ? body.image :
        typeof body?.dataUrl === 'string' ? body.dataUrl :
        ''

      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return NextResponse.json({ error: 'No valid image data provided' }, { status: 400, headers: CORS_HEADERS })
      }

      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/)
      if (!match) {
        return NextResponse.json({ error: 'Invalid image data URL' }, { status: 400, headers: CORS_HEADERS })
      }

      const mimeType = match[1]
      const base64 = match[2]
      const buffer = Buffer.from(base64, 'base64')
      const filename = `design-${Date.now()}.${mimeType.split('/')[1] || 'png'}`
      file = new File([buffer], filename, { type: mimeType })
    } else {
      const formData = await request.formData()
      const formFile = formData.get('image')
      if (formFile instanceof File) file = formFile
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400, headers: CORS_HEADERS })
    }

    const stagedQuery = `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters { name value }
          }
          userErrors { field message }
        }
      }
    `

    const stagedData = await adminGraphql<{
      stagedUploadsCreate: {
        stagedTargets: Array<{
          url: string
          resourceUrl: string
          parameters: Array<{ name: string; value: string }>
        }>
        userErrors: UserError[]
      }
    }>(storeDomain, accessToken, stagedQuery, {
      input: [
        {
          filename: file.name || `design-${Date.now()}.png`,
          mimeType: file.type || 'image/png',
          resource: 'IMAGE',
          httpMethod: 'POST',
          fileSize: String(file.size),
        },
      ],
    })

    const stagedErrors = stagedData?.stagedUploadsCreate?.userErrors || []
    if (stagedErrors.length > 0) {
      return NextResponse.json(
        { error: stagedErrors.map((e) => e.message).filter(Boolean).join('; ') || 'Failed to create staged upload target' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const target = stagedData?.stagedUploadsCreate?.stagedTargets?.[0]
    if (!target?.url || !target?.resourceUrl) {
      return NextResponse.json({ error: 'No staged upload target returned from Shopify' }, { status: 500, headers: CORS_HEADERS })
    }

    const uploadForm = new FormData()
    for (const p of target.parameters || []) uploadForm.append(p.name, p.value)
    uploadForm.append('file', file)

    const uploadRes = await fetch(target.url, { method: 'POST', body: uploadForm })
    if (!uploadRes.ok) {
      return NextResponse.json({ error: 'Staged upload to Shopify failed' }, { status: 500, headers: CORS_HEADERS })
    }

    const fileCreateMutation = `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            __typename
            ... on GenericFile { id url }
            ... on MediaImage { id image { url } preview { image { url } } }
          }
          userErrors { field message }
        }
      }
    `

    const fileCreateData = await adminGraphql<{
      fileCreate: {
        files: any[]
        userErrors: UserError[]
      }
    }>(storeDomain, accessToken, fileCreateMutation, {
      files: [
        {
          contentType: 'IMAGE',
          originalSource: target.resourceUrl,
        },
      ],
    })

    const fileErrors = fileCreateData?.fileCreate?.userErrors || []
    if (fileErrors.length > 0) {
      return NextResponse.json(
        { error: fileErrors.map((e) => e.message).filter(Boolean).join('; ') || 'Shopify fileCreate failed' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const created = fileCreateData?.fileCreate?.files?.[0]
    const createdId = typeof created?.id === 'string' ? created.id : ''
    let url = getFileUrl(created)
    if (!url && createdId) {
      url = await waitForFileUrl(storeDomain, accessToken, createdId)
    }
    if (!url) {
      return NextResponse.json(
        { error: 'Shopify file created but still processing. Please retry in a few seconds.' },
        { status: 502, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json({
      success: true,
      url,
      provider: 'shopify-files',
      store: storeDomain,
    }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('[upload-design] error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
