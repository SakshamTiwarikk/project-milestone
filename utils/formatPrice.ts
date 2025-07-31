export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) {
    return "0.00"
  }

  const numPrice = typeof price === "number" ? price : Number.parseFloat(price.toString())

  if (isNaN(numPrice)) {
    return "0.00"
  }

  return numPrice.toFixed(2)
}
