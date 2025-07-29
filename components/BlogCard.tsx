import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const BlogCard = ({
    id,
    title,
    body,
    author,
    created_at,
    updated_at,
}: Blog) => {
  return (
    
        // aschild means the card that is inside the link is clickable
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
  )
}

export default BlogCard