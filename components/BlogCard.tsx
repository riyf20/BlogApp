import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Animated, {FadeInDown, ReduceMotion, FadeInRight } from 'react-native-reanimated';
import { Button, ButtonIcon, TrashIcon } from '@gluestack-ui/themed';
import { Link } from 'expo-router'
import { useAuthStore } from '@/utils/authStore';
import { deleteBlog } from '@/services/auth';


const BlogCard = ({ title, id, author, index, edit, deletion }: BlogCardProps) => {

    // Persisted data
    const {token, username} = useAuthStore()

    // Deletes specific blog
    const handleDelete = async () => {

        try {
            const data = await deleteBlog(id, token, username)
        } catch (error:any) {
            console.error("Error occured | Deleting blog", error.message)
        }
        deletion?.(true);
        
    }
        
  return (
    <>
        <Animated.View entering={
            FadeInDown
            .duration(700)
            .delay(index * 150)
            .reduceMotion(ReduceMotion.Never)
        }>
            {/* Shows a delete button if edit is true */}
            {edit ? (
                <View className="flex-row items-center justify-between mx-2 mt-4">

                    <Link href={`/blog/${id}`} asChild>
                        <TouchableOpacity className="flex-1 border border-black rounded-2xl mr-2 bg-white">
                            <Text className="text-lg text-primary font-bold mt-5 px-5">{title}</Text>
                            <Text className="text-lg text-secondary mb-3 px-5">Written by {author}</Text>
                        </TouchableOpacity>
                    </Link>
                    <Animated.View 
                        entering={FadeInRight
                            .springify()
                            .damping(80)
                            .mass(0.8)
                            .stiffness(200)
                            .duration(800)
                            .delay(index * 80)
                        }
                    >
                        <View>
                            <Button size="sm" variant="solid" action="negative" className="w-[100px] h-full" borderRadius={100} onPress={handleDelete}>
                                <ButtonIcon as={TrashIcon} />
                                <Text className="font-bold text-lg text-white"> Delete</Text>
                            </Button>
                        </View>
                    </Animated.View>
                </View>
            ) : (
                
                // Shows basic blogcard 
                <Link href={`/blog/${id}`} asChild>
                    <TouchableOpacity className="border border-black rounded-2xl mt-4 mx-2 bg-white">
                    <Text className="text-lg text-primary font-bold mt-5 px-5">{title}</Text>
                    <Text className="text-lg text-secondary mb-3 px-5">Written by {author}</Text>
                    </TouchableOpacity>
                </Link>
            )}
        </Animated.View>
    </>
  )
}

export default BlogCard