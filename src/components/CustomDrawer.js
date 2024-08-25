import React,{useState,useEffect} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseApi from "../api/BaseApi"
import { COLORS, SIZES, FONTS, icons, images,baseUrl } from "../constants";
import Share from 'react-native-share';
import { Dirs, FileSystem } from 'react-native-file-access';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DeviceInfo from 'react-native-device-info';


const versonCode = DeviceInfo.getVersion();


const CustomDrawer = props => {

 

  const handleLogOut = async ()=>{
    
    try {
      props.setIsloddingforDrawerItem(true);
        const user_ID = props.basicInfo.userID;
        const {data} = await BaseApi.post('/log.php', {
            act : 'LogOut',
            userID : user_ID
          });

          if(data.service_header.status_tag === 'success')
          {
              
                await AsyncStorage.removeItem('token')
                await AsyncStorage.removeItem('userID')
                await AsyncStorage.removeItem('empID')
                await AsyncStorage.removeItem('expoToken')
                
                props.navigation.replace('SignUp');
              
          }
          else
          {
            //alert(data.service_header.massage)
          }
          props.setIsloddingforDrawerItem(false);
          
    } catch (error) {
          console.log(error.massage)
    }
    
  }



const apkDowload = async (cur_version,pre_version) =>{
  
  if(cur_version != pre_version)
  {

    try 
    {
            props.setIsloddingforDrawerItem(true);
            var fileName = 'sims~'+cur_version+'.apk';
            var result = await FileSystem.downloadAsync(
              baseUrl+'spwsims/api/apps/'+fileName,
              FileSystem.documentDirectory + fileName
            );
            props.setIsloddingforDrawerItem(false);
            if(result.status == 200)
            {
              if(Platform.OS === 'android')
              {
              
                saveAndroidFile(result.uri,fileName)
              }
              else
              {
                Share(result.uri);
              }
               
            }
            else
            {
              alert('file dose not Exist');
            }
      //console.log(result.status);
     

    } catch (e) {
     // alert(e);
    }
    
     

  }

 //alert('sujon');
}

const saveAndroidFile = async (fileUri, fileName = 'File') => {
    

        
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (permissions.granted) {
    const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/octet-stream')
      .then(async (fileUri) => {
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      })
      .catch(e => console.log(e));
  } else {
    Share(fileUri);
  }


}





  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: COLORS.purple}}>
        <View
         
          style={{paddingLeft:moderateScale(14),paddingVertical:verticalScale(6),flexDirection:'row',backgroundColor: COLORS.purple}}>
          <Image
            source={{uri:baseUrl+props.basicInfo.empImg}}
            style={{height: scale(45), width: scale(45), borderRadius: scale(10),}}
          />
              <View style={{marginLeft:moderateScale(10),marginTop:verticalScale(15)}}>
                  <Text
                    style={{
                      color: COLORS.yellow,
                      fontSize: scale(12),
                      fontWeight:'600',
                      marginBottom: 0,
                    }}>
                    {props.basicInfo.userName.toLocaleUpperCase()}
                  </Text>
              
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: scale(10),
                        marginRight: moderateScale(5),
                      }}>
                    {props.basicInfo.empDesignation}
                    </Text>
           
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: verticalScale(5)}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: moderateScale(12), borderTopWidth: 1, borderTopColor: '#ccc'}}>
      
        <TouchableOpacity onPress={() => { handleLogOut() }} style={{paddingVertical: verticalScale(5)}} >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={scale(15)} />
            <Text
              style={{
                fontSize: scale(12),
                marginLeft: moderateScale(5), 
              }}>
              Sign Out 
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {apkDowload(props.basicInfo.appVersion,versonCode)}} style={{paddingVertical: verticalScale(10)}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
           
            <Octicons name="versions" size={scale(15)} color="black" />
            <Text
              style={{
                fontSize: scale(12),
                marginLeft: moderateScale(5),
                
              }}>
               {/* Version : {Constants.manifest.version} */}
               Version : { props.basicInfo.appVersion == versonCode ? versonCode : 
               <>
               {versonCode}
               <Text style={{color:'red'}}> (New Version : {props.basicInfo.appVersion})</Text>
               </>
               } 
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
