import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {
    token: string;
    user: User;
    username: string;
    refreshToken:string,

    isLoggedin: boolean;
    shouldCreateAccount: boolean;

    logIn: ({token, user, username, refreshToken}:logInProps) => void;
    logOut: () => void;
    setUsername: (username:string) => void;
    changeToken: (newToken:string) => void;
}

type logInProps = {
    token:string, 
    user:User, 
    username:string,
    refreshToken:string,
}

// Export the hook, takes an arrow function that returns as object with each of the keys in our state
// (defined above)
export const useAuthStore = create(
    
    // first argument for the persistor is what we are persisting | the object to store
    persist
        <UserState>((set) => ({
        isLoggedin: false,
        shouldCreateAccount: false,
        token: '',
        user: {
            id:0, 
            isGuest: false, 
            role:'', 
            username:''
        },
        username: '',
        refreshToken: '',
        logIn: ({token, user, username, refreshToken}:logInProps) => {
            set((state) => {
                return {
                    ...state,
                    isLoggedin: true,
                    shouldCreateAccount: false,
                    token,
                    user,
                    username,
                    refreshToken,
                }
            })
        },
        logOut: () => {
            set((state) => {
                return {
                    ...state,
                    isLoggedin: false,
                    shouldCreateAccount: false,
                    token: '',
                    user: {
                        id:0, 
                        isGuest: false, 
                        role:'', 
                        username:''
                    },
                    username: '',
                    refreshToken: '',
                }
            })
        },
        setUsername(username) {
            set((state) => ({
                ...state,
                username,
                user:{
                    ...state.user,
                    username,
                }
            }))
        },
        changeToken(newToken) {
            set((state) => ({
                ...state,
                token: newToken,
            }))
        }
        }),
   
    // second argument is where we are storing it
    {
        name: "auth-store",
        storage: createJSONStorage(() => ({
            setItem, 
            getItem,
            removeItem: deleteItemAsync,
        }))
    }
))