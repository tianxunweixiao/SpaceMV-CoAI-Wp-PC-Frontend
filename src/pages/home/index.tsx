import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppOutletContext } from '@/App'
import { adjustPathForEnvironment } from '@/utils/pathUtils'
import ContactUs from '@/components/contact-us'
import IconFont from '@/components/iconfont'
import Carousel from '@/components/carousel'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMenuIdx } from '@/store/modules/menuReducer'
import { setCompanyInfo, setLoading, setError } from '@/store/modules/companyReducer'
import { getCompanyInfoConfig, getCompanyProfileByPublishStatus } from '@/api/company'
import { getMainPageContent, CarouselImage, MainProduct, TypicalCustomers } from '@/api/mainPage'
import styles from './index.module.less'

function Home() {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const { isPreview = false } = useAppOutletContext()
  
  // 从store获取公司信息
  const companyInfo = useAppSelector(state => state.company.companyInfo)
  
  // 首页数据状态
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [mainProducts, setMainProducts] = useState<MainProduct[]>([])
  const [typicalCustomers, setTypicalCustomers] = useState<TypicalCustomers | null>(null)
  
  // 获取公司信息配置
  const fetchCompanyInfo = () => {
    dispatch(setLoading(true))
    getCompanyInfoConfig(isPreview)
      .then(response => {
        if (response.code === 200) {
          dispatch(setCompanyInfo(response.data))
        } else {
          dispatch(setError('获取公司信息失败'))
        }
      })
  }

  useEffect(() => {
    fetchCompanyInfo()
  }, [dispatch])

  // 获取首页数据
  useEffect(() => {
    const fetchMainPageData = async () => {
      const response = await getMainPageContent(isPreview)
      if (response.code === 200) {
        const isPublish = response.data.isPublish || '0'
        // API已经统一返回temp字段
        const carouselImageLists = isPublish === '1' ? response.data.carouselImageLists : response.data.carouselImageListsTemp;
        const mainProductsData = isPublish === '1' ? response.data.mainProducts : response.data.mainProductsTemp;
        const typicalCustomersData = isPublish === '1' ? response.data.typicalCustomer : response.data.typicalCustomerTemp;
        
        // 只显示isShow为'1'的轮播图
        const visibleCarouselImages = carouselImageLists.filter(img => img.isShow === '1')
        setCarouselImages(visibleCarouselImages)
        setMainProducts(mainProductsData)
        setTypicalCustomers(typicalCustomersData)
      }
    }
    
    fetchMainPageData()
  }, [])

  function handlePathClick(path: string, index: number) {
    // 使用公共函数根据预览环境调整路径
    const targetPath = adjustPathForEnvironment(path, isPreview)
    nav(targetPath)
    dispatch(setMenuIdx(index))
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    dispatch(setMenuIdx(0))
  }, [dispatch])

  return (
    <div className={styles.root} id="top">
      {carouselImages.length > 0 && (
        <Carousel items={carouselImages.map((img, index) => ({ src: img.imageUrl, alt: `banner-${index}` }))} />
      )}
      {/* 公司简介 */}
      {(() => {
        const profileOne = companyInfo ? getCompanyProfileByPublishStatus(companyInfo)?.profileOne || '' : ''
        if (!profileOne) return null
        
        return (
          <div className="info-wrap">
            <div className="into-title">公司简介</div>
            <div className="info-inner">
              <div 
                className="mt-53 info-content" 
                dangerouslySetInnerHTML={{ __html: profileOne }}
              />
              <div className="more-btn" onClick={() => handlePathClick('/about', 4)}>
                <span>了解更多</span>
                <IconFont type="icon-xiayige" />
              </div>
            </div>
          </div>
        )
      })()}
      {/* 主要产品 */}
      <div className="product-wrap">
        <div className="pro-title">主要产品</div>
        <div className="pro-list">
          {mainProducts.map((item, index) => {
            // 根据产品名称获取对应的路径
            const path = item.jumpUrl || ''
            return (
              <div className="pro-item" key={index} style={{ backgroundImage: `url(${item.imageUrl})` }}>
                <div 
                  className={`item-btn ${path ? 'clickable' : ''}`} 
                  onClick={() => path && handlePathClick(path, index + 1)}
                >
                  {item.productName}
                  <div className="btn-icon">
                    <IconFont type="icon-xiayige" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* 典型客户 */}
      {typicalCustomers?.imageUrl && (
        <div className="customer-wrap">
          <div className="customer-title">典型客户</div>
          <div className="customer-image" style={{ backgroundImage: `url(${typicalCustomers.imageUrl})` }}></div>
        </div>
      )}
      
      <ContactUs />
    </div>
  )
}

export default Home
