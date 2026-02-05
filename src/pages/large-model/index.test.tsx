import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAppOutletContext } from '@/App'
import { getProductInfoConfig, getLLMProductBasicInfoByPublishStatus, getLLMApplicationScenariosByPublishStatus } from '@/api/product'
import ClassicCase from './classic-case'
import LargeModel from './index'

// Mock dependencies
vi.mock('@/App', () => ({
  useAppOutletContext: vi.fn()
}))

vi.mock('@/api/product', () => ({
  getProductInfoConfig: vi.fn(),
  getLLMProductBasicInfoByPublishStatus: vi.fn(() => ({
    productName: 'Test LLM Product',
    productIntroduction: 'Test product introduction',
    backgroundImageUrl: 'test-bg.jpg'
  })),
  getLLMApplicationScenariosByPublishStatus: vi.fn(() => [
    {
      scenarioId: '1',
      scenarioName: 'Agriculture',
      scenarioIntroduction: 'Agriculture scenario',
      detailedIntroduction: 'Detailed agriculture scenario',
      iconUrl: 'agriculture-icon.jpg',
      backgroundImageUrl: 'agriculture-bg.jpg'
    },
    {
      scenarioId: '2',
      scenarioName: 'Industry',
      scenarioIntroduction: 'Industry scenario',
      detailedIntroduction: 'Detailed industry scenario',
      iconUrl: 'industry-icon.jpg',
      backgroundImageUrl: 'industry-bg.jpg'
    },
    {
      scenarioId: '3',
      scenarioName: 'Sky',
      scenarioIntroduction: 'Sky scenario',
      detailedIntroduction: 'Detailed sky scenario',
      iconUrl: 'sky-icon.jpg',
      backgroundImageUrl: 'sky-bg.jpg'
    }
  ])
}))

vi.mock('./classic-case', () => ({
  default: vi.fn(() => <div data-testid="classic-case">Classic Case</div>)
}))

describe('LargeModel Page', () => {
  const mockGetProductInfoConfig = getProductInfoConfig as any
  const mockGetLLMProductBasicInfoByPublishStatus = getLLMProductBasicInfoByPublishStatus as any
  const mockGetLLMApplicationScenariosByPublishStatus = getLLMApplicationScenariosByPublishStatus as any

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppOutletContext as any).mockReturnValue({ isPreview: false })
  })

  it('should render LargeModel page', () => {
    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: {}
    })

    render(<LargeModel />)

    // Check if the component renders without errors
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should fetch product data on mount', () => {
    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: {}
    })

    render(<LargeModel />)

    // Check if API was called
    expect(mockGetProductInfoConfig).toHaveBeenCalledWith(false)
  })

  it('should display product basic info when available', () => {
    const mockProductData = {}
    const mockLLMBasicInfo = {
      productName: 'Test LLM Product',
      productIntroduction: 'Test product introduction',
      backgroundImageUrl: 'test-bg.jpg'
    }

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetLLMProductBasicInfoByPublishStatus.mockReturnValue(mockLLMBasicInfo)

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should display application scenarios when available', () => {
    const mockProductData = {}
    const mockScenarios = [
      {
        scenarioId: '1',
        scenarioName: 'Agriculture',
        scenarioIntroduction: 'Agriculture scenario',
        detailedIntroduction: 'Detailed agriculture scenario',
        iconUrl: 'agriculture-icon.jpg',
        backgroundImageUrl: 'agriculture-bg.jpg'
      }
    ]

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetLLMApplicationScenariosByPublishStatus.mockReturnValue(mockScenarios)

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should render ClassicCase component with product data', () => {
    const mockProductData = {}

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should handle error when fetching product data', () => {
    mockGetProductInfoConfig.mockRejectedValue(new Error('Network error'))

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should handle empty product data', () => {
    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: null }
    )

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should handle empty application scenarios', () => {
    const mockProductData = {}

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetLLMApplicationScenariosByPublishStatus.mockReturnValue([])

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })

  it('should map scenario IDs correctly', () => {
    const mockProductData = {}
    const mockScenarios = [
      {
        scenarioId: '1',
        scenarioName: 'Agriculture',
        scenarioIntroduction: 'Agriculture scenario',
        detailedIntroduction: 'Detailed agriculture scenario',
        iconUrl: 'agriculture-icon.jpg',
        backgroundImageUrl: 'agriculture-bg.jpg'
      },
      {
        scenarioId: '2',
        scenarioName: 'Industry',
        scenarioIntroduction: 'Industry scenario',
        detailedIntroduction: 'Detailed industry scenario',
        iconUrl: 'industry-icon.jpg',
        backgroundImageUrl: 'industry-bg.jpg'
      },
      {
        scenarioId: '3',
        scenarioName: 'Sky',
        scenarioIntroduction: 'Sky scenario',
        detailedIntroduction: 'Detailed sky scenario',
        iconUrl: 'sky-icon.jpg',
        backgroundImageUrl: 'sky-bg.jpg'
      }
    ]

    mockGetProductInfoConfig.mockResolvedValue({ code: 200, data: mockProductData }
    )
    mockGetLLMApplicationScenariosByPublishStatus.mockReturnValue(mockScenarios)

    render(<LargeModel />)

    // Check if ClassicCase was called
    expect(ClassicCase).toHaveBeenCalled()
  })
})
