export type SceneKey = 'mountain' | 'sea' | 'city' | 'snow' | 'town' | 'lake' | 'food' | 'night'

export type StopStatus = 'visited' | 'planned'

export interface TravelStop {
  id: string
  /** 城市 / 地点名 */
  name: string
  /** 所属省份（用于地图高亮，需与 geojson 中的省名一致） */
  province: string
  lng: number
  lat: number
  date: string
  status: StopStatus
  /** 一句话注脚 */
  note: string
}

export interface MemoryEntry {
  id: string
  date: string
  title: string
  place: string
  body: string
  /** 照片地址，留空则使用内置插画 */
  photo: string
  scene: SceneKey
  weather: string
}

export interface Milestone {
  id: string
  label: string
  date: string
  note: string
}

export interface SiteData {
  /** 站点主标题 */
  title: string
  /** 副标题 / 一句题辞 */
  subtitle: string
  /** 在一起的那一天 YYYY-MM-DD */
  startDate: string
  /** 你俩的称呼，例如「阿泽 & 小满」 */
  names: string
  /** 署名 */
  signature: string
  /** 卷首语 */
  prologue: string
  /** 结束语 */
  epilogue: string
  stops: TravelStop[]
  memories: MemoryEntry[]
  milestones: Milestone[]
}
