import React, { useState, useRef } from 'react';
import { View, Text, Animated, Dimensions, PanResponder } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const CustomBottomSheet = ({ visible, onClose, children }) => {
    const [animation] = useState(new Animated.Value(screenHeight)); // Mulai di luar layar
    const [sheetHeight, setSheetHeight] = useState(screenHeight * 0.5); // Tinggi awal bottom sheet

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
                return gestureState.dy !== 0; // Set responder jika ada gerakan vertikal
            },
            onPanResponderMove: (evt, gestureState) => {
                // Ubah tinggi bottom sheet berdasarkan gerakan
                const newHeight = sheetHeight - gestureState.dy;

                // Batasi tinggi bottom sheet
                if (newHeight > 20 && newHeight <= sheetHeight) { // Minimum 20 piksel dan maksimum 500 piksel
                    setSheetHeight(newHeight);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // Jika tinggi sisa di bawah 250 piksel, tutup bottom sheet
                if (sheetHeight - gestureState.dy < 250) {
                    slideOut();
                } else {
                    // Kembalikan ke tinggi awal jika tidak ditutup
                    setSheetHeight(screenHeight * 0.5);
                }
            },
        })
    ).current;

    // Efek saat bottom sheet terlihat
    if (visible) {
        slideIn();
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            {visible && (
                <Animated.View
                    {...panResponder.panHandlers} // Menerapkan pan responder
                    style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 10,
                        width: '100%',
                        transform: [{ translateY: animation }],
                        height: sheetHeight, // Mengubah tinggi bottom sheet
                    }}
                >
                    {/* Garis penanda */}
                    <View
                        style={{
                            height: 4,
                            marginTop: 16, // Tinggi garis
                            width: 40, // Lebar garis
                            backgroundColor: '#ccc', // Warna garis
                            borderRadius: 2, // Membulatkan tepi garis
                            alignSelf: 'center', // Agar garis berada di tengah
                            marginBottom: 8, // Jarak antara garis dan konten
                        }}
                    />

                    <View
                        style={{
                           
                        }}
                    >
                        <View style={{ marginTop: 14 }}>
                        {children}
                        </View>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

export default CustomBottomSheet;
