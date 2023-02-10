import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import colors from '../constants/colors'

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
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase-config'

const filterData = [
  { name: 'Requests', active: '#74cf8c', status: 'friend request' },
  { name: 'Courses', active: '#74cf8c', status: 'course' },
  { name: 'Sent', active: '#74cf8c', status: 'sent friend request' },
]

export default function NotificationsScreen(props) {
  const [filters, setFilters] = useState([])
  const [notificationData, setNotificationData] = useState({})
  function RenderFilter({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (filters.includes(item)) {
            setFilters(filters.filter((i) => i != item))
          } else {
            setFilters([...filters, item])
          }
        }}
        style={[
          styles.filterButton,
          {
            backgroundColor: filters.includes(item) ? item.active : '#dae0e066',
          },
        ]}
      >
        <Text style={styles.filterText}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  function RenderNotification({ item }) {
    if (item == '-') return false
    // console.log(item)
    const messages = {
      'friend request': `User ${item.email} sent you a friend request`,
      'sent friend request': `You sent a friend request to user ${item.email}`,
      friends: `You are friends with ${item.email}`,
      'friend request reject': `You rejected ${item.email} to be your friend`,
      'sent friend request reject': `User ${item.email} rejected to be your friend`,
    }
    // console.log(item.status)
    return (
      <View
        style={[
          styles.notificationItem,
          {
            backgroundColor:
              props.theme == 'white'
                ? colors.themeWhiteBGPale
                : colors.themeDarkBGPale,
            borderColor:
              props.theme == 'white'
                ? colors.themeWhiteLine
                : colors.themeDarkLine,
          },
        ]}
      >
        <Text
          style={[
            styles.notificationTitle,
            {
              color: props.theme == 'white' ? colors.dark : colors.white,
            },
          ]}
        >
          {messages[item.status]}
        </Text>
        {item.status == 'friend request' ? (
          <View style={styles.notificationButtonsView}>
            <Pressable
              onPress={() => {
                update(
                  ref(
                    database,
                    `users/${item.email.replace('.', ',')}/notifications/` +
                      item.key
                  ),
                  {
                    status: 'friends',
                  }
                )
                update(
                  ref(
                    database,
                    `users/${auth.currentUser.email.replace(
                      '.',
                      ','
                    )}/notifications/` + item.key
                  ),
                  {
                    status: 'friends',
                  }
                )
              }}
              style={({ pressed }) => [
                styles.notificationButton,
                {
                  borderColor: pressed
                    ? props.theme == 'white'
                      ? colors.greenActivePale
                      : colors.darkGreenActive
                    : props.theme == 'white'
                    ? colors.greenActivePale
                    : colors.darkGreenActive,
                  backgroundColor: pressed
                    ? props.theme == 'white'
                      ? colors.darkGreenActive
                      : colors.greenActivePale
                    : props.theme == 'white'
                    ? colors.themeWhiteBGPale
                    : colors.themeDarkBGPale,
                },
              ]}
            >
              <Text
                style={[
                  styles.notificationButtonText,
                  {
                    color:
                      props.theme == 'white'
                        ? colors.greenActivePale
                        : colors.darkGreenActive,
                  },
                ]}
              >
                Accept
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                update(
                  ref(
                    database,
                    `users/${item.email.replace('.', ',')}/notifications/` +
                      item.key
                  ),
                  {
                    status: 'sent friend request reject',
                  }
                )
                update(
                  ref(
                    database,
                    `users/${auth.currentUser.email.replace(
                      '.',
                      ','
                    )}/notifications/` + item.key
                  ),
                  {
                    status: 'friend request reject',
                  }
                )
              }}
              style={({ pressed }) => [
                styles.notificationButton,
                {
                  borderColor: pressed
                    ? props.theme == 'white'
                      ? colors.redActivePale
                      : colors.darkRedActive
                    : props.theme == 'white'
                    ? colors.redActivePale
                    : colors.darkRedActive,
                  backgroundColor: pressed
                    ? props.theme == 'white'
                      ? colors.darkRedActive
                      : colors.redActivePale
                    : props.theme == 'white'
                    ? colors.themeWhiteBGPale
                    : colors.themeDarkBGPale,
                },
              ]}
            >
              <Text
                style={[
                  styles.notificationButtonText,
                  {
                    color:
                      props.theme == 'white'
                        ? colors.redActivePale
                        : colors.darkRedActive,
                  },
                ]}
              >
                Refuse
              </Text>
            </Pressable>
          </View>
        ) : (
          <></>
        )}
      </View>
    )
  }

  useEffect(() => {
    const notificationDataGetter = ref(
      database,
      `users/${auth.currentUser.email.replace('.', ',')}/notifications/`
    )
    onValue(notificationDataGetter, (snapshot) => {
      setNotificationData(snapshot.val())
    })
  }, [])

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
      {/* <FlatList
        horizontal={true}
        data={filterData}
        renderItem={renderFilter}
        columnWrapperStyle={{ flexWrap: 'wrap' }}
      /> */}
      <View style={styles.filterView}>
        {filterData.map((item, index) => (
          <RenderFilter key={index} item={item} />
        ))}
      </View>
      <View style={styles.flatListView}>
        <FlatList
          style={{ width: '100%' }}
          data={Object.values(notificationData)}
          renderItem={RenderNotification}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flatListView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  // filter
  filterView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  filterButton: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  filterText: {
    fontSize: 18,
  },
  // notifications
  notificationItem: {
    width: '95%',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 1,
  },
  notificationTitle: {
    fontSize: 18,
  },
  notificationButtonsView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  notificationButtonText: {
    fontSize: 18,
  },
})
