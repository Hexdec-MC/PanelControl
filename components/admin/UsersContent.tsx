'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'

export default function UsersContent() {
  const [users, setUsers] = useState([])

  // Inicializa el cliente de Supabase
  const supabase = createClient()

  // Carga los usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usuarios, error } = await supabase
          .from('usuarios')
          .select('nombre, email, avatar_url, created_at')
        if (error) {
          console.error('Error fetching users:', error)
          return
        }
        setUsers(usuarios)
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fecha de Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.email}>
                <TableCell className="font-medium">{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
