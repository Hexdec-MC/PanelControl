<<<<<<< HEAD
'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'

interface HeaderProps {
  activeTab: string
}

export default function Header({ activeTab }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    const fetchNotifications = async () => {
      const { data: purchases, error } = await supabase
        .from('purchases')
        .select('status')
        .eq('status', 'Pendiente')
      if (error) console.error('Error fetching notifications:', error)
      setNotificationCount(purchases?.length || 0) // Changed 'data' to 'purchases'
    }
    fetchNotifications()
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Gestión de Productos'}
            {activeTab === 'orders' && 'Pedidos'}
            {activeTab === 'users' && 'Usuarios'}
            {activeTab === 'promotions' && 'Promociones'}
            {activeTab === 'settings' && 'Configuración'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="bg-white/70 relative">
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
=======
'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'

interface HeaderProps {
  activeTab: string
}

export default function Header({ activeTab }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(0)



  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Gestión de Productos'}
            {activeTab === 'orders' && 'Pedidos'}
            {activeTab === 'users' && 'Usuarios'}
            {activeTab === 'promotions' && 'Promociones'}
            {activeTab === 'settings' && 'Configuración'}
          </h2>
        </div>
      
      </div>
    </header>
  )
>>>>>>> 77ce5e5 (Cambios 2.0)
}