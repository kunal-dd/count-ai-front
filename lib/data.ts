// Mock data for the restaurant inventory system

export interface InventoryItem {
  id: string
  name: string
  category: "kitchen" | "bar"
  quantity: number
  unit: string
  reorderLevel: number
  unitCost: number
  supplier: string
  lastUpdated: string
}

export interface OrderItem {
  id: string
  itemName: string
  quantity: number
  unit: string
  price: number
}

export interface SupplierOrder {
  id: string
  supplier: string
  items: OrderItem[]
  status: "low-stock" | "order-placed" | "order-received"
  orderDate: string
  expectedDate?: string
  totalValue: number
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  category: string
  rating: number
  lastOrder: string
}

export interface ChangeLogEntry {
  id: string
  itemId: string
  timestamp: string
  user: string
  type: "inventory-count" | "order-received"
  previousQuantity: number
  newQuantity: number
  orderId?: string // Reference to the order if type is order-received
  supplier?: string // Supplier name for order-received
}

export const MOCK_changeLog: ChangeLogEntry[] = [
  {
    id: "log-1",
    itemId: "1",
    timestamp: "2025-12-01T10:30:00Z",
    user: "John D.",
    type: "inventory-count",
    previousQuantity: 15,
    newQuantity: 12,
  },
  {
    id: "log-2",
    itemId: "1",
    timestamp: "2025-11-25T14:20:00Z",
    user: "System",
    type: "order-received",
    previousQuantity: 5,
    newQuantity: 15,
    orderId: "ORD-004",
    supplier: "Fresh Farms",
  },
  {
    id: "log-3",
    itemId: "2",
    timestamp: "2025-12-05T11:45:00Z",
    user: "Mike R.",
    type: "inventory-count",
    previousQuantity: 30,
    newQuantity: 25,
  },
  {
    id: "log-4",
    itemId: "3",
    timestamp: "2025-12-10T08:30:00Z",
    user: "John D.",
    type: "inventory-count",
    previousQuantity: 20,
    newQuantity: 8,
  },
  {
    id: "log-5",
    itemId: "4",
    timestamp: "2025-12-08T10:00:00Z",
    user: "Sarah M.",
    type: "inventory-count",
    previousQuantity: 25,
    newQuantity: 15,
  },
  {
    id: "log-6",
    itemId: "4",
    timestamp: "2025-12-08T16:00:00Z",
    user: "System",
    type: "order-received",
    previousQuantity: 15,
    newQuantity: 45,
    orderId: "ORD-005",
    supplier: "Premium Meats",
  },
  {
    id: "log-7",
    itemId: "5",
    timestamp: "2025-12-07T14:30:00Z",
    user: "John D.",
    type: "inventory-count",
    previousQuantity: 12,
    newQuantity: 6,
  },
  {
    id: "log-8",
    itemId: "6",
    timestamp: "2025-12-09T09:00:00Z",
    user: "Mike R.",
    type: "inventory-count",
    previousQuantity: 10,
    newQuantity: 4,
  },
  {
    id: "log-9",
    itemId: "7",
    timestamp: "2025-12-03T15:00:00Z",
    user: "Sarah M.",
    type: "inventory-count",
    previousQuantity: 12,
    newQuantity: 8,
  },
  {
    id: "log-10",
    itemId: "7",
    timestamp: "2025-12-07T11:00:00Z",
    user: "System",
    type: "order-received",
    previousQuantity: 8,
    newQuantity: 20,
    orderId: "ORD-006",
    supplier: "Spirit Masters",
  },
  {
    id: "log-11",
    itemId: "8",
    timestamp: "2025-12-07T11:00:00Z",
    user: "System",
    type: "order-received",
    previousQuantity: 4,
    newQuantity: 12,
    orderId: "ORD-006",
    supplier: "Spirit Masters",
  },
  {
    id: "log-12",
    itemId: "9",
    timestamp: "2025-12-02T11:00:00Z",
    user: "John D.",
    type: "inventory-count",
    previousQuantity: 8,
    newQuantity: 3,
  },
  {
    id: "log-13",
    itemId: "10",
    timestamp: "2025-12-04T16:30:00Z",
    user: "Mike R.",
    type: "inventory-count",
    previousQuantity: 10,
    newQuantity: 5,
  },
  {
    id: "log-14",
    itemId: "10",
    timestamp: "2025-12-07T11:00:00Z",
    user: "System",
    type: "order-received",
    previousQuantity: 5,
    newQuantity: 11,
    orderId: "ORD-006",
    supplier: "Spirit Masters",
  },
  {
    id: "log-15",
    itemId: "14",
    timestamp: "2025-12-01T12:00:00Z",
    user: "Sarah M.",
    type: "inventory-count",
    previousQuantity: 5,
    newQuantity: 2,
  },
]

