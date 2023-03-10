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
import Spinner from 'react-native-loading-spinner-overlay'

// import { collection, addDoc } from 'firebase/firestore'
// import { getDatabase, get } from 'firebase/database'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase-config'

import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
} from 'firebase/database'
import colors from '../constants/colors'
const database = getDatabase()

const width = Dimensions.get('window').width

export default function RegistrationScreen(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [uniqueEmailError, setUniqueEmailError] = useState(false)
  const [warningEmail, setWarningEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  const [correctPasswordError, setCorrectPasswordError] = useState(false)
  const [nameError, setNameError] = useState(true)

  async function createUser() {
    set(ref(database, 'users/' + email.replace('.', ',').toLowerCase()), {
      'user-name': name,
      'user-email': email.toLowerCase(),
      'user-icon': '',
      'user-age': '',
      'user-level': 1,
      'user-status': 'student',
      friends: ['-'],
      notifications: ['-'],
    })
  }

  function register() {
    setLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (re) => {
        await AsyncStorage.setItem('email', email.toLowerCase())
        await AsyncStorage.setItem('password', password)

        createUser()

        props.onChange('main')
      })
      .catch((err) => {
        if (err.message.includes('auth/invalid-email')) {
          setUniqueEmailError('Invalid email')
        } else if (err.message.includes('auth/email-already-in-use')) {
          setUniqueEmailError('This email is already used')
        }
        console.log(err.message)
      })
  }

  // useEffect(() => {
  //   //every user must have an email
  //   firebase
  //     .database()
  //     .ref(`users/${email.replace('.', ',')}`)
  //     .once('value', (snapshot) => {
  //       if (snapshot.exists()) {
  //         console.log('exists!')
  //       }
  //     })
  // }, [])

  return (
    <View style={styles.container}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={'Loading...'}
        //Text style of the Spinner Text
      />
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.title}>Easy English</Text>
        <Text style={styles.titleText}>your pocket mentor</Text>
      </View>
      <View style={styles.bottomBlock}>
        <View style={styles.inputBlock}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            placeholder="email"
            onChangeText={(text) => {
              setUniqueEmailError(false)
              try {
                const dataAboutUser = ref(
                  database,
                  'users/' + text.replace(' ', '')
                )
                onValue(dataAboutUser, (snapshot) => {
                  if (snapshot.exists()) {
                    if (text.replace(' ', '').length != 0)
                      setUniqueEmailError('This email is already used')
                  } else {
                    setUniqueEmailError(false)
                  }
                })
              } catch (error) {
                // console.log(error)
              }
              if (text.toLowerCase() !== text) {
                setWarningEmail(
                  `Email cannot contain capital letters. You will be registered by email ${text.toLowerCase()}`
                )
              } else {
                setWarningEmail(false)
              }
              setEmail(text.replace(' ', ''))
            }}
          />
        </View>
        {uniqueEmailError ? (
          <Text style={styles.redText}>{uniqueEmailError}</Text>
        ) : (
          <></>
        )}
        {warningEmail ? (
          <Text style={styles.yellowText}>{warningEmail}</Text>
        ) : (
          <></>
        )}

        <View style={styles.inputBlock}>
          <TextInput
            value={password}
            placeholder="password"
            onChangeText={(text) => {
              if (text.trim().replace(' ', '').length != text.length) {
                setCorrectPasswordError(
                  `You can't use spaces inside your password`
                )
              } else if (text.length < 6 && text.length > 0) {
                setCorrectPasswordError(
                  'Your password must include at least 6 symbols'
                )
              } else {
                setCorrectPasswordError(false)
              }
              setPassword(text)
            }}
          />
        </View>
        {correctPasswordError ? (
          <Text style={styles.redText}>{correctPasswordError}</Text>
        ) : (
          <></>
        )}
        <View style={styles.inputBlock}>
          <TextInput
            value={name}
            placeholder="name"
            onChangeText={(text) => {
              if (text.trim().replace(' ', '').length > 0) {
                setNameError(false)
              }
              setName(text)
            }}
          />
        </View>
        {nameError ? <Text style={styles.redText}>{nameError}</Text> : <></>}
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
              if (email.length == 0) {
                setUniqueEmailError('Please type your email')
              }
              // else if (uniqueEmailError) {
              //   setUniqueEmailError('This email is already used')
              // }
              else if (password.length == 0) {
                setCorrectPasswordError(
                  'Your password must include at least 6 symbols'
                )
              } else if (name.trim().replace(' ', '').length == 0) {
                setNameError('Please enter your name')
              } else {
                register()
              }
            }}
            activeOpacity={0.8}
            style={styles.touch}
          >
            <Text style={styles.buttonLogInText}>Registration</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.textIf}>
          If you already have an account you can log in
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
            onPress={() => props.onChange('login')}
            activeOpacity={0.8}
            style={styles.touch}
          >
            <Text style={styles.buttonLogInText}>Log In</Text>
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
  yellowText: {
    color: colors.yellow,
  },
})
