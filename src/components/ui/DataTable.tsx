import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Filter, Download } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  className?: string
}

export interface DataTableProps<T = Record<string, any>> {
  data?: T[]
  columns?: Column<T>[]
  keyExtractor?: (item: T) => string
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  filterOptions?: {
    label: string
    key: keyof T
    options: { label: string; value: string }[]
  }[]
  pageSize?: number
  emptyMessage?: string
  title?: string
  actions?: React.ReactNode
  onRowClick?: (item: T) => void
  className?: string
  children?: React.ReactNode
}

export function DataTable<T extends Record<string, any>>({
  data = [],
  columns = [],
  keyExtractor = (item: any) => item.id || Math.random().toString(),
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys,
  filterOptions,
  pageSize = 10,
  emptyMessage = 'No records found',
  title,
  actions,
  onRowClick,
  className,
  children,
}: DataTableProps<T>) {
  if (children) {
    return (
      <div className={cn('rounded-2xl bg-white shadow-sm border border-[#E8E0D6] overflow-hidden', className)}>
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-[#E8E0D6]">
            {title && (
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#172747]">
                {title}
              </h3>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        <div className="overflow-x-auto">
          {children}
        </div>
      </div>
    )
  }

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<{ key: string; value: string } | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and Search
  const filteredData = React.useMemo(() => {
    let result = [...data]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((item) => {
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some((k) => String(item[k] ?? '').toLowerCase().includes(q))
        }
        return Object.values(item).some((v) => String(v ?? '').toLowerCase().includes(q))
      })
    }

    if (activeFilter && activeFilter.value !== 'all') {
      result = result.filter((item) => String(item[activeFilter.key]) === activeFilter.value)
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, search, searchKeys, activeFilter, sortConfig])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null
      }
      return { key, direction: 'asc' }
    })
  }

  const exportCSV = () => {
    if (data.length === 0) return
    const headers = columns.map((c) => `"${c.header}"`).join(',')
    const rows = filteredData.map((item) =>
      columns.map((c) => `"${String(item[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sunpower_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#827B73]" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder={searchPlaceholder}
              className="pl-9 bg-white"
            />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {filterOptions && filterOptions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-[#827B73]" />
              {filterOptions.map((f) => (
                <select
                  key={String(f.key)}
                  className="h-10 text-xs font-semibold rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-[#292522] focus:border-[#172747] focus:outline-none"
                  onChange={(e) => {
                    setActiveFilter(e.target.value === 'all' ? null : { key: String(f.key), value: e.target.value })
                    setCurrentPage(1)
                  }}
                >
                  <option value="all">All {f.label}</option>
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={exportCSV} title="Export CSV">
            <Download className="h-4 w-4 mr-1 text-[#827B73]" />
            Export
          </Button>

          {actions}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-[#E8E0D6] bg-white overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#F7F3EC] border-b border-[#E8E0D6] h-10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#827B73] select-none',
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                      col.sortable && 'cursor-pointer hover:text-[#172747]',
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div
                      className={cn(
                        'inline-flex items-center gap-1',
                        col.align === 'right' && 'justify-end w-full'
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown className="h-3 w-3 opacity-60 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D6]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-32 text-center text-sm text-[#827B73] bg-[#FFF8F5]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'h-12 bg-white transition-colors duration-100 hover:bg-[#F7F3EC]/70',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-2.5 text-sm text-[#292522]',
                          col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left',
                          col.className
                        )}
                      >
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E0D6] bg-[#F7F3EC]/50 text-xs text-[#827B73]">
          <div>
            Showing{' '}
            <span className="font-semibold text-[#292522] tabular-nums">
              {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#292522] tabular-nums">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[#292522] tabular-nums">
              {filteredData.length}
            </span>{' '}
            records
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 font-medium text-[#292522] tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
