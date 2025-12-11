"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Pencil, Check, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Column<T> {
  key: keyof T | string
  header: string
  width?: string
  render?: (item: T) => React.ReactNode
  editable?: boolean
  type?: "text" | "number" | "select"
  options?: { value: string; label: string }[]
  link?: (item: T) => string
  clickable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  onDataChange?: (updatedData: T[]) => void
  onItemClick?: (item: T) => void
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  onDataChange,
  onItemClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, unknown>>({})

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const handleStartEdit = useCallback(
    (item: T) => {
      const values: Record<string, unknown> = {}
      columns.forEach((col) => {
        if (col.editable) {
          values[String(col.key)] = (item as Record<string, unknown>)[col.key as string]
        }
      })
      setEditValues(values)
      setEditingRowId(item.id)
    },
    [columns],
  )

  const handleSaveEdit = useCallback(() => {
    if (!editingRowId || !onDataChange) {
      setEditingRowId(null)
      return
    }

    const updatedData = data.map((item) => {
      if (item.id === editingRowId) {
        const updatedItem = { ...item }
        Object.entries(editValues).forEach(([key, value]) => {
          const column = columns.find((c) => String(c.key) === key)
          if (column?.type === "number") {
            ;(updatedItem as Record<string, unknown>)[key] = Number.parseFloat(String(value)) || 0
          } else {
            ;(updatedItem as Record<string, unknown>)[key] = value
          }
        })
        return updatedItem
      }
      return item
    })

    onDataChange(updatedData)
    setEditingRowId(null)
    setEditValues({})
  }, [editingRowId, editValues, data, columns, onDataChange])

  const handleCancelEdit = useCallback(() => {
    setEditingRowId(null)
    setEditValues({})
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  const handleFieldChange = (key: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [key]: value }))
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = (a as Record<string, unknown>)[sortKey]
    const bVal = (b as Record<string, unknown>)[sortKey]
    if (aVal === undefined || bVal === undefined) return 0
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground",
                  column.width,
                )}
                onClick={() => handleSort(String(column.key))}
              >
                <div className="flex items-center gap-1">
                  <span className="truncate">{column.header}</span>
                  {sortKey === String(column.key) &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3 shrink-0" />
                    ) : (
                      <ChevronDown className="h-3 w-3 shrink-0" />
                    ))}
                </div>
              </th>
            ))}
            {onDataChange && (
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-24">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => {
            const isEditing = editingRowId === item.id

            return (
              <tr
                key={item.id}
                className={cn(
                  "border-b border-border transition-colors",
                  "hover:bg-muted/30",
                  onRowClick && !isEditing && "cursor-pointer",
                  isEditing && "bg-muted/20",
                )}
                onClick={() => !isEditing && onRowClick?.(item)}
              >
                {columns.map((column) => {
                  const cellValue = (item as Record<string, unknown>)[column.key as string]
                  const isEditableColumn = column.editable && isEditing

                  return (
                    <td key={String(column.key)} className={cn("px-4 py-3 text-sm", column.width)}>
                      {isEditableColumn ? (
                        column.type === "select" && column.options ? (
                          <Select
                            value={String(editValues[String(column.key)] ?? "")}
                            onValueChange={(value) => handleFieldChange(String(column.key), value)}
                          >
                            <SelectTrigger className="h-8 w-full" onClick={(e) => e.stopPropagation()}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {column.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={column.type === "number" ? "number" : "text"}
                            value={String(editValues[String(column.key)] ?? "")}
                            onChange={(e) => handleFieldChange(String(column.key), e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-8 w-full"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )
                      ) : column.link ? (
                        <Link
                          href={column.link(item)}
                          className="text-primary hover:underline truncate block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {column.render ? column.render(item) : String(cellValue ?? "")}
                        </Link>
                      ) : column.clickable && onItemClick ? (
                        <button
                          type="button"
                          className="text-primary hover:underline truncate block text-left"
                          onClick={(e) => {
                            e.stopPropagation()
                            onItemClick(item)
                          }}
                        >
                          {column.render ? column.render(item) : String(cellValue ?? "")}
                        </button>
                      ) : column.render ? (
                        <span className="truncate block">{column.render(item)}</span>
                      ) : (
                        <span className="truncate block">{String(cellValue ?? "")}</span>
                      )}
                    </td>
                  )
                })}
                {onDataChange && (
                  <td className="px-4 py-3 text-sm w-24">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSaveEdit()
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelEdit()
                          }}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(item)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