export const MOCK_inventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Olive Oil",
    category: "kitchen",
    quantity: 12,
    unit: "L",
    reorderLevel: 5,
    unitCost: 15.99,
    supplier: "Fresh Farms",
    lastUpdated: "2025-12-01",
  },
  {
    id: "2",
    name: "Flour",
    category: "kitchen",
    quantity: 25,
    unit: "kg",
    reorderLevel: 10,
    unitCost: 2.5,
    supplier: "Fresh Farms",
    lastUpdated: "2025-12-05",
  },
  {
    id: "3",
    name: "Tomatoes",
    category: "kitchen",
    quantity: 8,
    unit: "kg",
    reorderLevel: 15,
    unitCost: 4.99,
    supplier: "Fresh Farms",
    lastUpdated: "2025-12-10",
  },
  {
    id: "4",
    name: "Chicken Breast",
    category: "kitchen",
    quantity: 15,
    unit: "kg",
    reorderLevel: 10,
    unitCost: 12.99,
    supplier: "Premium Meats",
    lastUpdated: "2025-12-08",
  },
  {
    id: "5",
    name: "Salmon Fillet",
    category: "kitchen",
    quantity: 6,
    unit: "kg",
    reorderLevel: 8,
    unitCost: 24.99,
    supplier: "Premium Meats",
    lastUpdated: "2025-12-07",
  },
  {
    id: "6",
    name: "Heavy Cream",
    category: "kitchen",
    quantity: 4,
    unit: "L",
    reorderLevel: 6,
    unitCost: 5.99,
    supplier: "Fresh Farms",
    lastUpdated: "2025-12-09",
  },
  {
    id: "7",
    name: "Vodka Premium",
    category: "bar",
    quantity: 8,
    unit: "bottles",
    reorderLevel: 5,
    unitCost: 32.0,
    supplier: "Spirit Masters",
    lastUpdated: "2025-12-03",
  },
  {
    id: "8",
    name: "Gin London Dry",
    category: "bar",
    quantity: 6,
    unit: "bottles",
    reorderLevel: 4,
    unitCost: 28.0,
    supplier: "Spirit Masters",
    lastUpdated: "2025-12-03",
  },
  {
    id: "9",
    name: "Whiskey Bourbon",
    category: "bar",
    quantity: 3,
    unit: "bottles",
    reorderLevel: 5,
    unitCost: 45.0,
    supplier: "Spirit Masters",
    lastUpdated: "2025-12-02",
  },
  {
    id: "10",
    name: "Tequila Blanco",
    category: "bar",
    quantity: 5,
    unit: "bottles",
    reorderLevel: 4,
    unitCost: 38.0,
    supplier: "Spirit Masters",
    lastUpdated: "2025-12-04",
  },
  {
    id: "11",
    name: "Triple Sec",
    category: "bar",
    quantity: 4,
    unit: "bottles",
    reorderLevel: 3,
    unitCost: 18.0,
    supplier: "Beverage Plus",
    lastUpdated: "2025-12-06",
  },
  {
    id: "12",
    name: "Lime Juice",
    category: "bar",
    quantity: 10,
    unit: "L",
    reorderLevel: 5,
    unitCost: 6.99,
    supplier: "Beverage Plus",
    lastUpdated: "2025-12-10",
  },
  {
    id: "13",
    name: "Simple Syrup",
    category: "bar",
    quantity: 8,
    unit: "L",
    reorderLevel: 4,
    unitCost: 8.99,
    supplier: "Beverage Plus",
    lastUpdated: "2025-12-06",
  },
  {
    id: "14",
    name: "Angostura Bitters",
    category: "bar",
    quantity: 2,
    unit: "bottles",
    reorderLevel: 3,
    unitCost: 14.0,
    supplier: "Spirit Masters",
    lastUpdated: "2025-12-01",
  },
]

