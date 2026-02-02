/**
 * 根据预览环境调整路径
 * @param path 原始路径，可以包含查询参数
 * @param isPreview 是否为预览环境
 * @returns 调整后的路径
 */
export function adjustPathForEnvironment(path: string, isPreview: boolean): string {
  // 分离路径和查询参数
  const [pathWithoutQuery, query] = path.split('?')
  
  // 移除可能存在的旧前缀，以便重新添加正确的前缀
  let cleanedPath = pathWithoutQuery
  if (cleanedPath.startsWith('/preview')) {
    cleanedPath = cleanedPath.replace('/preview', '')
  }

  if (isPreview) {
    // 预览环境：添加 /preview 前缀
    // 修复根路径问题：如果是根路径，直接返回 /preview，避免 /preview/
    if (cleanedPath === '/') {
      return query ? `/preview?${query}` : '/preview'
    }
    return query ? `/preview${cleanedPath}?${query}` : `/preview${cleanedPath}`
  } else {
    // 正式环境：直接返回清理后的路径
    return query ? `${cleanedPath}?${query}` : cleanedPath
  }
}