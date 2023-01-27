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
const database = getDatabase()

const textHeight = 18 // fot input
const numberOfLines = 5 // for input

const data = ['1', '2', '3', '4', '5']

export default function CurrentChat({ navigation }) {
  const [text, setText] = useState('')
  const [height, setHeight] = useState(textHeight * 2)
  const [currentChat, setCurrentChat] = useState()

  function createMessage() {
    let time = `${new Date().getUTCDate()}.${
      new Date().getUTCMonth() + 1
    }.${new Date().getUTCFullYear()} ${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`

    let days = new Date().getUTCDate().toString()
    let months = (new Date().getUTCMonth() + 1).toString()
    let hours = new Date().getUTCHours().toString()
    let minuts = new Date().getUTCMinutes().toString()
    let seconds = new Date().getUTCSeconds().toString()
    let miliDeconds = new Date().getUTCMilliseconds().toString()
    console.log(miliDeconds)
    let key = `${days.length == 1 ? '0' + days : days},${
      months.length == 1 ? '0' + months : months
    },${new Date().getUTCFullYear()}_${
      hours.length == 1 ? '0' + hours : hours
    }:${minuts.length == 1 ? '0' + minuts : minuts}:${
      seconds.length == 1 ? '0' + seconds : seconds
    }:${
      miliDeconds.length == 2 ? '0' + miliDeconds : miliDeconds
    } ${auth.currentUser.email.replace('.', ',')}`

    // const alphabet = [
    //   'A',
    //   'B',
    //   'C',
    //     'D',
    //     'E',
    //     'F',
    //     'G',
    //     'H',
    //     'I',
    //     'J',
    //     'K',
    //     'L',
    //     'M',
    //     'N',
    //     'O',
    //     'P',
    //     'Q',
    //     'R',
    //     'S',
    //     'T',
    //     'U',
    //     'V',
    //     'W',
    //     'X',
    //     'Y',
    //     'Z',
    // ]
    // let key

    // if (currentChat) {
    //   let lastKey = Object.values({ ...currentChat })
    //     .reverse()[0]
    //     .key.split('_')[0]
    //   let lastKeyLastLetter = lastKey.split('').reverse()[0]

    //   let indexEnd = alphabet.indexOf(lastKeyLastLetter)

    //   let newLastLetter
    //   let newKey
    //   if (indexEnd < alphabet.length - 1) {
    //     newLastLetter = alphabet[indexEnd + 1]
    //     newKey = lastKey.split('').reverse().pop() + newLastLetter
    //     key = `${newKey}_${auth.currentUser.email.replace('.', ',')}`
    //   } else {
    //     key = `${lastKey + alphabet[0]}_${auth.currentUser.email.replace(
    //       '.',
    //       ','
    //     )}`
    //   }

    //   let index = alphabet.indexOf(keyEnd)

    //   let lastKey = Object.values({ ...currentChat })
    //     .reverse()[0]
    //     .key.split('_')[0]
    //   let newKey
    //   let id =
    //     Object.values({ ...currentChat }).length > 0
    //       ? index < 25
    //               ? (newKey = lastKey.split('')
    //                 newKey[-1] =
    //               )
    //         : lastKey + 'A'
    //       : alphabet[0]
    //   key = `${id}_${auth.currentUser.email.replace('.', ',')}`
    //   console.log(keyEnd, lastKey, newKey)
    // } else {
    //   key = `${alphabet[0]}_${auth.currentUser.email.replace('.', ',')}`
    // }

    set(ref(database, `chats/GLOBALCHAT/` + key), {
      key: key,
      time: time,
      'author-email': auth.currentUser.email,
      text: text,
    })
    setText('')
  }

  function renderItem({ item }) {
    // console.log('===', item)
    return (
      <View>
        <Text>{item.text}</Text>
      </View>
    )
  }

  useEffect(() => {
    const dataChat = ref(database, `chats/GLOBALCHAT`)
    onValue(dataChat, (snapshot) => {
      setCurrentChat(snapshot.val())
      //   console.log(snapshot.val())
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.chatBlock}>
        <FlatList
          data={Object.values({ ...currentChat }).reverse()}
          inverted={true}
          renderItem={renderItem}
        />
      </View>
      <View style={[styles.inputBlock, { height: height }]}>
        <TextInput
          multiline={true}
          maxLines={5}
          style={styles.input}
          value={text}
          placeholder="type a message"
          onChangeText={(text) => setText(text)}
          onContentSizeChange={(event) => {
            const height =
              Platform.OS === 'ios'
                ? event.nativeEvent.contentSize.height
                : event.nativeEvent.contentSize.height - 0
            const lines = Math.round(height / textHeight)
            const visibleLines = lines < numberOfLines ? lines : numberOfLines
            const visibleHeight = textHeight * (visibleLines + 1)
            setHeight(visibleHeight)
          }}
        />
        <TouchableOpacity onPress={() => createMessage()}>
          <FontAwesome name="send-o" size={30} color="black" />
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
  inputBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    alignItems: 'center',
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
