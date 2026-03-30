export function parseSignal(text) {
  try {
    if (text.toLowerCase().includes('buy')) {
      return { type: 'BUY', price: 100 }
    }
    if (text.toLowerCase().includes('sell')) {
      return { type: 'SELL', price: 100 }
    }
    return null
  } catch (err) {
    return null
  }
}
