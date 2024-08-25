import React, { useEffect } from "react";
import { View, Text } from "react-native";
import  SignUp  from "./src/screens/SignUp";
 import AppStack from './src/navigation/AppStack';
//import  Home  from "./src/screens/Home";
import DisconectedPage from './src/utils/DisconectedPage';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from "react-native-flash-message";
import { useNetInfo } from "@react-native-community/netinfo";
import 'react-native-reanimated';
import 'react-native-gesture-handler';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const Stack = createNativeStackNavigator();

const App = () => {

  const netInfo = useNetInfo();


  useEffect(() => {
  }, [])



  function intialRender() {
    return (
      <NavigationContainer >
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
          initialRouteName={'SignUp'}
        >
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="AppStack" component={AppStack} />
          {/* <Stack.Screen name="LogOut" component={LogOut} /> */}


        </Stack.Navigator>
      </NavigationContainer>
    )
  }





  return (
    <>

      <View style={{ flex: 1 }}>

        {!netInfo.isConnected ? (<DisconectedPage />) : intialRender()}
        <FlashMessage position="top" />
      </View>
      
    </>


  )
}

export default App;
