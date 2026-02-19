import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'
import { MealsProvider } from '../context/MealsContext'


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <MealsProvider>
        <Slot />
      </MealsProvider>
    </ClerkProvider>
  )
}
