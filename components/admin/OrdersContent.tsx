'use client'

import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react' // Cambiado de Eye a ArrowRight para reflejar cambio de estado
import { createClient } from '@/utils/supabase/client'

// Define los colores para cada estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-800'
    case 'En camino':
      return 'bg-blue-100 text-blue-800'
    case 'Entregado':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Define la secuencia de estados
const getNextStatus = (currentStatus: string) => {
  const statusSequence = ['Pendiente', 'En camino', 'Entregado']
  const currentIndex = statusSequence.indexOf(currentStatus)
  return currentIndex < statusSequence.length - 1 ? statusSequence[currentIndex + 1] : currentStatus
}

export default function OrdersContent() {
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  // Inicializa el cliente de Supabase
  const supabase = createClient()

  // Carga los pedidos al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: purchases, error } = await supabase
          .from('purchases')
          .select('id, total_price, created_at, status, usuarios!inner(nombre)')
        if (error) {
          console.error('Error fetching orders:', error)
        } else {
          setOrders(purchases)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }
    fetchOrders()
  }, [])

  // Función para actualizar el estado de un pedido
  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus)
    if (nextStatus === currentStatus) {
      console.log('El pedido ya está en el estado final (Entregado)')
      return
    }

    try {
      const { error } = await supabase
        .from('purchases')
        .update({ status: nextStatus })
        .eq('id', orderId)
      if (error) {
        console.error('Error updating status:', error)
        return
      }

      // Actualiza el estado local para reflejar el cambio
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      )
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  // Filtra los pedidos según el estado seleccionado
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((order: any) => order.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white/70">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En camino">En camino</SelectItem>
            <SelectItem value="Entregado">Entregado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.usuarios.nombre}</TableCell>
                <TableCell className="font-medium">
                  {order.total_price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStatusChange(order.id, order.status)}
                    disabled={order.status === 'Entregado'}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
