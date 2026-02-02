import { useState, useEffect } from 'react'
import { useAppOutletContext } from '@/App'
import ClassicCase from './classic-case'
// import ArticleList from './article-list'
import styles from './index.module.less'
import { getProductInfoConfig, ProductData, getLLMProductBasicInfoByPublishStatus, getLLMApplicationScenariosByPublishStatus } from '@/api/product'

function LargeModel() {
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
  
  // 获取当前发布状态下的产品一基础信息
  const llmBasicInfo = productData ? getLLMProductBasicInfoByPublishStatus(productData) : null
  // 获取当前发布状态下的产品一应用场景
  const llmApplicationScenarios = productData ? getLLMApplicationScenariosByPublishStatus(productData) : null
  
  return (
    <div className={styles.root}>
      <div className="banner-item" id="introduction">
        <img src={llmBasicInfo?.backgroundImageUrl } className="banner-bg" />
        <div className="banner-content">
          <div className="con_title">{llmBasicInfo?.productName}</div>
          {llmBasicInfo?.productIntroduction && (
            <div className="con_sub_title">{llmBasicInfo.productIntroduction}</div>
          )}
          <div className="icon_wrap">
            {llmApplicationScenarios && llmApplicationScenarios.length > 0 && (
              llmApplicationScenarios.map((scenario, index) => (
                <div key={scenario.scenarioId || index} className="icon_item">
                  <img className="w-100 h-100" src={scenario.iconUrl } />
                  <span className="icon_label">{scenario.scenarioName}</span>
                </div>
              ))
            ) }
          </div>
        </div>

      </div>
      {llmApplicationScenarios && llmApplicationScenarios.length > 0 && (
        llmApplicationScenarios.map((scenario, index) => {
          // 根据index映射到对应的锚点ID
          let scenarioId = `scenario-${index}`
          if (index === 0) scenarioId = 'agriculture'
          if (index === 1) scenarioId = 'industry'
          if (index === 2) scenarioId = 'sky'
          
          return (
            <div key={index} className="banner-item" id={scenarioId}>
              <img 
                src={scenario.backgroundImageUrl } 
                className="banner-bg bg-ret" 
              />
              <div className="banner-content">
                <div className="con_title">{scenario.scenarioName}</div>
                {scenario.scenarioIntroduction && (
                  <div className="con_sub_title">{scenario.scenarioIntroduction}</div>
                )}
                {scenario.detailedIntroduction && (
                  <div className="con-txt">{scenario.detailedIntroduction}</div>
                )}
              </div>
            </div>
          );
        })
      )}
      <section id="case" className="mt-[-4px]">
        <ClassicCase productData={productData} />
      </section>
      {/*<ArticleList />*/}
    </div>
  )
}

export default LargeModel


