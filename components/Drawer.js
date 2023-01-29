import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../constants/colors'

export default function Drawer(props) {
  const dataFlatList = [
    { type: 'profile', text: 'Profile', icon: 'grid-outline', path: 'Profile' },
    {
      type: 'profile',
      text: 'Friends posts',
      icon: 'newspaper-outline',
      path: 'FriendsPosts',
    },
    {
      type: 'profile',
      text: 'Friends',
      icon: 'people-circle-outline',
      path: 'FrinedsListScreen',
    },
    {
      type: 'profile',
      text: 'Chat',
      icon: 'chatbox-ellipses-outline',
      path: 'GlobalChatScreen',
    },
    { type: 'line' },
    {
      type: 'lesson',
      text: 'Theory',
      icon: 'book-outline',
      path: 'Theory',
      activeBG: colors.redPale,
      activeColor: colors.redActivePale,
      darBG: colors.darkRed,
      darkActive: colors.darkRedActive,
    },
    {
      type: 'lesson',
      text: 'Tests',
      icon: 'ios-shield-checkmark-outline',
      path: 'Tests',
      activeBG: colors.bluePale,
      activeColor: colors.blueActivePale,
      darBG: colors.darkBlue,
      darkActive: colors.darkBlueActive,
    },
    {
      type: 'lesson',
      text: 'Certificates',
      icon: 'star-outline',
      path: 'Certificates',
      activeBG: colors.greenPale,
      activeColor: colors.greenActivePale,
      darBG: colors.darkGreen,
      darkActive: colors.darkGreenActive,
    },
    { type: 'line' },
  ]

  function renderItem({ item }) {
    if (item.type == 'profile') {
      return (
        <Pressable
          onPress={() => props.setScreen(item.path)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? props.theme == 'white'
                  ? colors.buttunActivePale
                  : colors.themeDarkBGPale
                : props.theme == 'white'
                ? colors.themeWhiteBG
                : colors.themeDarkBG,
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
                      : colors.themeDarkText
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
                {item.text}
              </Text>
            </>
          )}
        </Pressable>
      )
    } else if (item.type == 'line') {
      return (
        <View
          style={[
            styles.line,
            {
              backgroundColor:
                props.theme == 'white'
                  ? colors.themeWhiteLine
                  : colors.themeDarkLine,
            },
          ]}
        />
      )
    } else if (item.type == 'lesson') {
      return (
        <Pressable
          onPress={() => props.setScreen(item.path)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? props.theme == 'white'
                  ? item.activeBG
                  : `${item.darBG}33`
                : '#ffffff00',
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
                      ? `${item.activeColor}`
                      : item.darkActive
                    : props.theme == 'white'
                    ? `${item.activeColor}`
                    : `${item.darkActive}99`
                }
              />
              <Text
                style={[
                  styles.underProfileText,
                  {
                    color: pressed
                      ? props.theme == 'white'
                        ? `${item.activeColor}`
                        : item.darkActive
                      : props.theme == 'white'
                      ? `${item.activeColor}`
                      : `${item.darkActive}99`,
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
      <View style={styles.underProfileBlock}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          data={dataFlatList}
          renderItem={renderItem}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
  },
  button: {
    width: '90%',
    padding: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F6F6F6',
    marginTop: 7,
  },
  buttunText: {
    fontSize: 20,
    color: '#424244',
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
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  underProfileText: {
    fontSize: 20,
    color: '#79768a',
    marginLeft: 10,
  },

  line: {
    width: '100%',
    height: 2,
    borderRadius: 5,
    marginVertical: 10,
  },
})
