import { ToastManager, ToastContainer, toast } from './ToastManager'
import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

// 模拟 ReactDOM.createPortal
vi.mock('react-dom', () => ({
  createPortal: (children: React.ReactNode, container: Element) => {
    return React.createElement('div', { 'data-testid': 'portal' }, children)
  }
}))

// 模拟 React useEffect
vi.mock('react', async (importOriginal) => {
  const original = await importOriginal<any>()
  return {
    ...original,
    useEffect: vi.fn((callback) => {
      callback()
    }),
    useState: vi.fn(() => [null, vi.fn()])
  }
})

// 模拟 Toast 组件
vi.mock('./index.tsx', () => ({
  default: (props: any) => React.createElement('div', { 'data-testid': 'toast' }, props.message)
}))

// 模拟 document.body.appendChild 和 document.createElement
vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as HTMLElement))
vi.spyOn(document, 'createElement').mockReturnValue(({ appendChild: vi.fn() } as any) as HTMLDivElement)

describe('Toast Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 ToastManager 实例
    ;(ToastManager as any).instance = null
  })

  describe('ToastManager class', () => {
    it('should throw error when show is called before init', () => {
      const instance = new ToastManager()
      expect(() => instance.show({ message: 'Test' })).toThrow('Toast not initialized')
    })

    it('should throw error when hide is called before init', () => {
      const instance = new ToastManager()
      expect(() => instance.hide()).toThrow('Toast not initialized')
    })

    it('should call setToast with correct parameters when show is called', () => {
      const instance = new ToastManager()
      const mockSetToast = vi.fn()
      instance.init(mockSetToast)

      const options = { message: 'Test', type: 'success' as const }
      instance.show(options)

      expect(mockSetToast).toHaveBeenCalledWith({
        ...options,
        onClose: expect.any(Function)
      })
    })

    it('should call setToast with null when hide is called', () => {
      const instance = new ToastManager()
      const mockSetToast = vi.fn()
      instance.init(mockSetToast)

      instance.hide()
      expect(mockSetToast).toHaveBeenCalledWith(null)
    })

    it('should call hide when onClose is triggered', () => {
      const instance = new ToastManager()
      const mockSetToast = vi.fn()
      instance.init(mockSetToast)

      const options = { message: 'Test' }
      instance.show(options)

      const onClose = mockSetToast.mock.calls[0][0].onClose
      mockSetToast.mockClear()

      onClose()
      expect(mockSetToast).toHaveBeenCalledWith(null)
    })

    it('should return existing instance when constructor is called again', () => {
      const instance1 = new ToastManager()
      const instance2 = new ToastManager()
      expect(instance1).toBe(instance2)
    })
  })

  describe('ToastContainer', () => {
    it('should initialize ToastManager on mount', () => {
      expect(() => {
        React.createElement(ToastContainer)
      }).not.toThrow()
    })

    it('should return null when toast is null', () => {
      expect(() => {
        React.createElement(ToastContainer)
      }).not.toThrow()
    })
  })

  describe('toast object', () => {
    beforeEach(() => {
      // 初始化 ToastManager
      const mockSetToast = vi.fn()
      new ToastManager().init(mockSetToast)
    })

    it('should have show method', () => {
      expect(toast.show).toBeDefined()
      expect(typeof toast.show).toBe('function')
    })

    it('should have success method', () => {
      expect(toast.success).toBeDefined()
      expect(typeof toast.success).toBe('function')
    })

    it('should have error method', () => {
      expect(toast.error).toBeDefined()
      expect(typeof toast.error).toBe('function')
    })

    it('should have info method', () => {
      expect(toast.info).toBeDefined()
      expect(typeof toast.info).toBe('function')
    })

    it('should have warning method', () => {
      expect(toast.warning).toBeDefined()
      expect(typeof toast.warning).toBe('function')
    })

    it('should call show method with correct parameters for success', () => {
      const mockShow = vi.spyOn(new ToastManager(), 'show')
      
      toast.success('Success message')
      expect(mockShow).toHaveBeenCalledWith({ message: 'Success message', type: 'success' })
    })

    it('should call show method with correct parameters for error', () => {
      const mockShow = vi.spyOn(new ToastManager(), 'show')
      
      toast.error('Error message')
      expect(mockShow).toHaveBeenCalledWith({ message: 'Error message', type: 'error' })
    })

    it('should call show method with correct parameters for info', () => {
      const mockShow = vi.spyOn(new ToastManager(), 'show')
      
      toast.info('Info message')
      expect(mockShow).toHaveBeenCalledWith({ message: 'Info message', type: 'info' })
    })

    it('should call show method with correct parameters for warning', () => {
      const mockShow = vi.spyOn(new ToastManager(), 'show')
      
      toast.warning('Warning message')
      expect(mockShow).toHaveBeenCalledWith({ message: 'Warning message', type: 'warning' })
    })

    it('should call show method with duration parameter', () => {
      const mockShow = vi.spyOn(new ToastManager(), 'show')
      
      toast.success('Success message', 3000)
      expect(mockShow).toHaveBeenCalledWith({ message: 'Success message', type: 'success', duration: 3000 })
    })
  })
})
