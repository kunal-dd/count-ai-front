import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"

export default function AgentPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Agent" />

        <div className="flex-1 overflow-auto p-6">{/* Empty agent page */}</div>
      </div>
    </div>
  )
}
