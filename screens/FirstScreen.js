import React, { useState } from 'react'
import Header from '../conponents/Header'
import Drawer from '../conponents/Drawer'
import ProfileScreen from './ProfileScreen'

export default function FirstScreen(props) {
  const [drawer, setDrawer] = useState(false)
  const [screen, setScreen] = useState('Profile')

  const screenData = {
    Profile: <ProfileScreen onChange={() => props.onChange('login')} />,
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
