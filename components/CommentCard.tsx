import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Animated, { FadeInDown, FadeInRight, ReduceMotion } from 'react-native-reanimated';
import { Button, ButtonIcon, TrashIcon } from '@gluestack-ui/themed';
import { Link } from 'expo-router'


const CommentCard = ({ body, postid, updated_at, index, edit, id:commentId, setIndex, type }: CommentCardProps) => {

    // Changes date format
    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    // Deletes specific comment
    const handleDelete = async () => {
        setIndex!(index)
        type!('comment') 
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

                    <Link href={`/blog/${postid}`} asChild>
                        <TouchableOpacity className="flex-1 border border-black rounded-2xl mr-2 bg-white">
                            <Text className="text-lg text-primary font-bold mt-5 px-5">{body}</Text>
                            <Text className="text-lg text-secondary mb-3 px-5">Written {formatDate(updated_at)}</Text>
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

                // Shows basic commentcard
                <Link href={`/blog/${postid}`} asChild>
                    <TouchableOpacity className="border border-black rounded-2xl mt-4 mx-2 bg-white">
                        <Text className="text-lg text-primary font-bold mt-5 px-5">{body}</Text>
                        <Text className="text-lg text-secondary mb-3 px-5">Written {formatDate(updated_at)}</Text>
                    </TouchableOpacity>
                </Link>
            )}
        </Animated.View>
    </>
  )
}

export default CommentCard