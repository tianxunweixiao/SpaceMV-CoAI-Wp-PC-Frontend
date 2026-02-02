import { useState, useEffect } from 'react'
import { useAppOutletContext } from '@/App'
import styles from './index.module.less'
import { getProductInfoConfig, ProductData, getDeviceProductBasicInfoByPublishStatus, getDeviceApplicationScenariosByPublishStatus, getDeviceTypicalCaseProductsByPublishStatus } from '@/api/product'



function SmallDevice() {
  const { isPreview = false } = useAppOutletContext()
  
  // 产品数据状态
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 获取产品信息配置
  useEffect(() => {
    const fetchProductData = () => {
      setLoading(true)
      getProductInfoConfig(isPreview)
        .then(response => {
          if (response.code === 200) {
            setProductData(response.data)
            setError(null)
          } else {
            setError(`获取产品信息失败: ${response.msg}`)
          }
        })
        .catch(err => {
          setError(`获取产品信息出错: ${err.message}`)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    
    fetchProductData()
  }, [isPreview])

  // 获取当前发布状态下的产品二产品基础信息
  const deviceBasicInfo = productData ? getDeviceProductBasicInfoByPublishStatus(productData) : null
  // 获取当前发布状态下的产品二应用场景
  const deviceApplicationScenarios = productData ? getDeviceApplicationScenariosByPublishStatus(productData) : null
  // 获取当前发布状态下的产品二典型案例产品
  const deviceTypicalCaseProducts = productData ? getDeviceTypicalCaseProductsByPublishStatus(productData) : null

  return (
    <div className={styles.root}>
      <div 
        className="banner-wrap" 
        style={{ 
          backgroundImage: deviceBasicInfo?.backgroundImageUrl ? `url(${deviceBasicInfo.backgroundImageUrl})` : 'none' 
        }}
      >
        <div className="banner-info">
          <div className="font-bold">{deviceBasicInfo?.productName }</div>
          <p className="text-40">——{deviceBasicInfo?.productIntroduction}</p>
          {deviceBasicInfo?.detailedIntroduction && (
            <p className="info-txt">
              {deviceBasicInfo.detailedIntroduction}
            </p>
          )}
        </div>
      </div>
      <div id="case" className="case-wrap">
        <div className="title">应用场景</div>
        {deviceApplicationScenarios?.map((scenario, index) => (
          <div className="case-item" key={index}>
            <div className="sub-title">{scenario.scenarioName}</div>
            <div className="case-info-wrap">
              <div className="case-inner">
                {scenario.detailedIntroduction && (
                  <div className="inner-con">
                    {scenario.detailedIntroduction}
                  </div>
                )}
                <img className="w-[600px]" src={scenario.backgroundImageUrl} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div id="product" className="project-wrap">
        <div className="title">典型产品</div>
        {deviceTypicalCaseProducts?.map((product, index) => (
          <div className="pro-item" key={index}>
            <div className="sub-title">
              {product.productName}
              {product.productIntroduction && `——${product.productIntroduction}`}
            </div>
            <div className="grid-box">
              <div className="grid-left">
                {product.detailedIntroduction && (
                  <div className="grid-con">{product.detailedIntroduction}</div>
                )}

                {((product.standardFunctions && product.standardFunctions.length > 0) || (product.customServices && product.customServices.length > 0)) && (
                  <div className="extra-content">
                    {product.standardFunctions && product.standardFunctions.length > 0 && (
                      <div className="line-box">
                        <div className="line-title">标配功能</div>
                        <div className="text-16">
                          {product.standardFunctions.map((func, idx) => (
                            <span key={idx}>
                              {func}
                              {idx !== product.standardFunctions.length - 1 && <span className="item-divider">|</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.customServices && product.customServices.length > 0 && (
                      <div className="line-box">
                        <div className="line-title">定制服务</div>
                        <div className="text-16">
                          {product.customServices.map((service, idx) => (
                            <span key={idx}>
                              {service}
                              {idx !== product.customServices.length - 1 && <span className="item-divider">|</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid-img">
                <img src={product.imageUrl} alt={product.productName} className="bg-center bg-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SmallDevice
