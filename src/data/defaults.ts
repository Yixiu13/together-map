import type { SiteData } from '@/types'
import raw from './site-data.json'

/**
 * 站点的全部内容都来自 ./site-data.json。
 * 站内「书写回忆」导出 JSON 后，直接覆盖这个文件并提交，线上内容就会更新。
 */
export const defaultData = raw as unknown as SiteData
