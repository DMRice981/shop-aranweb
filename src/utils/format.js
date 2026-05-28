export function formatPrice(price) {
  return `¥${(price || 0).toFixed(2)}`
}

export function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export function formatTimeAgo(date) {
  if (!date) return ''
  const now = new Date().getTime()
  const past = new Date(date).getTime()
  const diff = now - past
  
  const second = 1000
  const minute = 60 * second
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else {
    return formatTime(date)
  }
}

export function formatSales(sales) {
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万+`
  }
  return `${sales}+`
}
