import { Food } from '../types'

const BASE_URL = 'https://fr.openfoodfacts.org'
const MIN_QUERY_LENGTH = 3
const TIMEOUT_MS = 8000

let currentAbortController: AbortController | null = null

interface OFFProduct {
  code?: string
  product_name?: string
  product_name_fr?: string
  product_name_en?: string
  brands?: string
  image_url?: string
  nutriscore_grade?: string
  nutriments?: {
    'energy-kcal_100g'?: number | string
    proteins_100g?: number | string
    carbohydrates_100g?: number | string
    fat_100g?: number | string
  }
}

export async function searchProducts(query: string): Promise<Food[]> {
  const trimmedQuery = query.trim()
  if (trimmedQuery.length < MIN_QUERY_LENGTH) return []

  if (currentAbortController) currentAbortController.abort()
  currentAbortController = new AbortController()

  const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(
    trimmedQuery
  )}&search_simple=1&action=process&json=1&fields=code,product_name,product_name_fr,product_name_en,brands,nutriments,image_url,nutriscore_grade&page_size=10`

  try {
    const timeoutId = setTimeout(() => {
      currentAbortController?.abort()
    }, TIMEOUT_MS)

    const response = await fetch(url, {
      signal: currentAbortController.signal,
      headers: {
        'User-Agent': 'SuiviNutrition/1.0',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

    const data = await response.json()

    if (!data?.products || !Array.isArray(data.products)) return []

    return data.products
      .filter((p: OFFProduct) => p.code)
      .map((p: OFFProduct): Food => ({
        id: p.code!,
        name: p.product_name || p.product_name_fr || p.product_name_en || 'Produit inconnu',
        brand: p.brands || 'Marque inconnue',
        image_url: p.image_url || undefined,
        nutriscore: p.nutriscore_grade?.toUpperCase() || 'N/A',
        calories: Number(p.nutriments?.['energy-kcal_100g'] ?? 0),
        proteins: Number(p.nutriments?.proteins_100g ?? 0),
        carbs: Number(p.nutriments?.carbohydrates_100g ?? 0),
        fats: Number(p.nutriments?.fat_100g ?? 0),
      }))
  } catch (error: any) {
    if (error.name === 'AbortError') return []
    console.error('Erreur lors de la récupération des produits:', error)
    return []
  }
}

export async function searchProductByCode(code: string): Promise<Food[]> {
  if (!code) return []

  const url = `${BASE_URL}/api/v0/product/${encodeURIComponent(code)}.json`

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SuiviNutrition/1.0 (contact: baptistelanglois0@gmail.com)' },
    })

    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

    const data = await response.json()
    const product = data.product
    if (!product) return []

    return [
      {
        id: product.code,
        name: product.product_name || product.product_name_fr || product.product_name_en || 'Produit inconnu',
        brand: product.brands || 'Marque inconnue',
        image_url: product.image_url ?? undefined,
        nutriscore: product.nutriscore_grade?.toUpperCase() || 'N/A',
        calories: Number(product.nutriments?.['energy-kcal_100g']) || 0,
        proteins: Number(product.nutriments?.proteins_100g) || 0,
        carbs: Number(product.nutriments?.carbohydrates_100g) || 0,
        fats: Number(product.nutriments?.fat_100g) || 0,
      },
    ]
  } catch (error) {
    console.error('Erreur lors de la récupération du produit par code-barres:', error)
    return []
  }
}