import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Drawer from '../components/Drawer'
import ProfileScreen from './ProfileScreen'
import FriendsPosts from './FriendsPosts'
import FrinedsListScreen from './FriendsListScreen'
import GlobalChatScreen from './GlobalChatScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function FirstScreen(props) {
  const [drawer, setDrawer] = useState(false)
  const [screen, setScreen] = useState('Profile')
  const [theme, setTheme] = useState('white')

  async function getThemeFunc() {
    let themeValue = await AsyncStorage.getItem('theme')
    if (themeValue != null) setTheme(themeValue)
  }

  async function ChangeTheme(newTheme) {
    await AsyncStorage.setItem('theme', newTheme)
  }

  useState(() => {
    getThemeFunc()
  }, [])

  // const [data, setData] = useState({})

  const screenData = {
    Profile: (
      <ProfileScreen
        onChange={() => props.onChange('login')}
        theme={theme}
        changeTheme={(newTheme) => {
          ChangeTheme(newTheme)
          setTheme(newTheme)
        }}
      />
    ),
    FriendsPosts: <FriendsPosts theme={theme} />,
    FrinedsListScreen: <FrinedsListScreen theme={theme} />,
    GlobalChatScreen: <GlobalChatScreen theme={theme} />,
  }

  // useEffect(() => {
  //   const dataAboutUser = ref(database)
  //   onValue(dataAboutUser, (snapshot) => {
  //     setData(snapshot.val())
  //   })
  // }, [])

  return (
    <>
      <Header theme={theme} drawer={drawer} showDrawer={(i) => setDrawer(i)} />

      {drawer ? (
        <Drawer
          theme={theme}
          setScreen={(i) => {
            setScreen(i)
            setDrawer(false)
          }}
        />
      ) : (
        screenData[screen]
      )}
    </>
  )
}
