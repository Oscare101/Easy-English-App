import React from 'react'
import {
  Button,
  Text,
  View,
  Easing,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
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
    activeBG: colors.purplePale,
    activeColor: colors.purpleActivePale,
    darBG: colors.darkPurple,
    darkActive: colors.darkPurpleActive,

    path: 'MainChat',
  },
  {
    name: 'Questions Chat',
    activeBG: colors.greenPale,
    activeColor: colors.greenActivePale,
    darBG: colors.darkGreen,
    darkActive: colors.darkGreenActive,
    path: 'QuestionsChat',
  },
]

function ChatsList(props) {
  function renderItem({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.chatButton,
          {
            borderColor: pressed
              ? props.theme == 'white'
                ? `${item.activeColor}`
                : item.darkActive
              : props.theme == 'white'
              ? `${item.activeColor}`
              : `${item.darkActive}99`,
            backgroundColor: pressed
              ? props.theme == 'white'
                ? item.activeBG
                : `${item.darBG}33`
              : '#ffffff00',
          },
        ]}
        onPress={() => props.onChangeChat(item.path)}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.chatTitle,
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
            {item.name}
          </Text>
        )}
      </Pressable>
    )
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

export default function GlobalChatScreen(props) {
  function ChatsListBuf({ navigation }) {
    return (
      <ChatsList
        theme={props.theme}
        onChangeChat={(path) => navigation.navigate(path)}
      />
    )
  }

  function MainChatBuf({ navigation }) {
    return (
      <MainChat
        myMessageColor={colors.purplePale}
        DBPath="GLOBALCHAT"
        theme={props.theme}
        onChangeChat={(path) => navigation.navigate(path)}
      />
    )
  }

  function QuestionsChatBuf({ navigation }) {
    return (
      <MainChat
        myMessageColor={colors.greenPale}
        DBPath="QUESTIONSCHAT"
        theme={props.theme}
        onChangeChat={(path) => navigation.navigate(path)}
      />
    )
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatsList"
        component={ChatsListBuf}
        options={{
          headerShown: false,
          //   headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="MainChat"
        component={MainChatBuf}
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
        component={QuestionsChatBuf}
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
