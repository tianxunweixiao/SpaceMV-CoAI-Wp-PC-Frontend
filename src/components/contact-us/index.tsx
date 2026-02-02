import styles from './index.module.less'
import { useAppSelector } from '@/store'
import { getCompanyInfoByPublishStatus, getFocusItemsByPublishStatus } from '@/api/company'

const ContactUs = () => {
  const companyInfo = useAppSelector(state => state.company.companyInfo)

  const companyBasicInfo = companyInfo ? getCompanyInfoByPublishStatus(companyInfo) : null

  const CONTACT_MAP = [
    {
      label: '联系我们',
      txt: (
        <div className="flex flex-col gap-14">
          <div>商务合作：{companyBasicInfo?.businessCooperation || 'example@spacemv.com'}</div>
          <div>简历投递：{companyBasicInfo?.resumeDelivery || 'example@spacemv.com'}</div>
        </div>
      )
    },
    {
      label: '地址',
      txt: (
        <div className="flex flex-col gap-14">
          <div>{companyBasicInfo?.companyAddress}</div>
        </div>
      )
    }
  ]

  // 获取关注设置项（太空机器视觉平台数据）
  const focusItems = companyInfo ? getFocusItemsByPublishStatus(companyInfo) : []

  return (
    <div id="contact" className={styles.root}>
      <div className="con-title">联系我们</div>
      {companyBasicInfo?.addrUrl && (
        <img className="h-[565px] mt-80 object-contain" src={companyBasicInfo.addrUrl} alt="公司地址" />
      )}
      <div className="con-info-wrap">
        <div className="info-inner">
          {CONTACT_MAP.map((item, index) => (
            <div key={index} className="con-item">
              <div className="info-label">{item.label}</div>
              <div className="info-txt">{item.txt}</div>
            </div>
          ))}
        </div>
        <div className="wechat-wrap">
          {focusItems?.map((item, index) => (
            <div className="we-item" key={index}>
              <img className="w-[124px] h-[124px]" src={item.imageUrl} />
              <div className="text-18 mt-16">{item.focusName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactUs