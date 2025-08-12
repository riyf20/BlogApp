import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Box, Button, ButtonText, ButtonGroup, 
    Heading, HStack, Pressable, Text, VStack, 
Icon, CloseIcon } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import { UploadCloud } from "lucide-react-native";
import ImageView from "react-native-image-viewing";
import ImageCard from "./ImageCard";
import InfoModal from "./InfoModal";
import { useHapticFeedback} from '@/components/HapticTab';

	
const ImageUploader = ({images, setImages, setClose}:ImageUploaderProps) => {

    // Browse files for image
    const handleBrowseFiles = async () => {

        // Ask for permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }

        // Open picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
            base64: true,
        });

        // Goes through images --> saves base64 and uri 
        if (result.assets) {
            const newImages = result.assets
                .filter(img => img.base64)
                .map(img => ({
                    fileUri: img.uri,                                // will use this for preview (faster)
                    base64: `data:image/jpeg;base64,${img.base64}`,  // will use when uploading
                }));
            setImages((prev: ImageItem[]) => [...prev, ...newImages]);
        }
        
    };

    // Used when enlarging image | visible toggles view | index starts specific image (within the array)
    const [visible, setIsVisible] = useState(false);
    const [imgIndex, setImgIndex] = useState(-1)

    // Function that sets up to show enlarged picture
    const imgPress = (index:number) => {
        setImgIndex(index);
        setIsVisible(true);
    }

    // Modal when attemping to delete image
    const [deleteModal, setDeleteModal] = useState(false);

    // Function to set up image deletion
    const imgLongPress = (index:number) => {
        setImgIndex(index)
        setDeleteModal(true);
    }
    
    // Function that is passed to the delete modal | Removes specified image
    const removeImage = () => {
        setImages((prevImages: ImageItem[]) => prevImages.filter((_, i) => i !== imgIndex));
        
        // Reset
        setDeleteModal(false);
        setImgIndex(-1); 
    };

    const haptic = useHapticFeedback();

    return (
    <>
        <HStack className="justify-between w-full mt-3">
            <VStack>
                <Heading size="md" className="font-semibold" color="black" >
                    Upload your Images
                </Heading>
                <Text size="sm" color="black" >JPG, PNG supported</Text>
            </VStack>
        
            {/* Close button on the right side */}
            <Pressable className="border-black border-2 rounded-full w-[35px] h-[35px]" onPress={setClose} onPressIn={haptic}>
                <View className="relative left-[5px] top-[5px]">
                <Icon as={CloseIcon} size="lg" className="stroke-background-500" />
                </View>
            </Pressable>
        </HStack>

        <Box className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[275px] w-full bg-[A9A9A9]">
            
            {/* If images already entered will show scrollable thumbnail version */}
            {images.length === 0 ? 
                <>
                    {/* No images entered | Shows text and icon */}
                    <TouchableOpacity onPress={handleBrowseFiles} className="items-center">
                    <Icon
                        as={UploadCloud}
                        className="h-[62px] w-[62px] stroke-background-200"
                        color="black"
                    />
                    <Text size="sm" color="black" >No files uploaded yet</Text>
                    </TouchableOpacity>
                </> 
                : 
                <>
                    {/* Scrollable thumbnail view of all images */}
                    <ScrollView 
                        horizontal={true}
                        contentContainerStyle={{
                            paddingHorizontal: 8,
                            gap: 8,
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                        showsHorizontalScrollIndicator={false}
                    >

                        {/* Imagecard renders each individual image */}
                        {/* Press will enlarge image using ImageView component | Long Press will show modal to delete image */}
                        {images.map((img, index) => (
                            <ImageCard key={index} uri={img.fileUri} index={index} onPress={imgPress} onLongPress={imgLongPress} parent="image"/>
                        ))}

                        {/* This is used to show an enlarged version of a specified image */}
                        <ImageView
                            images={images.map(img => ({ uri: img.fileUri }))}
                            imageIndex={imgIndex}
                            visible={visible}
                            onRequestClose={() => setIsVisible(false)}
                            presentationStyle="overFullScreen"
                            backgroundColor="dimgray"
                        />

                        {/* Modal to delete image */}
                        <InfoModal showModal={deleteModal} setShowModal={setDeleteModal} heading={"Delete Image?"} body={"Are you sure you would like to remove this image?"} buttonText={"Remove"} parent={"image"} confirmFunction={removeImage} imgUri={images[imgIndex]?.fileUri} />
                    </ScrollView>
                </>
            }
        </Box>

        {/* Button bar */}
        <ButtonGroup className="w-full flex">

            {/* Allows user to browse for image  */}
            <Button className={`${images.length === 0 ? 'w-full' : 'w-1/2'}`} bgColor="#91A3B6" onPressIn={haptic} onPress={handleBrowseFiles} borderRadius={10}>
                <ButtonText color="black">Browse files</ButtonText>
            </Button>

            {/* Conditional button to preview post | Closes sheet */}
            {images.length !== 0 &&
                <Button className="w-[50%]" bgColor="#008B8B" onPress={setClose} borderRadius={10}>
                    <ButtonText color="black">Preview Post</ButtonText>
                </Button>
            }
        </ButtonGroup>
    </>
    );
}

export default ImageUploader;