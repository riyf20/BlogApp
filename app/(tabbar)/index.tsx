import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import React, { useEffect } from "react";
import BlogCard from "@/components/BlogCard";


export default function Index() {

  // grab the data | all blogs
  const {data: blogs, isLoading, error} = useFetch<Blog[]>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs`); 
  

  return (

    // Acts like a header for main page
    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-20 px-4 mb-4">
        <Image
          source={images.logo}
            className="w-10 h-10"
            resizeMode="contain"
        />
        <Text className="text-4xl text-light-100 ml-3 font-bold">Blogs</Text>
      </View>
      
      {/* Acts as the list of blogs */}
      <View>

        <ScrollView
          className="" 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{
            minHeight: '100%',
          }}
        >
          <View className="mt-4 bg-white border border-transparent rounded-xl h-full">

            {/* Maps blogs and renders a card for each */}
            {blogs?.map((item:Blog) => (
              <BlogCard key={item.id} {...item} />
            ))}
          </View>


        </ScrollView>

      </View>
     
    </View>
  );
}
