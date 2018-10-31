import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Text, StyleSheet, View,ScrollView, Dimensions, TouchableOpacity,ActivityIndicator, TextInput,ImageBackground, AsyncStorage, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {  LoginManager,LoginButton,AccessToken,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';
//import { LoginManager,AccessToken  } from 'react-native-fbsdk';
//import PropTypes from 'prop-types'

import {loggInUserWithFb} from '../redux/actions/authAction'
const ACCESS_TOKEN = 'Access_Token'

const HEIGHT = Dimensions.get('window').height
const TEXTSIZE = Dimensions.get('window').width ;
const WIDTH = Dimensions.get('window').width ;

class LoginWithFB extends Component {
    
  constructor(props){
    super(props);
    this.state={
      name: '',
      id:'',
     profile:'',
     first_name:'',
     token:'',
    
    };
    //this.logintoFacebook = this.logintoFacebook.bind(this)
  }

   
 setdata = async() => {
  try{       
    console.log('token is being set...')
    await AsyncStorage.setItem(ACCESS_TOKEN, this.state.token)
    const token = await AsyncStorage.getItem(ACCESS_TOKEN)
    if(token){
    
    console.log(token)
    } else {
     console.log('Unable to fetch token')
    }
  } catch(error){
     console.log('Opps!!!')
    }
}
 

 

  render() {
    const {user, loggedIn} = this.props.auth;
    return (
      <View style={styles.container}>
       <ImageBackground resizeMode='cover' blurRadius={0}  source={require('../images/Background_Login_3-min.jpg')} style={{flex:1, position:'absolute', top:0, left:0, right:0, bottom:0, }}> 
           </ImageBackground>
           <View style={{flex: 1,
                backgroundColor: 'transparent',
                paddingHorizontal:10,
                alignItems:'center',
                justifyContent:'center',
              
               
               }}>

         <Text style={styles.welcomeText}>Welcome To ColleagueHub</Text>
         <Text style={styles.descText}>The best way to connect with your collegues online!</Text>
         <Text  style={styles.para}>Please Sign in with Facebook to continue</Text>
         <View style={{padding:10}}>
            <LoginButton
          readPermissions={["public_profile"]}  
         
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data)
                    this.setState({token: data.accessToken.toString()})

                    console.log(data.accessToken.toString()) 
                    _responseInfoCallback  = (error, result) => {
                       if (error) {
                        alert('Error fetching data: ' + error.toString());
                      } else {
                       
                       this.setdata()
                       return this.props.loggInUserWithFb(this.state)
                         
                       }
                     }

                    const infoRequest = new GraphRequest(
                      '/me?fields=name,picture.type(large),first_name',
                      null,
                      _responseInfoCallback
                    );
                   
                    new GraphRequestManager().addRequest(infoRequest).start();
                  }
                )
                
              }
            }
          }
          onLogoutFinished={() => {
            
          }}/>  
          </View>
          </View>
      </View>
    )
  }
}


const mapStateToProps = (state)=> {
  return{
    auth: state.auth
  }
}

export default connect(mapStateToProps, {loggInUserWithFb})(LoginWithFB)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    welcomeText:{
        fontSize: TEXTSIZE/10,
        color:'#fff',
        fontFamily:'Pacifico',
      paddingBottom:10,
        textAlign:'center',
        paddingTop:10
    },
    descText:{
      fontSize: TEXTSIZE/18,
      color:'#fff',
      fontFamily:'Quicksand-Bold',
      
      textAlign:'center'
  },
    para:{
        fontSize:TEXTSIZE/22,
        color:'#fff',
        marginBottom:30,
        marginTop:30,
        fontFamily:'Quicksand-Medium',
        flexWrap:'wrap',
        textAlign:'center'
    }
})



          


   