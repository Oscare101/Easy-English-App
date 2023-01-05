import React, { useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileScreen(props) {
  const dataFlatList = [
    { text: 'Create a new post', icon: 'add-circle-outline' },
    { text: 'Open chats', icon: 'chatbubble-ellipses-outline' },
    { text: 'Settings', icon: 'settings-outline' },
  ]

  function renderItem(item) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#F6F6F6' : '#fff',
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
      <View style={styles.profileBlock}>
        <View style={styles.personBlock}>
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 50,
              backgroundColor: '#666',
            }}
          />
          <View style={styles.nameBlock}>
            <Text style={styles.name}>Kyryl</Text>
            <Text style={styles.email}>123@gmail.com</Text>
          </View>
          <TouchableOpacity
            onPress={() => props.onChange('login')}
            style={styles.botBlock}
          >
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
        <View style={styles.underProfileBlock}>
          <FlatList
            style={{ width: '100%' }}
            data={dataFlatList}
            renderItem={renderItem}
          />
        </View>
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

  profileBlock: {
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 20,
  },
  personBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
    padding: 20,
    height: 100,
  },
  nameBlock: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    paddingLeft: 20,
  },
  name: {
    fontSize: 26,
  },
  email: {
    color: '#666',
    fontWeight: '300',
  },
  botBlock: {
    flexDirection: 'column',
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginTop: 3,
    backgroundColor: '#111',
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
