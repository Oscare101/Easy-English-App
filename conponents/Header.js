import React, { useEffect, useRef, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native'

export default function Header(props) {
  const [headerStatus, setHeaderStatus] = useState(false)
  const fadeAnim = useRef(new Animated.Value(headerStatus ? 0 : 1)).current
  const moveAnim = useRef(new Animated.Value(headerStatus ? 10 : 0)).current
  const rotateTopAnim = useRef(new Animated.Value(headerStatus ? 1 : 0)).current
  const rotateBottomAnim = useRef(
    new Animated.Value(headerStatus ? 1 : 0)
  ).current

  const topRotation = rotateTopAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })
  const bottomRotation = rotateBottomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-45deg'],
  })

  function FadeAnimation() {
    props.showDrawer(!headerStatus)
    Animated.timing(fadeAnim, {
      toValue: headerStatus ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
    Animated.timing(moveAnim, {
      toValue: headerStatus ? 0 : 10,
      duration: 200,
      useNativeDriver: false,
    }).start()
    Animated.timing(rotateTopAnim, {
      toValue: headerStatus ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
    Animated.timing(rotateBottomAnim, {
      toValue: headerStatus ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
    setHeaderStatus(!headerStatus)
  }

  useEffect(() => {
    if (props.drawer != headerStatus) {
      FadeAnimation()
    }
  }, [props.drawer])

  return (
    <View style={styles.header}>
      <StatusBar />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.burgerTouch}
        onPress={() => FadeAnimation()}
      >
        <View style={styles.burgerButtonBlock}>
          <Animated.View
            style={[
              styles.burgerButtonLine,
              {
                position: 'absolute',
                top: moveAnim,
                transform: [{ rotateZ: topRotation }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.burgerButtonLine,
              { position: 'absolute', top: 10, opacity: fadeAnim },
            ]}
          />
          <Animated.View
            style={[
              styles.burgerButtonLine,
              {
                position: 'absolute',
                bottom: moveAnim,
                transform: [{ rotateZ: bottomRotation }],
              },
            ]}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Easy English</Text>
      <Text>icon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#666',
  },
  burgerTouch: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burgerButtonBlock: {
    width: 23,
    height: 23,
  },
  burgerButtonLine: {
    width: 23,
    height: 3,
    borderRadius: 40,
    backgroundColor: '#000',
  },

  title: {
    fontSize: 24,
    letterSpacing: 1,
  },
})
