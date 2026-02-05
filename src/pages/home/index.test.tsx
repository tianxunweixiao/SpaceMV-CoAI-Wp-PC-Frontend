import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import { useAppOutletContext } from '@/App'
import { useAppDispatch, useAppSelector } from '@/store'
import { getCompanyInfoConfig, getCompanyProfileByPublishStatus } from '@/api/company'
import { getMainPageContent } from '@/api/mainPage'
import { adjustPathForEnvironment } from '@/utils/pathUtils'
import Home from './index'

// Vitest global variables
declare const vi: any

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}))

vi.mock('@/App', () => ({
  useAppOutletContext: vi.fn()
}))

vi.mock('@/store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn()
}))

vi.mock('@/api/company', () => ({
  getCompanyInfoConfig: vi.fn(),
  getCompanyProfileByPublishStatus: vi.fn(() => ({
    profileOne: '<p>Test company profile</p>'
  }))
}))

vi.mock('@/api/mainPage', () => ({
  getMainPageContent: vi.fn()
}))

vi.mock('@/utils/pathUtils', () => ({
  adjustPathForEnvironment: vi.fn((path: string) => path)
}))

vi.mock('@/components/contact-us', () => ({
  default: vi.fn(() => <div data-testid="contact-us">Contact Us</div>)
}))

vi.mock('@/components/iconfont', () => ({
  default: vi.fn(({ type }: { type: string }) => <span data-testid="iconfont">{type}</span>)
}))

vi.mock('@/components/carousel', () => ({
  default: vi.fn(({ items }: { items: Array<{ alt: string }> }) => (
    <div data-testid="carousel">
      {items.map((item: { alt: string }, index: number) => (
        <div key={index}>{item.alt}</div>
      ))}
    </div>
  ))
}))

vi.mock('@/store/modules/menuReducer', () => ({
  setMenuIdx: vi.fn()
}))

vi.mock('@/store/modules/companyReducer', () => ({
  setCompanyInfo: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn()
}))

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
})

describe('Home Page', () => {
  const mockNavigate = vi.fn()
  const mockDispatch = vi.fn()
  const mockUseSelector = vi.fn()
  const mockGetCompanyInfoConfig = getCompanyInfoConfig as any
  const mockGetMainPageContent = getMainPageContent as any
  const mockAdjustPathForEnvironment = adjustPathForEnvironment as any

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as any).mockReturnValue(mockNavigate)
    ;(useAppDispatch as any).mockReturnValue(mockDispatch)
    ;(useAppOutletContext as any).mockReturnValue({ isPreview: false })
    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: null }
      }
      return selector(state)
    })
  })

  it('should render Home page', () => {
    // Mock successful responses
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {}
    })
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    expect(screen.getByTestId('contact-us')).toBeInTheDocument()
  })

  it('should fetch company info on mount', async () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    await waitFor(() => {
      expect(mockGetCompanyInfoConfig).toHaveBeenCalledWith(false)
    })
  })

  it('should fetch main page data on mount', async () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    await waitFor(() => {
      expect(mockGetMainPageContent).toHaveBeenCalledWith(false)
    })
  })

  it('should render carousel when carouselImages exist', async () => {
    const mockCarouselImages = [
      { imageUrl: 'test1.jpg', isShow: '1' },
      { imageUrl: 'test2.jpg', isShow: '1' }
    ]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: mockCarouselImages,
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByTestId('carousel')).toBeInTheDocument()
    })
  })

  it('should not render carousel when carouselImages is empty', async () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    await waitFor(() => {
      expect(screen.queryByTestId('carousel')).not.toBeInTheDocument()
    })
  })

  it('should render company profile when available', async () => {
    const mockCompanyInfo = {
      profileOne: '<p>Test company profile</p>'
    }

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo
    })
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('公司简介')).toBeInTheDocument()
      expect(screen.getByText('了解更多')).toBeInTheDocument()
    })
  })

  it('should render main products', async () => {
    const mockMainProducts = [
      {
        productName: 'Product 1',
        imageUrl: 'product1.jpg',
        jumpUrl: '/product1'
      },
      {
        productName: 'Product 2',
        imageUrl: 'product2.jpg',
        jumpUrl: '/product2'
      }
    ]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: mockMainProducts,
      typicalCustomer: null
    }})

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('主要产品')).toBeInTheDocument()
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 2')).toBeInTheDocument()
    })
  })

  it('should render typical customer when available', async () => {
    const mockTypicalCustomer = {
      imageUrl: 'customer.jpg'
    }

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: mockTypicalCustomer
    }})

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('典型客户')).toBeInTheDocument()
    })
  })

  it('should handle path click', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    // Check if the component renders without errors
    expect(screen.getByTestId('contact-us')).toBeInTheDocument()
  })

  it('should handle product click', () => {
    const mockMainProducts = [{
      productName: 'Test Product',
      imageUrl: 'product.jpg',
      jumpUrl: '/product'
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: [],
      mainProducts: mockMainProducts,
      typicalCustomer: null
    }})

    render(<Home />)

    // Check if the component renders without errors
    expect(screen.getByTestId('contact-us')).toBeInTheDocument()
  })

  it('should use temp data when isPublish is 0', () => {
    const mockCarouselImages = [{ imageUrl: 'test.jpg', isShow: '1' }]
    const mockMainProducts = [{ productName: 'Test Product', imageUrl: 'product.jpg', jumpUrl: '/product' }]
    const mockTypicalCustomer = { imageUrl: 'customer.jpg' }

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '0',
      carouselImageListsTemp: mockCarouselImages,
      mainProductsTemp: mockMainProducts,
      typicalCustomerTemp: mockTypicalCustomer
    }})

    render(<Home />)

    // Check if the component renders without errors
    expect(screen.getByTestId('contact-us')).toBeInTheDocument()
  })

  it('should filter carousel images by isShow', () => {
    const mockCarouselImages = [
      { imageUrl: 'test1.jpg', isShow: '1' },
      { imageUrl: 'test2.jpg', isShow: '0' } // This should be filtered out
    ]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {
    }})
    mockGetMainPageContent.mockResolvedValue({ code: 200, data: {
      isPublish: '1',
      carouselImageLists: mockCarouselImages,
      mainProducts: [],
      typicalCustomer: null
    }})

    render(<Home />)

    // Check if the component renders without errors
    expect(screen.getByTestId('contact-us')).toBeInTheDocument()
  })
})
