import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { setMenuIdx } from '@/store/modules/menuReducer'
import { getCompanyInfoByPublishStatus } from '@/api/company'
import styles from './index.module.less'
import { adjustPathForEnvironment } from '@/utils/pathUtils'

interface FooterProps {
  isPreview?: boolean
}

const LINKS_MAP = [
  {
    name: '首页',
    path: '/'
  },
  {
    name: '产品一',
    path: '/model'
  },
  {
    name: '产品二',
    path: '/device'
  },
  {
    name: '新闻中心',
    path: '/news'
  },
  {
    name: '关于我们',
    path: '/about'
  }
]

function Footer({ isPreview = false }: FooterProps) {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const param = new URLSearchParams(window.location.search).get('param')
  const companyInfo = useAppSelector(state => state.company.companyInfo)

  function handleClick(path: string, index: number) {
    // 获取当前URL的查询参数
    const currentParams = window.location.search
    
    // 使用公共函数根据预览环境调整路径
    const targetPathWithoutParams = adjustPathForEnvironment(path, isPreview)
    
    // 完整目标路径（包含查询参数）
    const targetPath = currentParams ? `${targetPathWithoutParams}${currentParams}` : targetPathWithoutParams
    
    nav(targetPath)
    window.scrollTo(0, 0)
    dispatch(setMenuIdx(index))
  }

  // 获取公司基本信息
  const companyBasicInfo = companyInfo ? getCompanyInfoByPublishStatus(companyInfo) : null

  return (
    <div className={styles.root}>
      <div className="link-label">站点地图</div>
      <div className="link-list">
        {LINKS_MAP.map((item, index) => (
          <div className="link-item" key={index} onClick={() => handleClick(item.path, index)}>
            {item.name}
          </div>
        ))}
      </div>
      <div className="info-wrap">
        <span>{companyBasicInfo?.copyrightInfo }（{companyBasicInfo?.versionNumber }） |</span>
        <span className="ml-20 text-white flex items-center gap-2">
          <img className="w-18 h-18" src="/icon.png" />
          {companyBasicInfo?.securityRecord }
        </span>
        <a className="mx-20 text-white" href="http://beian.miit.gov.cn/">{companyBasicInfo?.icpRecord }{param ? `-${param}` : ''}</a>
        <span>{companyBasicInfo?.companyName }</span>
      </div>
    </div>
  )
}

export default Footer

