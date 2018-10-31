import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Layout from './layout/Layout'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
export default class App extends React.Component {
  
    
  
  render() {
    return(
     
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
             <Layout/> 
          </Provider>
          
        </PersistGate>
       
     
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#fff'
  }
})

//'http://192.168.43.76:3001/'
