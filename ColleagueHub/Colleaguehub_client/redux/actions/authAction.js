import { LOGIN_WITH_FB, SET_PROFILE_WITHDATA, DELETE_AUTH_USER, GET_ALL_USERS,SET_LOADING ,GET_CURRENT_PROFILE, UPDATE_USER_PROFILE, GET_SINGLE_USER, GET_SEARCHED_USER, GET_ALL_COLLEGUES, GET_POSTS, ADD_POST, DELETE_POST} from './types'
import axios from 'axios'
import {AsyncStorage} from 'react-native'
const ACCEES_TOKEN = 'Access_Token'

export const loggInUserWithFb = (userData) => dispatch  => {
  
    
       dispatch(setLoading());
        axios.post(`http://192.168.43.76:3001/auth/fblogin?access_token=${userData.token}`,
            userData)
            .then(res=> {
                console.log(res)
             dispatch({
                type: LOGIN_WITH_FB,
                payload: res.data
        })})
         
        .catch(err=> console.log(err))
}

export const setCurrentUserWithProfile = (userData)=> dispatch=> {
    
  console.log('User data is ', userData)
    axios.post(`http://192.168.43.76:3001/auth/createprofile?access_token=${userData.token}`,
    userData)
    .then(res=> 
       {  
           console.log('res is ', res)
            dispatch({
            type: SET_PROFILE_WITHDATA,
            payload: res.data
        })}
         )
        
        .catch(err=> console.log(err))
}

export const getAllUsers = (userData)=> dispatch=> {
    
   
    axios.get(`http://192.168.43.76:3001/auth/allusers?access_token=${userData}`
    )
    .then(res=> 
        dispatch({
            type: GET_ALL_USERS,
            payload: res.data
        })
         )
        
        .catch(err=> console.log(err))
}
export const getAllCollegues = (userData, userinfo)=> dispatch=> {
    
    
     axios.get(`http://192.168.43.76:3001/auth/allcollegues?access_token=${userData.token}&institution=${userinfo.institution}`,
     userData)
     .then(res=> 
         dispatch({
             type: GET_ALL_COLLEGUES,
             payload: res.data
         })
          )
         
         .catch(err=> console.log(err))
 }


export const getSingleUser = (userData, token)=> dispatch=> {
    
    dispatch(setLoading())
     axios.get(`http://192.168.43.76:3001/auth/allusers/${userData.facebookId}?access_token=${token.token}`,
     userData)
     .then(res=> 
         dispatch({
             type: GET_SINGLE_USER,
             payload: res.data
         })
          )
         
         .catch(err=> console.log(err))
 }


 export const getSearchedUser = (userData)=> dispatch=> {
    
    
     axios.get(`http://192.168.43.76:3001/auth/allusers?name=${userData.searchInput}&access_token=${userData.token}`,
     userData)
     .then(res=> 
         dispatch({
             type: GET_SEARCHED_USER,
             payload: res.data
         })
          )
         
         .catch(err=> console.log(err))
 }



export const updateUserProfile = (userData)=> dispatch=> {
    
    
     axios.post(`http://192.168.43.76:3001/auth/updateProfile?access_token=${userData.token}`,
     userData)
     .then(res=> 
         dispatch({
             type: UPDATE_USER_PROFILE,
             payload: res.data
         })
          )
         
         .catch(err=> console.log(err))
 }



export const getCurrentProfile = (userData)=> dispatch=> {
    
    
     axios.get(`http://192.168.43.76:3001/auth/currentProfile?access_token=${userData}`,
     userData)
     .then(res=> 
         dispatch({
             type: GET_CURRENT_PROFILE,
             payload: res.data
         })
          )
         
         .catch(err=> console.log(err))
 }

export const setLoading = () =>{
    return {
        type: SET_LOADING
    }
}



export const deleteAuthUser = (userData)=> dispatch=> {
    console.log('userData is ', userData)
    
    axios.delete(`http://192.168.43.76:3001/auth/user?access_token=${userData}`)
    .then(res=> {
        console.log(res)
        dispatch({
            type: DELETE_AUTH_USER,
            payload: {}
        })}
    )
        .catch(err=> console.log(err))
}

//post
export const getposts = (userdata, userinfo)=>dispatch=> {
  
    axios.get(`http://192.168.43.76:3001/auth/allposts?access_token=${userdata.token}&institution=${userinfo.institution}`)
    .then(res=> {
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    }).catch(err=> res.status(404).json({message:'Not found'}))
}

export const addpost = (userdata, userinfo)=>dispatch=> {
    
    axios.post(`http://192.168.43.76:3001/auth/addpost?access_token=${userdata.token}&institution=${userinfo.institution}`, userdata)
    .then(res=> {
        
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setLoading())
    }).catch(err=> res.status(404).json({message:'Something went wrong'}))
}

export const addlike = (postdata, token)=>dispatch=> {
   
    axios.post(`http://192.168.43.76:3001/auth/like/${postdata}?access_token=${token}`, postdata)
    .then(res=> {
        dispatch(getposts())
    }).catch(err=> res.status(404).json({message:'Something went wrong'}))
}
 

export const deletepost = (postData, token)=> dispatch=> {
   
    axios.delete(`http://192.168.43.76:3001/auth/deletepost/${postData}?access_token=${token}`)
    .then(res=> {
       
        dispatch({
            type: DELETE_POST,
            payload: {}
        })}
    )
        .catch(err=> res.status(500).json({message:'Opps! Cannot delete post'}))
}