import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {
    token: string;
    user: User;
    username: string;

    isLoggedin: boolean;
    shouldCreateAccount: boolean;

    logIn: ({token, user, username}:logInProps) => void;
    logOut: () => void;
}

type logInProps = {
    token:string, 
    user:User, 
    username:string,
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
        logIn: ({token, user, username}:logInProps) => {
            set((state) => {
                return {
                    ...state,
                    isLoggedin: true,
                    shouldCreateAccount: false,
                    token,
                    user,
                    username,
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
                }
            })
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