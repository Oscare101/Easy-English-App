import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, StyleSheet, Pressable } from 'react-native'
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
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function FriendsListScreen(props) {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const dataAboutUser = ref(
      database,
      'users/' + auth.currentUser.email.replace('.', ',')
    )
    onValue(dataAboutUser, (snapshot) => {
      setUserData(snapshot.val())
    })
  }, [])

  function renderFriends(friends) {
    let friendsArr = friends
    delete friendsArr.separators

    function renderFriend(friend) {
      return (
        <View
          style={[
            styles.friendBlock,
            {
              borderColor:
                props.theme == 'white'
                  ? colors.themeWhiteLine
                  : colors.themeDarkBGPale,
            },
          ]}
        >
          <Text
            style={[
              styles.name,
              { color: props.theme == 'white' ? colors.dark : colors.white },
            ]}
          >
            {friend.item.name}
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
            {friend.item.email}
          </Text>
          {/* <Text>{friend.item['chat-id']}</Text> */}

          <View style={styles.buttonGroup}>
            <Pressable
              onPress={() => {
                console.log('qwert')
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
                styles.touch,
              ]}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.buttonText,
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
                  Chat
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                console.log('qwert')
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
                styles.touch,
              ]}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.buttonText,
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
                  Profile
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )
    }

    return (
      <FlatList
        data={Object.values(friendsArr)[0].filter((i) => i != '-')}
        renderItem={renderFriend}
      />
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
        data={[Object.values({ ...userData.friends })]}
        renderItem={renderFriends}
      />
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
  friendBlock: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 5,
    padding: 10,
  },
  name: { fontSize: 18 },
  email: { color: '#666' },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    padding: 5,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  touch: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',

    marginVertical: 2,
    padding: 5,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#6D6C73',
    marginLeft: 10,
  },
})
