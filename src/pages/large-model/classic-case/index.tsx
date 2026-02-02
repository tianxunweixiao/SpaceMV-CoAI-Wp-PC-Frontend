import styles from './index.module.less'
import { ProductData, getLLMTypicalCaseProductsByPublishStatus } from '@/api/product'

interface ClassicCaseProps {
  productData: ProductData | null
}

function ClassicCase({ productData }: ClassicCaseProps) {
  // 使用getLLMTypicalCaseProductsByPublishStatus获取案例数据
  const llmTypicalCaseProducts = productData ? getLLMTypicalCaseProductsByPublishStatus(productData) : null

  // 准备案例数据，合并standardFunctions和customServices作为tags
  const caseData = llmTypicalCaseProducts || []

  return (
    <div className={styles.root}>
      <div className="case-title">典型案例</div>
      <div className="case-list">
        {caseData.length > 0 && (
          caseData.map((item, index) => {
            // 合并standardFunctions和customServices作为tags
            const tags = [...(item.standardFunctions || [])]
            return (
              <div className="case-item" key={item.caseProductId || index}>
                <img 
                  className="w-full h-[177px]" 
                  src={item.imageUrl || `/upload/banner/productServer/${index === 0 ? 'agrBanner.jpg' : index === 1 ? 'traBanner.jpg' : 'pipBanner.jpg'}`} 
                />
                <div className="case-info-wrap">
                  <div className="info-title">{item.productName}</div>
                  {tags && tags.length > 0 && (
                    <div className="info-tags">
                      {tags.map((tag, tagIndex) => (
                        <div className="info-tag" key={tagIndex}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ClassicCase
