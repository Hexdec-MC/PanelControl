'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '../ui/select'
import {  Input} from '../ui/input'
import {  Label } from '../ui/label'


export default function SettingsContent() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Ajusta la configuración de tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="store-name">Nombre de la Tienda</Label>
            <Input id="store-name" defaultValue="AquaStore" />
          </div>
          <div>
            <Label htmlFor="store-email">Email de Contacto</Label>
            <Input id="store-email" defaultValue="admin@aquastore.com" />
          </div>
          <div>
            <Label htmlFor="currency">Moneda</Label>
            <Select defaultValue="usd">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="mxn">MXN ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">Guardar Cambios</Button>
        </CardContent>
      </Card>
    </div>
  )
}