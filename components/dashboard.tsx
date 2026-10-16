'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { type CatalogItem, fetchItemsApi } from '@/lib/api'

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
})

const statusStyles: Record<string, string> = {
  'In Stock': 'bg-emerald-50 text-emerald-800',
  'Low Stock': 'bg-amber-50 text-amber-900',
  'Out of Stock': 'bg-rose-50 text-rose-800',
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<CatalogItem[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchItemsApi()
      .then((nextItems) => {
        if (!cancelled) setItems(nextItems)
      })
      .catch(() => {
        if (!cancelled) setError('The catalog could not be loaded.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => item.name.toLowerCase().includes(needle))
  }, [items, query])

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <div className="flex flex-1 flex-col bg-[#f4f1ea] text-stone-900">
      <header className="sticky top-0 z-10 border-stone-200/80 border-b bg-[#f4f1ea]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#1c3a2e] font-semibold text-[#f4f1ea] text-sm">
              B
            </span>
            <div>
              <p className="font-semibold text-sm tracking-tight">Boli</p>
              <p className="text-stone-500 text-xs">Equipment catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-stone-500 text-xs capitalize">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="h-9 rounded-lg border border-stone-300 bg-white px-3 font-medium text-sm transition hover:border-stone-400 hover:bg-stone-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">Catalog</h1>
            <p className="mt-1 text-sm text-stone-600">
              {loading
                ? 'Loading items…'
                : `${filteredItems.length} ${filteredItems.length === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="catalog-search" className="sr-only">
              Search items by name
            </label>
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#1c3a2e] focus:ring-2 focus:ring-[#1c3a2e]/20"
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm"
          >
            {error}
          </p>
        ) : null}

        {loading ? (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <li
                key={index}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-stone-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
                </div>
              </li>
            ))}
          </ul>
        ) : filteredItems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-stone-300 border-dashed bg-white px-6 py-16 text-center">
            <p className="font-medium text-base">No matching items</p>
            <p className="mt-2 text-sm text-stone-600">
              Nothing in the catalog matches “{query.trim()}”.
            </p>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-stone-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-stone-500 text-xs uppercase tracking-wide">
                      {item.category}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-medium text-xs ${statusStyles[item.status] ?? 'bg-stone-100 text-stone-700'}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h2 className="font-semibold text-base leading-6">
                    {item.name}
                  </h2>
                  <p className="font-semibold text-lg tracking-tight">
                    {currency.format(item.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
