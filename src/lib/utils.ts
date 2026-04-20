export const formatRelativeTime = (isoString: string): string => {
  const diff = new Date(isoString).getTime() - Date.now()
  const abs = Math.abs(diff)
  const hours = Math.floor(abs / 3_600_000)
  const minutes = Math.floor((abs % 3_600_000) / 60_000)

  if (diff < 0) {
    if (hours >= 24) return `${Math.floor(hours / 24)}일 전`
    if (hours > 0) return `${hours}시간 전`
    return `${minutes}분 전`
  }
  if (hours >= 24) return `${Math.floor(hours / 24)}일 후`
  if (hours > 0) return `${hours}시간 후`
  return `${minutes}분 후`
}

export const formatDateTime = (isoString: string): string => {
  const d = new Date(isoString)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${min}`
}

export const getMinutesBeforeDeparture = (departureIso: string): number => {
  return (new Date(departureIso).getTime() - Date.now()) / 60_000
}
