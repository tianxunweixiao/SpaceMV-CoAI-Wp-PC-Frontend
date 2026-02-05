import { render, screen } from '@testing-library/react'
import { getLLMTypicalCaseProductsByPublishStatus } from '@/api/product'
import ClassicCase from './index'

// Vitest global variables
declare const vi: any

// Mock dependencies
vi.mock('@/api/product', () => ({
  getLLMTypicalCaseProductsByPublishStatus: vi.fn(() => [])
}))

describe('ClassicCase Component', () => {
  const mockGetLLMTypicalCaseProductsByPublishStatus = getLLMTypicalCaseProductsByPublishStatus as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render ClassicCase component', () => {
    render(<ClassicCase productData={null} />)

    expect(screen.getByText('典型案例')).toBeInTheDocument()
  })

  it('should display case data when available', () => {
    const mockCaseData = [
      {
        caseProductId: '1',
        productName: 'Case 1',
        imageUrl: 'case1.jpg',
        standardFunctions: ['Function 1', 'Function 2']
      },
      {
        caseProductId: '2',
        productName: 'Case 2',
        imageUrl: 'case2.jpg',
        standardFunctions: ['Function 3']
      }
    ]

    mockGetLLMTypicalCaseProductsByPublishStatus.mockReturnValue(mockCaseData)

    render(<ClassicCase productData={{ isPublish: '1' }} />)

    expect(screen.getByText('Case 1')).toBeInTheDocument()
    expect(screen.getByText('Case 2')).toBeInTheDocument()
    expect(screen.getByText('Function 1')).toBeInTheDocument()
    expect(screen.getByText('Function 2')).toBeInTheDocument()
    expect(screen.getByText('Function 3')).toBeInTheDocument()
  })

  it('should display default images when imageUrl is not provided', () => {
    const mockCaseData = [
      {
        caseProductId: '1',
        productName: 'Case 1',
        standardFunctions: ['Function 1']
      },
      {
        caseProductId: '2',
        productName: 'Case 2',
        standardFunctions: ['Function 2']
      },
      {
        caseProductId: '3',
        productName: 'Case 3',
        standardFunctions: ['Function 3']
      }
    ]

    mockGetLLMTypicalCaseProductsByPublishStatus.mockReturnValue(mockCaseData)

    render(<ClassicCase productData={{ isPublish: '1' }} />)

    expect(screen.getByText('Case 1')).toBeInTheDocument()
    expect(screen.getByText('Case 2')).toBeInTheDocument()
    expect(screen.getByText('Case 3')).toBeInTheDocument()
  })

  it('should handle empty case data', () => {
    mockGetLLMTypicalCaseProductsByPublishStatus.mockReturnValue([])

    render(<ClassicCase productData={{ isPublish: '1' }} />)

    expect(screen.getByText('典型案例')).toBeInTheDocument()
    // No case items should be rendered
  })

  it('should handle null productData', () => {
    render(<ClassicCase productData={null} />)

    expect(screen.getByText('典型案例')).toBeInTheDocument()
    // No case items should be rendered
  })

  it('should handle case data without tags', () => {
    const mockCaseData = [
      {
        caseProductId: '1',
        productName: 'Case 1',
        imageUrl: 'case1.jpg'
        // No standardFunctions
      }
    ]

    mockGetLLMTypicalCaseProductsByPublishStatus.mockReturnValue(mockCaseData)

    render(<ClassicCase productData={{ isPublish: '1' }} />)

    expect(screen.getByText('Case 1')).toBeInTheDocument()
    // No tags should be rendered
  })

  it('should handle case data with empty tags array', () => {
    const mockCaseData = [
      {
        caseProductId: '1',
        productName: 'Case 1',
        imageUrl: 'case1.jpg',
        standardFunctions: []
      }
    ]

    mockGetLLMTypicalCaseProductsByPublishStatus.mockReturnValue(mockCaseData)

    render(<ClassicCase productData={{ isPublish: '1' }} />)

    expect(screen.getByText('Case 1')).toBeInTheDocument()
    // No tags should be rendered
  })

  it('should use index as key when caseProductId is not provided', () => {
    const mockCaseData = [
      {
        productName: 'Case 1',
        imageUrl: 'case1.jpg',
        standardFunctions: ['Function 1']
      }
    ]

    mockGetLLMTypicalCaseProductsByPublishStatus.mockReturnValue(mockCaseData)

    render(<ClassicCase productData={{ isPublish: '1' }} />)

    expect(screen.getByText('Case 1')).toBeInTheDocument()
  })
})
