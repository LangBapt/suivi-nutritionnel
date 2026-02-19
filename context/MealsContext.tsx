import React, { createContext, useContext, useEffect, useState } from 'react'
import { loadMeals, saveMeals } from '../services/storage'
import { Food, Meal } from '../types'

type MealsContextType = {
  meals: Meal[]
  currentMeal: Meal | null

  createMeal: (name: Meal['name']) => void
  addFoodToCurrentMeal: (food: Food) => void
  removeFoodFromCurrentMeal: (foodId: string) => void
  saveCurrentMeal: () => void
  deleteMeal: (mealId: string) => void

  getTotalCalories: (meal: Meal) => number
  getTotalProteins: (meal: Meal) => number
  getTotalCarbs: (meal: Meal) => number
  getTotalFats: (meal: Meal) => number
}

const MealsContext = createContext<MealsContextType | undefined>(undefined)

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null)

  useEffect(() => {
    const init = async () => {
      const storedMeals = await loadMeals()
      setMeals(storedMeals)
    }
    init()
  }, [])

  useEffect(() => {
    saveMeals(meals)
  }, [meals])

  function createMeal(name: Meal['name']) {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString(),
      foods: [],
    }

    setCurrentMeal(newMeal)
  }

  function addFoodToCurrentMeal(food: Food) {
    if (!currentMeal) return

    setCurrentMeal({
      ...currentMeal,
      foods: [...currentMeal.foods, food],
    })
  }

  function removeFoodFromCurrentMeal(foodId: string) {
    if (!currentMeal) return

    setCurrentMeal({
      ...currentMeal,
      foods: currentMeal.foods.filter((f) => f.id !== foodId),
    })
  }

  function saveCurrentMeal() {
    if (!currentMeal) return

    setMeals((prev) => [...prev, currentMeal])
    setCurrentMeal(null)
  }

  function deleteMeal(mealId: string) {
    setMeals((prev) => prev.filter((meal) => meal.id !== mealId))
  }

  function getTotalCalories(meal: Meal) {
    return meal.foods.reduce((sum, f) => sum + f.calories, 0)
  }

  function getTotalProteins(meal: Meal) {
    return meal.foods.reduce((sum, f) => sum + f.proteins, 0)
  }

  function getTotalCarbs(meal: Meal) {
    return meal.foods.reduce((sum, f) => sum + f.carbs, 0)
  }

  function getTotalFats(meal: Meal) {
    return meal.foods.reduce((sum, f) => sum + f.fats, 0)
  }

  return (
    <MealsContext.Provider
      value={{
        meals,
        currentMeal,
        createMeal,
        addFoodToCurrentMeal,
        removeFoodFromCurrentMeal,
        saveCurrentMeal,
        deleteMeal,
        getTotalCalories,
        getTotalProteins,
        getTotalCarbs,
        getTotalFats,
      }}
    >
      {children}
    </MealsContext.Provider>
  )
}

export function useMeals() {
  const context = useContext(MealsContext)
  if (!context) {
    throw new Error('useMeals must be used within MealsProvider')
  }
  return context
}
