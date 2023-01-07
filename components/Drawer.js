import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../constants/colors'

export default function Drawer(props) {
  const dataFlatList = [
    { text: 'Profile', icon: '', path: 'Profile' },
    // { text: 'Global chats', icon: '' },
    { text: 'Friends posts', icon: '', path: 'FriendsPosts' },
  ]

  function renderItem(item) {
    return (
      <Pressable
        onPress={() => props.setScreen(item.item.path)}
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
              name={item.item.icon}
              size={30}
              color={pressed ? '#232325' : '#6D6C73'}
            />
            <Text
              style={[
                styles.underProfileText,
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

  return (
    <View style={styles.container}>
      <View style={styles.underProfileBlock}>
        <FlatList
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
    padding: 5,
    borderRadius: 10,
    width: '100%',
  },
  underProfileText: {
    fontSize: 20,
    color: '#6D6C73',
    marginLeft: 10,
  },
})
