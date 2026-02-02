import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 定义菜单状态类型
export interface MenuState {
  selMenuIdx: number
}

// 初始状态
const INIT_STATE: MenuState = {
  selMenuIdx: 0
}

// 创建menu slice
const menuSlice = createSlice({
  name: 'menu',
  initialState: INIT_STATE,
  reducers: {
    setMenuIdx(state, action: PayloadAction<number>) {
      state.selMenuIdx = action.payload
    }
  }
})

export const { setMenuIdx } = menuSlice.actions

export default menuSlice.reducer
