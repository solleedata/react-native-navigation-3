import React from 'react'
import { useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import firebase from 'firebase'
import Apple from '../Auth/Apple'
import Google from '../Auth/Google'
import { useNavigation } from '@react-navigation/native'
import Onboarding from '../Components/Onboarding';

// import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../firebase1';
import AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

export default function Notifications() {

  const navigation = useNavigation()

  // SIGN OUT FUNCTION
  function signOut() {
    alert('signing out')
    firebase.auth().signOut();
    navigation.reset({ index: 0, routes: [{ name: 'SignedOut' }] })
  }

  // CHANGE COLOR TO BLUE


  return (
    <View style={styles.container}>
      {
        firebase.auth().currentUser == null ?

          <>
            <Apple />
            <Google />
          </>
          :
          <>
            <Text>No Notifications yet</Text>
            {/* <Onboarding /> */}
          </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOut: {
    marginTop: 300,
  }
})
