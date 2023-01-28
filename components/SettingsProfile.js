import React, { useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
  TextInput,
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

const dataFlatList = [
  { text: 'Personal information', icon: '', path: 'personal' },
  { text: 'Privacy', icon: '', path: 'main' },
  { text: 'Friends', icon: '', path: 'main' },
]

export default function SettingsProfile(props) {
  const [theme, setTheme] = useState(props.theme)
  const [currentSettings, setCurrentSettings] = useState('main')
  const [name, setName] = useState(props.user['user-name'])
  const [age, setAge] = useState(props.user['user-age'])

  function setData(newName, newAge) {
    update(ref(database, 'users/' + auth.currentUser.email.replace('.', ',')), {
      'user-name': newName,
      'user-icon': '',
      'user-age': newAge,
    })
  }

  function renderItem({ item }) {
    console.log(theme)
    return (
      <Pressable
        onPress={() => setCurrentSettings(item.path)}
        style={({ pressed }) => [
          styles.settingItem,
          {
            backgroundColor: pressed
              ? theme == 'white'
                ? colors.buttunActivePale
                : colors.themeDarkBGPale
              : theme == 'white'
              ? colors.themeWhiteBG
              : colors.themeDarkBG,
          },
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
                styles.settingText,
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

  function Main() {
    return (
      <>
        <View
          style={[
            styles.settingsMenuBlock,
            { backgroundColor: theme == 'white' ? '#fff' : colors.themeDarkBG },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: theme == 'white' ? colors.dark : colors.white },
            ]}
          >
            Settings
          </Text>

          <FlatList
            style={{ width: '100%' }}
            data={dataFlatList}
            renderItem={renderItem}
          />
          <TouchableOpacity
            onPress={() => props.onClose()}
            style={styles.closeButton}
          >
            <Ionicons
              name="ios-close-outline"
              size={35}
              color={theme == 'white' ? colors.dark : colors.white}
            />
          </TouchableOpacity>
          <View style={styles.themeBlock}>
            <TouchableOpacity
              onPress={() => {
                setTheme('white')
                props.changeTheme('white')
              }}
              style={[styles.themeButton, { backgroundColor: '#fff' }]}
            >
              <Ionicons
                name={theme == 'white' ? 'sunny' : 'sunny-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTheme('dark')
                props.changeTheme('dark')
              }}
              style={[styles.themeButton, { backgroundColor: '#3c3f4a' }]}
            >
              <Ionicons
                name={theme == 'dark' ? 'moon' : 'moon-outline'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.logOutBlock,
            { backgroundColor: theme == 'white' ? '#fff' : colors.themeDarkBG },
          ]}
        >
          <LinearGradient
            // Button Linear Gradient

            start={[0, 0]}
            end={[1, 1]}
            location={[0.25, 0.4, 1]}
            colors={[colors.gradientBlack1, colors.gradientBlack2]}
            style={styles.buttonLogOut}
          >
            <TouchableOpacity
              onPress={() => {
                props.onLogOut()
              }}
              activeOpacity={0.8}
              style={styles.touch}
            >
              <Text style={styles.buttonLogOutText}>Log Out</Text>
            </TouchableOpacity>
          </LinearGradient>
          <Text
            style={[
              styles.comment,
              {
                color:
                  theme == 'white'
                    ? colors.themeWhiteComment
                    : colors.themeDarkComment,
              },
            ]}
          >
            All your data is stored on the server. You can log into your account
            at any time
          </Text>
        </View>
      </>
    )
  }

  function Personal(props) {
    const [newName, setNewName] = useState(props.user['user-name'])
    const [newAge, setNewAge] = useState(props.user['user-age'])

    // console.log(props)
    return (
      <View style={styles.bigBlock}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setName(newName)
              setAge(newAge)
              setData(newName, newAge)
              setCurrentSettings('main')
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Personal information</Text>
        </View>

        <Text>Name:</Text>
        <View
          style={[
            styles.settingItem,
            { backgroundColor: colors.buttunActivePale, height: 35 },
          ]}
        >
          <TextInput
            blurOnSubmit={true}
            value={newName}
            placeholder="name"
            style={[styles.settingText, { color: '#000', width: '100%' }]}
            onChangeText={(text) => setNewName(text)}
          />
        </View>
        <Text>Email:</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              'You cannot change your email',
              ''[{ text: 'OK', onPress: () => {} }]
            )
          }}
          style={[
            styles.settingItem,
            { backgroundColor: colors.buttunActivePale, height: 35 },
          ]}
        >
          <Text style={styles.settingText}>{props.user['user-email']}</Text>
        </TouchableOpacity>
        <Text>Age:</Text>
        <View
          style={[
            styles.settingItem,
            { backgroundColor: colors.buttunActivePale, height: 35 },
          ]}
        >
          <TextInput
            value={newAge}
            placeholder="age"
            keyboardType="number-pad"
            style={[styles.settingText, { color: '#000', width: '100%' }]}
            onChangeText={(num) => setNewAge(num)}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        {currentSettings == 'main' ? <Main /> : <Personal user={props.user} />}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66666699',
  },
  block: {
    width: '80%',
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  settingsMenuBlock: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderRadius: 5,
    padding: 25,
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    letterSpacing: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  bigBlock: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  logOutBlock: {
    width: '100%',
    height: 110,
    marginTop: 5,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonLogOut: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonLogOutText: {
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

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 2,
    padding: 2,
    borderRadius: 10,
    width: '100%',
  },
  settingText: {
    fontSize: 18,
    color: '#6D6C73',
    marginLeft: 10,
  },

  // theme

  themeBlock: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#666',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    overflow: 'hidden',
  },
  themeButton: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
})
