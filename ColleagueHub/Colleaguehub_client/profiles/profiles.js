import React, { Component } from 'react'
import { StyleSheet, Text, View ,Image,Dimensions,ScrollView,FlatList, ActivityIndicator,TouchableOpacity,StatusBar, AsyncStorage } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {  Card, CardItem, Left,  } from 'native-base';
import {connect} from 'react-redux'
import {getAllUsers, getSingleUser, getAllCollegues} from '../redux/actions/authAction'
import Spinner from 'react-native-spinkit'
import { withNavigation } from 'react-navigation';
import {BannerView} from 'react-native-fbads'
let HEIGHT_MIN = Dimensions.get('window').height;
let WIDTH_MIN = Dimensions.get('window').width;
const TEXTSIZE = Dimensions.get('window').width ;
const ACCESS_TOKEN = 'Access_Token'

const WIDTH_LEFT = WIDTH_MIN -((WIDTH_MIN/2.3)*2)
const PADDING_WIDTH = WIDTH_LEFT /3.89999

class Profiles extends Component {
  

  constructor(){
    super();
    this.state={
      token:'',
     
      refreshing:false
    }
  }
  async componentDidMount() {
     
    const token = await AsyncStorage.getItem(ACCESS_TOKEN)
    if(token){
      this.setState({
        token
      })
     
       this.props.getAllCollegues(this.state, this.props.auth.userInfo)
       this.props.getAllUsers(this.state.token)
       
     
    }
    
  }

 
 

  _renderItem = ({item, index})=> {
   
    return (
     <View>
   <View>
    <TouchableOpacity 
    activeOpacity={0.9}
                
    onPress={
     async ()=>{
       await this.props.getSingleUser(item, this.state)
       if(this.state == null || undefined || ''){
         alert('Opps! Something went wrong!')
       } else {
       await this.props.navigation.navigate('ProfileItem')
       }
      }}
    style={{height:undefined,width: undefined,marginBottom:HEIGHT_MIN/50,marginLeft:PADDING_WIDTH}}
    >
                <Card style={{borderRadius:20, width:WIDTH_MIN/2.3, }}>
                    
                    <CardItem cardBody style={{height:(HEIGHT_MIN/4),width: undefined,borderTopLeftRadius: 20, borderTopRightRadius: 20}}> 
                    <Image source={{uri: item.profileImage}}  resizeMode="cover"
                 style={{height:  (HEIGHT_MIN/4) ,width: (WIDTH_MIN/ 2.3),borderTopLeftRadius: 20, borderTopRightRadius: 20}}/> 
                       
                    </CardItem>
                    
                    <CardItem style={{height: HEIGHT_MIN/19, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                        <Left style={{flex:1}}>
                           <Text numberOfLines={1} style={styles.name}>{item.name}</Text> 
                        </Left>
                    </CardItem>
                   
                    </Card> 
    </TouchableOpacity>
    </View>
  
    </View>
   
   
  )}

      
 
      // endreached = (allCollegues, allUsers)=> {
      //   if(allCollegues.length <6  ){
      //      this._renderItem
      //   } 
      //   else{
          
      //       this.setState({page: this.state.page+ 1}, ()=> this.props.getAllCollegues(this.state, this.props.auth.userInfo))
          
      //   }
        
         
      // }

      handleRefresh = ()=> {
        this.setState({
          refreshing: true,
         
        },()=> {

          this.props.getAllCollegues(this.state, this.props.auth.userInfo)
         return (
           this.setState({
             refreshing:false
           })
         )
        }
        )
      }
    
    render() {
      const {user, loggedIn,allCollegues, loading, userInfo}= this.props.auth


      if(loading){
        return(
          <View style={{flex: 1, justifyContent:'center',alignItems:'center', backgroundColor:'#fff'}}>
            <Spinner color={'#E239FC'} size={50} type={"ThreeBounce"}/>
          </View>
        )
      } 

    return (
      <View style={{flex:1,backgroundColor:'#ffffff' }}> 
       <View style={{flex:1,backgroundColor:'transparent',flexDirection: 'row'}}>
          
          <LinearGradient  colors={['#E239FC', '#6BBAFC']} style={{width: 100 + '%', height: 100 +'%',}} start={{x: 0, y: 0.6}} end={{x: 1, y: 0.5}}>
           <View style={{flexDirection:'row', alignItems:'center',width: 100 + '%', height: 100 +'%',alignSelf: 'center'}}>
               
               <Text style={{color:'white',flex:1 ,textAlign: 'center',fontSize: 32 ,backgroundColor: 'transparent', fontFamily:'Quicksand-Bold'}}>ColleagueHub</Text>
           </View>
 
         </LinearGradient> 
         </View>
          
       <View style={{marginTop:HEIGHT_MIN/35, flex:10 }}>
      
          <FlatList
              data={allCollegues}
             ListEmptyComponent={()=> <View  style={{justifyContent:'center'}}>
             <Text style={{  color:'#333',
             fontSize: TEXTSIZE/28,
             flex:1,
             textAlign:'center',
             fontFamily:'Quicksand-Regular'}}>No Profile</Text>
             </View>}
              renderItem={(item, index)=> this._renderItem(item, index)}
              ListFooterComponent={()=>{
                if(allCollegues.length <=0){
                  return(
                    
                    <View style={{flexDirection:'row', marginTop:7, justifyContent:'center', paddingBottom:20, width:WIDTH_MIN}}>
                    <View
                     style={{marginTop:10,marginBottom:10,width:'65%', margin:'auto', justifyContent:'center' }}>
                       <LinearGradient
                           colors={[ '#3972e9', 'rgba(25, 181, 254, 1)']} style={{borderRadius:30, elevation:7, margin:'auto'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                        >
                      <TouchableOpacity  activeOpacity={0.7}
                      style={{ padding:9, flex:1, borderRadius:10}}
                      onPress={()=> {
                        this.setState({
                          page:1
                        },()=> {
                          this.props.getAllCollegues(this.state, this.props.auth.userInfo)
                        
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
                     style={{marginTop:10,marginBottom:10,width:'65%', margin:'auto', justifyContent:'center' }}>
                       <LinearGradient
                           colors={[ '#3972e9', 'rgba(25, 181, 254, 1)']} style={{borderRadius:30, elevation:7, margin:'auto'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                        >
                      <TouchableOpacity  activeOpacity={0.7}
                      style={{ padding:9, flex:1, borderRadius:10}}
                      onPress={()=> {
                        this.setState({page: this.state.page+ 1}, ()=> this.props.getAllCollegues(this.state, this.props.auth.userInfo))
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
              contentContainerStyle={styles.list}
              numColumns={2}
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

export default connect(mapStateToProps, {getAllUsers, getSingleUser, getAllCollegues})( withNavigation(Profiles))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name:{
    color:'#333',
    fontSize: TEXTSIZE/24,
    flex:1,
    fontFamily:'Quicksand-Medium'
  },
  list: {
   
  
  }
});



//one: #5AB7EF;
//two:#5472F0