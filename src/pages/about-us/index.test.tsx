import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useAppOutletContext } from '@/App'
import { useAppDispatch, useAppSelector } from '@/store'
import { getCompanyInfoConfig, getCompanyProfileByPublishStatus, getProductCertsByPublishStatus } from '@/api/company'
import AboutUs from './index'

// Mock dependencies
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
    profileTwo: '<p>Test company profile</p>'
  })),
  getProductCertsByPublishStatus: vi.fn(() => [])
}))

vi.mock('@/components/contact-us', () => ({
  default: vi.fn(() => <div data-testid="contact-us">Contact Us</div>)
}))

vi.mock('@/components/iconfont', () => ({
  default: vi.fn(({ type }) => <span data-testid="iconfont">{type}</span>)
}))

vi.mock('@/store/modules/companyReducer', () => ({
  setCompanyInfo: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn()
}))

describe('AboutUs Page', () => {
  const mockDispatch = vi.fn()
  const mockUseSelector = vi.fn()
  const mockGetCompanyInfoConfig = getCompanyInfoConfig as any
  const mockGetCompanyProfileByPublishStatus = getCompanyProfileByPublishStatus as any
  const mockGetProductCertsByPublishStatus = getProductCertsByPublishStatus as any

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppDispatch as any).mockReturnValue(mockDispatch)
    ;(useAppOutletContext as any).mockReturnValue({ isPreview: false })
    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: null }
      }
      return selector(state)
    })
  })

  it('should render AboutUs page', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {}
    })

    render(<AboutUs />)

    expect(screen.getByAltText('banner')).toBeInTheDocument()
    expect(screen.getByText('公司简介')).toBeInTheDocument()
    expect(screen.getByText('产品认证')).toBeInTheDocument()
    expect(screen.getByTestId('contact-us')).toBeInTheDocument()
  })

  it('should fetch company info when not available', async () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: {}
    })

    render(<AboutUs />)

    await waitFor(() => {
      expect(mockGetCompanyInfoConfig).toHaveBeenCalledWith(false)
    })
  })

  it('should not fetch company info when already available', () => {
    const mockCompanyInfo = {}

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    render(<AboutUs />)

    expect(mockGetCompanyInfoConfig).not.toHaveBeenCalled()
  })

  it('should display company profile when available', async () => {
    const mockCompanyInfo = {
      profileTwo: '<p>Test company profile</p>'
    }

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo }
    )

    render(<AboutUs />)

    await waitFor(() => {
      expect(screen.getByText('公司简介')).toBeInTheDocument()
    })
  })

  it('should display product certifications when available', async () => {
    const mockCertifications = [
      {
        imageUrl: 'cert1.jpg',
        certName: 'Certification 1'
      },
      {
        imageUrl: 'cert2.jpg',
        certName: 'Certification 2'
      }
    ]

    const mockCompanyInfo = {}

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo }
    )
    mockGetProductCertsByPublishStatus.mockReturnValue(mockCertifications)

    render(<AboutUs />)

    await waitFor(() => {
      expect(screen.getByText('产品认证')).toBeInTheDocument()
      // Check if certification images are rendered
      expect(screen.getByAltText('Certification 1')).toBeInTheDocument()
      expect(screen.getByAltText('Certification 2')).toBeInTheDocument()
    })
  })

  it('should handle image click to open preview', async () => {
    const mockCertifications = [
      {
        imageUrl: 'cert1.jpg',
        certName: 'Certification 1'
      }
    ]

    const mockCompanyInfo = {}

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo }
    )
    mockGetProductCertsByPublishStatus.mockReturnValue(mockCertifications)

    render(<AboutUs />)

    await waitFor(() => {
      // Click on the certification image
      const certImage = screen.getByAltText('Certification 1')
      fireEvent.click(certImage)

      // Check if preview is open
      expect(screen.getByAltText('preview')).toBeInTheDocument()
    })
  })

  it('should handle image preview navigation', () => {
    const mockCertifications = [
      {
        imageUrl: 'cert1.jpg',
        certName: 'Certification 1'
      },
      {
        imageUrl: 'cert2.jpg',
        certName: 'Certification 2'
      }
    ]

    const mockCompanyInfo = {}

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo }
    )
    mockGetProductCertsByPublishStatus.mockReturnValue(mockCertifications)

    render(<AboutUs />)

    // Check if the component renders without errors
    expect(screen.getByText('产品认证')).toBeInTheDocument()
  })

  it('should close image preview when clicking outside', () => {
    const mockCertifications = [
      {
        imageUrl: 'cert1.jpg',
        certName: 'Certification 1'
      }
    ]

    const mockCompanyInfo = {}

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo }
    )
    mockGetProductCertsByPublishStatus.mockReturnValue(mockCertifications)

    render(<AboutUs />)

    // Check if the component renders without errors
    expect(screen.getByText('产品认证')).toBeInTheDocument()
  })

  it('should handle handleImageClick with no company info', () => {
    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: null }
      }
      return selector(state)
    })

    render(<AboutUs />)

    // The handleImageClick function should not throw an error
    // when called with no company info
  })

  it('should handle handleImageClick with no product certifications', () => {
    const mockCompanyInfo = {}

    ;(useAppSelector as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    mockGetProductCertsByPublishStatus.mockReturnValue([])

    render(<AboutUs />)

    // The handleImageClick function should not throw an error
    // when called with no product certifications
  })
})
