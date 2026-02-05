/*
 * @Author: wangxiaoming
 * @Date: 2025-11-27 11:47:10
 * @Description: 描述
 */
import React, { useEffect } from 'react'
import styles from './index.module.less'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (duration > 0) {
      timer = setTimeout(() => {
        onClose?.()
      }, duration)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [duration, onClose])

  return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>
}

export default Toast
