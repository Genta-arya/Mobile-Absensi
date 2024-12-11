import React, {useState, useRef} from 'react';
import {View, Animated, Dimensions, PanResponder} from 'react-native';
const {height: screenHeight} = Dimensions.get('window');
const CustomBottomSheet = ({visible, onClose, children}) => {
  const [animation] = useState(new Animated.Value(screenHeight));
  const [sheetHeight, setSheetHeight] = useState(screenHeight * 0.5);

  const slideIn = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(animation, {
      toValue: screenHeight,
      duration: 500,
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy !== 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newHeight = sheetHeight - gestureState.dy;

        if (newHeight > 20 && newHeight <= sheetHeight) {
          setSheetHeight(newHeight);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (sheetHeight - gestureState.dy < 250) {
          slideOut();
        } else {
          setSheetHeight(screenHeight * 0.5);
        }
      },
    }),
  ).current;

  if (visible) {
    slideIn();
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      {visible && (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 10,
            width: '100%',
            transform: [{translateY: animation}],
            height: sheetHeight,
          }}>
          <View
            style={{
              height: 4,
              marginTop: 16,
              width: 40,
              backgroundColor: '#ccc',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 8,
            }}
          />

          <View style={{}}>
            <View style={{marginTop: 14}}>{children}</View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default CustomBottomSheet;
