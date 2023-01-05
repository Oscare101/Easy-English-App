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

import { collection, addDoc } from 'firebase/firestore'
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
const database = getDatabase()

const width = Dimensions.get('window').width

export default function RegistrationScreen(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [unique, setUnique] = useState('')
  const [name, setName] = useState('')
  const [emails, setEmails] = useState({})

  async function createUser() {
    set(ref(database, 'users/' + email.replace('.', ',')), {
      'user-name': name,
      'user-email': email,
      'user-unique': unique,
      'user-icon': '',
      'user-gender': '',
      'user-age': '',
      'user-level': 1,
      'user-status': 'student',
    })
  }

  function register() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (re) => {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)

        createUser()

        props.onChange('main')
      })
      .catch((err) => console.log(err))
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
            onChangeText={(text) => {
              setEmail(text)
            }}
          />
        </View>
        <View style={styles.inputBlock}>
          <TextInput
            value={password}
            placeholder="password"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.inputBlock}>
          <TextInput
            value={name}
            placeholder="name"
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.inputBlock}>
          <TextInput
            value={unique}
            placeholder="unique nickname"
            onChangeText={(text) => setUnique(text)}
          />
        </View>

        <LinearGradient
          // Button Linear Gradient

          start={[0, 0]}
          end={[1, 1]}
          location={[0.25, 0.4, 1]}
          colors={['#18181b', '#35353d']}
          style={styles.buttonLogIn}
        >
          <TouchableOpacity
            onPress={() => {
              register()
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
          colors={['#647e72', '#86c7a6']}
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
    width: width * 0.6,
    paddingTop: 20,
  },

  line: {
    width: '100%',
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
})
