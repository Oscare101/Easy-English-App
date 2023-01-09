import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Drawer from '../components/Drawer'
import ProfileScreen from './ProfileScreen'
import FriendsPosts from './FriendsPosts'
import FrinedsListScreen from './FriendsListScreen'

export default function FirstScreen(props) {
  const [drawer, setDrawer] = useState(false)
  const [screen, setScreen] = useState('Profile')

  // const [data, setData] = useState({})

  const screenData = {
    Profile: <ProfileScreen onChange={() => props.onChange('login')} />,
    FriendsPosts: <FriendsPosts />,
    FrinedsListScreen: <FrinedsListScreen />,
  }

  // useEffect(() => {
  //   const dataAboutUser = ref(database)
  //   onValue(dataAboutUser, (snapshot) => {
  //     setData(snapshot.val())
  //   })
  // }, [])

  return (
    <>
      <Header drawer={drawer} showDrawer={(i) => setDrawer(i)} />

      {drawer ? (
        <Drawer
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
