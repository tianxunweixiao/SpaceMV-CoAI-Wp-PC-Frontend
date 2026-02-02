import { useState } from 'react'
import CusPagination from '@/components/cus-pagination'
import styles from './index.module.less'

const articles = [
  {
    image: '/upload/example1.jpg',
    title: '文章一',
    description:
      '文章描述一。',
    date: '20250208',
    link: 'https://example.com',
  },
]

interface Article {
  id?: string
  image: string
  title: string
  description: string
  date: string
  link: string
}

const ArticleList = () => {
  const [current, setCurrent] = useState(1)

  return (
    <div className={styles.root}>
      <div className="text-center font-bold text-58 text-white mb-60">空天与智能</div>
      <div className="article-container">
        <div className="article-list">
          {articles
            .slice((current - 1) * 3, current * 3)
            .map(({ link, image, title, description, date }: Article, index) => (
              <div className="article-card" onClick={() => window.open(link)} key={index}>
                <div className="article-image">
                  <img src={image} alt={title} />
                </div>
                <div className="article-content">
                  <div className="article-tags">
                    <span className="tag">空天与智能</span>
                    <span className="tag">{date}</span>
                  </div>
                  <div className="article-title">{title}</div>
                  <div className="article-des">{description}</div>
                </div>
              </div>
            ))}
        </div>
        <CusPagination current={current} total={articles.length} pageSize={3} onChange={(page) => setCurrent(page)} />
      </div>
    </div>
  )
}

export default ArticleList
