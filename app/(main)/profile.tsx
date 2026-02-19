import { useAuth, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function ProfilePage() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  if (!isSignedIn || !user) {
    return (
      <View style={styles.center}>
        <Text>Utilisateur non connecté</Text>
      </View>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/login')
    } catch (err) {
      console.error(err)
      alert('Impossible de se déconnecter.')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={80} color="#0a7ea4" />
        <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress || 'Email inconnu'}</Text>
        <Pressable style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 16,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
