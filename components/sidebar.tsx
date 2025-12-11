"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Package, ClipboardList, Users, ChefHat, Wine, Sun, Moon, Bot, ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

const navigation: NavItem[] = [
  { name: "Agent", href: "/agent", icon: Bot },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    children: [
      { name: "Kitchen", href: "/inventory/kitchen", icon: ChefHat },
      { name: "Bar", href: "/inventory/bar", icon: Wine },
    ],
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ClipboardList,
    children: [{ name: "Suppliers", href: "/orders/suppliers", icon: Users }],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Inventory", "Orders"])

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const isItemActive = (item: NavItem) => {
    if (pathname === item.href) return true
    if (item.children) {
      return item.children.some((child) => pathname === child.href)
    }
    return false
  }

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar py-4 transition-all duration-200",
        isCollapsed ? "w-12 items-center" : "w-56",
      )}
    >
      <div className={cn("mb-8 flex items-center", isCollapsed ? "justify-center" : "justify-between px-4")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
          R
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      <nav className={cn("flex flex-1 flex-col gap-1", isCollapsed ? "items-center" : "px-2")}>
        {navigation.map((item) => {
          const isActive = isItemActive(item)
          const isExpanded = expandedItems.includes(item.name)
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.name}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-colors flex-1",
                    isCollapsed ? "h-10 w-10 justify-center" : "h-9 px-3",
                    isActive
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                  title={item.name}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
                {hasChildren && !isCollapsed && (
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                  >
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                )}
              </div>

              {hasChildren && isExpanded && !isCollapsed && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-2">
                  {item.children!.map((child) => {
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg h-8 px-3 transition-colors text-sm",
                          isChildActive
                            ? "bg-sidebar-accent text-foreground font-medium"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                        )}
                      >
                        <child.icon className="h-4 w-4 shrink-0" />
                        <span>{child.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className={cn("flex flex-col gap-2", isCollapsed ? "items-center" : "px-2")}>
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors",
            isCollapsed ? "h-10 w-10 justify-center" : "h-9 px-3",
          )}
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {!isCollapsed && <span className="text-sm font-medium">Theme</span>}
        </button>
      </div>
    </div>
  )
}
