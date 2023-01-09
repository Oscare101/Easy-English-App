import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
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
import colors from '../constants/colors'

export default function FriendsListScreen() {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const dataAboutUser = ref(
      database,
      'users/' + auth.currentUser.email.replace('.', ',')
    )
    onValue(dataAboutUser, (snapshot) => {
      setUserData(snapshot.val())
      console.log('===', snapshot.val().friends)
    })
  }, [])

  function renderFriends(friends) {
    console.log(friends)
    return (
      <View>
        <Text>yujk</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>Friends</Text>
      <FlatList
        data={[Object.values({ ...userData.friends })]}
        renderItem={renderFriends}
      />
    </View>
  )
}
