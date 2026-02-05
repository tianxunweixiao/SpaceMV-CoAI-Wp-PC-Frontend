import { getTopButtons, ButtonStatus, ButtonType } from './index'
import axiosInstance from '../../services/axiosConfig'
import { vi } from 'vitest'

// 模拟 axiosInstance
vi.mock('../../services/axiosConfig', () => {
  const mockGet = vi.fn()
  return {
    default: {
      get: mockGet
    }
  }
})

const mockAxiosGet = axiosInstance.get as any

describe('TopButton API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call display endpoint when not in preview mode', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: [
        {
          buttonId: '1',
          buttonType: ButtonType.text,
          buttonText: 'Test Button',
          backgroundColor: '#007bff',
          jumpUrl: 'https://example.com',
          isShow: '1',
          state: ButtonStatus.complete
        }
      ]
    }

    mockAxiosGet.mockResolvedValue(mockResponse)

    const result = await getTopButtons(false)

    expect(mockAxiosGet).toHaveBeenCalledWith('/crm-website/buttonConfig/display/001')
    expect(result).toEqual(mockResponse)
  })

  it('should call preview endpoint when in preview mode with type=topButton', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: [
        {
          buttonId: '1',
          buttonType: ButtonType.image,
          jumpUrl: 'https://example.com',
          imageUrl: 'https://example.com/image.png',
          isShow: '1',
          state: ButtonStatus.completeSelf
        }
      ]
    }

    mockAxiosGet.mockResolvedValue(mockResponse)

    // 模拟 window.location.search
    Object.defineProperty(window, 'location', {
      value: { search: '?type=topButton' },
      writable: true
    })

    const result = await getTopButtons(true)

    expect(mockAxiosGet).toHaveBeenCalledWith('/crm-website/buttonConfig/preview/001')
    expect(result).toEqual(mockResponse)
  })

  it('should call display endpoint when in preview mode but no type=topButton', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: [
        {
          buttonId: '1',
          buttonType: ButtonType.text,
          buttonText: 'Test Button',
          jumpUrl: 'https://example.com',
          isShow: '1',
          state: ButtonStatus.completeNav
        }
      ]
    }

    mockAxiosGet.mockResolvedValue(mockResponse)

    // 模拟 window.location.search 不包含 type=topButton
    Object.defineProperty(window, 'location', {
      value: { search: '?type=other' },
      writable: true
    })

    const result = await getTopButtons(true)

    expect(mockAxiosGet).toHaveBeenCalledWith('/crm-website/buttonConfig/display/001')
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors correctly', async () => {
    const errorMessage = 'Network Error'
    mockAxiosGet.mockRejectedValue(new Error(errorMessage))

    await expect(getTopButtons(false)).rejects.toThrow(errorMessage)
  })

  it('should handle ButtonStatus enum correctly', () => {
    expect(ButtonStatus.complete).toBe('1')
    expect(ButtonStatus.completeSelf).toBe('2')
    expect(ButtonStatus.completeNav).toBe('3')
    expect(ButtonStatus.developing).toBe('4')
  })

  it('should handle ButtonType enum correctly', () => {
    expect(ButtonType.text).toBe('1')
    expect(ButtonType.image).toBe('2')
  })
})