export const MOCK_supplierOrders: SupplierOrder[] = [
  {
    id: "ORD-001",
    supplier: "Fresh Farms",
    items: [
      { id: "item-1", itemName: "Tomatoes", quantity: 20, unit: "kg", price: 4.99 },
      { id: "item-2", itemName: "Heavy Cream", quantity: 10, unit: "L", price: 5.99 },
    ],
    status: "low-stock",
    orderDate: "2025-12-11",
    totalValue: 159.7,
  },
  {
    id: "ORD-002",
    supplier: "Spirit Masters",
    items: [
      { id: "item-3", itemName: "Whiskey Bourbon", quantity: 6, unit: "bottles", price: 45.0 },
      { id: "item-4", itemName: "Angostura Bitters", quantity: 4, unit: "bottles", price: 14.0 },
    ],
    status: "order-placed",
    orderDate: "2025-12-10",
    expectedDate: "2025-12-13",
    totalValue: 326.0,
  },
  {
    id: "ORD-003",
    supplier: "Premium Meats",
    items: [{ id: "item-5", itemName: "Salmon Fillet", quantity: 10, unit: "kg", price: 24.99 }],
    status: "order-placed",
    orderDate: "2025-12-09",
    expectedDate: "2025-12-12",
    totalValue: 249.9,
  },
  {
    id: "ORD-004",
    supplier: "Fresh Farms",
    items: [{ id: "item-6", itemName: "Olive Oil", quantity: 24, unit: "L", price: 15.99 }],
    status: "order-received",
    orderDate: "2025-12-05",
    expectedDate: "2025-12-10",
    totalValue: 383.76,
  },
  {
    id: "ORD-005",
    supplier: "Premium Meats",
    items: [{ id: "item-7", itemName: "Chicken Breast", quantity: 30, unit: "kg", price: 12.99 }],
    status: "order-received",
    orderDate: "2025-12-03",
    expectedDate: "2025-12-08",
    totalValue: 389.7,
  },
  {
    id: "ORD-006",
    supplier: "Spirit Masters",
    items: [
      { id: "item-8", itemName: "Vodka Premium", quantity: 12, unit: "bottles", price: 32.0 },
      { id: "item-9", itemName: "Gin London Dry", quantity: 8, unit: "bottles", price: 28.0 },
      { id: "item-10", itemName: "Tequila Blanco", quantity: 6, unit: "bottles", price: 38.0 },
    ],
    status: "order-received",
    orderDate: "2025-12-02",
    expectedDate: "2025-12-07",
    totalValue: 836.0,
  },
]

export function getOrCreateSupplierOrder(orders: SupplierOrder[], supplier: string, item: OrderItem): SupplierOrder[] {
  const existingOrder = orders.find((order) => order.supplier === supplier && order.status === "low-stock")

  if (existingOrder) {
    const itemExists = existingOrder.items.some((i) => i.itemName === item.itemName)
    if (!itemExists) {
      return orders.map((order) =>
        order.id === existingOrder.id
          ? {
              ...order,
              items: [...order.items, item],
              totalValue: order.totalValue + item.price * item.quantity,
            }
          : order,
      )
    }
    return orders
  }

  const newOrder: SupplierOrder = {
    id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
    supplier,
    items: [item],
    status: "low-stock",
    orderDate: new Date().toISOString().split("T")[0],
    totalValue: item.price * item.quantity,
  }

  return [...orders, newOrder]
}

export const suppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Fresh Farms",
    contact: "John Green",
    email: "john@freshfarms.co.uk",
    phone: "+44 161 496 0732",
    category: "Produce",
    rating: 4.9,
    lastOrder: "2025-12-10",
  },
  {
    id: "SUP-002",
    name: "Premium Meats",
    contact: "Robert Smith",
    email: "robert@premiummeats.co.uk",
    phone: "+44 113 496 0621",
    category: "Meat & Poultry",
    rating: 4.7,
    lastOrder: "2025-12-08",
  },
  {
    id: "SUP-003",
    name: "Spirit Masters",
    contact: "David Brown",
    email: "david@spiritmasters.co.uk",
    phone: "+44 117 496 0398",
    category: "Spirits",
    rating: 4.8,
    lastOrder: "2025-12-04",
  },
  {
    id: "SUP-004",
    name: "Beverage Plus",
    contact: "Amy Taylor",
    email: "amy@beverageplus.co.uk",
    phone: "+44 151 496 0287",
    category: "Beverages",
    rating: 4.3,
    lastOrder: "2025-12-06",
  },
]
