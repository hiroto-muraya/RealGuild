/**
 * 配色パレットの切り替え（ユーザーが選べる設定。docs/requirements.md F7）。
 * 選択は localStorage に保存するが、保存できない環境でも既定の配色で動くようにする。
 */
export const palettes = [
  { id: 'night', label: '勇者の夜' },
  { id: 'field', label: '草原' },
  { id: 'gb', label: 'クラシック' },
] as const

export type PaletteId = (typeof palettes)[number]['id']

const STORAGE_KEY = 'realguild.palette'
const DEFAULT_PALETTE: PaletteId = 'night'

function isPaletteId(value: unknown): value is PaletteId {
  return palettes.some((p) => p.id === value)
}

export function loadPalette(): PaletteId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return isPaletteId(saved) ? saved : DEFAULT_PALETTE
  } catch {
    return DEFAULT_PALETTE
  }
}

export function applyPalette(id: PaletteId) {
  document.documentElement.dataset.palette = id
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // 保存できなくても表示には影響しない
  }
}
