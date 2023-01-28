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
  ToastAndroid,
  Image,
} from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
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
  remove,
} from 'firebase/database'
const database = getDatabase()
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase-config'
import colors from '../constants/colors'
import SettingsProfile from '../components/SettingsProfile'
import PostCreator from '../components/PostCreator'
import getUserTime from '../components/getUserTime'

import FriendsListScreen from './FriendsListScreen'

function Profile(props) {
  const [userData, setUserData] = useState({})
  const [modalProfileVisible, setModalProfileVisible] = useState(false)
  const [temporaryProfileScreen, setTemporaryProfileScreen] = useState(false)
  const dataFlatList = [
    { text: 'Create a new post', icon: 'add-circle-outline', path: 'post' },
    // {
    //   text: 'Privat chats (-)',
    //   icon: 'chatbubble-ellipses-outline',
    //   path: 'post',
    // },
    // {
    //   text: 'Friends',
    //   icon: 'people-outline',
    //   path: 'Friends',
    // },
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
        onPress={() => {
          setTemporaryProfileScreen(item.item.path)
          setModalProfileVisible(true)
        }}
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

  function CheckLike(item) {
    let newLikes = item.likes
    if (item['author-email'] == auth.currentUser.email) {
      ToastAndroid.showWithGravity(
        'You cannot like your own posts',
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG
      )
      return false
    }
    if (item.likes.includes(auth.currentUser.email)) {
      newLikes.splice(
        newLikes.findIndex((i) => i == auth.currentUser.email),
        1
      )
    } else {
      newLikes.push(auth.currentUser.email)
    }
    // console.log(item.likes, newLikes)
    update(ref(database, 'posts/' + item.key), {
      likes: newLikes,
    })
    update(
      ref(
        database,
        `users/${auth.currentUser.email.replace('.', ',')}/posts/` + item.key
      ),
      {
        likes: newLikes,
      }
    )
  }

  function Delete(key) {
    remove(ref(database, 'posts/' + key))
    remove(
      ref(
        database,
        `users/${auth.currentUser.email.replace('.', ',')}/posts/` + key
      )
    )
  }

  function RenderPosts({ item }) {
    // let userTime = getUserTime(item.time)

    return (
      <TouchableOpacity
        onLongPress={() => Delete(item.key)}
        style={styles.postView}
      >
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postText}>{item.text}</Text>
        <View style={styles.postBottom}>
          <Text style={styles.postTime}>{item.time}</Text>
          <TouchableOpacity
            onPress={() => CheckLike(item)}
            style={styles.postLikesBlock}
          >
            <Text style={styles.postLikes}>{item.likes.length - 1}</Text>
            <AntDesign name="like2" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    const dataAboutUser = ref(
      database,
      'users/' + auth.currentUser.email.replace('.', ',')
    )
    onValue(dataAboutUser, (snapshot) => {
      setUserData(snapshot.val())
    })
  }, [])

  function TopProfileBlock() {
    return (
      <View style={styles.profileBlock}>
        <View style={styles.personBlock}>
          <Image
            source={require('../constants/user.png')}
            style={{ width: 70, height: 70 }}
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
            onPress={() => {
              setTemporaryProfileScreen('settings')
              setModalProfileVisible(true)
            }}
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
    )
  }

  function renderProfile(item) {
    if (item.item == 'Profile') {
      return <TopProfileBlock />
    } else {
      return (
        <FlatList
          style={{ width: '100%' }}
          data={item.item.reverse()}
          renderItem={(item) => RenderPosts(item)}
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={modalProfileVisible}
        transparent={true}
        animationType="none"
      >
        {temporaryProfileScreen == 'settings' ? (
          <SettingsProfile
            user={userData}
            onLogOut={() => logOut()}
            onClose={() => {
              setModalProfileVisible(false)
              setTemporaryProfileScreen(false)
            }}
          />
        ) : temporaryProfileScreen == 'post' ? (
          <PostCreator
            user={userData}
            onClose={() => {
              setModalProfileVisible(false)
              setTemporaryProfileScreen(false)
            }}
          />
        ) : (
          <></>
        )}
      </Modal>

      {/* <TopProfileBlock /> */}

      <View style={styles.postsBlock}>
        <FlatList
          style={{ width: '100%' }}
          data={['Profile', Object.values({ ...userData.posts })]}
          renderItem={renderProfile}
        />
      </View>
    </View>
  )
}

export default function ProfileScreen(props) {
  const [screen, setScreen] = useState('Profile')
  return (
    <>
      {screen == 'Profile' ? (
        <Profile
          onChange={(i) => props.onChange(i)}
          onNewScreen={(i) => setScreen(i)}
        />
      ) : (
        <></>
      )}
    </>
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
    marginBottom: 5,
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

  postsBlock: {
    width: '100%',
    alignSelf: 'center',
  },
  postView: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 15,
    marginTop: 5,
    padding: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  postText: {
    fontSize: 18,
    fontWeight: '400',
  },
  postTime: {
    fontSize: 14,
    fontWeight: '300',
  },
  postBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  postLikesBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.buttunActivePale,
  },
  postLikes: {
    fontSize: 20,
    marginRight: 10,
  },
})
