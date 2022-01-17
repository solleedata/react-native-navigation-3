import React, { useState, useCallback, useLayoutEffect, useEffect, createContext } from 'react';
import { ScrollView, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, RefreshControl, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-elements';
import { Menu, MenuOption, MenuOptions, MenuTrigger, } from 'react-native-popup-menu';
import { CheckCircle, Heart, MoreVertical, UserCircle, HandsClapping, } from 'phosphor-react-native';
import Apple from '../Auth/Apple'
import Google from '../Auth/Google'

import firebase from 'firebase';

// AWS IMPORT
import Amplify from 'aws-amplify'
import config from '../src/aws-exports'
import { API, graphqlOperation } from 'aws-amplify'
import { createComment, updateComment, deleteComment, createPost, updatePost, createPostLike } from '../src/graphql/mutations'
import { listComments, listPostLikes, listUsers, getUser, getComment } from '../src/graphql/queries'
Amplify.configure(config)

import UserProvider from '../Auth/UserProvider';

export default function DetailedFeed({ post }) {

  const { param } = useRoute().params

  const navigation = useNavigation();

  // LIKE BUTTON 
  const LikeButton = () => {
    const [liked, setLiked] = useState(false)
    const [number, setNumber] = useState(param.likesCount)
    const [counts, setCounts] = useState([])

    // ADD LIKE (USER ID) TO DATABASE
    async function addLike() {
      try {
        // const count = { ...liked }
        // setCounts([...counts, count])
        // setLiked(!liked)
        const result = await API.graphql(graphqlOperation(
          updatePost,
          {
            input: {
              id: param.id,
              // likesCount: liked ? param.likesCount - 1 : param.likesCount + 1,
              likesCount: param.likesCount + 1,
              likesByUserArray: [
                ...param.likesByUserArray,
                firebase.auth().currentUser.uid,
              ],
            }
          }
        ))
        // setCounts([...counts, result.data.updatePost])
        setNumber(result.data.updatePost.likesCount)

      } catch (e) {
        console.log('error updating post: ', e)
      }
    }

    // REMOVE LIKE (USER ID) FROM DATABASE
    async function removeLike() {
      try {
        // const count = { ...liked }
        // setCounts([...counts, count])
        // setLiked(!liked)
        const result = await API.graphql(graphqlOperation(
          updatePost,
          {
            input: {
              id: param.id,
              // DELETE USER ID FROM ARRAY
              likesCount: param.likesCount - 1,
              likesByUserArray: param.likesByUserArray.filter(userId => userId !== firebase.auth().currentUser.uid),
            }
          }
        ))
        // setCounts([...counts, result.data.updatePost])
        setNumber(result.data.updatePost.likesCount)
      } catch (e) {
        console.log('error updating post: ', e)
      }
    }

    // CHECK IF USER HAS LIKED POST
    const userLiked = param.likesByUserArray.includes(
      firebase.auth().currentUser.uid
    )

    const onLikePressed = () => {
      setLiked(!liked)
      // setNumber(number + 1)
      addLike()
    }

    const onDislikePressed = () => {
      setLiked(!liked)
      // setNumber(number - 1)
      removeLike()
    }



    return (
      <View>
        <TouchableOpacity
          style={styles.buttons}
          onPress={userLiked ? onDislikePressed : onLikePressed}
        >
          {
            userLiked ?
              <Heart size={28} color="hotpink" weight='fill' />
              : <Heart size={28} color="gray" />
          }
          <Text>{number}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // CLAP BUTTON 
  const ClapButton = () => {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);

    function onLikePressed() {
      setLiked(!liked);
      setCount(count + 1);
    }

    function onDislikePressed() {
      setLiked(!liked);
      setCount(count - 1);
    }

    return (
      // <View onPress={() => setLiked((isLiked) => !isLiked)}>
      <View>
        <TouchableOpacity
          style={styles.buttons}
          onPress={liked ? onDislikePressed : onLikePressed}>
          {
            liked ?
              <HandsClapping size={28} color="blue" weight='fill' />
              : <HandsClapping size={28} color="gray" />
          }
          <Text>{count}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // REFRESH CONTROL
  // const [refreshing, setRefreshing] = useState(false);
  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);

  useEffect(() => {
    fetchComments()
  }, [])

  // HEADER BUTTONS 
  useLayoutEffect(() => {
    Header({ navigation })
  }, [navigation])

  // ADD COMMENT
  const initialStateComment = { content: '' }
  const [formStateComments, setFormStateComments] = useState(initialStateComment)
  const [comments, setComments] = useState([])
  // CREATE COMMENT 
  async function addComment() {
    try {
      const comment = { ...formStateComments }
      setComments([...comments, comment])
      setFormStateComments(initialStateComment)
      // ✅ REFRESH AFTER SUBMIT:
      const result = await API.graphql(graphqlOperation(
        createComment,
        {
          input: {
            content: formStateComments.content,
            postCommentsId: param.id,
            userCommentsId: firebase.auth().currentUser.uid,
          }
        }))
      setComments([...comments, result.data.createComment])
      console.log('🚀 create comment 성공')
      console.log('🚀', firebase.auth().currentUser.providerData[0].providerId) //google.com
    } catch (err) {
      console.log('creating 에러!!', err)
    }
  }
  // let commentsCount = ''
  // FETCH COMMENTS
  async function fetchComments() {
    try {
      const commentData = await API.graphql(graphqlOperation(
        // listComments
        listComments, { filter: { postCommentsId: { eq: param.id } } }
      ));
      setComments(commentData.data.listComments.items)
    } catch (err) {
      console.log(err, 'fetching 에러!!!');
    }
  }
  // commentsCount = comments.length

  function setInputComments(key, value) {
    setFormStateComments({ ...formStateComments, [key]: value })
  }

  // GET OWNER OF THE POST
  const [owner, setOwner] = useState([])
  async function fetchOwner() {
    try {
      const ownerData = await API.graphql(graphqlOperation(getUser,
        { id: param.userPostsId }
      ));
      setOwner(ownerData.data.getUser.nickname)
      console.log('owner: ', owner)
    } catch (err) {
      console.log(err, 'owner fetching 에러!!!');
    }
  }
  useEffect(() => {
    fetchOwner()
  }, [])


  const report = () => {
    alert(`Report this post.
    Is this post inappropriate? We will review this report within 24 hrs and if deemed inappropriate the post will be removed within that timeframe. We will also take actions against it's author
    `)
  }

  const block = () => {
    alert(`Confirm you want to block ${owner}`)
  }

  return (

    // IF NOT SIGNED IN 
    firebase.auth().currentUser == null ?

      <View style={styles.signIn}>
        <Apple />
        <Google />
      </View>

      :

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={onRefresh}
      //   />
      // }
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.push('Home')}
                style={{ flexDirection: 'row' }}
              >
                <Text style={styles.author} >
                  {owner}
                </Text>
              </TouchableOpacity>

              <View style={styles.commentHeader}>

                <View>
                  <Menu>
                    <MenuTrigger text='+ more' />
                    <MenuOptions>
                      <MenuOption onSelect={report} >
                        <Text style={{ color: 'red' }}>Report innapropriate</Text>
                      </MenuOption>
                      <MenuOption onSelect={block} >
                        <Text style={{ color: 'red' }}>Block this user</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>

                </View>
              </View>

            </View>
            <View style={styles.content}>
              <Text style={styles.contentText}>{param.title}</Text>
            </View>

            <View style={styles.btnContainer}>
              <LikeButton />
              <ClapButton />
            </View>

            <Divider />
            <View style={styles.commentsContainer}>
              {/* <Text style={styles.commentsCounter}> {commentsCount} Comments </Text> */}
              <ScrollView>
                {
                  comments
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).reverse()
                    .map((comment, index) => (
                      <View key={comment.id ? comment.id : index} style={styles.comment} >
                        <View style={styles.commentHeader}>
                          <UserCircle size={25} color='#000' />
                          {/* <Text>{comment.owner} </Text> */}
                          <Text>{comment?.user?.nickname} </Text>
                        </View>
                        <Text> {comment.content} </Text>
                      </View>
                    ))
                }

              </ScrollView>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                onChangeText={val => setInputComments('content', val)}
                value={formStateComments.content}
                style={styles.textInput}
                multiline
                placeholder="Write a comment..."
                placeholderTextColor={'#777'}
              />
              <TouchableOpacity
                disabled={formStateComments.content.length === 0}
                onPress={addComment
                }>
                <CheckCircle size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View >
      </KeyboardAwareScrollView >
  )
}

// REFRESH CONTROL
const wait = (timeout) => {
  fetchComments()
  return new Promise(resolve => setTimeout(resolve, timeout));
}

// HEADER BUTTONS
export const Header = ({ navigation }) => {
  navigation.setOptions({
    // LEFT
    headerTitleAlign: 'left',
    // RIGHT
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            style={headerRightButtons}
            source={require('../assets/icons/logo.png')}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
        >
          <Image
            style={styles.headerRightButtons}
            source={require('../assets/icons/dots-nine.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  });
}


// CREATE CONTEXT 
const userObjectContext = {
  likes: "likes",
  comments: 'comments',
}
export const UserContext = createContext(userObjectContext)


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const headerRightButtons = {
  width: 30,
  height: 30,
  marginRight: WIDTH * 0.03,
}

const styles = StyleSheet.create({
  headerRightButtons: {
    width: 30,
    height: 30,
    // marginRight: WIDTH * 0.05,
  },
  signIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: WIDTH * 0.05,
  },
  card: {
    marginTop: 10,
    backgroundColor: '#fff',
    // flex: 5,
  },
  avatar: {
    marginRight: 10,
    // marginLeft: 20
  },
  author: {
    fontSize: 18,
    fontWeight: '700'
  },
  header: {
    paddingTop: 10,
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 5,
    color: '#fff',
    flexDirection: 'row',
  },
  contentText: {
    fontWeight: '500',
    marginVertical: 20
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  commentsContainer: {
    marginTop: 20,
  },
  commentsCounter: {
    fontWeight: '400',
    fontSize: 11,
  },
  commentHeader: {
    flexDirection: 'row',
  },
  comment: {
    // borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  textInputContainer: {
    marginTop: "auto",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  textInput: {
    borderWidth: 1,
    marginHorizontal: 5,
    width: "90%",
    fontSize: 15,
    color: '#000',
    borderRadius: 10,
    backgroundColor: "#eee",
    padding: 10,
    height: 70,
  },
})
