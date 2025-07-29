import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

import Animated, { FadeIn, FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated';


type BlogCardProps = Blog & { index: number };

const BlogCard = ({ title, id, author, index }: BlogCardProps) => {
        
  return (
    <>
        <Animated.View entering={
                FadeInDown
                .duration(700)
                .delay(index * 150)
                .reduceMotion(ReduceMotion.Never)
            }>
            <Link href={`/blog/${id}`} asChild>
            
            <TouchableOpacity className="border border-black rounded-2xl mt-4 mx-2">
                <Text
                    className="text-lg text-primary font-bold mt-5 px-5"
                >{title}</Text>
                <Text
                    className="text-lg text-secondary mb-3 px-5"
                >Written by {author}</Text>
            </TouchableOpacity>
            
            </Link>
        </Animated.View>
    </>
  )
}

export default BlogCard