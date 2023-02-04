import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from 'react-native'
import colors from '../constants/colors'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
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
import { auth, db } from '../firebase-config'

export default function FriendProfileScreen(props) {
  const isFocused = useIsFocused()
  const [userData, setUserData] = useState({})
  const [dataFlatList, setDataFlatList] = useState([
    {
      textIfNotAFriend: 'Ask to be a friend',
      textIfAFriend: 'You are frineds',
      icon: 'people-outline',
      path: 'friend',
    },
  ])

  function renderItem({ item }) {
    return (
      <Pressable
        onPress={() => {
          //   console.log(userData.friends.includes(auth.currentUser.email))
          if (item.path == 'friend') {
            let exit = false
            if (userData.friends.includes(auth.currentUser.email)) {
              ToastAndroid.showWithGravity(
                'You are already friends',
                ToastAndroid.BOTTOM,
                ToastAndroid.LONG
              )
              return false
            } else {
              Object.values(userData.notifications).map((i) => {
                if (
                  i.status == 'friend request' &&
                  i['friend-email'] == auth.currentUser.email
                ) {
                  // console.log(i)
                  ToastAndroid.showWithGravity(
                    'You have already sent a request',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.LONG
                  )
                  exit = true
                  return false
                }
              })
              if (!exit) {
                let days = new Date().getUTCDate().toString()
                let months = (new Date().getUTCMonth() + 1).toString()
                let hours = new Date().getUTCHours().toString()
                let minuts = new Date().getUTCMinutes().toString()
                let seconds = new Date().getUTCSeconds().toString()
                let miliDeconds = new Date().getUTCMilliseconds().toString()
                let key = `${days.length == 1 ? '0' + days : days},${
                  months.length == 1 ? '0' + months : months
                },${new Date().getUTCFullYear()}_${
                  hours.length == 1 ? '0' + hours : hours
                }:${minuts.length == 1 ? '0' + minuts : minuts}:${
                  seconds.length == 1 ? '0' + seconds : seconds
                }:${
                  miliDeconds.length == 2 ? '0' + miliDeconds : miliDeconds
                } ${auth.currentUser.email.replace('.', ',')}`
                update(
                  ref(
                    database,
                    `users/${props.user.replace('.', ',')}/notifications/` + key
                  ),
                  {
                    status: 'friend request',
                    'friend-email': auth.currentUser.email,
                    time: new Date().toDateString(),
                  }
                )
                update(
                  ref(
                    database,
                    `users/${auth.currentUser.email.replace(
                      '.',
                      ','
                    )}/notifications/` + key
                  ),
                  {
                    status: 'sending friend request',
                    'friend-email': props.user,
                    time: new Date().toDateString(),
                  }
                )
              }
            }
          }
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
              {item.textIfNotAFriend}
            </Text>
          </>
        )}
      </Pressable>
    )
  }
  function CheckLike(item) {
    let newLikes = item.likes

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
      ref(database, `users/${props.user.replace('.', ',')}/posts/` + item.key),
      {
        likes: newLikes,
      }
    )
  }
  function RenderPosts({ item }) {
    // let userTime = getUserTime(item.time)

    return (
      <TouchableOpacity
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
              name={
                item.likes.includes(auth.currentUser.email)
                  ? 'md-heart'
                  : 'md-heart-outline'
              }
              size={20}
              color={props.theme == 'white' ? colors.dark : colors.white}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
              {props.user}
              {/* {auth.currentUser.metadata.lastSignInTime
                .split(' ')
                .splice(1, 3)
                .join(' ')} */}
            </Text>
          </View>
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
  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      const dataAboutUser = ref(
        database,
        'users/' + props.user.replace('.', ',')
      )
      onValue(dataAboutUser, (snapshot) => {
        setUserData(snapshot.val())
      })
    }
  }, [isFocused])

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
