import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Package } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader icon={<Package className="h-5 w-5" />} title="Inventory" />
        <div className="flex-1 overflow-auto p-8"></div>
      </div>
    </div>
  )
}
