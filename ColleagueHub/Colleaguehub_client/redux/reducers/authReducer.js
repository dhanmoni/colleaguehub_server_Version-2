import { LOGIN_WITH_FB,SET_PROFILE_WITHDATA, DELETE_AUTH_USER , GET_CURRENT_USER, GET_CURRENT_PROFILE, GET_ALL_USERS, SET_LOADING, UPDATE_USER_PROFILE, GET_SINGLE_USER, GET_SEARCHED_USER, GET_ALL_COLLEGUES,
GET_POSTS, DELETE_POST, ADD_POST 
} from '../actions/types'
//import isEmpty from '../../validation/isEmpty'

const initialState={
    loading:false,
    loggedIn: false,
    user:{},
    userInfo: {},
    allUsers:null,
    profile:null,
    searchedUser:{},
    allCollegues:[],
    post:{},
    posts:[]
}
export default function(state= initialState, action){
    switch (action.type) {

       case LOGIN_WITH_FB:
        return {
            ...state,
            loggedIn: true,
            user:action.payload,
            loading:false,
            userInfo:null
        }
        case GET_SEARCHED_USER:
        return {
            ...state,
            loggedIn: true,
            loading:false,
            searchedUser:action.payload
        }
        case SET_PROFILE_WITHDATA:
        return {
            ...state,
            loggedIn: true,
            userInfo:action.payload ,
            loading:false     
        }

        case UPDATE_USER_PROFILE:
        return {
            ...state,
            loggedIn: true,
            userInfo:action.payload,
            loading:false     
        }

        case SET_LOADING:
        return {
            ...state,
            loading:true     
        }

        case DELETE_AUTH_USER:
        return {
            ...state,
            loggedIn:false,
            user:action.payload,
            userInfo:action.payload,
            loading:false
        }
        case GET_ALL_USERS:
        return {
            ...state,
           allUsers: action.payload,
           loading:false
            
        }
        case GET_ALL_COLLEGUES:
        return {
            ...state,
           allCollegues:action.payload,
           loading:false
            
        }
        case GET_SINGLE_USER:
        return {
            ...state,
            profile:action.payload,
           loading:false
            
        }
        // case GET_CURRENT_USER:
        //     return {
        //         ...state,
        //       user:action.payload,
              
        //     } 
        case GET_CURRENT_PROFILE:
            return {
                ...state,
              userInfo:action.payload,
              loading:false
            } 
            //post reducer
        case GET_POSTS: 
            return {
              ...state, 
              posts: action.payload,
              loading: false
            }
        case ADD_POST: 
              return {
                ...state,
                posts: [action.payload, ...state.posts],
                post: action.payload
              }
             
              
        case DELETE_POST: 
               return {
                 ...state,
                 posts: state.posts.filter(post => post._id !== action.payload)
               }
       
        default:
            return state;
    }
}