'use client'

// Update the import path to the correct location of your UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Gift, Plus } from 'lucide-react'

export default function PromotionsContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Promociones Activas</h3>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Promoción
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-cyan-600" />
              Descuento de Verano
            </CardTitle>
            <CardDescription>20% de descuento en productos acuáticos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Código:</span>
                <span className="font-mono">VERANO20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Válido hasta:</span>
                <span>31/08/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Usos:</span>
                <span>45/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}