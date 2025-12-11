"use client"

import { X, History, Package, ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { InventoryItem, ChangeLogEntry } from "@/lib/data"

interface ChangeLogPanelProps {
  item: InventoryItem | null
  logs: ChangeLogEntry[]
  isOpen: boolean
  onClose: () => void
}

export function ChangeLogPanel({ item, logs, isOpen, onClose }: ChangeLogPanelProps) {
  if (!isOpen || !item) return null

  const itemLogs = logs.filter((log) => log.itemId === item.id)

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-medium">Change Log</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Item Info */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-medium text-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {item.quantity} {item.unit} in stock
        </p>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-auto p-4">
        {itemLogs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No changes recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {itemLogs.map((log) => (
              <div key={log.id} className="relative pl-4 pb-4 border-l-2 border-border last:pb-0">
                <div
                  className={cn(
                    "absolute -left-1.5 top-0 h-3 w-3 rounded-full",
                    log.type === "order-received" ? "bg-green-500" : "bg-primary",
                  )}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {log.type === "order-received" ? (
                        <Package className="h-3 w-3 text-green-500" />
                      ) : (
                        <ClipboardCheck className="h-3 w-3 text-primary" />
                      )}
                      <span className="text-xs font-medium text-foreground">{log.user}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.type === "order-received" ? (
                      <>
                        Order received from <span className="font-medium text-foreground">{log.supplier}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">{log.orderId}</span>
                      </>
                    ) : (
                      "Inventory count updated"
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {log.previousQuantity} {item.unit}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded",
                        log.newQuantity > log.previousQuantity
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {log.newQuantity} {item.unit}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        log.newQuantity > log.previousQuantity
                          ? "text-green-600 dark:text-green-400"
                          : "text-destructive",
                      )}
                    >
                      ({log.newQuantity > log.previousQuantity ? "+" : ""}
                      {log.newQuantity - log.previousQuantity})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
