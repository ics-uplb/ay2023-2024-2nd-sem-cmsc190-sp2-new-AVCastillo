import axios from 'axios';
import {createContext, useState, useReducer} from 'react';

export const ClassContext=createContext()

export const classesReducer=(state,action)=>{
    switch(action.type){
        case 'SET_CLASSES':
            return{
                classes: action.payload
            }
        case 'ADD_CLASS':
            return {
                classes: [action.payload, ...state.classes]
            }
        
    }

}




export const ClassContextProvider=({children})=>{
    const [state,dispatch]= useReducer(classesReducer,{
        classes: null
    })



    return (
        <ClassContext.Provider value={{state,dispatch}}>
            {children}
        </ClassContext.Provider>
    )
}