import classNames from 'classnames'
import styles from './index.module.less'

interface CustomPaginationProps {
  current: number
  total: number
  pageSize?: number
  onChange: (page: number) => void
}

function CusPagination({ current, total, pageSize = 12, onChange }: CustomPaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className={styles.root}>
      <div className="page-total">共 {total} 项数据</div>
      <div className="page-options">
        <button className="opt-item ret-btn" disabled={current === 1} onClick={() => onChange(current - 1)}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <div
            className={classNames('opt-item', {
              active: current === i + 1
            })}
            key={i}
            onClick={() => onChange(i + 1)}
          >
            {i + 1}
          </div>
        ))}
        <button className="opt-item ret-btn" disabled={current === totalPages} onClick={() => onChange(current + 1)}>
          &gt;
        </button>
      </div>
    </div>
  )
}

export default CusPagination
