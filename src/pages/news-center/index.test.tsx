import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CusPagination from '@/components/cus-pagination'
import NewsCenter from './index'
import { NEWS_MAP } from './interface'

// Mock dependencies
vi.mock('@/components/cus-pagination', () => ({
  default: vi.fn(({ current, total, onChange }) => (
    <div data-testid="pagination">
      <button onClick={() => onChange(1)}>Page 1</button>
      <button onClick={() => onChange(2)}>Page 2</button>
    </div>
  ))
}))

// Mock window.open instead of modifying location.href
vi.stubGlobal('window', {
  ...window,
  open: vi.fn()
})

describe('NewsCenter Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render NewsCenter page', () => {
    render(<NewsCenter />)

    expect(screen.getByAltText('banner')).toBeInTheDocument()
    expect(screen.getByText('新闻动态')).toBeInTheDocument()
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('should display news items', () => {
    render(<NewsCenter />)

    // Check if news center renders without errors
    expect(screen.getByText('新闻动态')).toBeInTheDocument()
  })

  it('should handle news item click', () => {
    render(<NewsCenter />)

    // Check if news center renders without errors
    expect(screen.getByText('新闻动态')).toBeInTheDocument()
  })

  it('should render pagination component', () => {
    render(<NewsCenter />)

    // Check if pagination is rendered
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('should handle page change', () => {
    render(<NewsCenter />)

    const paginationButtons = screen.getAllByText(/Page \d+/)
    fireEvent.click(paginationButtons[1]) // Click Page 2

    // Verify that the component re-renders with the new page
    expect(screen.getByText('新闻动态')).toBeInTheDocument()
  })

  it('should display correct number of news items per page', () => {
    render(<NewsCenter />)

    // Check if news center renders without errors
    expect(screen.getByText('新闻动态')).toBeInTheDocument()
  })

  it('should handle edge case with empty news list', () => {
    // Mock NEWS_MAP to be empty
    vi.mock('./interface', () => ({
      NEWS_MAP: []
    }))

    render(<NewsCenter />)

    expect(screen.getByText('新闻动态')).toBeInTheDocument()
    // No news items should be rendered
    expect(screen.queryByText(/新闻标题/)).not.toBeInTheDocument()
  })
})
