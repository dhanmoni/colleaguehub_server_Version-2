
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator,ToastAndroid, Image, Dimensions,ImageBackground,StatusBar, ScrollView, Button, Alert, AsyncStorage, FlatList, Animated } from 'react-native';
import {connect} from 'react-redux'
import { Container, Header, Content, Card, CardItem, Right, Item, Input } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {deleteAuthUser, deletepost, getposts, addlike} from '../redux/actions/authAction'
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit'
import PostScreen from './PostScreen';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const TEXTSIZE = Dimensions.get('window').width ;
const ACCESS_TOKEN = 'Access_Token'
import moment from 'moment'
import { BannerView } from 'react-native-fbads';

class UserScreen extends Component {
  static navigationOptions = {
    header: null, 

  }
  async componentDidMount() {
      
    const token = await AsyncStorage.getItem(ACCESS_TOKEN)
    if(token){
      this.setState({
        token
      })
    }
    
  }
  constructor(){
    super();
    this.state={
      token:'',
      text:''
    }
  }

 
//  componentWillMount(){
//    this.animatedRotation = new Animated.Value(0.001)
//  }

  deletebutton(token) {
    console.log(token)
    Alert.alert(
      'Are you sure?',
      'This will delete your account and profile permanently!',
      [
        
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        {text: 'Delete', onPress: () => this.props.deleteAuthUser(token)},
      ],
      { cancelable: true }
    )
  }

  findUserLike(likes){
    
    if (likes.filter(like => like.facebookId ===this.props.auth.user.facebookId).length >0) {
      return true
    } else {
      return false
    }
  }

  
 
  

  _renderItem = ({item})=> {
    const postdate = moment(item.date).format('MMM Do, h:mm a');

  
  
   


    //var a = moment([2007, 0, 29]);
    //var b = moment([2007, 0, 28]);
    //a.diff(b) // 86400000
    

    return (
    <View
    style={{height:undefined,width: undefined,marginBottom:HEIGHT/50,paddingHorizontal:10}} >
      <Card style={{borderRadius:10,  }}>    
                    <CardItem  style={{height:undefined,width: undefined,borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection:'row',backgroundColor:'rgba(212, 19, 160,1)', alignItems:'center' }}> 
                    <View style={{flexDirection:'row'}}>
                    <View style={{ }}>
                       <Image source={{uri: item.profileImage}}  resizeMode="cover"
                    style={{height:  (HEIGHT/14) ,width: (HEIGHT/ 14), borderRadius:(HEIGHT/5), marginLeft:4, marginTop:4, marginBottom:2, borderColor:'#fff', borderWidth:2}}/> 
                    </View>
                    <View style={{ width:65+'%', }}> 
                    <View style={{flexDirection:'column', width:100+'%'}}>
                      <View style={{}}> 
                        <Text numberOfLines={1} style={{  marginLeft:10,
                        color:'#fff',
                        fontFamily:'Quicksand-Bold',
                        fontSize:TEXTSIZE/24,
                      }}>{item.name}</Text>
                      </View>
                      <View style={{}}>
                      <Text style={{fontSize:TEXTSIZE/30, color:'#fff', marginLeft:10}}>{postdate}</Text>
                      </View>
                      </View>
                     </View>
                      </View>
                       <View style={{position:'absolute',flexDirection:'row', right:60, alignItems:'center'}}>
                       <View style={{borderRadius:120,marginRight:7, borderWidth:0.4, borderColor:'#fff'}}>
                       <Text style={{borderRadius:120,color:'#fff',textAlign:'center', backgroundColor:'rgba(0, 0, 0, 0.4)', paddingLeft:5, paddingRight:5}}>{item.likes ? (item.likes.length):(0)}</Text>
                       </View>
                       <Animated.View   >
                         <TouchableOpacity 
                         activeOpacity={0.7}
                          onPress={()=> {
                            this.rotateIcon
                            this.props.addlike(item._id, this.state.token)
                             setTimeout(()=>this.props.getposts(this.state, this.props.auth.userInfo), 2000)
                          }} 
                         >
                       <FontAwesome
                       
                        name="heart" size={23} color={this.findUserLike(item.likes) ? '#f50002':'#fff'}/>
                      </TouchableOpacity>
                       </Animated.View>
                       
                       </View>

                       <View style={{position:'absolute', right:20, alignItems:'center'}}>
                       <TouchableOpacity activeOpacity={0.7}
                        onPress={()=> {
                          this.props.deletepost(item._id,this.state.token)
                          ToastAndroid.show('Deleting post...', ToastAndroid.LONG);
                          setTimeout(()=>this.props.getposts(this.state, this.props.auth.userInfo), 2000)
                          ToastAndroid.show('Post deleted', ToastAndroid.SHORT);
                        }}
                       >
                       <Icon  name="trash-alt" size={22} color='#fff'/>
                       </TouchableOpacity>
                       </View>
                    </CardItem>
                    <CardItem cardBody style={{height:undefined, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginLeft:4}}>
                       <Text style={styles.posttext}>{item.text}</Text>
                    </CardItem>                   
        </Card> 
     </View>
    
  )}

