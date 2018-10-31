import React, { Component } from 'react'
import { StyleSheet, Text, View,TextInput, TouchableOpacity,ActivityIndicator, Image, Dimensions, ScrollView, AsyncStorage, Keyboard} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Content, Item, Input, Button, Card, CardItem, Left,  } from 'native-base';
import {connect} from 'react-redux'
import {getAllUsers, getSingleUser, getSearchedUser} from '../redux/actions/authAction'
import * as Animatable from 'react-native-animatable';
let HEIGHT_MIN = Dimensions.get('window').height;
let WIDTH_MIN = Dimensions.get('window').width;
const TEXTSIZE = Dimensions.get('window').width ;
const ACCESS_TOKEN = 'Access_Token'
import debounce from 'lodash/debounce';


class SearchScreen extends Component {
  constructor(){
    super();
    this.state={
      searchBarFocused: false,
      searchInput:'',
      token:''
    }
  }
  


  
  componentDidMount() {
    this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHide = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
    this.keyboardWillShow = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)


  }

  keyboardDidShow = () => {
    this.setState({ searchBarFocused: true })
  }
  keyboardDidHide = () => {
    this.setState({ searchBarFocused: false })
  }

  keyboardWillShow = () => {
    this.setState({ searchBarFocused: true })
  }

  keyboardWillHide = () => {
    this.setState({ searchBarFocused: false })
  }

  async componentDidMount() {
     
    const token = await AsyncStorage.getItem(ACCESS_TOKEN)
    if(token){
      this.setState({
        token
      })
     
    }
    
  }

  makeRequest = debounce(()=> {
    this.props.getSearchedUser(this.state)
  }, 250)

  handleSearch = (text)=> {
      this.setState({searchInput:text}),
      ()=> this.makeRequest()
  }

  render() {
    const {user, loggedIn, allUsers, loading, searchedUser}= this.props.auth
    let profileItem;
   
    if(this.state.searchInput == '' || null || undefined){
      profileItem = ( <View><Text>Search to find collegue...</Text></View> )
    } 
     else {

       profileItem = allUsers.filter(
        (item)=>{
           return item.name.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1
        }
      ).map((itemSearched, index)=>
         {return (
            <TouchableOpacity key ={index} 
            activeOpacity={0.9}
            
            onPress={
             async ()=>{
               await this.props.getSingleUser(itemSearched, this.state)
               if(this.state == null || undefined || ''){
                 alert('Opps! Something went wrong!')
               } else {
               await this.props.navigation.navigate('ProfileItem')
               }
              }}
            style={{height:undefined,width: undefined,marginBottom:HEIGHT_MIN/50}}>
            <Card style={{borderRadius:20}}>
                
            <CardItem cardBody style={{height:(HEIGHT_MIN/4),width: (WIDTH_MIN/ 2.3),borderTopLeftRadius: 20, borderTopRightRadius: 20}}> 
            <Image source={{uri: itemSearched.profileImage}}  resizeMode="cover"
         style={{height:  (HEIGHT_MIN/4) ,width: (WIDTH_MIN/ 2.3),borderTopLeftRadius: 20, borderTopRightRadius: 20}}/> 
               
            </CardItem>
            
            <CardItem style={{height: HEIGHT_MIN/19, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <Left style={{flex:1}}>
                   <Text numberOfLines={1} style={styles.name}>{itemSearched.name}</Text> 
                </Left>
            </CardItem>
           
            </Card>     
        </TouchableOpacity>
         )}
         )
  

    }

    return (
      <View style={{flex:1,backgroundColor:'#ffffff' }}>
       <View style={{flex:1,backgroundColor:'transparent',flexDirection: 'row'}}>
          
          <LinearGradient  colors={['#128EFE', '#931FFF']} style={{width: 100 + '%', height: 100 +'%',}} start={{x: 0, y: 0.6}} end={{x: 1, y: 0.5}}>
           <View style={{width: 100 + '%', height: 100 +'%',alignItems:'center', justifyContent:'center'}}>
              <View  style={{width:WIDTH_MIN/1.1,backgroundColor:'#fff', margin:'auto',height: 60+'%',borderRadius:30, alignItems:'center',  flexDirection:'row'}}>
                 
                 
               
                  <Item>
                    <Animatable.View animation={this.state.searchBarFocused ? 'fadeInLeft': 'fadeInRight'} duration={200}>
                    {this.state.searchBarFocused ? ( <Icon name={this.state.searchBarFocused ? "arrow-left" : ""} size={24} style={{paddingLeft:5, paddingRight:3}} />):(<View></View>)}
                   
                    </Animatable.View>
                 
                    <Input
                     placeholder="Search" 
                     value={this.state.searchInput}
                     onChangeText={this.handleSearch}
                     style={{fontFamily:'Quicksand-Medium'}}/>
                  </Item>
               
              </View>
            
           </View>
 
         </LinearGradient> 
         </View>
         <View  style={{flex:10, backgroundColor:'#fff'}}>
        <ScrollView>
        
        <View style={{flex:1,flexDirection:'row',marginTop:HEIGHT_MIN/35, flexWrap: 'wrap', justifyContent:'space-evenly', }}>
                {profileItem}
        </View>
	   	</ScrollView>
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

export default connect(mapStateToProps, {getSingleUser, getSearchedUser})(SearchScreen)

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
  }
});