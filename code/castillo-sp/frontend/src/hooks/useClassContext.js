import { ClassContext} from "../context/ClassContext";
import { useContext } from "react";


export const useClassContext=()=>{
    const context=useContext(ClassContext)

    if(!context){
        throw Error("may mali")
    }

    return context
}