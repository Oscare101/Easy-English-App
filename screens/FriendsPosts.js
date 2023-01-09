import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ToastAndroid,
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

export default function FriendsPosts() {
  const [postsData, setPostsData] = useState({})

  useEffect(() => {
    const dataAboutUser = ref(database, 'posts/')
    onValue(dataAboutUser, (snapshot) => {
      setPostsData(snapshot.val())
    })
  }, [])

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

  function RenderPosts({ item }) {
    let userTime = getUserTime(item.time)
    return (
      <TouchableOpacity style={styles.postView}>
        <View>
          <Text>item</Text>
        </View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postText}>{item.text}</Text>
        <View style={styles.postBottom}>
          <Text style={styles.postTime}>{userTime}</Text>
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

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={Object.values({ ...postsData })}
        renderItem={RenderPosts}
      />
    </View>
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
