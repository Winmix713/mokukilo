import { NextRequest, NextResponse } from 'next/server'
import { FigmaApiClient } from '@/services/figma-api'

export async function POST(request: NextRequest) {
  try {
    const { figmaUrl, apiKey } = await request.json()

    if (!figmaUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Figma URL és API kulcs szükséges' },
        { status: 400 }
      )
    }

    // Validate API key format
    if (!FigmaApiClient.validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Érvénytelen API kulcs formátum' },
        { status: 400 }
      )
    }

    // Extract file key from URL
    const fileKey = FigmaApiClient.extractFileKey(figmaUrl)
    
    // Create API client and fetch data
    const apiClient = new FigmaApiClient(apiKey)
    
    // Validate connection first
    const isValidConnection = await apiClient.validateConnection()
    if (!isValidConnection) {
      return NextResponse.json(
        { error: 'Érvénytelen API kulcs vagy nincs hozzáférés a Figma API-hoz' },
        { status: 401 }
      )
    }

    // Fetch file data
    const figmaData = await apiClient.getFile(fileKey)
    
    return NextResponse.json({
      success: true,
      data: figmaData,
      fileKey
    })

  } catch (error) {
    console.error('Figma API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba történt'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Figma API endpoint - használj POST kérést' },
    { status: 405 }
  )
}