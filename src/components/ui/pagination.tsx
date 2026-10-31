import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  >
    <ul className="flex items-center space-x-1">
      <li>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
      </li>
      <li>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </li>
    </ul>
  </nav>
)

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
  />
))
PaginationItem.displayName = 'PaginationItem'

const PaginationLink = ({
  className,
  isActive,
  ...props
}: React.ComponentProps<'a'> & { isActive?: boolean }) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'flex h-9 w-9 items-center justify-center text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      isActive && 'bg-primary text-primary-foreground',
      className
    )}
    {...props}
  />
)

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<'a'>) => (
  <a
    aria-label="Go to previous page"
    className={cn(
      'flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </a>
)

const PaginationNext = ({ className, ...props }: React.ComponentProps<'a'>) => (
  <a
    aria-label="Go to next page"
    className={cn(
      'flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next</span>
  </a>
)

export {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
}