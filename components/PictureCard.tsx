import { View, Image, Text} from 'react-native'
import React from 'react'

const PictureCard = (props: Picture) => {
  const { image_blob, id } = props;


  return (
    <View>
      <Image 
        source={{ uri: `data:image/jpeg;base64,${image_blob}`}}
        style={{ width: 250, height: 250, borderRadius: 10 }}
        resizeMode="cover"
      />
      
    </View>
  );
};

export default PictureCard;