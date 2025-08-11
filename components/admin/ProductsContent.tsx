'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Filter, Plus, Edit, Package, DollarSign, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'

interface ProductsContentProps {
  isAddProductOpen: boolean
  setIsAddProductOpen: (open: boolean) => void
}

export default function ProductsContent({ isAddProductOpen, setIsAddProductOpen }: ProductsContentProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    name: '',
    price: '',
    in_stock: '', // Almacena la cantidad como string
    unit: '',
    description: '',
    category: '',
    image_file: null as File | null,
    image_url: ''
  })
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('producto')
        .select('*')
      if (!error) setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const getStatusColor = (inStock: number) => {
    return inStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    if (filter === 'active') return product.in_stock > 0
    if (filter === 'inactive') return product.in_stock <= 0
    return true
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen no debe exceder los 5MB.')
      return
    }
    if (file && !['image/png', 'image/jpeg'].includes(file.type)) {
      setErrorMessage('Solo se permiten imágenes PNG o JPG.')
      return
    }
    setForm(prev => ({
      ...prev,
      image_file: file
    }))
  }

  const handleSaveProduct = async () => {
    const { name, price, in_stock, unit, description, category, image_file } = form

    if (!name || !price || !in_stock || !unit) {
      setErrorMessage('Por favor, completa los campos obligatorios: nombre, precio, cantidad y unidad.')
      return
    }

    const parsedPrice = parseFloat(price)
    const parsedInStock = parseInt(in_stock, 10)
    if (isNaN(parsedPrice) || isNaN(parsedInStock)) {
      setErrorMessage('El precio y la cantidad deben ser valores numéricos válidos.')
      return
    }

    let image_url = selectedProduct?.image_url || ''
    if (image_file) {
      const fileName = `${Date.now()}_${image_file.name}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image_file)

      if (uploadError) {
        setErrorMessage(`Error al subir la imagen: ${uploadError.message}`)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      // Usar el dominio público de Supabase en lugar de localhost
      image_url = publicUrlData.publicUrl.replace('http://localhost:54321', 'https://your-supabase-project-id.supabase.co');
    }

    setErrorMessage(null)

    try {
      if (selectedProduct) {
        const { error } = await supabase
          .from('producto')
          .update({
            name,
            price: parsedPrice,
            in_stock: parsedInStock,
            unit,
            description,
            category,
            image_url: image_url,
          })
          .eq('id', selectedProduct.id)

        if (error) throw error

        setProducts(products.map((p) =>
          p.id === selectedProduct.id
            ? { ...p, name, price: parsedPrice, in_stock: parsedInStock, unit, description, category, image_url: image_url }
            : p
        ))
      } else {
        const { error } = await supabase
          .from('producto')
          .insert({
            name,
            price: parsedPrice,
            in_stock: parsedInStock,
            unit,
            description,
            category,
            image_url: image_url,
            rating: 0,
            reviews: 0,
          })

        if (error) throw error

        const { data: newProduct } = await supabase
          .from('producto')
          .select('*')
          .eq('name', name)
          .single()

        setProducts([...products, newProduct])
      }

      setIsAddProductOpen(false)
      setSelectedProduct(null)
      setForm({
        name: '',
        price: '',
        in_stock: '',
        unit: '',
        description: '',
        category: '',
        image_file: null,
        image_url: ''
      })
    } catch (error: any) {
      setErrorMessage(`Error al ${selectedProduct ? 'actualizar' : 'guardar'} el producto: ${error.message}`)
    }
  }

  const handleEdit = (product: any) => {
    setForm({
      name: product.name || '',
      price: product.price ? product.price.toString() : '',
      in_stock: product.in_stock ? product.in_stock.toString() : '',
      unit: product.unit || '',
      description: product.description || '',
      category: product.category || '',
      image_file: null,
      image_url: product.image_url || ''
    })
    setSelectedProduct(product)
    setIsAddProductOpen(true)
  }

  const handleStock = async (product: any) => {
    const newStock = prompt(`Actualizar cantidad de: ${product.name}`, product.in_stock || '0')
    if (newStock !== null) {
      const parsedStock = parseInt(newStock, 10)
      if (isNaN(parsedStock)) {
        alert('La cantidad debe ser un número válido.')
        return
      }

      try {
        const { error } = await supabase
          .from('producto')
          .update({ in_stock: parsedStock })
          .eq('id', product.id)

        if (error) throw error

        setProducts(products.map((p) =>
          p.id === product.id ? { ...p, in_stock: parsedStock } : p
        ))
      } catch (error: any) {
        alert(`Error al actualizar la cantidad: ${error.message}`)
      }
    }
  }

  const handlePrice = async (product: any) => {
    const newPrice = prompt(`Actualizar precio de: ${product.name}`, product.price || '0')
    if (newPrice !== null) {
      const parsedPrice = parseFloat(newPrice)
      if (isNaN(parsedPrice)) {
        alert('El precio debe ser un número válido.')
        return
      }

      try {
        const { error } = await supabase
          .from('producto')
          .update({ price: parsedPrice })
          .eq('id', product.id)

        if (error) throw error

        setProducts(products.map((p) =>
          p.id === product.id ? { ...p, price: parsedPrice } : p
        ))
      } catch (error: any) {
        alert(`Error al actualizar el precio: ${error.message}`)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-white/70">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white/70">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Dialog open={isAddProductOpen} onOpenChange={(open) => {
          setIsAddProductOpen(open)
          if (!open) {
            setForm({
              name: '',
              price: '',
              in_stock: '',
              unit: '',
              description: '',
              category: '',
              image_file: null,
              image_url: ''
            })
            setSelectedProduct(null)
            setErrorMessage(null)
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              {selectedProduct ? 'Editar Producto' : 'Agregar Producto'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
              <DialogDescription>{selectedProduct ? 'Modifica la información del producto' : 'Completa la información del producto'}</DialogDescription>
            </DialogHeader>
            {errorMessage && <p className="text-red-500 mb-4 bg-red-100 p-2 rounded">{errorMessage}</p>}
            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={form.name} onChange={handleFormChange} placeholder="Ej: Producto Acuático" />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input id="category" value={form.category} onChange={handleFormChange} placeholder="Ej: Peces, Accesorios" />
              </div>
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input id="price" value={form.price} onChange={handleFormChange} placeholder="$0.00" />
              </div>
              <div>
                <Label htmlFor="in_stock">Cantidad</Label>
                <Input id="in_stock" type="number" value={form.in_stock} onChange={handleFormChange} placeholder="0" />
              </div>
              <div>
                <Label htmlFor="unit">Unidad</Label>
                <Select value={form.unit} onValueChange={(value) => setForm(prev => ({ ...prev, unit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidades">Unidades</SelectItem>
                    <SelectItem value="cajas">Cajas</SelectItem>
                    <SelectItem value="kilos">Kilos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={form.description} onChange={handleFormChange} placeholder="Descripción..." />
              </div>
              <div className="col-span-2">
                <Label htmlFor="image_file">Imagen del Producto</Label>
                <Input id="image_file" type="file" accept="image/*" onChange={handleFileChange} />
                {form.image_url && (
                  <div className="mt-2">
                    <Image
                      src={form.image_url}
                      alt="Vista previa"
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="col-span-2 flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500" onClick={handleSaveProduct}>
                  {selectedProduct ? 'Actualizar' : 'Guardar'}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => {
                  setIsAddProductOpen(false)
                  setForm({
                    name: '',
                    price: '',
                    in_stock: '',
                    unit: '',
                    description: '',
                    category: '',
                    image_file: null,
                    image_url: ''
                  })
                  setSelectedProduct(null)
                  setErrorMessage(null)
                }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.in_stock || '0'}</TableCell>
                <TableCell>{product.unit || 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStock(product)}>
                        <Package className="w-4 h-4 mr-2" />
                        Cantidad
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrice(product)}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Precio
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}