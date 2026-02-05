/*
 * @Author: wangxiaoming
 * @Date: 2025-11-12 17:29:53
 * @Description: 描述
 */
import { useState, useEffect } from 'react'
import ContactUs from '@/components/contact-us'
import IconFont from '@/components/iconfont'
import { useAppDispatch, useAppSelector } from '@/store'
import { setCompanyInfo, setLoading, setError } from '@/store/modules/companyReducer'
import { getCompanyInfoConfig, getCompanyProfileByPublishStatus, getProductCertsByPublishStatus } from '@/api/company'
import { useAppOutletContext } from '@/App'
import DOMPurify from 'dompurify'
import styles from './index.module.less'

function AboutUs() {
  const dispatch = useAppDispatch()
  // 从store获取公司信息
  const companyInfo = useAppSelector(state => state.company.companyInfo)
  // 从上下文获取isPreview参数
  const { isPreview } = useAppOutletContext()
  
  const [preImgSrc, setPreImgSrc] = useState('')
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 获取公司信息配置（如果还没有数据）
  useEffect(() => {
    if (!companyInfo) {
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
  }, [dispatch, companyInfo, isPreview])

  const handleImageClick = (type: 'pre' | 'next') => {
    if (!companyInfo) return
    const productCertifications = getProductCertsByPublishStatus(companyInfo)
    if (!productCertifications || productCertifications.length === 0) return
    
    const totalCertifications = productCertifications.length
    
    setCurrentIndex((prev) => {
      let newIndex
      if (type === 'pre') {
        newIndex = prev > 0 ? prev - 1 : totalCertifications - 1
      } else {
        newIndex = prev < totalCertifications - 1 ? prev + 1 : 0
      }
      
      // 更新预览图片
      setPreImgSrc(productCertifications[newIndex].imageUrl)
      
      return newIndex
    })
  }

  return (
    <div className={styles.root}>
      <img className="w-full h-[508px]" src="/about/banner.png" alt="banner" />
      <div id="intro" className="company-wrap">
        <div className="company-title">公司简介</div>
        {companyInfo && (
          <div 
            className="company-con" 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getCompanyProfileByPublishStatus(companyInfo)?.profileTwo || '') }}
          />
        )}
      </div>
      <div id="product" className="product-wrap">
        <div className="product-title">产品认证</div>
        <div className="product-list">
          {companyInfo && getProductCertsByPublishStatus(companyInfo)?.map((certification, index) => (
            <div
              className="product-item"
              key={index}
              onClick={() => {
                setPreImgSrc(certification.imageUrl)
                setOpen(true)
              }}
            >
              <img 
                className="w-full h-full object-contain" 
                src={certification.imageUrl} 
                alt={certification.certName} 
              />
            </div>
          ))}
        </div>
      </div>
      {open && (
        <div className="image-review" onClick={() => setOpen(false)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="nav-btn prev-btn" onClick={() => handleImageClick('pre')}>
              <IconFont type="icon-shangyige" />
            </div>
            <img src={preImgSrc} alt="preview" />
            <div className="nav-btn next-btn" onClick={() => handleImageClick('next')}>
              <IconFont type="icon-xiayige" />
            </div>
            <div className="close-btn-wrap">
              <div className="close-btn" onClick={() => setOpen(false)}>
                <IconFont type="icon-guanbi" />
              </div>
            </div>
          </div>
        </div>
      )}
      <ContactUs />
    </div>
  )
}

export default AboutUs
