import axios from 'axios';
import {createContext, useState, useReducer} from 'react';

export const UserContext=createContext()

export const userReducer=(state,action)=>{
    switch(action.type){
        case 'SET_USER':
            return{
                user: action.payload
            }
        // case 'SET_ROLE':
        //     return{
        //         role: action.payload
        //     }    
        // case 'ADD_CLASS':
        //     return {
        //         classes: [action.payload, ...state.classes]
        //     }    
    }

}




export const UserContextProvider=({children})=>{
    const [state,dispatchUser]= useReducer(userReducer,{
        user: null
    })



    return (
        <UserContext.Provider value={{...state,dispatchUser}}>
            {children}
        </UserContext.Provider>
    )
}