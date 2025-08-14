import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import ImageUploader from './ImageUploader';
import {Dimensions, Text, View} from 'react-native'
import CommentSection from './CommentSection';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

const Bottom =  forwardRef<BottomSheetHandle, BottomProps>(({ images, setImages, parent, comments, keyboard }, ref) => {
  
  // Reference so it can connect to parent
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Functions that can be called
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    commentUp: () => bottomSheetModalRef.current?.snapToIndex(2),
    commentDown: () => bottomSheetModalRef.current?.snapToIndex(1),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  // Logs changes
  // const handleSheetChanges = useCallback((index:any) => {
  //   console.log('handleSheetChanges', commentPoints[index]);
  //   console.log('point', commentPointsHeight[index]);
  // }, []);
  
  const points = ['70%'];
  const commentPoints = ['30%', '60%', '90%'];
  const [dynamicHeight, setDynamicHeight] = useState(0);

  // Closes sheet
  const closeBottom = () => {
    bottomSheetModalRef.current?.close();
  }
  
  // Stores window size
  const windowHeight = Dimensions.get('window').height;

  const animatedPosition = useSharedValue(0);

  // Listen for position changes | Found this speed/size to work the best
  useAnimatedReaction(
    () => animatedPosition.value,
    (pos) => {
      let multiplier;

      if (pos >= 372) {
        // Between 650 and 372 | Bottom to mid
        multiplier = 0.1 + ((pos - 650) / (372 - 650)) * (0.4 - 0.1);
      } else {
        // Between 372 and 93 | mid to top
        multiplier = 0.4 + ((pos - 372) / (93 - 372)) * (0.7 - 0.4);
      }

      // Buffer so it doesnt go fully behind field | 88 is currently the best 
      const commentFieldBuffer = 88
      runOnJS(setDynamicHeight)((windowHeight * multiplier)-commentFieldBuffer);
      
    }
  );

  return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          // onChange={handleSheetChanges} //for debugging
          snapPoints={parent==='create' ? points : commentPoints}
          enablePanDownToClose={parent==='create' ? true : false}
          enableContentPanningGesture={parent === 'create' ? true : false}
          enableHandlePanningGesture={keyboard ? false : true}
          enableDynamicSizing={false}
          animatedPosition={animatedPosition}
          backgroundStyle={{
            backgroundColor: `${parent==='create' ? `lightgrey` : `white`}`,
          }}
          style={{
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 18,
            width: '100%',
          }}
          index={0} //starts at this index when opened
          animateOnMount={parent==='comments' ? false : true}
          handleComponent={() => (
              // Style for Handle indicator
              <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                <View style={{
                  backgroundColor: '#2F4858',
                  width: 45,
                  height: 4,
                  borderRadius: 2,
                  marginBottom: 6
                }}/>

                {/* Title */}
                {parent==='comments' && (
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Comments ({comments?.length})</Text>
                )}
              </View>
            )}
        >

          {/* Shows context here */}
          <BottomSheetView className="flex-1 items-center p-4 bg-#[121C22] z-50">

            {/* Create page | image uploader */}
            {parent==='create' && images && setImages ?
              <ImageUploader images={images} setImages={setImages} setClose={closeBottom}/>

              // Comment page | comment sheet
            : parent==='comments' && comments ?
              <>
                {comments.length > 0 ?
                  <BottomSheetScrollView
                    showsVerticalScrollIndicator={true}
                    indicatorStyle="black"
                    style={{
                      marginTop: 6,
                      width: '100%',
                      height: dynamicHeight,
                    }}
                    contentContainerStyle={{
                      paddingBottom: 50,
                    }}
                  >
                   {comments?.map((comment:usersComment, index) => (
                      <CommentSection key={comment.id} {...comment} index={index}/>
                    ))} 

                  </BottomSheetScrollView>
                  :
                  <Text className='font-semibold mt-6'>Be the first to comment!</Text>
                } 
                         
              </>
            : 
            // nothing
            <></>
              
            }
            
          </BottomSheetView>
        </BottomSheetModal>

      </BottomSheetModalProvider>
  );
});

export default Bottom;