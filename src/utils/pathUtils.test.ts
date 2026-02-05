import { adjustPathForEnvironment } from './pathUtils'

describe('Path Utils', () => {
  describe('adjustPathForEnvironment', () => {
    // 测试预览环境
    it('should add /preview prefix to root path in preview mode', () => {
      const result = adjustPathForEnvironment('/', true)
      expect(result).toBe('/preview')
    })

    it('should add /preview prefix to root path with query params in preview mode', () => {
      const result = adjustPathForEnvironment('/?id=1&name=test', true)
      expect(result).toBe('/preview?id=1&name=test')
    })

    it('should add /preview prefix to non-root path in preview mode', () => {
      const result = adjustPathForEnvironment('/about', true)
      expect(result).toBe('/preview/about')
    })

    it('should add /preview prefix to non-root path with query params in preview mode', () => {
      const result = adjustPathForEnvironment('/about?id=1&name=test', true)
      expect(result).toBe('/preview/about?id=1&name=test')
    })

    it('should remove existing /preview prefix and re-add it in preview mode', () => {
      const result = adjustPathForEnvironment('/preview/about', true)
      expect(result).toBe('/preview/about')
    })

    // 测试正式环境
    it('should return root path unchanged in production mode', () => {
      const result = adjustPathForEnvironment('/', false)
      expect(result).toBe('/')
    })

    it('should return root path with query params unchanged in production mode', () => {
      const result = adjustPathForEnvironment('/?id=1&name=test', false)
      expect(result).toBe('/?id=1&name=test')
    })

    it('should return non-root path unchanged in production mode', () => {
      const result = adjustPathForEnvironment('/about', false)
      expect(result).toBe('/about')
    })

    it('should return non-root path with query params unchanged in production mode', () => {
      const result = adjustPathForEnvironment('/about?id=1&name=test', false)
      expect(result).toBe('/about?id=1&name=test')
    })

    it('should remove existing /preview prefix in production mode', () => {
      const result = adjustPathForEnvironment('/preview/about', false)
      expect(result).toBe('/about')
    })

    it('should remove existing /preview prefix with query params in production mode', () => {
      const result = adjustPathForEnvironment('/preview/about?id=1&name=test', false)
      expect(result).toBe('/about?id=1&name=test')
    })
  })
})
