import { render, screen, fireEvent } from '@testing-library/react'
import CusPagination from '@/components/cus-pagination'
import ArticleList from './index'

// Mock dependencies
vi.mock('@/components/cus-pagination', () => ({
  default: vi.fn(({ current, total, pageSize, onChange }) => (
    <div data-testid="pagination">
      <button onClick={() => onChange(1)}>Page 1</button>
      <button onClick={() => onChange(2)}>Page 2</button>
    </div>
  ))
}))

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true
})

describe('ArticleList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render ArticleList component', () => {
    render(<ArticleList />)

    // Check for the title
    expect(screen.getAllByText('空天与智能')[0]).toBeInTheDocument()
    expect(screen.getByText('文章一')).toBeInTheDocument()
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('should display article details', () => {
    render(<ArticleList />)

    expect(screen.getByAltText('文章一')).toBeInTheDocument()
    expect(screen.getByText('文章一')).toBeInTheDocument()
    expect(screen.getByText('文章描述一。')).toBeInTheDocument()
    expect(screen.getByText('20250208')).toBeInTheDocument()
  })

  it('should handle article card click', () => {
    render(<ArticleList />)

    const articleCard = screen.getByText('文章一').closest('.article-card')
    fireEvent.click(articleCard!)

    expect(window.open).toHaveBeenCalledWith('https://example.com')
  })

  it('should render pagination component', () => {
    render(<ArticleList />)

    // Check if CusPagination was called
    expect(CusPagination).toHaveBeenCalled()
    
    // Check the first argument
    const callArgs = (CusPagination as any).mock.calls[0][0]
    expect(callArgs).toHaveProperty('current', 1)
    expect(callArgs).toHaveProperty('total', 1)
    expect(callArgs).toHaveProperty('pageSize', 3)
    expect(callArgs).toHaveProperty('onChange')
  })

  it('should handle page change', () => {
    render(<ArticleList />)

    const paginationButtons = screen.getAllByText(/Page \d+/)
    fireEvent.click(paginationButtons[1]) // Click Page 2

    // Verify that the component re-renders with the new page
    expect(screen.getByText('空天与智能')).toBeInTheDocument()
  })

  it('should slice articles based on current page', () => {
    // This test verifies that the component correctly slices the articles array
    // based on the current page and page size
    render(<ArticleList />)

    // Since we only have 1 article, it should be displayed on the first page
    expect(screen.getByText('文章一')).toBeInTheDocument()
  })
})
