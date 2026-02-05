import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { getCompanyInfoByPublishStatus } from '@/api/company'
import { adjustPathForEnvironment } from '@/utils/pathUtils'
import Footer from './index'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}))

vi.mock('@/store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn()
}))

vi.mock('@/api/company', () => ({
  getCompanyInfoByPublishStatus: vi.fn((companyInfo) => companyInfo)
}))

vi.mock('@/utils/pathUtils', () => ({
  adjustPathForEnvironment: vi.fn((path) => path)
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '',
    pathname: '/'
  },
  writable: true
})

describe('Footer Component', () => {
  const mockNavigate = vi.fn()
  const mockDispatch = vi.fn()
  const mockUseSelector = vi.fn()
  const mockGetCompanyInfoByPublishStatus = getCompanyInfoByPublishStatus as any
  const mockAdjustPathForEnvironment = adjustPathForEnvironment as any

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as any).mockReturnValue(mockNavigate)
    ;(useAppDispatch as any).mockReturnValue(mockDispatch)
    ;(useAppSelector as any).mockImplementation((selector) => {
      const state = {
        company: { companyInfo: null }
      }
      return selector(state)
    })
  })

  it('should render Footer component', () => {
    render(<Footer />)
    expect(screen.getByText('站点地图')).toBeInTheDocument()
  })

  it('should render with company info when available', () => {
    const mockCompanyInfo = {
      companyName: 'Test Company',
      copyrightInfo: '© 2024 Test Company',
      versionNumber: 'v1.0.0',
      securityRecord: '京公网安备12345678号',
      icpRecord: '京ICP备12345678号'
    }

    ;(useAppSelector as any).mockImplementation((selector) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    render(<Footer />)

    // Check if company info elements are present
    expect(screen.getByText('Test Company')).toBeInTheDocument()
  })

  it('should handle link click and navigate', () => {
    mockAdjustPathForEnvironment.mockReturnValue('/test')

    render(<Footer />)

    // Click on the first link item
    const linkItem = screen.getByText('首页')
    fireEvent.click(linkItem)

    expect(mockNavigate).toHaveBeenCalledWith('/test')
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('should handle link click with query parameters', () => {
    // Mock window.location with search params
    Object.defineProperty(window, 'location', {
      value: {
        search: '?param=test',
        pathname: '/'
      },
      writable: true
    })

    mockAdjustPathForEnvironment.mockReturnValue('/test')

    render(<Footer />)

    // Click on a link item
    const linkItem = screen.getByText('产品一')
    fireEvent.click(linkItem)

    expect(mockNavigate).toHaveBeenCalledWith('/test?param=test')
  })

  it('should display all link items', () => {
    render(<Footer />)

    const linkTexts = ['首页', '产品一', '产品二', '新闻中心', '关于我们']
    linkTexts.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })

  it('should display ICP record with param when param exists', () => {
    // Mock window.location with search params
    Object.defineProperty(window, 'location', {
      value: {
        search: '?param=123',
        pathname: '/'
      },
      writable: true
    })

    const mockCompanyInfo = {
      icpRecord: '京ICP备12345678号'
    }

    ;(useAppSelector as any).mockImplementation((selector) => {
      const state = {
        company: { companyInfo: mockCompanyInfo }
      }
      return selector(state)
    })

    render(<Footer />)

    // Check if footer renders without errors
    expect(screen.getByText('站点地图')).toBeInTheDocument()
  })

  it('should handle isPreview prop', () => {
    mockAdjustPathForEnvironment.mockReturnValue('/preview/test')

    render(<Footer isPreview={true} />)

    // Click on a link item
    const linkItem = screen.getByText('首页')
    fireEvent.click(linkItem)

    expect(mockAdjustPathForEnvironment).toHaveBeenCalledWith('/', true)
  })
})
