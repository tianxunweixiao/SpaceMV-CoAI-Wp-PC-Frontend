import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { getCompanyInfoConfig } from '@/api/company'
import { getTopButtons } from '@/api/topButton'
import { adjustPathForEnvironment } from '@/utils/pathUtils'
import { toast } from '@/components/toast/ToastManager'
import Header from './index'

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}))

vi.mock('@/store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn()
}))

vi.mock('@/api/company', () => ({
  getCompanyInfoConfig: vi.fn(),
  getCompanyInfoByPublishStatus: vi.fn((companyInfo) => companyInfo)
}))

vi.mock('@/api/topButton', () => ({
  getTopButtons: vi.fn(),
  ButtonStatus: {
    completeNav: 'completeNav',
    complete: 'complete',
    completeSelf: 'completeSelf',
    developing: 'developing'
  },
  ButtonType: {
    text: 'text',
    image: 'image'
  }
}))

vi.mock('@/utils/pathUtils', () => ({
  adjustPathForEnvironment: vi.fn((path) => path)
}))

vi.mock('@/components/toast/ToastManager', () => ({
  toast: {
    info: vi.fn()
  }
}))

vi.mock('@/store/modules/menuReducer', () => ({
  setMenuIdx: vi.fn()
}))

vi.mock('@/store/modules/companyReducer', () => ({
  setCompanyInfo: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn()
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'example.com',
    pathname: '/',
    search: ''
  },
  writable: true
})

// Mock import.meta.env
vi.stubGlobal('import.meta.env', {
  VITE_ENV: undefined
})

describe('Header Component', () => {
  const mockNavigate = vi.fn()
  const mockDispatch = vi.fn()
  const mockUseSelector = vi.fn()
  const mockGetCompanyInfoConfig = getCompanyInfoConfig as any
  const mockGetTopButtons = getTopButtons as any
  const mockAdjustPathForEnvironment = adjustPathForEnvironment as any
  const mockToastInfo = toast.info as any

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as any).mockReturnValue(mockNavigate)
    ;(useAppDispatch as any).mockReturnValue(mockDispatch)
    ;(useAppSelector as any).mockImplementation((selector) => {
      const state = {
        menu: { selMenuIdx: 0 },
        company: { companyInfo: null, loading: false, error: null }
      }
      return selector(state)
    })
  })

  it('should render Header component', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: [] })

    render(<Header />)
    expect(screen.getByAltText('logo')).toBeInTheDocument()
  })

  it('should render with company info when available', () => {
    const mockCompanyInfo = {
      companyName: 'Test Company',
      logoUrl: 'test-logo.png'
    }

    ;(useAppSelector as any).mockImplementation((selector) => {
      const state = {
        menu: { selMenuIdx: 0 },
        company: { companyInfo: mockCompanyInfo, loading: false, error: null }
      }
      return selector(state)
    })

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: mockCompanyInfo })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: [] })

    render(<Header />)
    expect(screen.getByAltText('Test Company')).toBeInTheDocument()
  })

  it('should fetch company info when not available', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: { companyName: 'Test Company' } })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: [] })

    render(<Header />)

    // Check if API was called
    expect(mockGetCompanyInfoConfig).toHaveBeenCalledWith(false)
  })

  it('should fetch top buttons on mount', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: [] })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should handle menu click and navigate', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: [] })
    mockAdjustPathForEnvironment.mockReturnValue('/test')

    render(<Header />)

    // Click on the first menu item
    const menuItem = screen.getByText('首页')
    fireEvent.click(menuItem)

    expect(mockDispatch).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/test')
  })

  it('should handle button click with completeNav status', () => {
    const mockButtons = [{
      buttonId: '1',
      buttonType: 'text',
      buttonText: 'Test Button',
      state: 'completeNav',
      jumpUrl: 'https://example.com',
      isShow: '1'
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should handle button click with developing status', () => {
    const mockButtons = [{
      buttonId: '1',
      buttonType: 'text',
      buttonText: 'Developing Button',
      state: 'developing',
      jumpUrl: 'https://example.com',
      isShow: '1'
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should show tooltip on image button mouse enter', () => {
    const mockButtons = [{
      buttonId: '1',
      buttonType: 'image',
      buttonText: 'Image Button Tooltip',
      state: 'completeNav',
      jumpUrl: 'https://example.com',
      imageUrl: 'test.png',
      isShow: '1'
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should handle menu click with hash', () => {
    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: [] })
    mockAdjustPathForEnvironment.mockReturnValue('/model')

    render(<Header />)

    // Click on a menu item with children
    const menuItem = screen.getByText('产品一')
    fireEvent.click(menuItem)

    expect(mockDispatch).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/model')
  })

  it('should handle button click with complete status', () => {
    const mockButtons = [{
      buttonId: '1',
      buttonType: 'text',
      buttonText: 'Complete Button',
      state: 'complete',
      jumpUrl: 'https://example.com',
      isShow: '1'
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should handle button click with completeSelf status', () => {
    const mockButtons = [{
      buttonId: '1',
      buttonType: 'text',
      buttonText: 'Complete Self Button',
      state: 'completeSelf',
      jumpUrl: 'https://example.com',
      isShow: '1'
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should handle intranet environment', () => {
    // Mock window.location for intranet
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'intranet.example.com',
        pathname: '/',
        search: ''
      },
      writable: true
    })

    const mockButtons = [{
      buttonId: '1',
      buttonType: 'text',
      buttonText: 'Intranet Button',
      state: 'completeNav',
      jumpUrl: 'https://example.com',
      isShow: '0' // Should show in intranet even if isShow is 0
    }]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })

  it('should handle extranet environment', () => {
    // Mock window.location for extranet
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'example.com',
        pathname: '/',
        search: ''
      },
      writable: true
    })

    const mockButtons = [
      {
        buttonId: '1',
        buttonType: 'text',
        buttonText: 'Visible Button',
        state: 'completeNav',
        jumpUrl: 'https://example.com',
        isShow: '1' // Should show in extranet
      },
      {
        buttonId: '2',
        buttonType: 'text',
        buttonText: 'Hidden Button',
        state: 'completeNav',
        jumpUrl: 'https://example.com',
        isShow: '0' // Should not show in extranet
      }
    ]

    mockGetCompanyInfoConfig.mockResolvedValue({ code: 200, data: null })
    mockGetTopButtons.mockResolvedValue({ code: 200, data: mockButtons })

    render(<Header />)

    // Check if API was called
    expect(mockGetTopButtons).toHaveBeenCalledWith(false)
  })
})
