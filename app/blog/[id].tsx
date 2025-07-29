import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import useFetch from '@/services/useFetch';
import PictureCard from '@/components/PictureCard';

const BlogDetails = () => {

  // Grabs id 
  const {id} = useLocalSearchParams();

  // Fetches blog details based on id 
  const {data: blog, isLoading, error} = useFetch<Blog>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/` + id); 

  const [hasimages, setHasImages] = useState(false);  // Blog post => Images
  const [images, setImages] = useState([]);  // Array of blog's images
  const [initialImages, setInitialImages] = useState([]);  // Initial set of images 
  const [imageLoaded, setImageLoaded] = useState(false);  // Image render 
  const [comments, setComments] = useState([]);  // Blog post => Comments

  
  useEffect(() => {
    if (blog) {
      // Fetch images 
      fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/${id}/images`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        // Will be used to display images
        setImages(data);

        // Used as backup when user makes edits
        setInitialImages(data);

        // Will be used to conditional messages (loading) if blog has images
        setHasImages(((data.length) > 0));
        setImageLoaded(hasimages);
      })


      // Fetch comments
      fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/${id}/comments`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())

      // set comments
      .then(data => setComments(data))
      .catch(err => console.error('Error fetching comments:', err));


    }
  }, [blog, id, hasimages]);
  // removed dependancies for now
  // token, editComment, edit, commentsUpdated

  return (

    // Acts as header and will show blog's title
    <View className='flex-1 bg-dark-100'>
      <View className="justify-center items-center flex-row mt-20 px-4 mb-4">
        <Text className="text-3xl text-light-100 ml-3 font-bold">{blog?.title}</Text>
      </View>

      {/* Shows the blog details  */}
      <View className="mt-4 bg-white border border-transparent rounded-3xl h-full">

        <Text className='m-4 mt-8 font-medium text-xl text-black'>
          {blog?.body}
        </Text>

        {/* Conditionally renders images */}
        {images.length > 0 && 
          <>
            <View>
              <FlatList
                data={images}
                horizontal
                renderItem={({ item }) => <PictureCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                style={{height: 300, marginHorizontal: 16, marginBottom: -20}}
              />
            </View>
          </>
        }

        <View className='mt-[-20px]'>
          <Text className='m-4'>
            Written by: {blog?.author}
          </Text>
        </View>
        
        
      </View>


    </View>
  )
}

export default BlogDetails