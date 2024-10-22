import React from 'react';
import MyStack from './src/Navigation/Stack';
import FlashMessage from 'react-native-flash-message';


const App = () => {
  return  (
    <>
    
    <MyStack />
    <FlashMessage style={{borderRadius: 40  , margin: 10}} />

    </>
  
  

  )
};

export default App;
