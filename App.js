import 'react-native-gesture-handler'
import React, { useState } from 'react'
import FirstScreen from './screens/FirstScreen'
import LogInScreen from './screens/LogInScreen'
import RegistrationScreen from './screens/Registration'
export default function App() {
  const [status, setStatus] = useState('login')

  const content =
    status == 'login' ? (
      <LogInScreen onChange={(whereTo) => setStatus(whereTo)} />
    ) : status == 'registration' ? (
      <RegistrationScreen onChange={(whereTo) => setStatus(whereTo)} />
    ) : (
      <FirstScreen onChange={(whereTo) => setStatus(whereTo)} />
    )

  return content
}
