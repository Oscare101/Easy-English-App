import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
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
import colors from '../constants/colors'
const database = getDatabase()

const textHeight = 18 // fot input
const numberOfLines = 5 // for input

export default function MainChat(props) {
  const [text, setText] = useState('')
  const [height, setHeight] = useState(textHeight * 2)
  const [currentChat, setCurrentChat] = useState()
  const [userName, setUserName] = useState('')

  function createMessage() {
    // if (text.replace(' ', '')) return false
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

    set(ref(database, `chats/${props.DBPath}/` + key), {
      key: key,
      time: time,
      'author-email': auth.currentUser.email,
      'author-name': userName,

      text: text,
    })
    setText('')
  }

  function renderItem({ item }) {
    const myMessage = (
      <View
        style={[
          styles.messageItem,
          {
            alignSelf: 'flex-end',
            backgroundColor: `${props.myMessageColor}66`,
            borderBottomRightRadius: 0,
          },
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    )
    const otherMessage = (
      <View
        style={[
          styles.messageItem,
          {
            alignSelf: 'flex-start',
            backgroundColor: `${colors.bluePale}66`,
            borderBottomLeftRadius: 0,
          },
        ]}
      >
        <Text style={styles.messageName}>{item['author-name']}</Text>
        <Text style={styles.messageText}>{item.text}</Text>

        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    )

    return (
      <>
        {item['author-email'] == auth.currentUser.email
          ? myMessage
          : otherMessage}
      </>
    )
  }

  useEffect(() => {
    const dataChat = ref(database, `chats/${props.DBPath}`)
    onValue(dataChat, (snapshot) => {
      setCurrentChat(snapshot.val())
      //   console.log(snapshot.val())
    })

    const dataAboutUser = ref(
      database,
      'users/' + auth.currentUser.email.replace('.', ',')
    )
    onValue(dataAboutUser, (snapshot) => {
      setUserName(snapshot.val()['user-name'])
      // console.log(snapshot.val()['user-name'])
    })
  }, [])

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            props.theme == 'white'
              ? colors.themeWhiteBG
              : colors.themeDarkBGPale,
        },
      ]}
    >
      <View
        style={[
          styles.chatBlock,
          {
            backgroundColor:
              props.theme == 'white'
                ? colors.themeWhiteBG
                : colors.themeDarkBGPale,
          },
        ]}
      >
        <FlatList
          data={Object.values({ ...currentChat }).reverse()}
          inverted={true}
          renderItem={renderItem}
        />
      </View>
      <View
        style={[
          styles.inputBlock,
          {
            backgroundColor:
              props.theme == 'white' ? colors.themeWhiteBG : colors.themeDarkBG,
            height: height,
          },
        ]}
      >
        <TextInput
          multiline={true}
          maxLines={5}
          style={[
            styles.input,
            {
              backgroundColor:
                props.theme == 'white'
                  ? colors.themeWhiteBG
                  : colors.themeDarkBGPale,
              color: props.theme == 'white' ? colors.dark : colors.white,
            },
          ]}
          value={text}
          placeholder="type a message"
          placeholderTextColor={
            props.theme == 'white'
              ? colors.themeWhiteComment
              : colors.themeDarkComment
          }
          onChangeText={(text) => setText(text)}
          onContentSizeChange={(event) => {
            const height = event.nativeEvent.contentSize.height + 10
            const lines = Math.round(height / textHeight)
            const visibleLines = lines < numberOfLines ? lines : numberOfLines
            const visibleHeight = textHeight * (visibleLines + 1)
            setHeight(visibleHeight)
          }}
        />
        <TouchableOpacity onPress={() => createMessage()}>
          <FontAwesome
            name="send-o"
            size={30}
            color={props.theme == 'white' ? colors.dark : colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chatBlock: {
    flex: 1,
    backgroundColor: '#fff',
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
  },

  // messages

  messageItem: {
    width: '80%',
    backgroundColor: 'red',
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  messageName: {
    fontSize: 14,
  },
  messageText: {
    fontSize: 20,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '300',
  },

  // input

  inputBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    alignItems: 'center',
    backgroundColor: `${colors.purplePale}33`,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    marginRight: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: textHeight,
    // height: textHeight * 2,
  },
})
