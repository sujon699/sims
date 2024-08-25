import React,{useState,useEffect} from "react";
import {
  Platform,
  Image
} from "react-native"
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomDrawer from '../components/CustomDrawer'; 
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { COLORS, SIZES, FONTS, icons, images } from "../constants"

import DistriBution from '../screens/Invoice/DistriBution';
import MobilePurchase from '../screens/Purchase/MobilePurchase';
import PurchaseScreen from '../screens/Purchase/PurchaseScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseApi from "../api/BaseApi";
import StockDashboard from "../screens/Stock/StockDashboard";
import StockRequest from "../screens/Stock/StockRequest";
import StockRequestDetails from "../screens/Stock/StockRequestDetails";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import Loading from "../utils/Loading";
import InvForDeliver from '../screens/Invoice/InvForDeliver';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DistributionStack = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};

const MobilePurchaseStack = () => {
  return (
    <Stack.Navigator>
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

const StockStack = () => {
  return (
    <Stack.Navigator>
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
      
    </Stack.Navigator>
  );
};





const AuthStack = () => {

    const [tokens, setTokens] = useState({
      tokenID: '',
      userName: '',
      userID: '',
      empImg: '',
      empDesignation : '',
      appVersion: '',
      
    });

    const [menuPer, setMenuPer] = useState({
      StockManagement: null,
      Distribution: null,
      MobilePurchase: null,
    });

    const [isloddingforDrawerItem, setIsloddingforDrawerItem] = useState(false);



 

  useEffect(() => {
      fetchtoken();
    
  }, []);

  const fetchtoken = async () => {
    
        const tokenID = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('userName');
        const user_ID = await AsyncStorage.getItem('userID');
        const eimg = await AsyncStorage.getItem('empImg');
        const empDesi = await AsyncStorage.getItem('empDesignation');
        const appVer = await AsyncStorage.getItem('appVersion');



        var newdata = {
          tokenID: tokenID,
          userName: user,
          userID: user_ID,
          empImg: eimg,
          empDesignation : empDesi,
          appVersion : appVer,
        }
        setTokens(newdata);


              try {
                    var  menuList =  JSON.stringify(menuPer);
                      const {data} = await BaseApi.post('/Utility/UtilityApi.php', {
                          token: tokens.tokenID,
                          userID: user_ID,
                          act:'MenuPermission',
                          menuList : menuList
                      });

                      if(data.service_header.status_tag === 'success')
                      {
                          //console.log(data.spw_data);
                          setMenuPer(data.spw_data);  
                          
                      }
                      else
                      {
                        //console.log(data.spw_data);
                      }
                      
                      
              } 
              catch (error) {
                  // console.log(error)  
              }
    
    
    
  };



  function RederDrawer()
  {
    return (

              <Drawer.Navigator
              drawerContent={props => <CustomDrawer {...props} basicInfo={tokens} setIsloddingforDrawerItem={setIsloddingforDrawerItem}  />}
              screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#7b62f2',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {
                  marginLeft:  moderateScale(-20),
                  fontSize: scale(11), 
                  paddingVertical:moderateScale(-2),
                  marginTop:verticalScale(-3),
                 
                // padding:0
                },
                drawerItemStyle:{
                  paddingVertical:-moderateScale(0),
                  marginTop:verticalScale(-1)
                }
              }}>

                  <Drawer.Screen
                    name="HOME"
                    component={TabNavigator}
                    options={{
                      drawerIcon: ({color}) => (
                        <Ionicons name="home-outline" size={scale(18)} style={{ marginTop:verticalScale(-2)}} color={color} />
                      ),
                    }}
                  />

                 <Drawer.Screen
                    name="STOCK MANAGEMENT"
                    component={StockStack}
                    options={{
                      drawerIcon: ({color}) => (
                      
                        <Image source={ icons.stock }
                        style={{
                            height: scale(19),
                            width: scale(19),
                            tintColor: color,
                            marginTop:verticalScale(-2) 
                        }}
                       />
                      ),
                      drawerItemStyle: {
                        display: menuPer.StockManagement,
                      },
                    }}
                  />
               
                  <Drawer.Screen
                    name="DISTRIBUTION"
                    component={DistributionStack}
                    options={{
                      drawerIcon: ({color}) => (

                        <Image source={ icons.distribution_black }
                        style={{
                            height: scale(19),
                            width: scale(19),
                            tintColor: color,
                            marginTop:verticalScale(-2) 
                        }}
                       />


                      ),
                      drawerItemStyle: {
                        display: menuPer.Distribution,
                      },
                    }}
                  />

                <Drawer.Screen
                    name="MOBILE PURCHASE"
                    component={MobilePurchaseStack}
                    options={{
                      drawerIcon: ({color}) => ( 

                        <Image source={ icons.mobile_purchase_black }
                        style={{
                            height: scale(19),
                            width: scale(19),
                            tintColor: color,
                            marginTop:verticalScale(-2) 
                        }}
                       />
                        
                        
                        
                        
                      ),
                      drawerItemStyle: {
                        display: menuPer.MobilePurchase,
                        //"none"
                      },
                    }}
                  />
                  
                 
            </Drawer.Navigator>



    );
  }



  return (
        <>
                    {
                        isloddingforDrawerItem ? (<Loading />)  : (   RederDrawer() ) 
                    } 
        </>
    
  );
};

export default AuthStack;
