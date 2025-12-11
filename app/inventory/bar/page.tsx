"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"
import { ChangeLogPanel } from "@/components/change-log-panel"
import { suppliers as staticSuppliers, type InventoryItem, type ChangeLogEntry } from "@/lib/data"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function BarInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [inventoryData, logsData] = await Promise.all([
        api.getInventory(),
        api.getChangeLog()
      ])
      // Filter for bar only
      setItems(inventoryData.filter((item) => item.category === "bar"))
      setChangeLogs(logsData)
    } catch (error) {
      console.error("Failed to load inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const supplierOptions = staticSuppliers.map((s) => ({ value: s.name, label: s.name }))

  const unitOptions = [
    { value: "kg", label: "kg" },
    { value: "g", label: "g" },
    { value: "L", label: "L" },
    { value: "ml", label: "ml" },
    { value: "units", label: "units" },
    { value: "bottles", label: "bottles" },
    { value: "cases", label: "cases" },
    { value: "boxes", label: "boxes" },
    { value: "packs", label: "packs" },
    { value: "dozen", label: "dozen" },
  ]

  const columns: Column<InventoryItem>[] = [
    { key: "name", header: "Item Name", width: "w-40", editable: true, type: "text", clickable: true },
    {
      key: "unitCost",
      header: "Unit Cost",
      editable: true,
      type: "number",
      render: (item) => `£${item.unitCost.toFixed(2)}`,
    },
    {
      key: "quantity",
      header: "Current Qty",
      editable: true,
      type: "number",
      render: (item) => (
        <span className={item.quantity < item.reorderLevel ? "text-destructive font-medium" : ""}>{item.quantity}</span>
      ),
    },
    {
      key: "reorderLevel",
      header: "Reorder Level",
      editable: true,
      type: "number",
      render: (item) => `${item.reorderLevel}`,
    },
    {
      key: "unit",
      header: "Unit",
      editable: true,
      type: "select",
      options: unitOptions,
    },
    {
      key: "supplier",
      header: "Supplier",
      editable: true,
      type: "select",
      options: supplierOptions,
      link: () => "/orders/suppliers",
    },
    { key: "lastUpdated", header: "Last Updated" },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const isLowStock = item.quantity < item.reorderLevel
        return (
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
              isLowStock ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600 dark:text-green-400",
            )}
          >
            {isLowStock ? "Low Stock" : "In Stock"}
          </span>
        )
      },
    },
  ]

  const handleDataChange = async (updatedData: InventoryItem[]) => {
    // Detect changes and update API
    for (const newItem of updatedData) {
        const oldItem = items.find(i => i.id === newItem.id)
        if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
             try {
                 await api.updateInventoryItem(newItem.id, newItem)
             } catch(e) {
                 console.error("Update failed", e)
             }
        }
    }
    setItems(updatedData)
  }

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsPanelOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader title="Inventory" subtitle="Bar" />
        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>
          ) : (
             <DataTable data={items} columns={columns} onDataChange={handleDataChange} onItemClick={handleItemClick} />
          )}
        </div>
      </div>
      <ChangeLogPanel item={selectedItem} logs={changeLogs} isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  )
}

