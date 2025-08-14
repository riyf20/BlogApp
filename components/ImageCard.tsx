import { Image, Pressable } from 'react-native'
import React from 'react'



const ImageCard = ({ uri, onPress, onLongPress, index, parent}: ImageCardProps) => {
  
  if (parent==='blogFallback') {
    uri = `data:image/jpeg;base64,${uri}`
    console.log("FALLBACK")
  }

  return (
   <Pressable onPress={() => {onPress(index)}} style={{ marginRight: 8 }} onLongPress={() => {onLongPress(index)}}>
    <Image
      source={{ uri }}

      // Parent can be delete, create, image (so far...)
      style={parent==='delete' ? 
        {
          width: 100,
          height: 100,
          borderRadius: 8,
          alignSelf: 'center',
          marginTop: 12,
        }
        : parent==='create' ?
            {
              width: 75,
              height: 75,
              borderRadius: 8,
            }
        :
        // blog will use this style as well
            {
              width: 200,
              height: 250,
              borderRadius: 8,
            }
        }
    />

  </Pressable>
  )
}

export default ImageCard