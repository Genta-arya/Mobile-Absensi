import React from 'react';
import MyStack from './src/Navigation/Stack';
import FlashMessage from 'react-native-flash-message';


const App = () => {
  return  (
    <>
    
    <MyStack />
    <FlashMessage style={{margin: 20  , borderRadius:10 , alignItems:'center' , justifyContent:'center'}} position={'bottom'} />

    </>
  
  

  )
};

export default App;
