import { Stack } from 'expo-router'

export default function AddRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Nouveau repas',
        headerTitleAlign: 'center',
      }}
    />
  )
}
