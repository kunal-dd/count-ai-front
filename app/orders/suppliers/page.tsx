"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"
// import { suppliers as initialSuppliers, type Supplier } from "@/lib/data"
import { type Supplier } from "@/lib/data"
import { api } from "@/lib/api"

const supplierCategories = [
  "Produce",
  "Meat & Poultry",
  "Seafood",
  "Dairy",
  "Beverages",
  "Spirits",
  "Wine & Beer",
  "Dry Goods",
  "Packaging",
  "Cleaning Supplies",
]

export default function SuppliersPage() {
  const [supplierData, setSupplierData] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
        setLoading(true)
        const data = await api.getSuppliers()
        setSupplierData(data)
    } catch (e) {
        console.error("Failed to load suppliers", e)
    } finally {
        setLoading(false)
    }
  }

  const columns: Column<Supplier>[] = [
    { key: "name", header: "Supplier Name", width: "w-48", editable: true },
    { key: "contact", header: "Contact", editable: true },
    { key: "email", header: "Email", editable: true },
    { key: "phone", header: "Phone", editable: true },
    {
      key: "category",
      header: "Category",
      editable: true,
      type: "select",
      options: supplierCategories.map(c => ({ value: c, label: c})), // Fixed format
    },
  ]

  const handleDataChange = async (newData: Supplier[]) => {
    // Detect changes and update API
    // Simple approach: Iterate and update all changed items (or optimizing by finding diff)
    for (const newSup of newData) {
        const oldSup = supplierData.find(s => s.id === newSup.id)
        if (oldSup && JSON.stringify(oldSup) !== JSON.stringify(newSup)) {
            try {
                await api.updateSupplier(newSup.id, newSup)
            } catch(e) {
                console.error("Failed to update supplier", e)
            }
        }
    }
    setSupplierData(newData)
    
    // Also, handle Creation if new item added? 
    // The current DataTable might not support "Adding" new rows easily without a button.
    // If it did, we'd need to handle `api.createSupplier`.
    // For now assuming just editing.
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Orders" subtitle="Suppliers" />
        <div className="flex-1 overflow-auto">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading suppliers...</div>
          ) : (
             <DataTable data={supplierData} columns={columns} onDataChange={handleDataChange} />
          )}
        </div>
      </div>
    </div>
  )
}

