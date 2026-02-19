import { Stack } from 'expo-router'

export default function HomeRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Mes repas' }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: 'Détails du repas' }}
      />
    </Stack>
  )
}
