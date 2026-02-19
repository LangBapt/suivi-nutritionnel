import { useSignIn } from '@clerk/clerk-expo'
import type { EmailCodeFactor } from '@clerk/types'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [showEmailCode, setShowEmailCode] = React.useState(false)

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId,
        })
        router.replace('/(main)/(home)')
      } else if (signInAttempt.status === 'needs_second_factor') {
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is EmailCodeFactor => factor.strategy === 'email_code',
        )

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
            emailAddressId: emailCodeFactor.emailAddressId,
          })
          setShowEmailCode(true)
        }
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      alert(err.errors?.[0]?.message || "Identifiants invalides")
    }
  }, [isLoaded, signIn, setActive, router, emailAddress, password])

  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId,
        })
        router.replace('/(main)/(home)')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      alert("Code de vérification incorrect")
    }
  }, [isLoaded, signIn, setActive, router, code])

  if (!isLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {showEmailCode ? (
          <>
            <Text style={styles.title}>Double authentification</Text>
            <Text style={styles.description}>
              Entrez le code envoyé sur votre email pour sécuriser votre connexion.
            </Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Code de sécurité"
              placeholderTextColor="#666"
              onChangeText={setCode}
              keyboardType="numeric"
            />
            <Pressable style={styles.button} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Vérifier</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Connexion</Text>
            
            <Text style={styles.label}>Adresse Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="email@exemple.com"
              placeholderTextColor="#666"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="********"
              placeholderTextColor="#666"
              secureTextEntry={true}
              onChangeText={setPassword}
            />

            <Pressable
              style={[
                styles.button,
                (!emailAddress || !password) && styles.buttonDisabled,
              ]}
              onPress={onSignInPress}
              disabled={!emailAddress || !password}
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </Pressable>

            <View style={styles.linkContainer}>
              <Text style={styles.text}>Pas encore de compte ? </Text>
              <Link href="/signup">
                <Text style={styles.linkText}>S'inscrire</Text>
              </Link>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 4,
  },
  text: {
    color: '#666',
  },
  linkText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
})