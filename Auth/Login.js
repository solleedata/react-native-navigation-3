import React, { useEffect, useState } from 'react'
import { View, Button, StyleSheet, TextInput, TouchableOpacity, Text, } from 'react-native'
import { auth } from '../firebase'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Apple2 from './Apple2';
import GoogleAuth2 from './GoogleAuth2';
import { Divider } from 'react-native-elements';

// import { AppleButton } from '@invertase/react-native-apple-authentication';

// import auth from '@react-native-firebase/auth';
// import { auth } from '@react-native-firebase/auth';
// import { appleAuth } from '@invertase/react-native-apple-authentication';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage)
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Chat')
      } else {
        // navigation.canGoBack() &&
        // navigation.popToTop()
        null
      }
    })
    return unsubscribe
  }, [])


  // async function onAppleButtonPress() {
  //   // Start the sign-in request
  //   const appleAuthRequestResponse = await appleAuth.performRequest({
  //     requestedOperation: appleAuth.Operation.LOGIN,
  //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //   });

  //   // Ensure Apple returned a user identityToken
  //   if (!appleAuthRequestResponse.identityToken) {
  //     throw 'Apple Sign-In failed - no identify token returned';
  //   }

  //   // Create a Firebase credential from the response
  //   const { identityToken, nonce } = appleAuthRequestResponse;
  //   const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

  //   // Sign the user in with the credential
  //   return auth().signInWithCredential(appleCredential);
  // }

  // AUTHENTICATION  
  // function AppleSignIn() {
  //   return (
  //     <AppleButton
  //       buttonStyle={AppleButton.Style.WHITE}
  //       buttonType={AppleButton.Type.SIGN_IN}
  //       style={{
  //         width: 160,
  //         height: 45,
  //       }}
  //       onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}
  //     />
  //   );
  // }
  // function FacebookSignIn() {
  //   return (
  //     <Button
  //       title="Facebook Sign-In"
  //       onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
  //     />
  //   );
  // }


  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChengeText={(text) => setEmail(text)}
        name="email"
        placeholder="Enter your email"
        placeholderTextColor={'#666'}
        style={styles.textInput}
        label="Email"
      />
      {/* <ChatScreen /> */}
      <TextInput
        value={password}
        onChengeText={(text) => setPassword(text)}
        name="password"
        placeholder="Enter your password"
        placeholderTextColor={'#666'}
        style={styles.textInput}
        label="Password"
        secureTextEntry
      />

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() => { signIn }}
        >
          <View style={styles.floatingBtn}>
            <Text style={styles.floatingBtnText}> Sign In </Text>
          </View>
        </TouchableOpacity>
        {/* submit button */}
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() => {
            navigation.navigate('Register')
          }}
        >
          <View style={styles.floatingBtnReverse}>
            <Text style={styles.floatingBtnTextReverse}> Register </Text>
          </View>
        </TouchableOpacity>

        {/* <AppleSignIn /> */}
      </View>

      <Divider style={{ color: '#000' }} />

      <Apple2 />

      <GoogleAuth2 />
    </View>
  );
}


// alternative: 
// const onLogin = async(email, password) => {
//     try{
//         await firebase.auth().signInWithEmailAndPassword(email, password) {
//             console.log('success', email)
//         } catch (error) {
//             alert(error.message)
//     }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    height: 50,
    width: 300,
    borderColor: '#e6e6e6',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderRadius: 13,
    padding: 10,
    marginBottom: 30,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around'
  },
  floatingBtn: {
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 40,
    position: 'relative',
    backgroundColor: 'black',
    borderRadius: 100,
    // shadow ios:
    shadowColor: 'lightgray',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // shadow android: 
    elevation: 0.8,
  },
  floatingBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textDecorationLine: 'underline'
  },
  floatingBtnReverse: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 40,
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 100,
    // shadow ios:
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  floatingBtnTextReverse: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    textDecorationLine: 'underline'
  }

})