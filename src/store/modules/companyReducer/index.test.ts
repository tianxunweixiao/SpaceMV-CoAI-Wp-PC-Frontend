import companyReducer, { setCompanyInfo, setLoading, setError, CompanyState } from './index'
import { CompanyInfoConfig } from '@/api/company'

describe('Company Reducer', () => {
  const initialState: CompanyState = {
    companyInfo: null,
    loading: false,
    error: null
  }

  it('should return initial state', () => {
    const result = companyReducer(undefined, { type: 'unknown' })
    expect(result).toEqual(initialState)
  })

  it('should handle setCompanyInfo', () => {
    const mockCompanyInfo: CompanyInfoConfig = {
      isPublish: '1',
      txwxCompanyInfo: {
        companyName: 'Test Company',
        copyrightInfo: '© 2023 Test Company',
        versionNumber: '1.0.0',
        companyAddress: 'Test Address',
        securityRecord: 'Test Security Record',
        icpRecord: 'Test ICP Record',
        businessCooperation: 'Test Business Cooperation',
        resumeDelivery: 'Test Resume Delivery',
        logoUrl: 'https://example.com/logo.png',
        addrUrl: 'https://example.com/address.png',
        createBy: 'test',
        createTime: '2023-01-01T00:00:00Z',
        updateBy: 'test',
        updateTime: '2023-01-01T00:00:00Z',
        savedBy: 'test',
        savedTime: '2023-01-01T00:00:00Z',
        publishedBy: 'test',
        publishedTime: '2023-01-01T00:00:00Z',
        remark: 'Test Remark',
        id: 1
      }
    }

    const action = setCompanyInfo(mockCompanyInfo)
    const result = companyReducer(initialState, action)

    expect(result.companyInfo).toEqual(mockCompanyInfo)
    expect(result.loading).toBe(false)
    expect(result.error).toBe(null)
  })

  it('should handle setLoading', () => {
    const action = setLoading(true)
    const result = companyReducer(initialState, action)

    expect(result.loading).toBe(true)
    expect(result.companyInfo).toEqual(initialState.companyInfo)
    expect(result.error).toEqual(initialState.error)
  })

  it('should handle setError with string', () => {
    const errorMessage = 'Test error message'
    const action = setError(errorMessage)
    const result = companyReducer(initialState, action)

    expect(result.error).toBe(errorMessage)
    expect(result.loading).toBe(false)
    expect(result.companyInfo).toEqual(initialState.companyInfo)
  })

  it('should handle setError with null', () => {
    const action = setError(null)
    const result = companyReducer(initialState, action)

    expect(result.error).toBe(null)
    expect(result.loading).toBe(false)
    expect(result.companyInfo).toEqual(initialState.companyInfo)
  })
})
