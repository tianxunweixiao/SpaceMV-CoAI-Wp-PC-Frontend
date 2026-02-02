import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CompanyInfoConfig } from '@/api/company'

// 定义初始状态
export interface CompanyState {
  companyInfo: CompanyInfoConfig | null
  loading: boolean
  error: string | null
}

const initialState: CompanyState = {
  companyInfo: null,
  loading: false,
  error: null
}

// 创建company slice
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // 设置公司信息
    setCompanyInfo(state, action: PayloadAction<CompanyInfoConfig>) {
      state.companyInfo = action.payload
      state.loading = false
      state.error = null
    },
    // 设置加载状态
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    // 设置错误信息
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.loading = false
    }
  }
})

// 导出actions
export const { setCompanyInfo, setLoading, setError } = companySlice.actions

// 导出reducer
export default companySlice.reducer