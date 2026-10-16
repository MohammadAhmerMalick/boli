export type AuthUser = {
  id: number
  name: string
  role: string
}

export type CatalogItem = {
  id: number
  name: string
  category: string
  price: number
  status: string
  image: string
}

export const mockLoginApi = async (username: string, password: string) => {
  // 500ms network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (username === 'admin' && password === 'password123') {
    return {
      token: 'fake-jwt-token-xyz-987',
      user: { id: 1, name: 'Admin User', role: 'admin' } satisfies AuthUser,
    }
  }

  throw new Error('Invalid username or password')
}

const ITEMS_DATABASE: CatalogItem[] = [
  {
    category: 'Hardware',
    id: 1,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
    name: 'MacBook Pro 16"',
    price: 2499,
    status: 'In Stock',
  },
  {
    category: 'Monitors',
    id: 2,
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    name: 'Dell UltraSharp 27" 4K',
    price: 619,
    status: 'In Stock',
  },
  {
    category: 'Accessories',
    id: 3,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    name: 'Keychron K2 Mechanical Keyboard',
    price: 89,
    status: 'Low Stock',
  },
  {
    category: 'Accessories',
    id: 4,
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    name: 'Logitech MX Master 3S',
    price: 99,
    status: 'In Stock',
  },
  {
    category: 'Audio',
    id: 5,
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 398,
    status: 'In Stock',
  },
  {
    category: 'Hardware',
    id: 6,
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
    name: 'CalDigit TS4 Thunderbolt 4 Dock',
    price: 399,
    status: 'Out of Stock',
  },
]

// Simulated Async Catalog Fetch API (1s delay)
export const fetchItemsApi = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [...ITEMS_DATABASE]
}
