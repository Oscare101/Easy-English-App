import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Pressable,
  Modal,
  TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'

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
import { collection, getDocs } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase-config'
import colors from '../constants/colors'
import SettingsProfile from '../components/SettingsProfile'

export default function ProfileScreen(props) {
  const [userData, setUserData] = useState({})
  const [settingsProfileVisible, setSettingsProfileVisible] = useState(false)
  const [name, setName] = useState('')

  const dataFlatList = [
    { text: 'Create a new post', icon: 'add-circle-outline' },
    { text: 'Open chats', icon: 'chatbubble-ellipses-outline' },
    { text: 'Settings', icon: 'settings-outline' },
  ]

  function logOut() {
    signOut(auth)
      .then(async () => {
        await AsyncStorage.setItem('email', '')
        await AsyncStorage.setItem('password', '')
        props.onChange('login')
      })
      .catch((error) => {
        // An error happened.
      })
  }

  function renderItem(item) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? colors.buttunActivePale : '#fff',
          },
          styles.underProfileItem,
        ]}
      >
        {({ pressed }) => (
          <>
            <Ionicons
              name={item.item.icon}
              size={30}
              color={pressed ? '#232325' : '#6D6C73'}
            />
            <Text
              style={[
                styles.underProfileText,
                { color: pressed ? '#232325' : '#6D6C73' },
              ]}
            >
              {item.item.text}
            </Text>
          </>
        )}
      </Pressable>
    )
  }

  // const GetUser = async () => {
  //   const querySnapshot = await getDocs(
  //     collection(db, 'users', auth.currentUser.email.replace('.', ','))
  //   )
  //   console.log(querySnapshot)
  // }

  useEffect(() => {
    const dataAboutUser = ref(
      database,
      'users/' + auth.currentUser.email.replace('.', ',')
    )
    onValue(dataAboutUser, (snapshot) => {
      setUserData(snapshot.val())
    })
  }, [])

  return (
    <View style={styles.container}>
      <Modal
        visible={settingsProfileVisible}
        transparent={true}
        animationType="none"
      >
        <SettingsProfile
          visible={settingsProfileVisible}
          user={userData}
          onLogOut={() => logOut()}
          onClose={() => setSettingsProfileVisible(false)}
        />
      </Modal>

      <View style={styles.profileBlock}>
        <View style={styles.personBlock}>
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 50,
              backgroundColor: '#666',
            }}
          />
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{userData['user-name']}</Text>
            <Text style={styles.email}>
              {auth.currentUser.email}
              {auth.currentUser.metadata.lastSignInTime
                .split(' ')
                .splice(1, 3)
                .join(' ')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setSettingsProfileVisible(true)}
            style={styles.botBlock}
          >
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
        <View style={styles.underProfileBlock}>
          <FlatList
            style={{ width: '100%' }}
            data={dataFlatList}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
  },

  profileBlock: {
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 20,
  },
  personBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
    padding: 20,
    height: 100,
  },
  nameBlock: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    paddingLeft: 20,
  },
  name: {
    fontSize: 26,
  },
  email: {
    color: '#666',
    fontWeight: '300',
  },
  botBlock: {
    flexDirection: 'column',
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginTop: 3,
    backgroundColor: '#111',
  },
  underProfileBlock: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    width: '100%',
  },
  underProfileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 2,
    padding: 5,
    borderRadius: 10,
    width: '100%',
  },
  underProfileText: {
    fontSize: 20,
    color: '#6D6C73',
    marginLeft: 10,
  },

  ///////////////////////////////////
})
