'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FigmaApiResponse, GeneratedComponent } from '@/types/figma'
import { CodeGenerationOptions } from '@/services/advanced-code-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  Code2, 
  Download, 
  Copy, 
  Settings, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  Eye,
  FileCode,
  Palette,
  Plus,
  FileText
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { copyToClipboard, downloadFile } from '@/lib/utils'

interface CodeGenerationPanelProps {
  figmaData: FigmaApiResponse
  fileKey: string
}

interface CustomCodeInputs {
  jsx: string
  css: string
  cssAdvanced: string
}

interface CodeGenerationError {
  error: string
}

interface CodeGenerationSuccess {
  success: true
  components: GeneratedComponent[]
  generatedAt: string
}

export function CodeGenerationPanel({ figmaData, fileKey }: CodeGenerationPanelProps) {
  const [options, setOptions] = useState<CodeGenerationOptions>({
    framework: 'react',
    styling: 'tailwind',
    typescript: true,
    accessibility: true,
    responsive: true,
    optimizeImages: true,
  })

  const [customCode, setCustomCode] = useState<CustomCodeInputs>({
    jsx: '',
    css: '',
    cssAdvanced: ''
  })

  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<GeneratedComponent | null>(null)
  const [activeTab, setActiveTab] = useState('jsx')
  const [copied, setCopied] = useState<string | null>(null)
  const [showCustomInputs, setShowCustomInputs] = useState(false)

  const codeGenerationMutation = useMutation<CodeGenerationSuccess, CodeGenerationError, void>({
    mutationFn: async () => {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          figmaData,
          options,
          customCode
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Kódgenerálási hiba történt')
      }

      return result
    },
    onSuccess: (data) => {
      setGeneratedComponents(data.components)
      if (data.components.length > 0) {
        setSelectedComponent(data.components[0])
      }
    },
  })

  const handleGenerate = () => {
    codeGenerationMutation.mutate()
  }

  const handleCopy = async (content: string, type: string) => {
    try {
      await copyToClipboard(content)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Másolási hiba:', error)
    }
  }

  const handleDownload = (content: string, filename: string) => {
    downloadFile(content, filename)
  }

  const getFileExtension = (type: string) => {
    switch (type) {
      case 'jsx': return options.typescript ? '.tsx' : '.jsx'
      case 'css': return '.css'
      case 'typescript': return '.d.ts'
      default: return '.txt'
    }
  }

  const handleDownloadAll = () => {
    if (!selectedComponent) return
    
    const files = [
      { name: `${selectedComponent.name}${getFileExtension('jsx')}`, content: selectedComponent.jsx },
      { name: `${selectedComponent.name}.css`, content: selectedComponent.css },
    ]
    
    if (selectedComponent.typescript) {
      files.push({ name: `${selectedComponent.name}.d.ts`, content: selectedComponent.typescript })
    }
    
    files.forEach(file => {
      downloadFile(file.content, file.name)
    })
  }

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Kódgenerálási Beállítások</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Framework</Label>
              <Select value={options.framework} onValueChange={(value: any) => setOptions({...options, framework: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>CSS Framework</Label>
              <Select value={options.styling} onValueChange={(value: any) => setOptions({...options, styling: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                  <SelectItem value="css-modules">CSS Modules</SelectItem>
                  <SelectItem value="styled-components">Styled Components</SelectItem>
                  <SelectItem value="plain-css">Plain CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>További Opciók</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="typescript" 
                    checked={options.typescript}
                    onCheckedChange={(checked) => setOptions({...options, typescript: !!checked})}
                  />
                  <Label htmlFor="typescript">TypeScript</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="accessibility" 
                    checked={options.accessibility}
                    onCheckedChange={(checked) => setOptions({...options, accessibility: !!checked})}
                  />
                  <Label htmlFor="accessibility">Accessibility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="responsive" 
                    checked={options.responsive}
                    onCheckedChange={(checked) => setOptions({...options, responsive: !!checked})}
                  />
                  <Label htmlFor="responsive">Responsive Design</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Code Section */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCustomInputs(!showCustomInputs)}
              className="mb-4 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCustomInputs ? 'Egyéni Kód Elrejtése' : 'Egyéni Kód Hozzáadása'}
            </Button>

            {showCustomInputs && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Egyéni Kód Hozzáadása</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-jsx" className="flex items-center space-x-2 mb-2">
                      <FileCode className="w-4 h-4" />
                      <span>JSX Kód Hozzáadása</span>
                    </Label>
                    <Textarea
                      id="custom-jsx"
                      placeholder="// Egyéni JSX kód, amely beépül a generált komponensbe"
                      value={customCode.jsx}
                      onChange={(e) => setCustomCode({...customCode, jsx: e.target.value})}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="custom-css" className="flex items-center space-x-2 mb-2">
                      <Palette className="w-4 h-4" />
                      <span>CSS Kód Hozzáadása</span>
                    </Label>
                    <Textarea
                      id="custom-css"
                      placeholder="/* Egyéni CSS stílusok */"
                      value={customCode.css}
                      onChange={(e) => setCustomCode({...customCode, css: e.target.value})}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="custom-css-advanced" className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4" />
                      <span>CSS++ Kód Hozzáadása (Fejlett)</span>
                    </Label>
                    <Textarea
                      id="custom-css-advanced"
                      placeholder="/* Fejlett CSS funkciók: animációk, transitions, custom properties */"
                      value={customCode.cssAdvanced}
                      onChange={(e) => setCustomCode({...customCode, cssAdvanced: e.target.value})}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleGenerate}
              disabled={codeGenerationMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-4"
            >
              {codeGenerationMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Kód Generálása...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4" />
                  <span>Kód Generálása</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {codeGenerationMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Kódgenerálási hiba:</span>
          </div>
          <p className="text-red-700 mt-1">{codeGenerationMutation.error.error}</p>
        </div>
      )}

      {/* Generated Components */}
      {generatedComponents.length > 0 && (
        <div className="space-y-6">
          {/* Component Selector */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileCode className="w-5 h-5" />
                  <span>Generált Komponensek ({generatedComponents.length})</span>
                </CardTitle>
                {selectedComponent && (
                  <Button onClick={handleDownloadAll} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Összes Letöltése
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedComponents.map((component) => (
                  <div
                    key={component.id}
                    onClick={() => setSelectedComponent(component)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedComponent?.id === component.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{component.name}</h4>
                      <Badge variant="outline">{component.metadata.componentType}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Pontosság: {component.metadata.estimatedAccuracy}%
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          component.accessibility.score >= 80 ? 'bg-green-500' : 
                          component.accessibility.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                          WCAG {component.accessibility.wcagCompliance}
                        </span>
                      </div>
                      {(customCode.jsx || customCode.css || customCode.cssAdvanced) && (
                        <Badge variant="secondary" className="text-xs">
                          <Plus className="w-3 h-3 mr-1" />
                          Egyéni
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Component Details */}
          {selectedComponent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>{selectedComponent.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {selectedComponent.metadata.complexity}
                    </Badge>
                    <Badge variant="outline">
                      {selectedComponent.metadata.estimatedAccuracy}% pontosság
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Quality Metrics */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Minőségi Mutatók</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Accessibility</span>
                        <span className="text-sm font-medium">{selectedComponent.accessibility.score}%</span>
                      </div>
                      <Progress value={selectedComponent.accessibility.score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Vizuális Pontosság</span>
                        <span className="text-sm font-medium">{selectedComponent.metadata.estimatedAccuracy}%</span>
                      </div>
                      <Progress value={selectedComponent.metadata.estimatedAccuracy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Responsive</span>
                        <span className="text-sm font-medium">
                          {selectedComponent.responsive.hasResponsiveDesign ? '100%' : '0%'}
                        </span>
                      </div>
                      <Progress 
                        value={selectedComponent.responsive.hasResponsiveDesign ? 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>

                {/* Code Display */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="jsx">
                        {options.typescript ? 'TSX' : 'JSX'}
                      </TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      {options.typescript && (
                        <TabsTrigger value="typescript">Types</TabsTrigger>
                      )}
                    </TabsList>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(
                          activeTab === 'jsx' ? selectedComponent.jsx :
                          activeTab === 'css' ? selectedComponent.css :
                          selectedComponent.typescript || '',
                          activeTab
                        )}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copied === activeTab ? 'Másolva!' : 'Másolás'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(
                          activeTab === 'jsx' ? selectedComponent.jsx :
                          activeTab === 'css' ? selectedComponent.css :
                          selectedComponent.typescript || '',
                          `${selectedComponent.name}${getFileExtension(activeTab)}`
                        )}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Letöltés
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="jsx">
                    <div className="max-h-96 overflow-auto rounded-lg">
                      <SyntaxHighlighter
                        language={options.typescript ? "tsx" : "jsx"}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                        }}
                        showLineNumbers
                      >
                        {selectedComponent.jsx}
                      </SyntaxHighlighter>
                    </div>
                  </TabsContent>

                  <TabsContent value="css">
                    <div className="max-h-96 overflow-auto rounded-lg">
                      <SyntaxHighlighter
                        language="css"
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                        }}
                        showLineNumbers
                      >
                        {selectedComponent.css}
                      </SyntaxHighlighter>
                    </div>
                  </TabsContent>

                  {options.typescript && selectedComponent.typescript && (
                    <TabsContent value="typescript">
                      <div className="max-h-96 overflow-auto rounded-lg">
                        <SyntaxHighlighter
                          language="typescript"
                          style={tomorrow}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                          }}
                          showLineNumbers
                        >
                          {selectedComponent.typescript}
                        </SyntaxHighlighter>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {/* Accessibility Issues */}
                {selectedComponent.accessibility.issues.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Accessibility Problémák
                    </h4>
                    <div className="space-y-2">
                      {selectedComponent.accessibility.issues.map((issue, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-yellow-800">{issue.message}</div>
                          <div className="text-yellow-700">Javítás: {issue.fix}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {selectedComponent.accessibility.suggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Javaslatok</h4>
                    <ul className="space-y-1">
                      {selectedComponent.accessibility.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start">
                          <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}