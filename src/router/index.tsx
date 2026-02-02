import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'

// 创建共享的子路由配置
const createChildRoutes = () => [
  {
    index: true,
    lazy: async () => {
      const data = await import('@/pages/home')
      const Home = data.default
      return {
        element: <Home />
      }
    }
  },
  {
    path: 'news',
    lazy: async () => {
      const data = await import('@/pages/news-center')
      const NewsCenter = data.default
      return {
        element: <NewsCenter />
      }
    }
  },
  {
    path: 'about',
    lazy: async () => {
      const data = await import('@/pages/about-us')
      const AboutUs = data.default
      return {
        element: <AboutUs />
      }
    }
  },
  {
    path: 'device',
    lazy: async () => {
      const data = await import('@/pages/small-device')
      const SmallDevice = data.default
      return {
        element: <SmallDevice />
      }
    }
  },
  {
    path: 'model',
    lazy: async () => {
      const data = await import('@/pages/large-model')
      const LargeModel = data.default
      return {
        element: <LargeModel />
      }
    }
  }
]

const routers = createBrowserRouter([
  // 正式环境路由
  {
    path: '/',
    element: <App isPreview={false} />,
    children: createChildRoutes()
  },
  // 预览环境路由
  {
    path: '/preview',
    element: <App isPreview={true} />,
    children: createChildRoutes()
  }
])

export default routers
