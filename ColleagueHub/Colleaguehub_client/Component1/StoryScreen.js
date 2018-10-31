import React, { Component } from 'react'
import { StyleSheet, Text, View ,Image,Dimensions,ScrollView,FlatList, ActivityIndicator,TouchableOpacity,StatusBar, AsyncStorage, TextInput, Keyboard, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'
import {  Card, CardItem, Left, Item, Input  } from 'native-base';
import {connect} from 'react-redux'
import {getAllUsers, getSingleUser, getAllCollegues, getposts, addpost, addlike} from '../redux/actions/authAction'
import Spinner from 'react-native-spinkit'
let HEIGHT_MIN = Dimensions.get('window').height;
let WIDTH_MIN = Dimensions.get('window').width;
const TEXTSIZE = Dimensions.get('window').width ;
const ACCESS_TOKEN = 'Access_Token'
import Moment from 'react-moment';
import moment from 'moment'
import {BannerView} from 'react-native-fbads'
//const WIDTH_LEFT = WIDTH_MIN -((WIDTH_MIN/2.3)*2)
//const PADDING_WIDTH = WIDTH_LEFT /3.89999

class StoryScreen extends Component {
  static navigationOptions={
    header:null
}

  constructor(props){
    super(props);
    this.state={
      token:'',
      page:1,
      refreshing:false,
      text:'',
      isLoading:false,
      color:'#fff'
    
    }
  }
  async componentDidMount() {
     
    const token = await AsyncStorage.getItem(ACCESS_TOKEN)
    if(token){
      this.setState({
        token
      })
     
       this.props.getposts(this.state, this.props.auth.userInfo)
     
       
     
    }
    
  }
 
 
  findUserLike(likes){
    if(likes && likes.length !==undefined){
     
      if (likes.filter(like => like.facebookId == this.props.auth.user.facebookId).length >0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
   
  }
 
  _renderItem = (item, index)=> {
   
    const postdate = moment(item.date).format('MMM Do, h:mm a');
   
   
    return (
     
    <View>
    <View 
    style={{height:undefined,width: undefined,marginBottom:HEIGHT_MIN/40,paddingHorizontal:10}}
    >
      <Card style={{borderRadius:10,  }}>
                    
                    <CardItem  style={{height:undefined,width: undefined,borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection:'row',backgroundColor:'#4776e6' }}> 
                    <View style={{flexDirection:'row'}}>
                      <View style={{ }}>
                       <Image source={{uri: item.profileImage}}  resizeMode="cover"
                    style={{height:  (HEIGHT_MIN/14) ,width: (HEIGHT_MIN/ 14), borderRadius:(HEIGHT_MIN/5), marginLeft:4, marginTop:4, marginBottom:2, borderColor:'#fff', borderWidth:2}}/> 
                    </View>
                    <View style={{flexDirection:'row', width:79+'%'}}>
                   
                        <TouchableOpacity style={{flexDirection:'column', justifyContent:'center'}} activeOpacity={0.99} onPress={()=> {
                        this.props.getSingleUser(item, this.state)
                        this.props.navigation.navigate('ProfileItem')
                      }}>
                      <View style={{marginRight:20,}}> 
                        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                      </View>
                         <View style={{}}>
                         
                         <Text style={{fontSize:TEXTSIZE/30, color:'#fff', marginLeft:10}}>{postdate}</Text>
                         </View>
                        
                            
                        </TouchableOpacity>
                      
                    </View>
                     
                        
                   
                       
                       </View>
                       
                       <View style={{position:'absolute',flexDirection:'row', right:20, alignItems:'center'}}>
                       <View style={{borderRadius:120,marginRight:7, borderWidth:0.4, borderColor:'#fff'}}>
                       <Text style={{borderRadius:120,color:'#fff',textAlign:'center', backgroundColor:'rgba(0, 0, 0, 0.4)', paddingLeft:5, paddingRight:5}}>{item.likes ? (item.likes.length):(0)}</Text>
                       </View>
                       <View >
                       <TouchableOpacity onPress={()=> {
                       
                        this.props.addlike(item._id, this.state.token)
                        setTimeout(()=> this.props.getposts(this.state, this.props.auth.userInfo), 2000 )
                        setTimeout(()=> this.props.getposts(this.state, this.props.auth.userInfo), 2500 ) 

                         }}
                        
                        >
                       <Icon  name="heart" size={23}
                        color={this.findUserLike(item.likes) ? '#f70000':'#fff'}
                       
                        />
                       </TouchableOpacity>
                      
                        </View> 
                       </View>
                    </CardItem>
                    
                    <CardItem cardBody style={{height:undefined, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginLeft:4}}>
                       <Text style={styles.posttext}>{item.text}</Text>
                    </CardItem>                   
        </Card> 
       
     </View>
    <View>
       {
         
         index % 3 == 2  ? (<View>
            <BannerView
                placementId="1911005745652403_1918639781555666"
                type="rectangle"
              
              />
         </View>):(<View></View>)
       }
    </View>
    </View>
  )}

     handleRefresh = ()=> {
        this.setState({
          refreshing: true,
          page:1
        },()=> {

          this.props.getposts(this.state, this.props.auth.userInfo)
         return (
           this.setState({
             refreshing:false
           })
         )
        }
        )
      }

     

     
      onTextChange =(text)=> {
        this.setState({text})
      }
    
    render() {
      const {user, loggedIn,allCollegues, loading, userInfo, posts, post}= this.props.auth

     

      if(loading){
        return(
          <View style={{flex: 1, justifyContent:'center',alignItems:'center', backgroundColor:'#fff'}}>
            <Spinner color={'#4776e6'} size={50} type={"ThreeBounce"}/>
          </View>
        )

      } 

    return (
      <View style={{flex:1,backgroundColor:'#ffffff' }}> 
       <View style={{flex:1,backgroundColor:'transparent',flexDirection: 'row'}}>
          
          <LinearGradient  colors={['#8e54e9', '#4776e6']} style={{width: 100 + '%', height: 100 +'%',}} start={{x: 0, y: 0.6}} end={{x: 1, y: 0.5}}>
           <View style={{flexDirection:'row', alignItems:'center',width: 100 + '%', height: 100 +'%',alignSelf: 'center'}}>
               
               <Text style={{color:'white',flex:1 ,textAlign: 'center',fontSize: 32 ,backgroundColor: 'transparent', fontFamily:'Quicksand-Bold'}}>Story</Text>
               <View  style={{position:'absolute', right:20, alignItems:'center',}}>
             <Icon onPress={()=> this.props.navigation.navigate('PostScreen')} name='plus' size={29} color='white'/>
           </View>
           </View>
          
 
         </LinearGradient> 
         </View>
          
       <View style={{paddingTop:HEIGHT_MIN/50, flex:10 }}>
      
          <FlatList
              data={posts}
             ListEmptyComponent={()=> <View  style={{justifyContent:'center'}}>
             <Text style={{  color:'#333',
             fontSize: TEXTSIZE/28,
             flex:1,
             textAlign:'center',
             fontFamily:'Quicksand-Regular'}}>No post found...</Text>
             </View>}
              renderItem={({item, index}) => this._renderItem(item, index)}
              
              ListFooterComponent={()=>{
                if(posts.length <=0){
                  return(
                    
                    <View style={{flexDirection:'row', marginTop:7, justifyContent:'center', paddingBottom:20, width:WIDTH_MIN}}>
                    <View
                     style={{marginTop:10,marginBottom:10,width:'50%', margin:'auto', justifyContent:'center' }}>
                       <LinearGradient
                           colors={[ '#8e54e9', '#4776e6']} style={{borderRadius:30, elevation:7, margin:'auto'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                        >
                      <TouchableOpacity  activeOpacity={0.7}
                      style={{ padding:9, flex:1, borderRadius:10}}
                      onPress={()=> {
                        this.setState({
                          page:1
                        },()=> {
                          this.props.getposts(this.state, this.props.auth.userInfo)
                        
                        }
                        )
                      }}
                           >
                        <Text 
                        style={{alignSelf:'center', color:'white', fontSize:TEXTSIZE/24, fontFamily:'Quicksand-Bold'}}>
                       Refresh
                        </Text>
                      </TouchableOpacity>
                      </LinearGradient>
                    </View>
                    </View>
                  )
                }
               
                  return(
                    <View style={{flexDirection:'row', marginTop:7, justifyContent:'center', paddingBottom:20, width:WIDTH_MIN}}>
                    <View
                     style={{marginTop:10,marginBottom:10,width:'50%', margin:'auto', justifyContent:'center' }}>
                       <LinearGradient
                           colors={[ '#8e54e9', '#4776e6']} style={{borderRadius:30, elevation:7, margin:'auto'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                        >
                      <TouchableOpacity  activeOpacity={0.7}
                      style={{ padding:9, flex:1, borderRadius:10}}
                      onPress={()=> {
                        this.setState({page: this.state.page+ 1}, ()=> this.props.getposts(this.state, this.props.auth.userInfo))
                      }}
                           >
                        <Text 
                        style={{alignSelf:'center', color:'white', fontSize:TEXTSIZE/24, fontFamily:'Quicksand-Bold'}}>
                       Load More
                        </Text>
                      </TouchableOpacity>
                      </LinearGradient>
                    </View>
                    </View>

                  )

                
                } }
              keyExtractor={(item, index)=> index.toString()}
             
            
             refreshing={this.state.refreshing}
             onRefresh={this.handleRefresh}
             // onEndReached={()=> this.endreached(allCollegues, this.props.auth.allUsers)}
             // onEndReachedThreshold={0}
          />
         
    </View>
	  </View>
    )
  }
}
const mapStateToProps = (state)=> {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, {getAllUsers, getSingleUser,getposts, addpost, addlike})(StoryScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name:{
    marginLeft:10,
    color:'#fff',
    fontFamily:'Quicksand-Bold',
    fontSize:TEXTSIZE/22,
   
  },
  posttext: {
    color:'#333333',
    fontSize: TEXTSIZE/24,
    marginLeft:10,
     padding:15,
    fontFamily:'Quicksand-Medium'
  
  }
});



//one: #5AB7EF;
//two:#5472F0