import { Tabs } from "expo-router";
import { ImageBackground, Text, View } from "react-native";
import {Feather, AntDesign} from '@expo/vector-icons';
import { images } from "@/constants/images";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HapticTab } from "@/components/HapticTab";

// For the tab bar at the bottom
function TabIcon({ focused, icon, title }: any) {

  // If tab is focused --> will put background behind it
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
      <>
        {icon}
          <Text className="text-light-100 text-base font-bold ml-2">
            {title}
          </Text>
      </>
      </ImageBackground>
    );
  }

  // Else no background | basic tab bar 
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      {icon}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#121C22",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#000000",
        },
      }}
    >
      <Tabs.Screen
        // "Name" must match the file that is corresponding to it  
        name="index"
        options={{
          // "Title" will be name of page | "Header" toggles its visibility
          title: "Blogs",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<Feather name="home" size={24} color="white" />} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<Feather name="search" size={24} color="white" />} title="Search" />
          ),
        }}
      />

      <Tabs.Screen
        name="posts"
        options={{
          title: "Posts",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<MaterialCommunityIcons name="post" size={24} color="white" />} title="Posts" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={<AntDesign name="user" size={24} color="white" />} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}