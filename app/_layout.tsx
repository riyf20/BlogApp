import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      {/* time and other status icons */}
      <StatusBar hidden={false} />

      {/* structure of the app */}
      {/* essentially defines 2 main groups: tab, blogDetails */}
      <Stack>
        <Stack.Screen
          name="(tabbar)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="blog/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}