export type Food = {
  id: string
  name: string
  brand?: string
  image_url?: string
  nutriscore?: string
  calories: number
  proteins: number
  carbs: number
  fats: number
}

export type MealType =
  | 'Petit-déjeuner'
  | 'Déjeuner'
  | 'Dîner'
  | 'Snack'

export type Meal = {
  id: string
  name: MealType
  date: string
  foods: Food[]
}