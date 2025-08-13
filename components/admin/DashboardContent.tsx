<<<<<<< HEAD
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Image from 'next/image'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { createClient } from '@/utils/supabase/client'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardContent() {
  const [stats, setStats] = useState([
    { title: 'Ventas Totales', value: '0', trend: 'up', change: '0%' },
    { title: 'Usuarios Nuevos', value: '0', trend: 'up', change: '0%' },
    { title: 'Productos en Stock', value: '0', trend: 'up', change: '0%' },
    { title: 'Pedidos Pendientes', value: '0', trend: 'up', change: '0%' }
  ])
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] })
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      // Ventas totales
      const { data: purchases, error: purchasesError } = await supabase.from('purchases').select('total_cents')
      if (purchasesError) console.error('Error fetching purchases:', purchasesError)
      const totalSales = (purchases?.reduce((sum, p) => sum + (p.total_cents || 0), 0) / 100).toFixed(2)

      // Usuarios nuevos (este mes)
      const { data: usuarios, error: usuariosError } = await supabase
        .from('usuarios')
        .select('created_at')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      if (usuariosError) console.error('Error fetching usuarios:', usuariosError)
      const newUsers = usuarios?.length || 0

      // Productos en stock (usando in_stock)
      const { data: productos, error: productosError } = await supabase
        .from('producto')
        .select('in_stock')
        .gt('in_stock', 0) // Solo productos con cantidad mayor a 0
      if (productosError) console.error('Error fetching productos:', productosError)
      const productsInStock = productos?.length || 0

      // Pedidos pendientes
      const { data: pendingPurchases, error: pendingError } = await supabase
        .from('purchases')
        .select('status')
        .eq('status', 'Pendiente')
      if (pendingError) console.error('Error fetching pending purchases:', pendingError)
      const pendingOrders = pendingPurchases?.length || 0

      // Actualizar estadísticas
      setStats([
        { title: 'Ventas Totales', value: `$${totalSales}`, trend: 'up', change: 'N/A' },
        { title: 'Usuarios Nuevos', value: newUsers, trend: 'up', change: 'N/A' },
        { title: 'Productos en Stock', value: productsInStock, trend: 'up', change: 'N/A' },
        { title: 'Pedidos Pendientes', value: pendingOrders, trend: 'up', change: 'N/A' }
      ])

      // Datos para gráfico de ventas
      const { data: sales, error: salesError } = await supabase
        .from('purchases')
        .select('created_at, total_cents')
        .order('created_at', { ascending: true })
      if (salesError) console.error('Error fetching sales:', salesError)
      const labels = sales?.map(s => new Date(s.created_at).toLocaleDateString()) || []
      const data = sales?.map(s => s.total_cents / 100) || []
      setSalesData({
        labels,
        datasets: [{
          label: 'Ventas Diarias',
          data,
          borderColor: '#06B6D4',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          fill: true
        }]
      })

      // Productos más vendidos
      const { data: topProds, error: topProdsError } = await supabase
        .from('purchase_items')
        .select('product_id, quantity, producto(name, image_url, price, in_stock)') // Cambiado a 'in_stock'
        .order('quantity', { ascending: false })
        .limit(3)
      if (topProdsError) console.error('Error fetching top products:', topProdsError)
      setTopProducts(topProds?.map(p => ({
        id: p.product_id,
        name: p.producto.name,
        image: p.producto.image_url || '/placeholder.svg',
        price: `$${p.producto.price}`,
        stock: p.producto.in_stock || 0 // Cambiado a 'in_stock'
      })) || [])
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-cyan-200 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              {stat.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={salesData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.price}</p>
                  </div>
                  <Badge variant="secondary">{product.stock} en stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
=======

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Image from 'next/image'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { createClient } from '@/utils/supabase/client'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardContent() {
  const [stats, setStats] = useState([
    { title: 'Ventas Totales', value: '0', trend: 'up', change: '0%' },
    { title: 'Usuarios Nuevos', value: '0', trend: 'up', change: '0%' },
    { title: 'Productos en Stock', value: '0', trend: 'up', change: '0%' },
    { title: 'Pedidos Pendientes', value: '0', trend: 'up', change: '0%' }
  ])
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] })
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      // Ventas totales
      const { data: purchases, error: purchasesError } = await supabase.from('purchases').select('total_cents')
      if (purchasesError) console.error('Error fetching purchases:', purchasesError)
      const totalSales = (purchases?.reduce((sum, p) => sum + (p.total_cents || 0), 0) / 100).toFixed(2)

      // Usuarios nuevos (este mes)
      const { data: usuarios, error: usuariosError } = await supabase
        .from('usuarios')
        .select('created_at')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      if (usuariosError) console.error('Error fetching usuarios:', usuariosError)
      const newUsers = usuarios?.length || 0

      // Productos en stock (usando in_stock)
      const { data: productos, error: productosError } = await supabase
        .from('producto')
        .select('in_stock')
        .gt('in_stock', 0)
      if (productosError) console.error('Error fetching productos:', productosError)
      const productsInStock = productos?.length || 0

      // Pedidos pendientes
      const { data: pendingPurchases, error: pendingError } = await supabase
        .from('purchases')
        .select('status')
        .eq('status', 'Pendiente')
      if (pendingError) console.error('Error fetching pending purchases:', pendingError)
      const pendingOrders = pendingPurchases?.length || 0

      // Actualizar estadísticas
      setStats([
        { title: 'Ventas Totales', value: `$${totalSales}`, trend: 'up', change: 'N/A' },
        { title: 'Usuarios Nuevos', value: newUsers, trend: 'up', change: 'N/A' },
        { title: 'Productos en Stock', value: productsInStock, trend: 'up', change: 'N/A' },
        { title: 'Pedidos Pendientes', value: pendingOrders, trend: 'up', change: 'N/A' }
      ])

      // Datos para gráfico de ventas
      const { data: sales, error: salesError } = await supabase
        .from('purchases')
        .select('created_at, total_cents')
        .order('created_at', { ascending: true })
      if (salesError) console.error('Error fetching sales:', salesError)
      const labels = sales?.map(s => new Date(s.created_at).toLocaleDateString()) || []
      const data = sales?.map(s => s.total_cents / 100) || []
      setSalesData({
        labels,
        datasets: [{
          label: 'Ventas Diarias',
          data,
          borderColor: '#06B6D4',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          fill: true
        }]
      })

      // Productos más vendidos
      const { data: topProds, error: topProdsError } = await supabase
        .from('purchase_items')
        .select('product_id, quantity, producto(name, image_url, price, price-mayor, in_stock)')
        .order('quantity', { ascending: false })
        .limit(3)
      if (topProdsError) console.error('Error fetching top products:', topProdsError)
      setTopProducts(topProds?.map(p => ({
        id: p.product_id,
        name: p.producto.name,
        image: p.producto.image_url || '/placeholder.svg',
        price: p.producto.price ? `$${p.producto.price.toFixed(2)}` : '$0.00',
        price_mayor: p.producto['price-mayor'] ? `$${p.producto['price-mayor'].toFixed(2)}` : '$0.00',
        stock: p.producto.in_stock || 0
      })) || [])
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-cyan-200 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              {stat.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={salesData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Minorista: {product.price} | Mayorista: {product.price_mayor}
                    </p>
                  </div>
                  <Badge variant="secondary">{product.stock} en stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
>>>>>>> 77ce5e5 (Cambios 2.0)
