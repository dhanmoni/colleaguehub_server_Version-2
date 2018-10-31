import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import {connect} from 'react-redux'
import {Tabs, LoginPage, CreatePropfilePage} from '../config/routers'
class Layout extends Component {
  render() {
    const {user, loggedIn, userInfo, allCollegues} = this.props.auth;
    if(loggedIn ===true && userInfo === null ){
        return(
            <CreatePropfilePage/>
        )
     }
     else if(loggedIn===true && userInfo !== null ){
        return (
            <Tabs/>
        )
     }
    else {
        return(
            <LoginPage/>
        )
    }
  
   
  }
}

const mapStateToProps = (state)=> {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Layout)
