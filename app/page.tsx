<<<<<<< HEAD
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si el administrador está autenticado
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'

    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  return <AdminDashboard />
=======
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si el administrador está autenticado
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'

    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  return <AdminDashboard />
>>>>>>> 77ce5e5 (Cambios 2.0)
}