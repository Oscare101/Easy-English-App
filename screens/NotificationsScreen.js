import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
    console.log(item)
    const messages = {
      'friend request': `User ${item.email} sent you a friend request`,
      'sent friend request': `You sent a friend request to user ${item.email}`,
    }
    console.log(item.status)
    return (
      <View>
        <Text>{messages[item.status]}</Text>
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
      <View>
        <FlatList
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
})
