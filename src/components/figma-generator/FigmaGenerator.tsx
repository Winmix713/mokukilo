'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Link, Play, AlertCircle, ArrowLeft } from 'lucide-react'
import { FigmaApiResponse } from '@/types/figma'
import { FigmaInfoDisplay } from './FigmaInfoDisplay'

const figmaFormSchema = z.object({
  figmaUrl: z.string().url('Érvényes Figma URL szükséges').refine(
    (url) => url.includes('figma.com/file/') || url.includes('figma.com/design/'),
    'A URL-nek Figma fájl vagy design linknek kell lennie'
  ),
  apiKey: z.string().min(1, 'API kulcs szükséges').refine(
    (key) => /^figd_[a-zA-Z0-9_-]+$/.test(key),
    'Érvénytelen Figma API kulcs formátum'
  ),
})

type FigmaFormData = z.infer<typeof figmaFormSchema>

interface FigmaApiError {
  error: string
}

interface FigmaApiSuccess {
  success: true
  data: FigmaApiResponse
  fileKey: string
}

export function FigmaGenerator() {
  const [activeTab, setActiveTab] = useState('url')
  const [figmaData, setFigmaData] = useState<FigmaApiResponse | null>(null)
  const [fileKey, setFileKey] = useState<string>('')

  const form = useForm<FigmaFormData>({
    resolver: zodResolver(figmaFormSchema),
    defaultValues: {
      figmaUrl: '',
      apiKey: '',
    },
  })

  const figmaMutation = useMutation<FigmaApiSuccess, FigmaApiError, FigmaFormData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Hiba történt a Figma API hívás során')
      }

      return result
    },
    onSuccess: (data) => {
      setFigmaData(data.data)
      setFileKey(data.fileKey)
    },
  })

  const onSubmit = (data: FigmaFormData) => {
    figmaMutation.mutate(data)
  }

  const handleBackToForm = () => {
    setFigmaData(null)
    setFileKey('')
    figmaMutation.reset()
  }

  // Ha van eredmény, azt jelenítjük meg
  if (figmaData) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Figma Fájl Információk
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Részletes információk a Figma fájlról
            </p>
          </div>
          <Button 
            onClick={handleBackToForm}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vissza</span>
          </Button>
        </div>

        <FigmaInfoDisplay figmaData={figmaData} fileKey={fileKey} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Next.js Figma-to-Code Generátor
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Figma fájl információk lekérdezése és kódgenerálás Next.js környezetben
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center space-x-2">
                <Link className="w-4 h-4" />
                <span>Figma URL</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Fájl Feltöltés</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="figmaUrl">Figma Fájl URL</Label>
                <Input
                  id="figmaUrl"
                  placeholder="https://www.figma.com/file/... vagy https://www.figma.com/design/..."
                  {...form.register('figmaUrl')}
                />
                {form.formState.errors.figmaUrl && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{form.formState.errors.figmaUrl.message}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Támogatott formátumok: Figma fájl linkek (/file/) és design linkek (/design/)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">Figma API Kulcs</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="figd_..."
                  {...form.register('apiKey')}
                />
                {form.formState.errors.apiKey && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{form.formState.errors.apiKey.message}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Szerezd be a tokened: Figma → Account Settings → Personal Access Tokens
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Húzd ide a Figma fájlt
                </h3>
                <p className="text-gray-500 mb-4">
                  Vagy kattints a tallózáshoz (.fig fájl)
                </p>
                <Button type="button" variant="outline">
                  Fájl Kiválasztása
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={figmaMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold"
            >
              {figmaMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Információk lekérdezése...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Információk Lekérdezése</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {figmaMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Hiba történt:</span>
          </div>
          <p className="text-red-700 mt-1">{figmaMutation.error.message}</p>
        </div>
      )}
    </div>
  )
}