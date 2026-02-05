import { getCompanyInfoConfig, getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus, getProductCertsByPublishStatus, getCompanyProfileByPublishStatus, type CompanyInfoConfig } from './index'
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

describe('Company API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call display endpoint when not in preview mode', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: {
        isPublish: '1',
        txwxCompanyInfo: { companyName: 'Test Company' },
        txwxFocus: [],
        txwxProductCerts: [],
        txwxCompanyProfile: { profileOne: 'Test Profile' }
      }
    }

    mockAxiosGet.mockResolvedValue(mockResponse)

    const result = await getCompanyInfoConfig(false)

    expect(mockAxiosGet).toHaveBeenCalledWith('/crm-website/companyDetail/display')
    expect(result).toEqual(mockResponse)
  })

  it('should call preview endpoint when in preview mode with type=company', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: {
        isPublish: '0',
        txwxCompanyInfoTemp: { companyName: 'Test Company' },
        txwxFocusTemp: [],
        txwxProductCertsTemp: [],
        txwxCompanyProfileTemp: { profileOne: 'Test Profile' }
      }
    }

    mockAxiosGet.mockResolvedValue(mockResponse)

    // 模拟 window.location.search
    Object.defineProperty(window, 'location', {
      value: { search: '?type=company' },
      writable: true
    })

    const result = await getCompanyInfoConfig(true)

    expect(mockAxiosGet).toHaveBeenCalledWith('/crm-website/companyDetail/preview')
    expect(result).toEqual(mockResponse)
  })

  it('should call display endpoint when in preview mode but no type=company', async () => {
    const mockResponse = {
      code: 200,
      msg: 'success',
      data: {
        isPublish: '1',
        txwxCompanyInfo: { companyName: 'Test Company' },
        txwxFocus: [],
        txwxProductCerts: [],
        txwxCompanyProfile: { profileOne: 'Test Profile' }
      }
    }

    mockAxiosGet.mockResolvedValue(mockResponse)

    // 模拟 window.location.search 不包含 type=company
    Object.defineProperty(window, 'location', {
      value: { search: '?type=other' },
      writable: true
    })

    const result = await getCompanyInfoConfig(true)

    expect(mockAxiosGet).toHaveBeenCalledWith('/crm-website/companyDetail/display')
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors correctly', async () => {
    const errorMessage = 'Network Error'
    mockAxiosGet.mockRejectedValue(new Error(errorMessage))

    await expect(getCompanyInfoConfig(false)).rejects.toThrow(errorMessage)
  })

  describe('Helper Functions', () => {
    const mockConfig: CompanyInfoConfig = {
      isPublish: '1',
      txwxCompanyInfo: {
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        id: 1,
        companyName: 'Published Company',
        copyrightInfo: '',
        versionNumber: '1.0',
        companyAddress: '',
        securityRecord: '',
        icpRecord: '',
        businessCooperation: '',
        resumeDelivery: '',
        logoUrl: '',
        addrUrl: ''
      },
      txwxFocus: [{
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        focusId: 1,
        focusName: 'Focus 1',
        imageUrl: '',
        sortOrder: 1,
        jumpUrl: null
      }],
      txwxProductCerts: [{
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        certId: 1,
        certName: 'Cert 1',
        imageUrl: '',
        sortOrder: 1,
        jumpUrl: null
      }],
      txwxCompanyProfile: {
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        id: 1,
        profileOne: 'Published Profile',
        profileTwo: '',
        profileThree: null
      },
      txwxCompanyInfoTemp: {
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        id: 2,
        companyName: 'Draft Company',
        copyrightInfo: '',
        versionNumber: '1.0',
        companyAddress: '',
        securityRecord: '',
        icpRecord: '',
        businessCooperation: '',
        resumeDelivery: '',
        logoUrl: '',
        addrUrl: ''
      },
      txwxFocusTemp: [{
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        focusId: 2,
        focusName: 'Focus 2',
        imageUrl: '',
        sortOrder: 2,
        jumpUrl: null
      }],
      txwxProductCertsTemp: [{
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        certId: 2,
        certName: 'Cert 2',
        imageUrl: '',
        sortOrder: 2,
        jumpUrl: null
      }],
      txwxCompanyProfileTemp: {
        createBy: 'test',
        createTime: '2024-01-01',
        updateBy: 'test',
        updateTime: '2024-01-01',
        savedBy: 'test',
        savedTime: '2024-01-01',
        publishedBy: 'test',
        publishedTime: '2024-01-01',
        remark: '',
        id: 2,
        profileOne: 'Draft Profile',
        profileTwo: '',
        profileThree: null
      }
    }

    it('should return temp company info when isPublish is 0', () => {
      const config = { ...mockConfig, isPublish: '0' }
      const result = getCompanyInfoByPublishStatus(config)
      expect(result).toEqual(config.txwxCompanyInfoTemp)
    })

    it('should return published company info when isPublish is 1', () => {
      const config = { ...mockConfig, isPublish: '1' }
      const result = getCompanyInfoByPublishStatus(config)
      expect(result).toEqual(config.txwxCompanyInfo)
    })

    it('should return temp focus items when isPublish is 0', () => {
      const config = { ...mockConfig, isPublish: '0' }
      const result = getFocusItemsByPublishStatus(config)
      expect(result).toEqual(config.txwxFocusTemp)
    })

    it('should return published focus items when isPublish is 1', () => {
      const config = { ...mockConfig, isPublish: '1' }
      const result = getFocusItemsByPublishStatus(config)
      expect(result).toEqual(config.txwxFocus)
    })

    it('should return temp product certs when isPublish is 0', () => {
      const config = { ...mockConfig, isPublish: '0' }
      const result = getProductCertsByPublishStatus(config)
      expect(result).toEqual(config.txwxProductCertsTemp)
    })

    it('should return published product certs when isPublish is 1', () => {
      const config = { ...mockConfig, isPublish: '1' }
      const result = getProductCertsByPublishStatus(config)
      expect(result).toEqual(config.txwxProductCerts)
    })

    it('should return temp company profile when isPublish is 0', () => {
      const config = { ...mockConfig, isPublish: '0' }
      const result = getCompanyProfileByPublishStatus(config)
      expect(result).toEqual(config.txwxCompanyProfileTemp)
    })

    it('should return published company profile when isPublish is 1', () => {
      const config = { ...mockConfig, isPublish: '1' }
      const result = getCompanyProfileByPublishStatus(config)
      expect(result).toEqual(config.txwxCompanyProfile)
    })
  })
})
