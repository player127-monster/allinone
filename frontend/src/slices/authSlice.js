
import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'user',
    initialState: {
        loading: true,     // for loading screen
        isAuthenticated:false
    },
    reducers: {
        loginRequest(state, action){                 // single product pending while request processing
            return {
                ...state,                           //coping it before state - its initialState
                loading: true, 
            }
        },
        loginSuccess(state, action){                 //single product successfully got from backed
            return {
                loading:false,
                isAuthenticated:true,   
                user: action.payload.user       //single product getting backend products api products to fronend products
            }
        },
        loginFail(state, action){                   //if failed to retrive
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },
        clearError(state, action){                   //if failed to retrive
            return{
                ...state, 
                error: null
            }
        },


        registerRequest(state, action){                 
            return {
                ...state,                           
                loading: true, 
            }
        },
        registerSuccess(state, action){                 
            return {
                loading:false,
                isAuthenticated:true,   
                user: action.payload.user       
            }
        },
        registerFail(state, action){                   
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },


        loadUserRequest(state, action){                 
            return {
                ...state,    
                isAuthenticated:false,                       
                loading: true, 
            }
        },
        loadUserSuccess(state, action){                 
            return {
                loading:false,
                isAuthenticated:true,   
                user: action.payload.user       
            }
        },
        loadUserFail(state, action){                   
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },

        
        logoutSuccess(state, action){                 
            return {
                loading:false,
                isAuthenticated:false,     
            }
        },
        logoutFail(state, action){                   
            return{
                ...state,
                error: action.payload
            }
        },

         updateProfileRequest(state, action){                 
            return {
                ...state,                           
                loading: true, 
                isUpdated:false
            }
        },
        updateProfileSuccess(state, action){                 
            return {
                ...state,
                loading:false,  
                user: action.payload.user,
                isUpdated:true      
            }
        },
        updateProfileFail(state, action){                   
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },

        clearUpdateProfile(state,action){
            return{
                ...state,
                isUpdated:false
            }
        },

        resetUpdate(state) {
            state.isUpdated = false;
        },

        resetMessage(state) {
           state.message = null;
        },


         updatePasswordRequest(state, action){                 
            return {
                ...state,                           
                loading: true, 
                isUpdated:false
            }
        },
        updatePasswordSuccess(state, action){                 
            return {
                ...state,
                loading:false,
                isUpdated:true      
            }
        },
        updatePasswordFail(state, action){                   
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },

         forgotPasswordRequest(state, action){                 
            return {
                ...state,                           
                loading: true, 
            }
        },
        forgotPasswordSuccess(state, action){                 
            return {
                ...state,
                loading:false,
                message:action.payload.message     
            }
        },
        forgotPasswordFail(state, action){                   
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },

         resetPasswordRequest(state, action){                 
            return {
                ...state,                           
                loading: true, 
            }
        },
        resetPasswordSuccess(state, action){                 
            return {
                ...state,
                loading:false,
                isAuthenticated:true,
                user:action.payload.user   
            }
        },
        resetPasswordFail(state, action){                   
            return{
                ...state,  
                loading:false,
                error: action.payload
            }
        },
    }
});

const {actions, reducer }= authSlice;

export const {loginRequest,
     loginSuccess, 
     loginFail ,
     clearError,
     registerRequest, 
     registerSuccess, 
     registerFail,
     loadUserRequest,
     loadUserSuccess,
     loadUserFail,
     logoutSuccess,
     logoutFail,
     updateProfileRequest,
     updateProfileSuccess,
     updateProfileFail,
     resetUpdate,resetMessage,clearUpdateProfile,
     updatePasswordRequest,updatePasswordSuccess,updatePasswordFail,
     forgotPasswordRequest,forgotPasswordSuccess,forgotPasswordFail,
     resetPasswordRequest,resetPasswordSuccess,resetPasswordFail,
    } = actions;

export default reducer;