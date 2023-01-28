import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
  ToastAndroid,
  Image,
  Alert,
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
  const [theme, setTheme] = useState(props.theme)
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

  function renderItem({ item }) {
    return (
      <Pressable
        onPress={() => {
          setTemporaryProfileScreen(item.path)
          setModalProfileVisible(true)
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? props.theme == 'white'
                ? colors.buttunActivePale
                : colors.themeDarkBG
              : props.theme == 'white'
              ? colors.themeWhiteBG
              : colors.themeDarkBGPale,
          },
          styles.underProfileItem,
        ]}
      >
        {({ pressed }) => (
          <>
            <Ionicons
              name={item.icon}
              size={30}
              color={
                pressed
                  ? props.theme == 'white'
                    ? colors.themeWhiteTextPale
                    : colors.themeDarkTextPale
                  : props.theme == 'white'
                  ? colors.themeWhiteComment
                  : colors.themeDarkComment
              }
            />
            <Text
              style={[
                styles.underProfileText,
                {
                  color: pressed
                    ? props.theme == 'white'
                      ? colors.themeWhiteTextPale
                      : colors.themeDarkText
                    : props.theme == 'white'
                    ? colors.themeWhiteComment
                    : colors.themeDarkComment,
                },
              ]}
            >
              {item.text}
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
        onLongPress={() => {
          Alert.alert('Delete', 'Are you sure you want to delete this post?', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => Delete(item.key),
              style: 'cancel',
            },
          ])
        }}
        style={[
          styles.postView,
          {
            borderColor:
              props.theme == 'white'
                ? colors.themeWhiteLine
                : colors.themeDarkLine,
          },
        ]}
      >
        <Text
          style={[
            styles.postTitle,
            { color: props.theme == 'white' ? colors.dark : colors.white },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.postText,
            { color: props.theme == 'white' ? colors.dark : colors.white },
          ]}
        >
          {item.text}
        </Text>
        <View style={styles.postBottom}>
          <Text
            style={[
              styles.postTime,
              {
                color:
                  props.theme == 'white'
                    ? colors.themeWhiteComment
                    : colors.themeDarkComment,
              },
            ]}
          >
            {item.time}
          </Text>
          <TouchableOpacity
            onPress={() => CheckLike(item)}
            style={styles.postLikesBlock}
          >
            <Text
              style={[
                styles.postLikes,
                {
                  color: props.theme == 'white' ? colors.dark : colors.white,
                },
              ]}
            >
              {item.likes.length - 1}
            </Text>
            <Ionicons
              name="md-heart-outline"
              size={20}
              color={props.theme == 'white' ? colors.dark : colors.white}
            />
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
      <View
        style={[
          styles.profileBlock,
          {
            backgroundColor:
              props.theme == 'white'
                ? colors.themeWhiteBGPale
                : colors.themeDarkBGPale,
          },
        ]}
      >
        <View
          style={[
            styles.personBlock,
            {
              borderColor:
                props.theme == 'white'
                  ? colors.themeWhiteLine
                  : colors.themeDarkLine,
            },
          ]}
        >
          <Image
            source={require('../constants/user.png')}
            style={{ width: 70, height: 70 }}
          />
          <View style={styles.nameBlock}>
            <Text
              style={[
                styles.name,
                {
                  color: props.theme == 'white' ? colors.black : colors.white,
                },
              ]}
            >
              {userData['user-name']}
            </Text>
            <Text
              style={[
                styles.email,
                {
                  color:
                    props.theme == 'white'
                      ? colors.themeWhiteComment
                      : colors.themeDarkComment,
                },
              ]}
            >
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
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    props.theme == 'white' ? colors.dark : colors.white,
                },
              ]}
            />
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    props.theme == 'white' ? colors.dark : colors.white,
                },
              ]}
            />
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    props.theme == 'white' ? colors.dark : colors.white,
                },
              ]}
            />
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
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            props.theme == 'white' ? colors.themeWhiteBG : colors.themeDarkBG,
        },
      ]}
    >
      <Modal
        visible={modalProfileVisible}
        transparent={true}
        animationType="none"
      >
        {temporaryProfileScreen == 'settings' ? (
          <SettingsProfile
            user={userData}
            theme={props.theme}
            changeTheme={props.changeTheme}
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
          theme={props.theme}
          changeTheme={props.changeTheme}
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
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    // borderWidth: 1,
    // borderColor: colors.buttunActivePale,
  },
  postLikes: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: '300',
  },
})
