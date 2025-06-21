'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Figma, Github, Settings, Home, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Kezdőlap', href: '/', icon: Home },
    { name: 'Generátor', href: '/generator', icon: Code2 },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Figma className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Figma-to-Code</h1>
              <p className="text-sm text-gray-500">Next.js AI Generator</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 font-medium transition-colors ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Kezdés
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}