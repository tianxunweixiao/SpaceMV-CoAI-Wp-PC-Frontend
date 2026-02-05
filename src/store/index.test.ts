import { store, persistor, useAppDispatch, useAppSelector } from './index'
import { RootState, AppDispatch } from './index'

describe('Redux Store', () => {
  it('should create store successfully', () => {
    expect(store).toBeDefined()
    expect(store.getState).toBeDefined()
    expect(store.dispatch).toBeDefined()
  })

  it('should create persistor successfully', () => {
    expect(persistor).toBeDefined()
    expect(persistor.purge).toBeDefined()
    expect(persistor.flush).toBeDefined()
  })

  it('should have correct initial state structure', () => {
    const initialState = store.getState()
    expect(initialState).toHaveProperty('menu')
    expect(initialState).toHaveProperty('company')
  })

  it('should export useAppDispatch hook', () => {
    expect(useAppDispatch).toBeDefined()
    expect(typeof useAppDispatch).toBe('function')
  })

  it('should export useAppSelector hook', () => {
    expect(useAppSelector).toBeDefined()
    expect(typeof useAppSelector).toBe('function')
  })

  it('should have correct RootState type structure', () => {
    // 测试 RootState 类型是否包含 menu 和 company 属性
    const testState: Partial<RootState> = {
      menu: {
        selMenuIdx: 0
      },
      company: {
        companyInfo: null,
        loading: false,
        error: null
      }
    }
    expect(testState).toBeDefined()
  })

  it('should have correct AppDispatch type', () => {
    // 测试 AppDispatch 类型是否可以用于 dispatch 操作
    const testDispatch: AppDispatch = store.dispatch
    expect(testDispatch).toBeDefined()
  })
})
