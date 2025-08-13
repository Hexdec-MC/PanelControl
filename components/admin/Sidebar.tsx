<<<<<<< HEAD
'use client'

import { Package, ShoppingCart, Users, BarChart3, Gift, Settings, Package2 } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-cyan-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Package2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            AquaAdmin
          </h1>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
            { id: 'users', label: 'Usuarios', icon: Users },
            { id: 'promotions', label: 'Promociones', icon: Gift },
            { id: 'settings', label: 'Configuración', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
=======
'use client'

import { Package, ShoppingCart, Users, BarChart3, Gift, Settings, Package2 } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-cyan-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Package2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Merca-App
          </h1>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
            { id: 'users', label: 'Usuarios', icon: Users },

          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
>>>>>>> 77ce5e5 (Cambios 2.0)
}