import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ContactUs from './index'

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      menu: (state = { selMenuIdx: 0 }) => state,
      company: (state = { companyInfo: null, loading: false, error: null }) => state
    },
    preloadedState
  })
}

describe('ContactUs Component', () => {
  test('renders ContactUs component with default state', () => {
    const store = createTestStore()
    
    const { container } = render(
      <Provider store={store}>
        <ContactUs />
      </Provider>
    )
    
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })
  
  test('renders ContactUs component with companyInfo', () => {
    const mockCompanyInfo = {
      basicInfo: {
        businessCooperation: 'business@example.com',
        resumeDelivery: 'hr@example.com',
        companyAddress: '北京市海淀区',
        addrUrl: 'https://example.com/map.jpg'
      },
      focusSettings: [
        {
          id: 1,
          focusName: '微信公众号',
          imageUrl: 'https://example.com/wechat.jpg',
          publishStatus: 1
        }
      ]
    }
    
    const store = createTestStore({
      company: {
        companyInfo: mockCompanyInfo,
        loading: false,
        error: null
      }
    })
    
    const { container } = render(
      <Provider store={store}>
        <ContactUs />
      </Provider>
    )
    
    expect(container.querySelector('#contact')).toBeInTheDocument()
    expect(screen.getByText('地址')).toBeInTheDocument()
  })
  
  test('renders ContactUs component without addrUrl', () => {
    const mockCompanyInfo = {
      basicInfo: {
        businessCooperation: 'business@example.com',
        resumeDelivery: 'hr@example.com',
        companyAddress: '北京市海淀区'
      }
    }
    
    const store = createTestStore({
      company: {
        companyInfo: mockCompanyInfo,
        loading: false,
        error: null
      }
    })
    
    const { container } = render(
      <Provider store={store}>
        <ContactUs />
      </Provider>
    )
    
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })
  
  test('renders ContactUs component without focusItems', () => {
    const mockCompanyInfo = {
      basicInfo: {
        businessCooperation: 'business@example.com',
        resumeDelivery: 'hr@example.com',
        companyAddress: '北京市海淀区'
      }
    }
    
    const store = createTestStore({
      company: {
        companyInfo: mockCompanyInfo,
        loading: false,
        error: null
      }
    })
    
    const { container } = render(
      <Provider store={store}>
        <ContactUs />
      </Provider>
    )
    
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })
})
