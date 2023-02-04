import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ToastAndroid,
  Easing,
} from 'react-native'
import colors from '../constants/colors'
import getUserTime from '../components/getUserTime'
import { Ionicons, AntDesign } from '@expo/vector-icons'

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
import { collection, getDocs } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase-config'

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import FriendProfileScreen from './FriendProfileScreen'
const Stack = createStackNavigator()

const timingConfig = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.linear,
  },
}

export default function FriendsPosts(props) {
  const [postsData, setPostsData] = useState({})
  const [userTo, setUserTo] = useState('')

  useEffect(() => {
    const dataAboutUser = ref(database, 'posts/')
    onValue(dataAboutUser, (snapshot) => {
      setPostsData(snapshot.val())
    })
  }, [])

  function PostsViewFunc({ navigation }) {
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
          `users/${item['author-email'].replace('.', ',')}/posts/` + item.key
        ),
        {
          likes: newLikes,
        }
      )
    }

    function RenderPosts({ item }) {
      // let userTime = getUserTime(item.time)
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => {
            if (item['author-email'] != auth.currentUser.email) {
              setUserTo(item['author-email'])
              navigation.navigate('FriendProfileScreen')
            }
          }}
          style={[
            styles.postView,
            {
              backgroundColor:
                props.theme == 'white'
                  ? colors.themeWhiteBG
                  : colors.themeDarkBG,
              borderColor:
                props.theme == 'white'
                  ? colors.themeWhiteLine
                  : colors.themeDarkLine,
            },
          ]}
        >
          <View>
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
              {item['author-email']}
            </Text>
          </View>
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
        <FlatList
          style={{ width: '100%' }}
          data={Object.values({ ...postsData }).reverse()}
          renderItem={RenderPosts}
        />
      </View>
    )
  }

  function FriendProfileScreenFunc() {
    return <FriendProfileScreen theme={props.theme} user={userTo} />
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostsViewFunc"
        component={PostsViewFunc}
        options={{
          headerShown: false,
          //   headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="FriendProfileScreen"
        component={FriendProfileScreenFunc}
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: timingConfig,
            close: timingConfig,
          },
        }}
      />
      {/* <Stack.Screen
        name="QuestionsChat"
        component={QuestionsChatBuf}
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: timingConfig,
            close: timingConfig,
          },
        }}
      /> */}
    </Stack.Navigator>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },

  postsBlock: {
    width: '100%',
    alignSelf: 'center',
  },
  postView: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
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
