import React, { Component } from 'react'
import { StyleSheet, Text, View ,Image,Dimensions,ScrollView,FlatList,Animated, ActivityIndicator,TouchableOpacity,StatusBar, AsyncStorage, TextInput, Keyboard, ToastAndroid, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'
import {  Card, CardItem, Left, Item, Input  } from 'native-base';
import {connect} from 'react-redux'
import {getAllUsers, getSingleUser, getAllCollegues, getposts, addpost, deletepost} from '../redux/actions/authAction'
import Spinner from 'react-native-spinkit'
let HEIGHT_MIN = Dimensions.get('window').height;
let WIDTH_MIN = Dimensions.get('window').width;
const TEXTSIZE = Dimensions.get('window').width ;
const ACCESS_TOKEN = 'Access_Token'


class PostScreen extends Component {
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
      isLoading:false
    }
  }
  async componentDidMount() {
     
    const token = await AsyncStorage.getItem(ACCESS_TOKEN)
    if(token){
      this.setState({
        token
      })
     
      
     
       
     
    }
    
  }

     
      onTextChange =(text)=> {
        this.setState({text})
      }
    
    render() {
      const {user, loggedIn,allCollegues, loading, userInfo, posts, post}= this.props.auth
      
     

    return (
     
      <View style={{flex:1,backgroundColor:'#ffffff' }}> 
      
       <View style={{flex:1,backgroundColor:'transparent',flexDirection: 'row'}}>
          
          <LinearGradient  colors={['#8e54e9', '#4776e6']} style={{width: 100 + '%', height: 100 +'%',}} start={{x: 0, y: 0.6}} end={{x: 1, y: 0.5}}>
           <View style={{flexDirection:'row', alignItems:'center',width: 100 + '%', height: 100 +'%',alignSelf: 'center'}}>
               
               <Text style={{color:'white',flex:1 ,textAlign: 'center',fontSize: 32 ,backgroundColor: 'transparent', fontFamily:'Quicksand-Bold'}}>ColleagueHub</Text>
              
           </View>
          
 
         </LinearGradient> 
         </View>
          
       <View style={{marginTop:HEIGHT_MIN/50, flex:10 }}>
      
            <View>
              <Text style={{ color:'#333333',
                    fontSize: TEXTSIZE/21,
                    marginLeft:10,
                    padding:15,
                    fontFamily:'Quicksand-Medium'}}>
                 Hi {user.first_name}, Post Something Here.
               </Text>
            </View>
            <View style={{marginHorizontal:7, borderRadius:8, margin:4}}>
                <TextInput
                value={this.state.text}
                onChangeText={this.onTextChange}
                numberOfLines={8}
                underlineColorAndroid='transparent'
                multiline={true}
                style={{borderRadius:8,textAlignVertical:'top', borderWidth:0.4, color:'#333', fontSize:TEXTSIZE/22,fontFamily:'Quicksand-Regular',padding:15,marginHorizontal:10}}
                />
            </View>
              
            <View style={{flexDirection:'row', marginTop:40, justifyContent:'space-around', paddingBottom:50}}>
          <View style={{width:'45%',}}>
        
        <TouchableOpacity activeOpacity={0.9} style={{borderRadius:12, backgroundColor:'#888',padding:7, borderRadius:10}} 
        onPress={()=> this.props.navigation.navigate('StoryScreen')}>
          <Text style={{alignSelf:'center', color:'white', fontSize:TEXTSIZE/23,fontFamily:'Quicksand-Medium'}}>Cancel</Text>
        </TouchableOpacity>
       
        </View>
           <View style={{width:'45%',}}>
           

            <TouchableOpacity activeOpacity={0.9} style={{borderRadius:12, backgroundColor:'#128EFE', padding:7, borderRadius:10, flex:1}} onPress={
             async ()=>{ 
               
               
               if(this.state.text == ''|| null ) {
                 
                 alert('Text field must not be empty!')
                 
               } else {
                this.props.addpost(this.state, userInfo)
                this.props.navigation.navigate('StoryScreen')
               
                setTimeout(()=> this.props.getposts(this.state, userInfo), 2000)
                ToastAndroid.show('Posting...', ToastAndroid.LONG)
               }
              }
              
             

              }>
              <Text style={{alignSelf:'center', color:'white', fontSize:TEXTSIZE/23,fontFamily:'Quicksand-Medium'}}>Save</Text>
            </TouchableOpacity>
       
        </View>
        </View>  
           
         
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

export default connect(mapStateToProps, {getAllUsers, getSingleUser,getposts, addpost, deletepost})(PostScreen)

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
    fontSize: TEXTSIZE/21,
    marginLeft:10,
     padding:15,
    fontFamily:'Quicksand-Medium'
  
  }
});



//one: #5AB7EF;
//two:#5472F0