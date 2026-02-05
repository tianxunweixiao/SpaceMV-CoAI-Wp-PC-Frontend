import { vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Toast from './index'

// Mock the styles module
vi.mock('./index.module.less', () => ({
  default: {
    toast: 'toast',
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning'
  }
}))

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render Toast component with default type', () => {
    const onClose = vi.fn()

    render(<Toast message="Test message" onClose={onClose} />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('should render Toast component with success type', () => {
    const onClose = vi.fn()

    render(<Toast message="Success message" type="success" onClose={onClose} />)

    expect(screen.getByText('Success message')).toBeInTheDocument()
  })

  it('should render Toast component with error type', () => {
    const onClose = vi.fn()

    render(<Toast message="Error message" type="error" onClose={onClose} />)

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should render Toast component with warning type', () => {
    const onClose = vi.fn()

    render(<Toast message="Warning message" type="warning" onClose={onClose} />)

    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('should call onClose after duration', () => {
    const onClose = vi.fn()
    const duration = 100 // Short duration for testing

    render(<Toast message="Test message" duration={duration} onClose={onClose} />)

    // Advance time by duration + 1
    act(() => {
      vi.advanceTimersByTime(duration + 1)
    })

    expect(onClose).toHaveBeenCalled()
  })

  it('should clear timeout on unmount', () => {
    const onClose = vi.fn()
    const duration = 1000

    // Mock clearTimeout
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount } = render(<Toast message="Test message" duration={duration} onClose={onClose} />)

    // Unmount the component
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should not call onClose if duration is 0', () => {
    const onClose = vi.fn()
    const duration = 0

    render(<Toast message="Test message" duration={duration} onClose={onClose} />)

    // Advance time by a large amount
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('should handle missing onClose prop', () => {
    // This should not throw an error
    render(<Toast message="Test message" />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('should use default duration when not provided', () => {
    const onClose = vi.fn()

    // Mock setTimeout
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

    render(<Toast message="Test message" onClose={onClose} />)

    // Check if setTimeout was called with the default duration (3000ms)
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000)
  })
})
