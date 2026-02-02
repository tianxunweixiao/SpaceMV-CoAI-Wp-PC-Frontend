import { useState, useMemo } from 'react'
import CusPagination from '@/components/cus-pagination'
import styles from './index.module.less'
import { NEWS_MAP } from './interface.ts'

function NewsCenter() {
  const [current, setCurrent] = useState(1)
  const news = useMemo(() => {
    const pageSize = 12
    const startIndex = (current - 1) * pageSize
    return NEWS_MAP.slice((current - 1) * pageSize, startIndex + pageSize)
  }, [current])

  return (
    <div className={styles.root}>
      <img className="w-full h-[508px]" src="/news/banner.png" alt="banner" />
      <div className="dynamic-wrap">
        <div className="dynamic-title">新闻动态</div>
        <div className="dynamic-list">
          {news.map((item, index) => (
            <div className="dynamic-item" key={index} onClick={() => (window.location.href = item.link)}>
              <img className="w-full h-[281px]" src={`/news/wechat/${item.img}`} alt="主要图片" />
              <div className="dynamic-info">
                <div className="info-con">{item.title}</div>
                <div className="text-[#9F9F9F]">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
        <CusPagination current={current} total={NEWS_MAP.length} onChange={(page) => setCurrent(page)} />
      </div>
    </div>
  )
}

export default NewsCenter
