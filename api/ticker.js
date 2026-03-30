export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price"
    )

    const data = await response.json()

    return res.status(200).json({
      success: true,
      data: data.slice(0, 50), // limit biar ringan
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}
