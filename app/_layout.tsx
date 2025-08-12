import "./globals.css";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useAuthStore } from "@/utils/authStore";
import { GluestackUIProvider } from '@gluestack-ui/themed';
import config from 'gluestack-ui.config'; 

export default function RootLayout() {

  // Persisted data
  const { isLoggedin } = useAuthStore();

  return (
    <>
      <StatusBar hidden={false} />

      {/* Link to use Gluestack component library */}
      <GluestackUIProvider config={config}>
        
          {/* Structure for condition page viewing */}
          <Stack>
            
            {/* Will allow users to access these pages if loggedin */}
            <Stack.Protected guard={isLoggedin}>
              <Stack.Screen name="(tabbar)" options={{ headerShown: false }} />
              <Stack.Screen name="blog/[id]" options={{ headerShown: false }} />                
              <Stack.Screen name="blog/create" options={{ headerShown: false }} />
            </Stack.Protected>
            
            {/* Will redirect users to log in | sign up if they are not loggedin */}
            <Stack.Protected guard={!isLoggedin}>
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} /> 
            </Stack.Protected>
            
          </Stack>
      </GluestackUIProvider>
    </>
  );
}