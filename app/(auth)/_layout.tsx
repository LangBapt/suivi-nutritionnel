import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0a7ea4' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="login"
        options={{ title: 'Se connecter' }}
      />
      <Stack.Screen
        name="signup"
        options={{ title: "S'inscrire" }}
      />
    </Stack>
  )
}
