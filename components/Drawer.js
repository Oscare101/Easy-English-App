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
    },
    {
      type: 'lesson',
      text: 'Tests',
      icon: 'ios-shield-checkmark-outline',
      path: 'Tests',
      activeBG: colors.bluePale,
      activeColor: colors.blueActivePale,
    },
    {
      type: 'lesson',
      text: 'Certificates',
      icon: 'star-outline',
      path: 'Certificates',
      activeBG: colors.greenPale,
      activeColor: colors.greenActivePale,
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
              backgroundColor: pressed ? colors.buttunActivePale : '#fff',
            },
            styles.underProfileItem,
          ]}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name={item.icon}
                size={30}
                color={pressed ? '#232325' : '#76808a'}
              />
              <Text
                style={[
                  styles.underProfileText,
                  { color: pressed ? '#232325' : '#76808a' },
                ]}
              >
                {item.text}
              </Text>
            </>
          )}
        </Pressable>
      )
    } else if (item.type == 'line') {
      return <View style={styles.line} />
    } else if (item.type == 'lesson') {
      return (
        <Pressable
          onPress={() => props.setScreen(item.path)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? item.activeBG : '#fff',
            },
            styles.underProfileItem,
          ]}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name={item.icon}
                size={30}
                color={pressed ? item.activeColor : `${item.activeColor}bb`}
              />
              <Text
                style={[
                  styles.underProfileText,
                  {
                    color: pressed ? item.activeColor : `${item.activeColor}bb`,
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
    <View style={styles.container}>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#aaa',
    marginVertical: 10,
  },
})
