import { FigmaGenerator } from '@/components/figma-generator/FigmaGenerator'
import { Header } from '@/components/layout/Header'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="pt-8">
        <FigmaGenerator />
      </main>
    </div>
  )
}