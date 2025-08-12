import { View, Image, Text} from 'react-native'
import React from 'react'

const PictureCard = ({ image_blob, id }: Picture) => {

  return (
    <View>
      <Image 
        id={id.toString()}
        source={{ uri: `data:image/jpeg;base64,${image_blob}`}}
        style={{ width: 250, height: 250, borderRadius: 10 }}
        resizeMode="cover"
      />
      
    </View>
  );
};

export default PictureCard;