import { View, Text } from 'react-native'
import React from 'react'
import firebase from 'firebase/app'

export default function Signin() {
    const text = "Wanna Signin? :)"

    const Signinwithgoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth.signInWithPopup(provider)
    }

  return (
    <View>
      <button onClick={Signinwithgoogle}>{text}</button>

    </View>
  )
}