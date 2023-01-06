import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase-config'
import colors from '../constants/colors'
// const auth = getAuth()

const width = Dimensions.get('window').width

export default function LogInScreen(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // useEffect(() => {
  //   // Call only when screen open or when back on screen
  //   if (isFocused) {
  //     GetUser()
  //   }
  // }, [isFocused])

  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (re) => {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
        setEmail('')
        setPassword('')
        props.onChange('main')
      })
      .catch((err) => {
        console.log(err.message)
        if (err.message.includes('auth/wrong-password')) {
          setError('Wrong email or password')
        } else {
          setError('Invalid email')
        }
      })
  }

  async function GetStorageEmail() {
    try {
      const getEmail = await AsyncStorage.getItem('email')
      const getPassword = await AsyncStorage.getItem('password')
      if (getEmail !== null) {
        setEmail(getEmail)
        setPassword(getPassword)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    GetStorageEmail()
    return console.log('useEffect done')
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.title}>Easy English</Text>
        <Text style={styles.titleText}>your pocket mentor</Text>
      </View>
      <View style={styles.bottomBlock}>
        <View style={styles.inputBlock}>
          <TextInput
            value={email}
            placeholder="email"
            onChangeText={(text) => setEmail(text.trim())}
          />
        </View>
        <View style={styles.inputBlock}>
          <TextInput
            value={password}
            placeholder="password"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        {error ? <Text style={styles.redText}>{error}</Text> : <></>}

        <LinearGradient
          // Button Linear Gradient

          start={[0, 0]}
          end={[1, 1]}
          location={[0.25, 0.4, 1]}
          colors={[colors.gradientBlack1, colors.gradientBlack2]}
          style={styles.buttonLogIn}
        >
          <TouchableOpacity
            onPress={() => {
              login()
            }}
            activeOpacity={0.8}
            style={styles.touch}
          >
            <Text style={styles.buttonLogInText}>Log In</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.textIf}>
          If you don’t have an account, you can create it here
        </Text>
        <LinearGradient
          // Button Linear Gradient

          start={[0, 0]}
          end={[1, 1]}
          location={[0.25, 0.4, 1]}
          colors={[colors.gradientGreen1, colors.gradientGreen2]}
          style={styles.buttonRegistration}
        >
          <TouchableOpacity
            onPress={() => props.onChange('registration')}
            activeOpacity={0.8}
            style={styles.touch}
          >
            <Text style={styles.buttonLogInText}>Registration</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },

  // header View
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 20,
  },

  line: {
    width: '60%',
    height: 1,
    backgroundColor: '#666',
  },
  title: { fontSize: 40, fontWeight: '600', padding: 5 },
  titleText: {
    fontSize: 18,
    color: '#666',
  },

  // bottom block

  bottomBlock: {
    width: width * 0.8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBlock: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 5,
  },

  buttonLogIn: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonLogInText: {
    color: '#fff',
    fontSize: 20,
    letterSpacing: 1,
  },

  textIf: {
    color: '#666',
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
  },

  buttonRegistration: {
    width: '60%',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },

  touch: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  redText: {
    color: colors.red,
  },
})
