'use client'

import React, { useMemo } from 'react'
import { FigmaApiResponse } from '@/types/figma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Calendar, Layers, Palette, Component, Type, Square, Circle, Code2 } from 'lucide-react'
import { CodeGenerationPanel } from './CodeGenerationPanel'

interface FigmaInfoDisplayProps {
  figmaData: FigmaApiResponse
  fileKey: string
}

interface ProcessedDocument {
  allNodes: (any & { depth: number })[]
  nodeCounts: Record<string, number>
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('hu-HU')
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  TEXT: Type,
  RECTANGLE: Square,
  ELLIPSE: Circle,
  FRAME: Layers,
  COMPONENT: Component,
  INSTANCE: Component,
  DEFAULT: Square,
}

const getNodeTypeIcon = (type: string) => {
  return ICON_MAP[type] || ICON_MAP.DEFAULT
}

const processFigmaDocument = (documentNode: any): ProcessedDocument => {
  const allNodes: (any & { depth: number })[] = []
  const nodeCounts: Record<string, number> = {}

  const traverse = (node: any, depth = 0) => {
    allNodes.push({ ...node, depth })
    nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1

    if (node.children) {
      node.children.forEach((child: any) => traverse(child, depth + 1))
    }
  }

  traverse(documentNode)
  return { allNodes, nodeCounts }
}

export function FigmaInfoDisplay({ figmaData, fileKey }: FigmaInfoDisplayProps) {
  const { allNodes, nodeCounts } = useMemo(() => {
    if (!figmaData?.document) {
      return { allNodes: [], nodeCounts: {} }
    }
    return processFigmaDocument(figmaData.document)
  }, [figmaData.document])

  const componentCount = Object.keys(figmaData.components || {}).length
  const styleCount = Object.keys(figmaData.styles || {}).length
  
  const stats = {
    totalNodes: allNodes.length,
    componentCount,
    styleCount,
    nodeTypesCount: Object.keys(nodeCounts).length
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Fájl Információk</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center space-x-2">
            <Code2 className="w-4 h-4" />
            <span>Kód Generálás</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          {/* File Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Fájl Információk</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Fájl neve</label>
                  <p className="text-lg font-semibold">{figmaData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fájl kulcs</label>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{fileKey}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Utolsó módosítás</label>
                  <p className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(figmaData.lastModified)}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Verzió</label>
                  <p>{figmaData.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Szerepkör</label>
                  <Badge variant="secondary">{figmaData.role}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Szerkesztő típus</label>
                  <Badge variant="outline">{figmaData.editorType}</Badge>
                </div>
              </div>
              
              {figmaData.thumbnailUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Előnézeti kép</label>
                  <img 
                    src={figmaData.thumbnailUrl} 
                    alt="Figma fájl előnézet" 
                    className="max-w-xs rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Tartalom Statisztikák</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalNodes}</div>
                  <div className="text-sm text-blue-800">Összes elem</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.componentCount}</div>
                  <div className="text-sm text-green-800">Komponensek</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.styleCount}</div>
                  <div className="text-sm text-purple-800">Stílusok</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.nodeTypesCount}</div>
                  <div className="text-sm text-orange-800">Elem típusok</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Node Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Elem Típusok Megoszlása</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(nodeCounts).map(([type, count]) => {
                  const IconComponent = getNodeTypeIcon(type)
                  return (
                    <div key={type} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{type}</span>
                      <Badge variant="secondary" className="ml-auto">{count}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Document Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Dokumentum Struktúra (első 50 elem)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-xs border rounded-md p-2 bg-gray-50">
                {allNodes.slice(0, 50).map((node) => {
                  const IconComponent = getNodeTypeIcon(node.type)
                  return (
                    <div 
                      key={node.id} 
                      className="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded"
                      style={{ paddingLeft: `${node.depth * 16}px` }}
                    >
                      <IconComponent className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="truncate" title={node.name}>{node.name || 'Névtelen'}</span>
                      <span className="text-gray-400">({node.type})</span>
                    </div>
                  )
                })}
                {allNodes.length > 50 && (
                  <div className="text-center py-2 text-gray-500">
                    ... és még {allNodes.length - 50} elem
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <CodeGenerationPanel figmaData={figmaData} fileKey={fileKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}