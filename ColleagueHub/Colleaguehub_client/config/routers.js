import React from 'react'
import { Text, View, Image } from 'react-native'
import {createMaterialTopTabNavigator,createTabNavigator, createSwitchNavigator, createStackNavigator} from 'react-navigation'

import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../Component1/HomeScreen';
import SearchScreen from '../Component1/SearchScreen';
import UserScreen from '../Component1/UserScreen';
import LoginWithFB from '../Component2/LoginWithFB'
import EditProfile from '../Component1/EditProfile'
import CreateProfile from '../Component1/CreateProfile'
import ProfileItem from '../profiles/profileItem'
import StoryScreen from '../Component1/StoryScreen'
import PostScreen from '../Component1/PostScreen'

export const UserStack = createStackNavigator(
  {
  User:{
    screen:UserScreen
  },
  EditProfile:{
    screen: EditProfile
    
  },
  
}
)

UserStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const StoryStack = createStackNavigator(
  {
  StoryScreen:{
    screen:StoryScreen
  },
  PostScreen:{
    screen: PostScreen
    
  },
  
}
)

StoryStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const LoginPage = createSwitchNavigator({
  Login: {
    screen: LoginWithFB
  },
 
})

export const CreatePropfilePage = createSwitchNavigator({
  CreateProfile: {
    screen: CreateProfile
  },
 
})


export const HomeStack = createStackNavigator(
  {
  HomeScreen:{
    screen:HomeScreen
  },
  ProfileItem:{
    screen: ProfileItem
    
  },
  
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 }
)
HomeStack.navigationOptions = ({ navigation }) => {
 
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};


 export const Tabs = createTabNavigator(
     {
        Home: { 
            screen: HomeStack,
            navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon:
              ({ focused }) => (
                focused ?
                 <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#e239fc', borderRadius:25, height:50, width:50,position:'absolute'}}>
                    <Icon name="home"  size={33} style={{}} color='#fff' />
                </View>:
                <Icon name="home"  size={27} style={{}} color="#808080" />
              )
          },
          },
          Story: { 
            screen: StoryStack,
            navigationOptions: {
            tabBarLabel: 'Feed',
            tabBarIcon:
              ({ focused }) => (
                focused ?
                 <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#4776e6', borderRadius:25, height:50, width:50,position:'absolute'}}>
                    <Icon name="list-alt"  size={33} style={{}} color='#fff' />
                </View>:
                <Icon name="list-alt"  size={27} style={{}} color="#808080" />
              )
          },
          },
        
        Search:{
            screen: SearchScreen,
            navigationOptions: {
              tabBarLabel: 'Search',
              
              tabBarIcon:
              ({ focused }) => (
                focused ?
                <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#931FFF', borderRadius:25, height:50, width:50,position:'absolute'}}>
                <Icon name="search"  size={33} style={{}} color='#fff' />
            </View>:  <Icon name="search"  size={25} style={{}} color="#808080" />
              )
               
           },
           },
     
  
         
          User: { 
          screen:UserStack,
            navigationOptions: {
            tabBarLabel: 'User',
           
            tabBarIcon:
            ({ focused }) => (
              focused ?
              <View style={{alignItems:'center',elevation:1, justifyContent:'center',backgroundColor: 'rgba(212, 19, 160,1)', borderRadius:25, height:50, width:50,position:'absolute'}}>
              <Icon name="user"  size={33} style={{}} color='#fff' />
          </View>:
              <Icon name="user"  size={26} style={{}} color="#808080" />
            )
          },
          
          },
          
 },

//one #E239FC;
//two #6BBAFC
//three #FF014B;
//#3972e9
//four #FDBF3F
//#D492FF
//#96B5FF
//#931FFF
//#128EFE
//#514a9d
//#24c6dc
//#4776e6
//#8e54e9
//Quicksand_Bold
//Quicksand-Light
//Quicksand-Medium
//Quicksand-Regular

 {
        
    tabBarPosition: 'bottom',
    tabBarOptions: {
      
       showLabel: false,
       showIcon: true,
       style:{
        backgroundColor: '#fff',
       
        padding: 5, margin:0, 
        
       },
       tabStyle: {
        margin: 0,
        padding:0
      },
       iconStyle: {
        width: 50,
        height: 50,
        padding:0},
       indicatorStyle:{
           opacity:0
       }
    }
 }

 ) 



 