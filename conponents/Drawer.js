import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

export default function Drawer(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => props.setScreen('Profile')}
      >
        <Text style={styles.buttunText}>Profile</Text>
      </TouchableOpacity>
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
})
