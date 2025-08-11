'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize Supabase client
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate input
      if (!usuario || !contraseña) {
        setError('Por favor, ingresa usuario y contraseña.')
        setIsLoading(false)
        return
      }

      // Log the input and table being queried
      console.log('Querying for usuario:', usuario)
      console.log('Querying table: admin, columns: usuario, contraseña')

      // Query admin table
      const { data: admins, error: adminError } = await supabase
        .from('admin')
        .select('usuario, contraseña')
        .eq('usuario', usuario)
        .limit(1)

      // Log the full query response
      console.log('Query response:', { admins, adminError })

      if (adminError) {
        console.error('Error querying admin table:', adminError)
        setError(`Error al consultar la base de datos: ${adminError.message}. Verifica la configuración de la tabla o los permisos (RLS).`)
        setIsLoading(false)
        return
      }

      if (!admins || admins.length === 0) {
        console.error('No user found for:', usuario)
        setError('Usuario no encontrado. Verifica que "admin@gmail.com" esté registrado en la tabla admin y que RLS permita acceso.')
        setIsLoading(false)
        return
      }

      // Verify password (assuming plain text)
      const admin = admins[0]
      if (admin.contraseña !== contraseña) {
        console.error('Incorrect password for user:', usuario)
        setError('Contraseña incorrecta. Verifica que la contraseña sea "admin".')
        setIsLoading(false)
        return
      }

      // Set session (Note: localStorage is not secure for production)
      localStorage.setItem('isAdminAuthenticated', 'true')

      // Redirect to dashboard
      router.push('/')
    } catch (err) {
      console.error('Unexpected login error:', err)
      setError('Error inesperado: ' + err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white/70 backdrop-blur-sm border-cyan-200">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión - Administrador</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="usuario">Usuario</Label>
            <Input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value.trim())}
              placeholder="Ingresa el usuario del administrador"
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="contraseña">Contraseña</Label>
            <Input
              id="contraseña"
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-cyan-600 hover:bg-cyan-700" 
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Nota: Este sistema utiliza localStorage para la sesión, lo cual no es seguro para producción. 
          Considera usar un sistema de autenticación más robusto.
        </p>
      </Card>
    </div>
  )
}