import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../constants/colors'

import { auth } from '../firebase-config'
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

export default function PostCreator(props) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState(false)

  function CreatePost() {
    if (title.replace(' ', '').length == 0) {
      setError('Type a title for your post')
    } else if (text.replace(' ', '').length == 0) {
      setError('Type a text for your post')
    } else {
      // console.log(new Date().getTimezoneOffset())

      let time = `${new Date().getUTCDate()}.${
        new Date().getUTCMonth() + 1
      }.${new Date().getUTCFullYear()} ${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`

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

      set(ref(database, 'posts/' + key), {
        key: key,
        time: time,
        'author-email': auth.currentUser.email,
        title: title,
        text: text,
        likes: ['-'],
      })
      set(
        ref(
          database,
          `users/${auth.currentUser.email.replace('.', ',')}/posts/` + key
        ),
        {
          key: key,
          time: time,
          'author-email': auth.currentUser.email,
          title: title,
          text: text,
          likes: ['-'],
        }
      )
      setText('')
      setTitle('')
      props.onClose()
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: props.theme == 'white' ? '#66666699' : '#00000099' },
      ]}
    >
      <View style={[styles.block]}>
        <View
          style={[
            styles.bigBlock,
            {
              backgroundColor:
                props.theme == 'white' ? '#fff' : colors.themeDarkBG,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => props.onClose()}
            style={styles.closeButton}
          >
            <Ionicons
              name="ios-close-outline"
              size={35}
              color={props.theme == 'white' ? colors.dark : colors.white}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.title,
              { color: props.theme == 'white' ? colors.dark : colors.white },
            ]}
          >
            Create a new post
          </Text>
          <View style={styles.contentInput}>
            <View style={styles.contentInputBlock}>
              <Text
                style={{
                  color: props.theme == 'white' ? colors.dark : colors.white,
                }}
              >
                Title:
              </Text>
              <View
                style={[
                  styles.postItem,
                  {
                    backgroundColor:
                      props.theme == 'white'
                        ? colors.buttunActivePale
                        : colors.themeDarkBGPale,
                  },
                ]}
              >
                <TextInput
                  placeholderTextColor={
                    props.theme == 'white'
                      ? colors.themeWhiteComment
                      : colors.themeDarkComment
                  }
                  blurOnSubmit={true}
                  value={title}
                  placeholder="Title"
                  style={[
                    styles.postText,
                    {
                      color:
                        props.theme == 'white'
                          ? colors.themeWhiteTextPale
                          : colors.themeDarkText,
                      width: '100%',
                      padding: 5,
                    },
                  ]}
                  onChangeText={(text) => {
                    setTitle(text)
                    setError(false)
                  }}
                />
              </View>
              <Text
                style={{
                  color: props.theme == 'white' ? colors.dark : colors.white,
                }}
              >
                Text:
              </Text>
              <View
                style={[
                  styles.postItem,
                  {
                    backgroundColor:
                      props.theme == 'white'
                        ? colors.buttunActivePale
                        : colors.themeDarkBGPale,
                    flex: 1,
                  },
                ]}
              >
                <TextInput
                  placeholderTextColor={
                    props.theme == 'white'
                      ? colors.themeWhiteComment
                      : colors.themeDarkComment
                  }
                  scrollEnabled={true}
                  editable
                  maxLength={1000}
                  multiline
                  onChangeText={(text) => {
                    setError(false)
                    setText(text)
                  }}
                  value={text}
                  placeholder="type some text here"
                  style={[
                    styles.postText,
                    {
                      color:
                        props.theme == 'white'
                          ? colors.themeWhiteTextPale
                          : colors.themeDarkText,
                      flex: 1,
                      margin: 5,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.contentSubmit}>
              {error ? <Text style={styles.error}>{error}</Text> : <></>}
              <LinearGradient
                // Button Linear Gradient
                start={[0, 0]}
                end={[1, 1]}
                location={[0.25, 0.4, 1]}
                colors={[colors.gradientBlack1, colors.gradientBlack2]}
                style={styles.buttonSubmit}
              >
                <TouchableOpacity
                  onPress={() => {
                    CreatePost()
                  }}
                  activeOpacity={0.8}
                  style={styles.touch}
                >
                  <Text style={styles.buttonSubmitText}>Post</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  block: {
    width: '80%',
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bigBlock: {
    borderRadius: 15,
    padding: 25,
    flex: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: 1,
    width: '80%',
  },
  contentInput: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentInputBlock: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contentSubmit: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    fontSize: 14,
    color: colors.red,
  },

  postItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 2,
    padding: 2,
    borderRadius: 10,
    width: '100%',
  },
  postText: {
    fontSize: 18,
    color: '#6D6C73',
  },

  buttonSubmit: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,

    marginTop: 5,
  },
  buttonSubmitText: {
    color: '#fff',
    fontSize: 20,
    letterSpacing: 1,
  },
  touch: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  comment: {
    color: '#666',
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
  },
})
