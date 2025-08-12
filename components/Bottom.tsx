import React, { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import ImageUploader from './ImageUploader';

const Bottom =  forwardRef<BottomSheetHandle, BottomProps>(({ images, setImages }, ref) => {
  
  // Reference so it can connect to parent
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Functions that can be called
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  // Logs changes
  // const handleSheetChanges = useCallback((index:any) => {
  //   console.log('handleSheetChanges', points[index-1]);
  // }, []);
  
  const points = ['70%'];

  // Closes sheet
  const closeBottom = () => {
    bottomSheetModalRef.current?.close();
  }

  return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          // onChange={handleSheetChanges} //for debugging
          snapPoints={points}
          enablePanDownToClose
          backgroundStyle={{
            backgroundColor: 'lightgrey',
          }}
          style={{
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 18,
            width: '100%',
          }}
          index={1} //starts at this index when opened
        >

          {/* Shows context here */}
          <BottomSheetView className="flex-1 items-center p-4 bg-#[121C22] z-50">
            <ImageUploader images={images} setImages={setImages} setClose={closeBottom}/>
          </BottomSheetView>
        </BottomSheetModal>

      </BottomSheetModalProvider>
  );
});

export default Bottom;