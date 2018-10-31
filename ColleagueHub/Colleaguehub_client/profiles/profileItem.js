import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator, Image, Dimensions,Linking, ImageBackground,StatusBar, ScrollView, Button, Alert, AsyncStorage } from 'react-native';
import {connect} from 'react-redux'
import { Container, Header, Content, Card, CardItem, Right } from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient';
import {getAllUsers, getSingleUser} from '../redux/actions/authAction'
import Spinner from 'react-native-spinkit'
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const TEXTSIZE = Dimensions.get('window').width ;
const ACCESS_TOKEN = 'Access_Token'
import {BannerView} from 'react-native-fbads'

class ProfileItem extends Component {

   


  render() {
    const {user, loggedIn, allUsers, loading, profile}= this.props.auth

    if(loading){
        return(
          <View style={{flex: 1, justifyContent:'center',alignItems:'center', backgroundColor:'#fff'}}>
            <Spinner color={'#E239FC'} size={50} type={"Wave"}/>
          </View>
        )
      }
      return (
     
        <ScrollView style={{flex:1, backgroundColor:'#ffffff'}} showsVerticalScrollIndicator={false}>
        <View style={{flex:1}}>
        {/******************user profile*****************/}
        
          <View style={{height: HEIGHT/2, borderBottomLeftRadius:20, borderBottomRightRadius:20 }}>
          <View style={{alignItems:'center',flexDirection:'row', position:'absolute', top:13, left:15, zIndex:100}}>
            
            
          </View>
          
            <ImageBackground blurRadius={2.3} resizeMode='cover' source={{uri:profile.profileImage}} style={{flex:1, overflow:'hidden', borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
                <Icon
                onPress={()=> this.props.navigation.navigate('HomeScreen')}
                name='arrow-left' size={30} color="#fff" style={{position:'absolute', top:20, left:20, padding:10,zIndex:1000 }}/>
                <LinearGradient 
                   colors={[ 'rgba(212, 19, 190,0.5)','rgba(212,146, 255, 0.7)', 'rgba(150, 180, 245, 0.2)']} style={{width: 100 + '%', height: 100 +'%',overflow:'hidden'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.9}}
                ><View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
                  <Image source={{uri:profile.profileImage}} style={styles.image}/> 
                  </View>
                  </LinearGradient>
             </ImageBackground>
          </View>
          {/******************* user details*******************/}
          {/* <LinearGradient 
                   colors={['rgba(212,146, 255, 1)', 'rgba(150, 180, 245, 1)']} style={{width: 100 + '%', height: 100 +'%',overflow:'hidden'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.9}}
                > */}
                  
  
          
                 <View style={{marginTop:10,marginLeft:3, marginRight:3,}}>
                 <View style={{}}>
  
                 
             <Card style={{ margin:0,elevation:8,borderRadius:20, paddingBottom:0,  }}>
                
               
  
               <CardItem style={{borderTopLeftRadius:20, borderTopRightRadius:20}}>
                 <Text style={styles.name}>{profile.name}</Text> 
               </CardItem>
              
              <CardItem>
              <Icon name="user-graduate" size={22}  color= 'rgba(212, 19, 160,1)' style={{width: WIDTH/10,alignSelf:'center'}}/>
              <Text style={styles.institute}>{profile.institution}</Text>  
               </CardItem>
               <CardItem>
               <Icon name="briefcase" size={22}  color= 'rgba(212, 19, 160,1)' style={{width: WIDTH/10,alignSelf:'center'}}/>
              <Text style={styles.institute}>{profile.status}</Text>
                
               </CardItem>
               
               {profile.residence == '' || null || undefined ? ( <View></View>) :
            (<CardItem>
            <Icon name="map-marker"  color= 'rgba(212, 19, 160,1)' size={25} style={{width: WIDTH/10,alignSelf:'center'}}/>
            <Text style={styles.institute}>{profile.residence}</Text>
            </CardItem>)
            
              }  

                 {profile.ig_username == '' || null || undefined ? ( <View></View>) :
              (<CardItem>
              <Icon name="instagram"  color= 'rgba(212, 19, 160,1)' size={25} style={{width: WIDTH/10,alignSelf:'center'}}/>
              <Text style={styles.institute}>{profile.ig_username}</Text>
              </CardItem>)
              
              }

               {profile.bio == '' || null ||undefined ? (
                 <View></View>
              ) :
               (<CardItem >
                  <Icon name="info-circle" color= 'rgba(212, 19, 160,1)'size={22} style={{width: WIDTH/10,alignSelf:'center'}}/>
                  <Text style={styles.bio}>{profile.bio}</Text>
                </CardItem>)
              }
              <CardItem style={{borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
                 
              </CardItem>
             </Card>
             </View>
             </View>
             {
               profile.ig_username == ''|| null || undefined || profile.facebookId == user.facebookId ? (<View></View>):(
                <View style={{flexDirection:'row', marginTop:7, justifyContent:'center', paddingBottom:20, width:WIDTH}}>
                <View
                 style={{marginTop:10,marginBottom:10,width:'65%', margin:'auto', justifyContent:'center' }}>
                   <LinearGradient
                       colors={[ '#833ab4', '#fd1d1d', '#fcb045']} style={{borderRadius:30, elevation:7, margin:'auto'}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                    >
                  <TouchableOpacity  activeOpacity={0.7}
                  style={{ padding:9, flex:1, borderRadius:10}}
                       onPress={()=> {
                        Linking.canOpenURL('https://instagram.com/'+profile.ig_username).then(supported => {
                          if (!supported) {
                            return Linking.openURL('https://instagram.com/'+profile.ig_username)
                          } else {
                            return Linking.openURL('https://instagram.com/'+profile.ig_username);
                          }
                        }).catch(err => console.error('An error occurred', err));
                      
                         }}>
                    <Text 
                    style={{alignSelf:'center', color:'white', fontSize:TEXTSIZE/24, fontFamily:'Quicksand-Bold'}}>
                    View Instagram Profile
                    </Text>
                  </TouchableOpacity>
                  </LinearGradient>
                </View>
               
                </View>
               )
             }
             
            
           
         
         
             <View style={{marginBottom:20}}>
                  <BannerView
                placementId="1911005745652403_1918573884895589"
                type="rectangle"
              
              />
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

export default connect(mapStateToProps, {getSingleUser})(ProfileItem)

const styles = StyleSheet.create({
  image:{
    height: HEIGHT/3.6,
    width:HEIGHT/3.6,
    borderRadius:HEIGHT/2,
    borderColor:'white',
    borderWidth:2
  },
 
  name:{
    color:'#333',
    fontSize: TEXTSIZE/18,
    textAlign:'left',
    paddingTop:3,
    paddingBottom:3,
    fontFamily:'Quicksand-Bold',
   
    flexWrap:'wrap'
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
    fontFamily:'Quicksand-Medium'
  },
  
})