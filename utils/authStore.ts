import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import {getItem, setItem, deleteItemAsync} from "expo-secure-store"

// This defines the states that will be saved
type UserState = {
    isLoggedin: boolean;
    shouldCreateAccount: boolean;
    logIn: () => void;
    logOut: () => void;
}

// Export the hook, takes an arrow function that returns as object with each of the keys in our state
// (defined above)
export const useAuthStore = create(
    
    // first argument for the persistor is what we are persisting | the object to store
    persist
        <UserState>((set) => ({
        isLoggedin: false,
        shouldCreateAccount: false,
        logIn: () => {
            set((state) => {
                return {
                    ...state,
                    isLoggedin: true,
                }
            })
        },
        logOut: () => {
            set((state) => {
                return {
                    ...state,
                    isLoggedin: false,
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