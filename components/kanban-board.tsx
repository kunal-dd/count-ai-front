"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { SupplierOrder, OrderItem, InventoryItem, Supplier } from "@/lib/data"
import { MoreHorizontal, Plus, Calendar, Package, PoundSterling, Send, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"

interface KanbanBoardProps {
  orders: SupplierOrder[]
  inventory: InventoryItem[]
  suppliers: Supplier[]
}

const columns = [
  { id: "low-stock" as const, title: "Low Stock", color: "bg-chart-1/20 text-chart-1" },
  { id: "order-placed" as const, title: "Order Placed", color: "bg-chart-2/20 text-chart-2" },
  { id: "order-received" as const, title: "Order Received", color: "bg-chart-3/20 text-chart-3" },
]

export function KanbanBoard({ orders, inventory, suppliers }: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<SupplierOrder | null>(null)
  const [localOrders, setLocalOrders] = useState<SupplierOrder[]>(orders)

  // Sync props to local state when they change
  useEffect(() => {
    setLocalOrders(orders)
  }, [orders])

  // NOTE: Logic to auto-create low-stock orders based on inventory is powerful but tricky with API.
  // Instead of auto-generating them in frontend only effectively 'previewing' them,
  // we should rely on what's in the DB or explicit user actions.
  // The original code did a complex useEffect sync. We will simplify:
  // "Low Stock Inventory" items appear in the top panel. Clicking them ADDS them to a "Low Stock" order in the DB.

  const getOrdersByStatus = (status: SupplierOrder["status"]) => {
    return localOrders.filter((order) => order.status === status)
  }

  const handleDragStart = (order: SupplierOrder) => {
    setDraggedItem(order)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: SupplierOrder["status"]) => {
    if (draggedItem && draggedItem.status !== status) {
      // Optimistic update
      setLocalOrders((prev) =>
        prev.map((order) =>
          order.id === draggedItem.id
            ? { ...order, status }
            : order
        )
      )
      
      try {
        await api.updateOrderStatus(draggedItem.id, status)
      } catch (error) {
        console.error("Failed to move order", error)
        // Revert (could load from prop again)
        setLocalOrders(orders)
      }
      setDraggedItem(null)
    }
  }

  const addLowStockItem = async (inventoryItem: InventoryItem) => {
    const supplierExists = suppliers.some((s) => s.name === inventoryItem.supplier)
    if (!supplierExists) return

    const orderItem: OrderItem = {
      id: `item-${Date.now()}`,
      itemName: inventoryItem.name,
      quantity: Math.max(inventoryItem.reorderLevel * 2 - inventoryItem.quantity, 1), // Smarter Qty logic
      unit: inventoryItem.unit,
      price: inventoryItem.unitCost, // mapped from unitCost
    }

    // Check if we have an existing LOW STOCK order for this supplier
    // This logic mimics the backend but we need to potentially create a NEW order via API
    // The current backend API `POST /orders` creates a NEW order every time.
    // It doesn't support appending to an existing "draft" order easily unless we implement that backend logic.
    // For MVP, we will simpler: Create a NEW order for this item.
    // Ideally, we'd find an existing order and append, but let's stick to the simplest working flow for now:
    // User clicks -> New "Draft/Low-Stock" Order Card appears.
    
    // Correction: The backend `POST /orders` creates a new Order with status="low-stock".
    // So we just call that.
    
    // But wait, if multiple items belong to same supplier, we want one order card?
    // The previous frontend logic merged them.
    // Since our backend doesn't support "Append Item to Order", we will create separate orders for now
    // OR we can do a quick check in frontend to see if we can merge locally before sending?
    // No, we must persist state.
    
    // Let's CREATE a new order for this item.
    try {
        const newOrderPartial = {
            supplier: inventoryItem.supplier,
            items: [orderItem],
            totalValue: orderItem.price * orderItem.quantity
        }
        
        const createdOrder = await api.placeOrder(newOrderPartial)
        setLocalOrders(prev => [...prev, createdOrder])
    } catch(e) {
        console.error("Failed to create order", e)
    }
  }

  const placeOrder = async (orderId: string) => {
    try {
        const order = localOrders.find(o => o.id === orderId)
        if (!order) return
        
        // Optimistic
        setLocalOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "order-placed" } : o
          )
        )
        
        await api.updateOrderStatus(orderId, "order-placed")
    } catch (e) {
        console.error("Failed to place order", e)
    }
  }

  const markAsArrived = async (orderId: string) => {
    try {
        // Optimistic
        setLocalOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "order-received" } : o
          )
        )
        await api.updateOrderStatus(orderId, "order-received")
    } catch (e) {
        console.error("Failed to mark arrived", e)
    }
  }

  const lowStockItems = inventory.filter((item) => {
    const isLowStock = item.quantity < item.reorderLevel
    const supplierExists = suppliers.some((s) => s.name === item.supplier)
    // Check if already in a "low-stock" or "order-placed" order to avoid duplicates
    // This requires checking all local orders
    const alreadyOrdered = localOrders.some((order) =>
      order.status !== 'order-received' &&
      order.items.some((orderItem) => orderItem.itemName === item.name)
    )
    return isLowStock && supplierExists && !alreadyOrdered
  })

  return (
    <div className="flex flex-col h-full">
      {lowStockItems.length > 0 && (
        <div className="mx-6 mt-4 p-3 rounded-lg border border-chart-1/30 bg-chart-1/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-chart-1">
              {lowStockItems.length} item(s) below reorder level - click to create order
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addLowStockItem(item)}
                className="text-xs px-2 py-1 rounded bg-card border border-border hover:border-chart-1/50 transition-colors"
              >
                + {item.name} ({item.supplier})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 p-6 overflow-x-auto flex-1">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[320px] flex flex-col"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", column.color)}>{column.title}</span>
                <span className="text-sm text-muted-foreground">{getOrdersByStatus(column.id).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-2 min-h-[200px] rounded-lg bg-muted/30 p-2">
              {getOrdersByStatus(column.id).map((order) => (
                <div
                  key={order.id}
                  draggable
                  onDragStart={() => handleDragStart(order)}
                  className={cn(
                    "rounded-lg border border-border bg-card cursor-move transition-all",
                    "hover:shadow-sm hover:border-muted-foreground/30",
                    draggedItem?.id === order.id && "opacity-50",
                  )}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{order.supplier}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{order.items.length} item(s)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PoundSterling className="h-3 w-3" />
                        <span>£{order.totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{order.orderDate}</span>
                      {order.expectedDate && <span className="text-muted-foreground/70"> → {order.expectedDate}</span>}
                    </div>
                  </div>

                  <div className="border-t border-border px-3 py-2 bg-muted/20">
                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="text-foreground">{item.itemName}</span>
                          <span className="text-muted-foreground">
                            {item.quantity} {item.unit} · £{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {column.id === "low-stock" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          placeOrder(order.id)
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Send className="h-3 w-3" />
                        Place Order
                      </button>
                    )}
                    {column.id === "order-placed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsArrived(order.id)
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-chart-3 text-white hover:bg-chart-3/90 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Arrived
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

