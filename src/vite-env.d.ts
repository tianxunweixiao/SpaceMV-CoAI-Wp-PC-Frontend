/// <reference types="vite/client" />
interface ImportMetaEnv {
  [key: string]: any

  BASE_URL: string
  MODE: string
  DEV: boolean
  PROD: boolean
  SSR: boolean
  readonly VITE_URL: string
}

interface ImportMeta {
  readonly env
}
