import { InventoryItem, SupplierOrder, Supplier, ChangeLogEntry } from "./data"

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:2930"

export const api = {
  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    const res = await fetch(`${API_BASE_URL}/inventory`)
    if (!res.ok) throw new Error("Failed to fetch inventory")
    return res.json()
  },
  
  getLowStock: async (): Promise<InventoryItem[]> => {
    const res = await fetch(`${API_BASE_URL}/inventory/low-stock`)
    if (!res.ok) throw new Error("Failed to fetch low stock items")
    return res.json()
  },

  updateInventoryItem: async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
    const res = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update inventory item")
    return res.json()
  },

  // Orders
  getOrders: async (): Promise<SupplierOrder[]> => {
    const res = await fetch(`${API_BASE_URL}/orders`)
    if (!res.ok) throw new Error("Failed to fetch orders")
    return res.json()
  },

  placeOrder: async (order: Partial<SupplierOrder>): Promise<SupplierOrder> => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
    if (!res.ok) throw new Error("Failed to place order")
    return res.json()
  },

  updateOrderStatus: async (id: string, status: string): Promise<SupplierOrder> => {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Failed to update order status")
    return res.json()
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    const res = await fetch(`${API_BASE_URL}/suppliers`)
    if (!res.ok) throw new Error("Failed to fetch suppliers")
    return res.json()
  },

  updateSupplier: async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update supplier")
    return res.json()
  },
  
  createSupplier: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const res = await fetch(`${API_BASE_URL}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier),
    })
    if (!res.ok) throw new Error("Failed to create supplier")
    return res.json()
  },

  // Change Log
  getChangeLog: async (): Promise<ChangeLogEntry[]> => {
    const res = await fetch(`${API_BASE_URL}/changelog`)
    if (!res.ok) throw new Error("Failed to fetch changelog")
    return res.json()
  }
}
