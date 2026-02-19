import { useSignUp } from '@clerk/clerk-expo'
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

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      alert(err.errors?.[0]?.message || "Une erreur est survenue lors de l'inscription")
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({
          session: signUpAttempt.createdSessionId,
        })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      alert(err.errors?.[0]?.message || "Code invalide")
    }
  }

  if (!isLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {pendingVerification ? (
          <>
            <Text style={styles.title}>Vérifiez votre email</Text>
            <Text style={styles.description}>
              Un code de vérification a été envoyé à votre adresse email.
            </Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Code de vérification"
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
            <Text style={styles.title}>Inscription</Text>
            
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
              onPress={onSignUpPress}
              disabled={!emailAddress || !password}
            >
              <Text style={styles.buttonText}>Continuer</Text>
            </Pressable>

            <View style={styles.linkContainer}>
              <Text style={styles.text}>Déjà un compte ? </Text>
              <Link href="/login">
                <Text style={styles.linkText}>Se connecter</Text>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
  text: {
    color: '#666',
  },
  linkText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
})