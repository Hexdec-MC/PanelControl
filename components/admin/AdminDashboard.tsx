<<<<<<< HEAD
'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'
import DashboardContent from '@/components/admin/DashboardContent'
import ProductsContent from '@/components/admin/ProductsContent'
import OrdersContent from '@/components/admin/OrdersContent'
import UsersContent from '@/components/admin/UsersContent'
import PromotionsContent from '@/components/admin/PromotionsContent'
import SettingsContent from '@/components/admin/SettingsContent'
import BubbleBackground from '@/components/admin/BubbleBackground'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      <BubbleBackground />
      <div className="flex h-screen relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <Header activeTab={activeTab} />
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'products' && (
              <ProductsContent
                isAddProductOpen={isAddProductOpen}
                setIsAddProductOpen={setIsAddProductOpen}
              />
            )}
            {activeTab === 'orders' && <OrdersContent />}
            {activeTab === 'users' && <UsersContent />}
            {activeTab === 'promotions' && <PromotionsContent />}
            {activeTab === 'settings' && <SettingsContent />}
          </main>
        </div>
      </div>
    </div>
  )
=======
'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'
import DashboardContent from '@/components/admin/DashboardContent'
import ProductsContent from '@/components/admin/ProductsContent'
import OrdersContent from '@/components/admin/OrdersContent'
import UsersContent from '@/components/admin/UsersContent'
import BubbleBackground from '@/components/admin/BubbleBackground'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      <BubbleBackground />
      <div className="flex h-screen relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <Header activeTab={activeTab} />
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'products' && (
              <ProductsContent
                isAddProductOpen={isAddProductOpen}
                setIsAddProductOpen={setIsAddProductOpen}
              />
            )}
            {activeTab === 'orders' && <OrdersContent />}
            {activeTab === 'users' && <UsersContent />}
          </main>
        </div>
      </div>
    </div>
  )
>>>>>>> 77ce5e5 (Cambios 2.0)
}