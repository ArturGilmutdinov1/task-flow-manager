const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  pending_operator: 'У оператора',
  pending_manager: 'У руководителя',
  rework: 'На доработке',
  approved: 'Согласована',
  rejected: 'Отклонена',
}

const STATUS_BADGE: Record<string, string> = {
  draft: 'badge--draft',
  pending_operator: 'badge--pending',
  pending_manager: 'badge--pending',
  rework: 'badge--rework',
  approved: 'badge--approved',
  rejected: 'badge--rejected',
}

const TYPE_LABELS: Record<string, string> = {
  purchase: 'Закупка',
  vacation: 'Отпуск',
}

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function getStatusBadgeClass(status: string): string {
  return STATUS_BADGE[status] ?? 'badge--draft'
}

export function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type
}

export function getTicketTitle(ticket: {
  type: string
  formData?: Record<string, unknown>
}): string {
  const formData = ticket.formData ?? {}

  if (ticket.type === 'purchase') {
    return String(formData.itemName || 'Заявка на закупку')
  }

  if (ticket.type === 'vacation') {
    const name = String(formData.itemName || 'Отпуск')
    const start = formData.startDate ? String(formData.startDate) : ''
    const end = formData.endDate ? String(formData.endDate) : ''
    if (start && end) {
      return `${name} · ${start} — ${end}`
    }
    return name
  }

  return 'Заявка'
}

export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
