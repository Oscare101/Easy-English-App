import React from 'react'
import {
  Button,
  Text,
  View,
  Easing,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import MainChat from '../components/MainChat'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import colors from '../constants/colors'
import QuestionsChat from '../components/QuestionsChat'
const Stack = createStackNavigator()

const timingConfig = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.linear,
  },
}

const chatsListData = [
  {
    name: 'Main Global Chat',
    color: colors.purpleActivePale,
    bgColor: colors.purplePale,
    path: 'MainChat',
  },
  {
    name: 'Questions Chat',
    color: colors.greenActivePale,
    bgColor: colors.greenPale,
    path: 'QuestionsChat',
  },
]

function ChatsList({ navigation }) {
  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={[styles.chatButton, { borderColor: item.bgColor }]}
        onPress={() => navigation.navigate(item.path)}
      >
        <Text style={[styles.chatTitle, { color: item.color }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.commentBlock}>
        <Text style={styles.commentText}>
          Be careful in global chats. Do not insult other users, do not share
          your personal information and respect each other :)
        </Text>
      </View>
      <FlatList
        data={chatsListData}
        renderItem={renderItem}
        style={{ width: '90%' }}
      />
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
        name="MainChat"
        component={MainChat}
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
      <Stack.Screen
        name="QuestionsChat"
        component={QuestionsChat}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  commentBlock: {
    width: '80%',
    marginVertical: 10,
  },
  commentText: {
    fontSize: 16,
    color: '#666',
  },
  chatButton: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  chatTitle: {
    fontSize: 20,
  },
})
