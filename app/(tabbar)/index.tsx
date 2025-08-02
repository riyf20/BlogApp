import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";


export default function Index() {

  // grab the data | all blogs
  const {data: blogs, isLoading, error, refetch: fetchData, reset} = useFetch<Blog[]>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs`); 

  const [refreshing, setRefreshing] = useState(false);
  

  return (

    // Acts like a header for main page
    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-16 px-4 mb-4">
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
          >
          <View className="mt-4 bg-white border border-transparent rounded-xl h-full">

            {isLoading ? (
              <>
                <ActivityIndicator size="large" color="#008B8B" className="mt-52"/>
                <View className="justify-center items-center mt-12">
                  <Text className="text-2xl text-secondary mb-3 px-5">
                    Blogs loading
                  </Text>
                </View>
              </>
            ) : error ? (
              <>
                <View className="justify-center items-center mt-12">
                  <Text className="text-2xl text-red-600 mb-3 px-5">
                    Error Occured!
                  </Text>
                  <Text className="text-2xl text-red-600 mb-3 px-5">
                    Error: {error}
                  </Text>
                  
                </View>
              </>
            ) : (
              <>
                {/* Maps blogs and renders a card for each */}
                {blogs?.map((item:Blog, index) => (
                  <BlogCard key={item.id} {...item} index={index}/>
                ))}
              </>
            )}

          </View>

        </ScrollView>

      </View>
     
    </View>
  );
}