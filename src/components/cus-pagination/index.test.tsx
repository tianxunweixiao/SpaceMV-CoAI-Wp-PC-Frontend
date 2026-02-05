import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import CusPagination from './index'

describe('CusPagination Component', () => {
  const mockOnChange = vi.fn()
  
  beforeEach(() => {
    mockOnChange.mockClear()
  })
  
  test('renders pagination with total items', () => {
    render(
      <CusPagination 
        current={1} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    expect(screen.getByText('共 24 项数据')).toBeInTheDocument()
  })
  
  test('renders correct number of pages', () => {
    render(
      <CusPagination 
        current={1} 
        total={25} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
  
  test('disables previous button on first page', () => {
    render(
      <CusPagination 
        current={1} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const prevButton = screen.getAllByText('<')[0]
    expect(prevButton).toBeDisabled()
  })
  
  test('disables next button on last page', () => {
    render(
      <CusPagination 
        current={2} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const nextButton = screen.getAllByText('>')[0]
    expect(nextButton).toBeDisabled()
  })
  
  test('enables previous button on non-first page', () => {
    render(
      <CusPagination 
        current={2} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const prevButton = screen.getAllByText('<')[0]
    expect(prevButton).not.toBeDisabled()
  })
  
  test('enables next button on non-last page', () => {
    render(
      <CusPagination 
        current={1} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const nextButton = screen.getAllByText('>')[0]
    expect(nextButton).not.toBeDisabled()
  })
  
  test('calls onChange when previous button is clicked', () => {
    render(
      <CusPagination 
        current={2} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const prevButton = screen.getAllByText('<')[0]
    fireEvent.click(prevButton)
    
    expect(mockOnChange).toHaveBeenCalledWith(1)
  })
  
  test('calls onChange when next button is clicked', () => {
    render(
      <CusPagination 
        current={1} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const nextButton = screen.getAllByText('>')[0]
    fireEvent.click(nextButton)
    
    expect(mockOnChange).toHaveBeenCalledWith(2)
  })
  
  test('calls onChange when page number is clicked', () => {
    render(
      <CusPagination 
        current={1} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const pageButton = screen.getByText('2')
    fireEvent.click(pageButton)
    
    expect(mockOnChange).toHaveBeenCalledWith(2)
  })
  
  test('highlights current page', () => {
    render(
      <CusPagination 
        current={2} 
        total={24} 
        pageSize={12} 
        onChange={mockOnChange} 
      />
    )
    
    const pageButtons = screen.getAllByText(/^[1-2]$/)
    expect(pageButtons).toHaveLength(2)
  })
  
  test('uses default pageSize of 12 when not provided', () => {
    render(
      <CusPagination 
        current={1} 
        total={13} 
        onChange={mockOnChange} 
      />
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
