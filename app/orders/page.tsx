"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { KanbanBoard } from "@/components/kanban-board"
import { api } from "@/lib/api"
import type { SupplierOrder, InventoryItem, Supplier } from "@/lib/data"

export default function OrdersPage() {
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, inventoryData, suppliersData] = await Promise.all([
          api.getOrders(),
          api.getInventory(),
          api.getSuppliers()
        ])
        setOrders(ordersData)
        setInventory(inventoryData)
        setSuppliers(suppliersData)
      } catch (error) {
        console.error("Failed to fetch order data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Orders" />
        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
          ) : (
            <KanbanBoard orders={orders} inventory={inventory} suppliers={suppliers} />
          )}
        </div>
      </div>
    </div>
  )
}

