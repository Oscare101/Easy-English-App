import React, { useState } from 'react'
import Header from '../components/Header'
import Drawer from '../components/Drawer'
import ProfileScreen from './ProfileScreen'
import FriendsPosts from './FriendsPosts'

export default function FirstScreen(props) {
  const [drawer, setDrawer] = useState(false)
  const [screen, setScreen] = useState('Profile')

  const screenData = {
    Profile: <ProfileScreen onChange={() => props.onChange('login')} />,
    FriendsPosts: <FriendsPosts />,
  }

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
