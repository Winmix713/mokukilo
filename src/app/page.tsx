import { FigmaGenerator } from '@/components/figma-generator/FigmaGenerator'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { ProcessFlow } from '@/components/sections/ProcessFlow'
import { Stats } from '@/components/sections/Stats'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main>
        <Hero />
        <ProcessFlow />
        <Features />
        <Stats />
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Próbáld ki a Generátort
              </h2>
              <p className="text-xl text-gray-600">
                Töltsd fel a Figma designod vagy illeszd be a linket, hogy production-ready kódot generálj
              </p>
            </div>
            <FigmaGenerator />
          </div>
        </section>
      </main>
    </div>
  )
}