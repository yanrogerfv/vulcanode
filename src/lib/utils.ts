import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function formatCurrency(value: number): string {
  return `$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

/**
 * Condensa a lista de itens pendentes da pílula de hover: mostra no máximo `maxItems`
 * rótulos (ou o que couber em `maxChars`) e devolve quantos ficaram de fora, para
 * serem exibidos como "+X". O primeiro item sempre entra, mesmo que seja longo,
 * para a pílula nunca ficar só com o contador.
 */
export function summarizeItemLabels(
  items: { name: string; quantity: number; unitLabel: string | null }[],
  maxItems = 4,
  maxChars = 80
): { labels: string[]; hiddenCount: number } {
  const labels: string[] = []
  let usedChars = 0

  for (const item of items) {
    const label = `${item.quantity} ${item.unitLabel ?? item.name}`
    const isFirst = labels.length === 0
    if (!isFirst && (labels.length >= maxItems || usedChars + label.length > maxChars)) break
    labels.push(label)
    usedChars += label.length
  }

  return { labels, hiddenCount: items.length - labels.length }
}
