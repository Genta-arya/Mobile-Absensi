import { View, Text } from 'react-native'
import React from 'react'

const Container = ({props, children}) => {
  return (
    <View style={{flex: 1 , backgroundColor: 'white' , padding: 20 }}>
      {children}
    </View>
  )
}

export default Container