import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from '../screens/Home';
import Permissiontab from '../screens/Permissiontab';

import CartScreen from '../screens/Invoice/DistriBution';
import ScanInterface from '../screens/ScanInterface';
import Attendance from '../screens/Attendance';

import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


import CustomerDetails from '../screens/Customer/CustomerDetails';
import InvForDeliver from '../screens/Invoice/InvForDeliver';

import Profile from "../screens/Profiles/Profile";
import ProfileModify from "../screens/Profiles/ProfileModify";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import DistriBution from '../screens/Invoice/DistriBution';
import MobilePurchase from '../screens/Purchase/MobilePurchase';
import PurchaseScreen from '../screens/Purchase/PurchaseScreen';

import StockDashboard from "../screens/Stock/StockDashboard";
import StockRequest from "../screens/Stock/StockRequest";
import StockRequestDetails from "../screens/Stock/StockRequestDetails";



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={{headerShown: false}}
       
      />
      <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileModify"
          component={ProfileModify}
          options={{headerShown: false}}
          
        />

         <Stack.Screen
          name="Permissiontab"
          component={Permissiontab}
          options={{headerShown: false}}
          
        />

        <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetails}
        options={{headerShown: false}}
       
         />

          <Stack.Screen
            name="StockDashboard"
            component={StockDashboard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="StockRequest"
            component={StockRequest}
            options={{headerShown: false}}
          
          />
          <Stack.Screen
            name="StockRequestDetails"
            component={StockRequestDetails}
            options={{headerShown: false}}
          
          />

          <Stack.Screen
            name="DistriBution"
            component={DistriBution}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InvForDeliver"
            component={InvForDeliver}
            options={{headerShown: false}}
          
          />

          <Stack.Screen
            name="MobilePurchaseDashboard"
            component={MobilePurchase}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PurchaseScreen"
            component={PurchaseScreen}
            options={{headerShown: false}}
          
          />

    </Stack.Navigator>
  );
};


// const PerMisstionStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Permissiontab"
//         component={Permissiontab}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="CustomerDetails"
//         component={CustomerDetails}
//         options={{headerShown: false}}
       
//       />
//     </Stack.Navigator>
//   );
// };

const SacnStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScanInterface"
        component={ScanInterface}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InvForDeliver"
        component={InvForDeliver}
        options={{headerShown: false}}
       
      />
      <Stack.Screen
        name="StockRequestDetails"
        component={StockRequestDetails}
        options={{headerShown: false}}
       
      />
       <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      
    </Stack.Navigator>
  );
};




const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: '#D8D1E9'},
        tabBarInactiveTintColor: '#4d4d4d',
        tabBarActiveTintColor: '#7b62f2',
        
      }}
    
      
      
      >
      <Tab.Screen
        name="Home "
        component={HomeStack} 
        options={({route}) => ({
          tabBarStyle: {
            display: 'flex',
          },
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" color={color} size={scale(24)} />
          ),
        })}
      />
    
     

     {/* <Tab.Screen
        name="Remainder"
        component={Remainder}
        options={({route}) => ({
          //tabBarBadge: 0,
          tabBarBadgeStyle: {backgroundColor: 'red'},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-alarm" color={color} size={26} />
          ),
        })}
      /> */}

     <Tab.Screen
        name="Scan"
        component={SacnStack}
        options={({route}) => ({
            tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="qrcode-scan" size={scale(30)} color={color} />
          ),
        })}
      />

     {/* <Tab.Screen
        name="Permission"
        component={PerMisstionStack}
        options={({route}) => ({
         // tabBarBadge: 2,
          tabBarBadgeStyle: {backgroundColor: 'red'},
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="unlock-alt" color={color} size={26} />
          ),
          
        })}
      /> */}

     <Tab.Screen
        name="Menu"
        component={CartScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.openDrawer();
          }
        })}
        options={({route}) => ({
         
          tabBarIcon: ({color, size}) => (
            <Entypo name="menu" color={color} size={scale(24)} />
          ),
        })}
      />






    </Tab.Navigator>
  );
};



export default TabNavigator;
