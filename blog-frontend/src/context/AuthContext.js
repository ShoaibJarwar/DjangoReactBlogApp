import React, { createContext, useReducer, useContext} from "react";


const AuthContext = createContext();

const initialState = {
    user: null,
    token: null,
};

function reducer(state, action){
    switch(action.type){
        case "LOGIN":
            return {...state, user: action.payload.user, token: action.payload.token};
        case "LOGOUT":
            return {...state, user: null, token: null};
        default:
            return state;
    }
}


export function AuthProvider({children}){
    const [state, dispatch] = useReducer(reducer, initialState);

    return(
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}

export function UseAuth(){
    return useContext(AuthContext);
}