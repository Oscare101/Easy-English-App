import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'

const filterData = ['Requests', 'Courses', 'Sent']

export default function NotificationsScreen() {
  const [filters, setFilters] = useState([])

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
          { backgroundColor: filters.includes(item) ? '#74cf8c' : '#dae0e0' },
        ]}
      >
        <Text style={styles.filterText}>{item}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
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
      <Text>NOTIFICATIONS</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