  render() {
  
    const {user, loggedIn, userInfo, loading, getposts, posts}= this.props.auth
    if(loading){
      return(
        <View style={{flex: 1, justifyContent:'center',alignItems:'center', backgroundColor:'#fff'}}>
         <Spinner color={'#3972e9'} size={50} type={"Wave"}/>
        </View>
      )
    }

    let myPost = posts.filter(post=> post.facebookId === user.facebookId);

      let myposts;
      if(myPost <= 0){
        myposts = (<View></View>)
      } else {
        if(myPost.length>0){
         myposts = (
           <FlatList
              data={myPost}
              keyExtractor={post=> post.date}
              renderItem={this._renderItem}
           />
         )
        }  else{
          <Text>No post</Text>
        }
      }

    return (
     
      <ScrollView style={{flex:1, backgroundColor:'#ffffff'}} showsVerticalScrollIndicator={false}>
      <View>
      {/******************user profile*****************/}
      
        <View style={{height: HEIGHT/2, borderBottomLeftRadius:20, borderBottomRightRadius:20 }}>
        <StatusBar
          backgroundColor='#3972e9'
          barStyle="light-content"
        />
          <ImageBackground blurRadius={2.3} resizeMode='cover' source={{uri:user.profile}} style={{flex:1, overflow:'hidden', borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
            
              <LinearGradient 
                 colors={[ 'rgba(212, 19, 190,0.5)','rgba(212,146, 255, 0.7)', 'rgba(150, 180, 245, 0.2)']} style={{width: 100 + '%', height: 100 +'%',overflow:'hidden'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.9}}
              ><View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
                <Image source={{uri:user.profile}} style={styles.image}/> 
                </View>
                </LinearGradient>
           </ImageBackground>
        </View>
       
               <View style={{marginTop:10,marginLeft:3, marginRight:3,}}>
               <View style={{}}>

               
           <Card style={{ margin:0,elevation:8,borderRadius:20, paddingBottom:0, marginBottom:0, }}>
              
              <TouchableOpacity activeOpacity={0.9} onPress={()=> this.props.navigation.navigate('EditProfile')} style={{position:'absolute', height:HEIGHT/11, width:HEIGHT/11, top:10, right:10, zIndex:100000, elevation:10}}>
                    <LinearGradient
                    colors={[ 'rgba(212, 19, 190,1)','rgba(212,146, 255, 1)', 'rgba(150, 180, 245, 1)']} style={{alignItems:'center', justifyContent:'center', height:HEIGHT/12, width:HEIGHT/12, backgroundColor:'#c4a5f5', borderRadius:HEIGHT/24, elevation:5}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.9}}>
                  <Icon name='pen' size={24} color='white' style={{}}/>
                  </LinearGradient>
               </TouchableOpacity>

             <CardItem style={{borderTopLeftRadius:20, borderTopRightRadius:20,}}>
               <Text style={[styles.name, { width:'80%', flexWrap:'wrap'}]}>{user.name}</Text> 
             </CardItem>
            
            <CardItem>
            <Icon name="user-graduate" size={22}  color= 'rgba(212, 19, 160,1)' style={{width: WIDTH/10,alignSelf:'center'}}/>
            <Text style={styles.institute}>{userInfo.institution}</Text>  
             </CardItem>
             <CardItem>
             <Icon name="briefcase" size={22}  color= 'rgba(212, 19, 160,1)' style={{width: WIDTH/10,alignSelf:'center'}}/>
            <Text style={styles.institute}>{userInfo.status}</Text>
              
             </CardItem>
             {userInfo.residence == '' || null || undefined ? ( <View></View>) :
            (<CardItem>
            <Icon name="map-marker"  color= 'rgba(212, 19, 160,1)' size={25} style={{width: WIDTH/10,alignSelf:'center'}}/>
            <Text style={styles.institute}>{userInfo.residence}</Text>
            </CardItem>)
            
              }  
                 {userInfo.ig_username == '' || null || undefined ? (
               <View></View>
             ) :
            (<CardItem>
            <Icon name="instagram"  color= 'rgba(212, 19, 160,1)' size={25} style={{width: WIDTH/10,alignSelf:'center'}}/>
            <Text style={styles.institute}>{userInfo.ig_username}</Text>
            </CardItem>)
            
            }
             {userInfo.bio == '' || null ||undefined ? (
              <View></View>
            ) :
             (<CardItem >
                <Icon name="info-circle" color= 'rgba(212, 19, 160,1)'size={22} style={{width: WIDTH/10,alignSelf:'center'}}/>
                <Text style={styles.bio}>{userInfo.bio}</Text>
              </CardItem>)
            }
            <CardItem style={{borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
               
            </CardItem>
           </Card>
           </View>
           </View>
           
          
          <View style={{paddingTop:10}}>
     {myposts}
        
        </View>
        {/*************ads*************/}
        <View>
        <BannerView
        placementId="1911005745652403_1911143952305249"
        type="rectangle"
     
      />
        </View>
       
        <View style={{borderTopWidth:0.4, borderBottomWidth:0.4, marginBottom:20, marginTop:20}}>
          
        
          <Text  style={{color:'black',  fontSize: TEXTSIZE/22,marginLeft:20,paddingBottom:5,paddingTop:6,fontFamily:'Quicksand-Bold'}}>Account</Text>
          <TouchableOpacity activeOpacity={0.9} onPress={()=> this.deletebutton(this.state.token)}>
              <Text style={{color:'red',  fontSize: TEXTSIZE/23.5,marginLeft:20,paddingBottom:5, fontFamily:'Quicksand-Medium'}}>Delete Account</Text>
          </TouchableOpacity>
        </View>
       


        
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state)=> {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, {deleteAuthUser, deletepost, getposts, addlike})(UserScreen)

const styles = StyleSheet.create({
  image:{
    height: HEIGHT/3.6,
    width:HEIGHT/3.6,
    borderRadius:HEIGHT/2,
    borderColor:'white',
    borderWidth:2
  },
  userinformation:{
    
  

  },
  name:{
    color:'#333',
    fontSize: TEXTSIZE/18,
    textAlign:'left',
    paddingTop:3,
    paddingBottom:3,
    fontFamily:'Quicksand-Bold'
  },
  bio:{
    color:'black',
    fontSize:TEXTSIZE/23,
    paddingLeft:5,
    paddingRight:5,
    marginRight:10,
    width:90+'%',
    flexWrap:'wrap',
    fontFamily:'Quicksand-Medium'
  },
  institute:{
    color:'#333333',
    fontSize: TEXTSIZE/22,
    paddingLeft:5,
    paddingRight:5,
    marginRight:10,
    width:90+'%',
    flexWrap:'wrap',
    fontFamily:'Quicksand-Medium'
  },
  posttext: {
    color:'#333333',
    fontSize: TEXTSIZE/24,
    marginLeft:10,
     padding:15,
    fontFamily:'Quicksand-Medium'
  
  }
  
  
})
//Medium rectangle
//1911005745652403_1911143952305249

/*<View style={{ borderTopLeftRadius:30,
   borderTopRightRadius:30, borderTopWidth:3, zIndex:100}}>
        
           <View style={{padding:7,backgroundColor:'transparent'}}>
          
            <Text style={styles.name}>{user.name}</Text>
           </View>
          <View style={styles.about}>
           <Icon name="user-graduate" size={22} style={{width: WIDTH/10,padding:3,alignSelf:'center'}}/>
            <Text style={styles.institute}>{userInfo.institution}</Text>
           </View>
           
            <View style={styles.about}>
            <Icon name="briefcase" size={22} style={{width: WIDTH/10,padding:3,alignSelf:'center',}}/>
            <Text style={styles.institute}>{userInfo.status}</Text>
            </View>
            {userInfo.residence=== '' ? (<View></View>) :
            (<View style={styles.about}>
            <Icon name="map-marker" size={25} style={{width: WIDTH/10,padding:3,alignSelf:'center',}}/>
            <Text style={styles.institute}>{userInfo.residence}</Text>
            </View>)
            
            }
            {userInfo.bio === '' ? (<View></View>) :
             (<View style={styles.about}>
                <Icon name="info-circle" size={22} style={{width: WIDTH/10,padding:3,alignSelf:"flex-start"}}/>
                <Text style={styles.bio}>{userInfo.bio}</Text>
              </View>)
            }
            
          </View>*/