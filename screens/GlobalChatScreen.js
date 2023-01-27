import React from 'react'
import { Button, Text, View, Easing, TouchableOpacity } from 'react-native'
import CurrentChat from '../components/CurrentChat'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
const Stack = createStackNavigator()

const timingConfig = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.linear,
  },
}

function ChatsList({ navigation }) {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('CurrentChat')}>
        <Text>CHAT</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function GlobalChatScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatsList"
        component={ChatsList}
        options={{
          headerShown: false,
          //   headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="CurrentChat"
        component={CurrentChat}
        options={{
          headerShown: false,
          headerLeft: () => null,
          animationEnabled: true,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: timingConfig,
            close: timingConfig,
          },
        }}
      />
    </Stack.Navigator>
  )
}
