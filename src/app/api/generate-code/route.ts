import { NextRequest, NextResponse } from 'next/server'
import { AdvancedCodeGenerator } from '@/services/advanced-code-generator'

export async function POST(request: NextRequest) {
  try {
    const { figmaData, options, customCode } = await request.json()

    if (!figmaData) {
      return NextResponse.json(
        { error: 'Figma adatok szükségesek' },
        { status: 400 }
      )
    }

    // Create code generator
    const generator = new AdvancedCodeGenerator(figmaData, options)
    
    // Set custom code if provided
    if (customCode) {
      generator.setCustomCode(customCode)
    }
    
    // Generate components
    const components = generator.generateComponents()
    
    return NextResponse.json({
      success: true,
      components,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Code Generation Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Kódgenerálási hiba történt'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}