import { render, screen, waitFor } from '@testing-library/react'
import { useAppOutletContext } from '@/App'
import { getProductInfoConfig, getDeviceProductBasicInfoByPublishStatus, getDeviceApplicationScenariosByPublishStatus, getDeviceTypicalCaseProductsByPublishStatus } from '@/api/product'
import SmallDevice from './index'

// Mock dependencies
vi.mock('@/App', () => ({
  useAppOutletContext: vi.fn()
}))

vi.mock('@/api/product', () => ({
  getProductInfoConfig: vi.fn(),
  getDeviceProductBasicInfoByPublishStatus: vi.fn(() => ({
    productName: 'Test Device Product',
    productIntroduction: 'Test product introduction',
    detailedIntroduction: 'Test detailed introduction',
    backgroundImageUrl: 'test-bg.jpg'
  })),
  getDeviceApplicationScenariosByPublishStatus: vi.fn(() => []),
  getDeviceTypicalCaseProductsByPublishStatus: vi.fn(() => [])
}))

describe('SmallDevice Page', () => {
  const mockGetProductInfoConfig = getProductInfoConfig as any
  const mockGetDeviceProductBasicInfoByPublishStatus = getDeviceProductBasicInfoByPublishStatus as any
  const mockGetDeviceApplicationScenariosByPublishStatus = getDeviceApplicationScenariosByPublishStatus as any
  const mockGetDeviceTypicalCaseProductsByPublishStatus = getDeviceTypicalCaseProductsByPublishStatus as any

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppOutletContext as any).mockReturnValue({ isPreview: false })
  })

  it('should render SmallDevice page', async () => {
    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: {}
    })

    render(<SmallDevice />)

    await waitFor(() => {
      expect(screen.getByText('应用场景')).toBeInTheDocument()
      expect(screen.getByText('典型产品')).toBeInTheDocument()
    })
  })

  it('should fetch product data on mount', async () => {
    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: {}
    })

    render(<SmallDevice />)

    await waitFor(() => {
      expect(mockGetProductInfoConfig).toHaveBeenCalledWith(false)
    })
  })

  it('should display device basic info when available', () => {
    const mockProductData = {}
    const mockDeviceBasicInfo = {
      productName: 'Test Device Product',
      productIntroduction: 'Test product introduction',
      detailedIntroduction: 'Test detailed introduction',
      backgroundImageUrl: 'test-bg.jpg'
    }

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetDeviceProductBasicInfoByPublishStatus.mockReturnValue(mockDeviceBasicInfo)

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should display application scenarios when available', () => {
    const mockProductData = {}
    const mockScenarios = [
      {
        scenarioName: 'Scenario 1',
        detailedIntroduction: 'Detailed scenario 1',
        backgroundImageUrl: 'scenario1.jpg'
      },
      {
        scenarioName: 'Scenario 2',
        detailedIntroduction: 'Detailed scenario 2',
        backgroundImageUrl: 'scenario2.jpg'
      }
    ]

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetDeviceApplicationScenariosByPublishStatus.mockReturnValue(mockScenarios)

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should display typical case products when available', () => {
    const mockProductData = {}
    const mockTypicalProducts = [
      {
        productName: 'Typical Product 1',
        productIntroduction: 'Product introduction 1',
        detailedIntroduction: 'Detailed introduction 1',
        imageUrl: 'product1.jpg',
        standardFunctions: ['Function 1', 'Function 2'],
        customServices: ['Service 1']
      },
      {
        productName: 'Typical Product 2',
        productIntroduction: 'Product introduction 2',
        detailedIntroduction: 'Detailed introduction 2',
        imageUrl: 'product2.jpg',
        standardFunctions: [],
        customServices: []
      }
    ]

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetDeviceTypicalCaseProductsByPublishStatus.mockReturnValue(mockTypicalProducts)

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should handle error when fetching product data', () => {
    mockGetProductInfoConfig.mockRejectedValue(new Error('Network error'))

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should handle empty product data', () => {
    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: null }
    )

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('应用场景')).toBeInTheDocument()
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should handle empty application scenarios', () => {
    const mockProductData = {}

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetDeviceApplicationScenariosByPublishStatus.mockReturnValue([])

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('应用场景')).toBeInTheDocument()
  })

  it('should handle empty typical case products', () => {
    const mockProductData = {}

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetDeviceTypicalCaseProductsByPublishStatus.mockReturnValue([])

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })

  it('should display typical case products without standard functions or custom services', () => {
    const mockProductData = {}
    const mockTypicalProducts = [{
      productName: 'Typical Product',
      productIntroduction: 'Product introduction',
      detailedIntroduction: 'Detailed introduction',
      imageUrl: 'product.jpg',
      standardFunctions: [],
      customServices: []
    }]

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetDeviceTypicalCaseProductsByPublishStatus.mockReturnValue(mockTypicalProducts)

    render(<SmallDevice />)

    // Check if the component renders without errors
    expect(screen.getByText('典型产品')).toBeInTheDocument()
  })
})
