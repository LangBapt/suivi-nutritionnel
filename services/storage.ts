import AsyncStorage from '@react-native-async-storage/async-storage'
import { Meal } from '../types'

const STORAGE_KEY = 'meals'

export async function saveMeals(meals: Meal[]) {
  try {
    const json = JSON.stringify(meals)
    await AsyncStorage.setItem(STORAGE_KEY, json)
  } catch (error) {
    console.error('Erreur sauvegarde meals:', error)
  }
}

export async function loadMeals(): Promise<Meal[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY)

    if (!data) return []

    return JSON.parse(data)
  } catch (error) {
    console.error('Erreur chargement meals:', error)

    await AsyncStorage.removeItem(STORAGE_KEY)

    return []
  }
}
