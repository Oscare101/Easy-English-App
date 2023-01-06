import React, { useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import colors from '../constants/colors'

const dataFlatList = [
  { text: 'Personal information', icon: '' },
  { text: 'Privacy', icon: '' },
  { text: 'Friends', icon: '' },
]

export default function SettingsProfile(props) {
  const [currentSettings, setCurrentSettings] = useState('main')

  function renderItem(item) {
    return (
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? colors.buttunActivePale : '#fff',
          },
          styles.settingItem,
        ]}
      >
        {({ pressed }) => (
          <>
            <Ionicons
              name={item.item.icon}
              size={30}
              color={pressed ? '#232325' : '#6D6C73'}
            />
            <Text
              style={[
                styles.settingText,
                { color: pressed ? '#232325' : '#6D6C73' },
              ]}
            >
              {item.item.text}
            </Text>
          </>
        )}
      </Pressable>
    )
  }

  const main = (
    <>
      <View style={styles.settingsMenuBlock}>
        <Text style={styles.title}>Settings</Text>
        <FlatList
          style={{ width: '100%' }}
          data={dataFlatList}
          renderItem={renderItem}
        />
        <TouchableOpacity
          onPress={() => props.onClose()}
          style={styles.closeButton}
        >
          <Ionicons name="ios-close-outline" size={35} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.logOutBlock}>
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
        <Text style={styles.comment}>
          All your data is stored on the server. You can log into your account
          at any time
        </Text>
      </View>
    </>
  )
  console.log(currentSettings)

  let content = currentSettings == 'main' ? main : <></>

  return (
    <View style={styles.container}>
      <View style={styles.block}>{content}</View>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderRadius: 5,
    padding: 25,
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    letterSpacing: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  logOutBlock: {
    width: '100%',
    height: 110,
    marginTop: 5,
    backgroundColor: '#fff',
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
})
