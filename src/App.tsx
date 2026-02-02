import { Outlet, useOutletContext } from 'react-router-dom'
import Footer from '@/components/footer'
import Header from '@/components/header'

interface AppProps {
  isPreview?: boolean
}

export type OutletContextType = {
  isPreview: boolean
}

// 创建一个自定义的useOutletContext钩子
export function useAppOutletContext() {
  return useOutletContext<OutletContextType>()
}

function App({ isPreview = false }: AppProps) {
  return (
    <>
      <Header isPreview={isPreview} />
      <Outlet context={{ isPreview }} />
      <Footer isPreview={isPreview} />
    </>
  )
}

export default App
