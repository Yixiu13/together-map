export interface TokenStats {
  /** 在一起的天数 */
  days: number
  /** 已过的完整年数 */
  years: number
  /** 去过的城市数 */
  cities: number
  /** 回忆章节数 */
  chapters: number
  /** 距离下一个周年还有几天 */
  nextDays: number
}

/**
 * 把文案里的占位符替换成实时数字，例如「{days}天前」→「596天前」。
 * 认不出的占位符原样保留，避免误伤普通的花括号。
 */
export function fillTokens(text: string, stats: TokenStats): string {
  if (!text) return ''
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = (stats as unknown as Record<string, number>)[key]
    return typeof value === 'number' ? String(value) : match
  })
}
