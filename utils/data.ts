export const stats = [
  { title: 'Ventas Totales', value: '$45,231', change: '+20.1%', trend: 'up' },
  { title: 'Pedidos', value: '1,234', change: '+15.3%', trend: 'up' },
  { title: 'Productos', value: '456', change: '+2.5%', trend: 'up' },
  { title: 'Usuarios', value: '2,345', change: '+8.2%', trend: 'up' },
]

export const products = [
  { id: 1, name: 'Producto Acuático A', price: '$29.99', stock: 45, image: '/placeholder.svg', status: 'Activo' },
  { id: 2, name: 'Producto Marino B', price: '$39.99', stock: 23, image: '/placeholder.svg', status: 'Activo' },
  { id: 3, name: 'Producto Oceánico C', price: '$19.99', stock: 67, image: '/placeholder.svg', status: 'Inactivo' },
]

export const orders = [
  { id: '#3210', customer: 'Ana García', total: '$89.99', status: 'Completado', date: '2024-01-15' },
  { id: '#3211', customer: 'Carlos López', total: '$129.99', status: 'Procesando', date: '2024-01-15' },
  { id: '#3212', customer: 'María Rodríguez', total: '$59.99', status: 'Enviado', date: '2024-01-14' },
]

export const users = [
  { id: 1, name: 'Ana García', email: 'ana@email.com', orders: 12, joined: '2023-06-15' },
  { id: 2, name: 'Carlos López', email: 'carlos@email.com', orders: 8, joined: '2023-08-22' },
  { id: 3, name: 'María Rodríguez', email: 'maria@email.com', orders: 15, joined: '2023-05-10' },
]

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completado':
      return 'bg-emerald-100 text-emerald-800'
    case 'Procesando':
      return 'bg-blue-100 text-blue-800'
    case 'Enviado':
      return 'bg-purple-100 text-purple-800'
    case 'Activo':
      return 'bg-emerald-100 text-emerald-800'
    case 'Inactivo':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}