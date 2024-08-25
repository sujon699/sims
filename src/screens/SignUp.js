import React,{useState,useEffect} from "react";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard
} from "react-native"
//import { TouchableOpacity } from "react-native-gesture-handler";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import BaseApi from "../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import Loading from "../utils/Loading";
import DeviceInfo from 'react-native-device-info';





const SignUp = ({ navigation }) => {
   
    const [usr, setUsr] = useState('')
    const [pass, setPass] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoding, setIsLoding] = useState(false);
    const [isloddingAction, setIsloddingAction] = useState(false);
      
    
   
    const fetchtoken = async () =>{
         
        const token =  await AsyncStorage.getItem('token')
        const userName =  await AsyncStorage.getItem('userName')

        if(token !== null) 
        {
            try 
            {
              setIsloddingAction(true);
              const {data} = await BaseApi.post('/IsTokenExpiry.php', {
                  token: token
                });

              //  console.log(data);
  
                if(data.service_header.status_tag === 'success')
                {
                    //navigation.navigate("AppStack");  
                    await AsyncStorage.setItem('empImg', data.spw_data.empImg);
                    await AsyncStorage.setItem('appVersion', data.spw_data.appVersion);
                    
                    navigation.dispatch(
                        StackActions.replace('AppStack', {
                          userName: usr,
                        })
                      );
                }
                else
                {
                  setUsr(userName);
                }
                setIsloddingAction(false);
              
            } 
            catch (error) 
            {
               setIsloddingAction(false);
               setUsr(userName);
               alert(error.massage);
               console.log(error);
               //alert('sujon');
            }
              
        }
        else
        {
            setUsr(userName);
        }
        
    }
   
    
   

    useEffect( () => {
        fetchtoken(); 
        let cancel = false;

        return () => { 
            cancel = true;
        }

    }, [])

 

    function renderLogo() {
        return (
            <>
          
            <View
                style={{
                    // marginTop:"40%",
                     //width:'100%',
                }}
            >
                
                <Image
                    source={images.simslogo}
                    resizeMode="contain"
                    style={{
                        width: scale(160),
                        height: scale(90),
                        
                    }}
                />
                
            </View>

            

        </>
        )
    }

   

    function renderForm() {
        return (
            <View
                style={{
                    //marginTop: SIZES.padding * 1.0,
                    width:'92%'
                }}
            >
                {/* Full Name */}
                <View style={{ marginTop: verticalScale(1) }}>
                    
                    <FontAwesome name="user" size={scale(15)} color="white"
                         style={{
                            position: 'absolute',
                            left: scale(10),
                            bottom: scale(11),
                            height: scale(20),
                            width: scale(30),
                            zIndex:3
                        }}
                     />
                    <TextInput
                        style={{
                            marginVertical: verticalScale(4),
                            borderColor: '#BDBDBD',
                            borderRadius:scale(2),
                            borderWidth: 1,
                            height: scale(38),
                            color: COLORS.white,
                            fontSize:scale(15),
                            backgroundColor:'rgba(103, 58, 183, 0.61)',
                            paddingLeft:moderateScale(28)
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter User "
                        placeholderTextColor={COLORS.lightGray}
                        selectionColor={COLORS.white}
                        value={usr}
                        onChangeText={(text) => setUsr(text)}
                    />
                </View>

                {/* Password */}
                <View style={{ marginTop: verticalScale(2) }}>
                   
                    <FontAwesome name="lock" size={scale(15)} color="white"
                         style={{
                            position: 'absolute',
                            left: scale(10),
                            bottom: scale(11),
                            height: scale(20),
                            width: scale(30),
                            zIndex:3
                        }}
                     />
                    <TextInput
                        style={{
                            marginVertical: verticalScale(4),
                            borderColor: '#BDBDBD',
                            borderWidth: 1,
                            borderRadius: scale(2),
                            height: scale(38),
                            color: COLORS.white,
                             fontSize:scale(15),
                             backgroundColor:'rgba(103, 58, 183, 0.61)',
                            paddingLeft:moderateScale(28)
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter Password"
                        placeholderTextColor={COLORS.lightGray}
                        selectionColor={COLORS.white}
                        secureTextEntry={!showPassword}
                        value={pass}
                        onChangeText={(text) => setPass(text)}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: scale(7),
                            height: scale(25),
                            width: scale(25)
                        }}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Image
                            source={showPassword ? icons.disable_eye : icons.eye}
                            style={{
                                height: scale(17),
                                width: scale(17),
                                tintColor: COLORS.white
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    

    const handleLogIn = async () =>  
    {
        
        if(usr.trim().length <= 3)
        {
            showMessage({
                message: 'User Feild length must be 4 Charecter',
                duration:2000,
                type: "danger",
              });
        }
        else if(pass.trim().length < 8)
        {
            showMessage({
                message: 'Password word length must be 8 Charecter ',
                duration:2000,
                type: "danger",
              });
            
        }
        else
        {
            setIsLoding(true)
            try {
                    //  alert(getVersion());
                    var E_tokenID = '';
                    //var E_tokenID = await AsyncStorage.getItem('expoToken');

                    if(E_tokenID == null)
                    {
                       // E_tokenID =  await registerForPushNotificationsAsync();
                        //console.log(E_tokenID);
                    }

                    const {data} = await BaseApi.post('/log.php', {
                        usr: usr.trim(),
                        pass: pass.trim(),
                        expoToken : E_tokenID,
                        act:'LogIn',
                        app_version: DeviceInfo.getVersion()
                    });
                    //console.log(data);
                    //alert( JSON.stringify(data));

                    if(data.service_header.status_tag === 'success')
                    {
                        //alert(data.spw_data.jwt);
                        await AsyncStorage.setItem('token', data.spw_data.jwt);
                        await AsyncStorage.setItem('userID', data.spw_data.userID);
                        await AsyncStorage.setItem('userName', data.spw_data.userName);
                        await AsyncStorage.setItem('empID', data.spw_data.empID);
                        await AsyncStorage.setItem('empName', data.spw_data.empName);
                        await AsyncStorage.setItem('expoToken', data.spw_data.expoToken);
                        await AsyncStorage.setItem('empImg', data.spw_data.empImg);
                        await AsyncStorage.setItem('empDesignation', data.spw_data.empDesignation);
                        await AsyncStorage.setItem('appVersion', data.spw_data.appVersion);
                        await AsyncStorage.setItem('officePhone', data.spw_data.officePhone);
                        await AsyncStorage.setItem('branch', data.spw_data.branch);
                        await AsyncStorage.setItem('branchID', data.spw_data.branchID);
                    

                        
                        
                        

                       // console.log(data.spw_data);
                        navigation.dispatch(
                            StackActions.replace('AppStack', {
                                userName: usr,
                                empDesignation: data.spw_data.empDesignation,
                                empImg:data.spw_data.empImg,
                            })
                        );
                        
                    }
                    else
                    {
                        //alert(data.service_header.massage);
                        showMessage({
                            message: data.service_header.massage,
                            duration:2000,
                            type: "danger",
                          });


                    }
                    
                    setIsLoding(false);
            } catch (error) {
                   alert(error);
                  console.log(error);
                  setIsLoding(false);
            }

           
            
        }

        


        
    }

    function renderButton() {
        return (
            
            <TouchableOpacity
                    style={{ width:'92%',marginTop:verticalScale(15) }}
                    onPress={() => handleLogIn()}
            >
                <View  style={{
                        height: scale(40),
                        backgroundColor: '#2A2A2A',
                        borderRadius: scale(5),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} 
                >
                        <View 
                            style={{ 
                                    flexDirection:"row", 
                                }}>
                            
                            {
                                isLoding ? (<ActivityIndicator animating={isLoding} size={"large"} color={"white"}   />) 
                                : (<Text style={{ color: COLORS.white,  fontSize:scale(16),fontWeight:'700'}}>Login</Text>)
                            }
                            
                        </View>
                </View>
            </TouchableOpacity>
            
            
        )
    }

   

    

    return (
        <>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ''}
            style={{ flex: 1 }}
        >
             <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}  >
            {
                    isloddingAction ? (<Loading />) 
                    : (
                        <LinearGradient
                            colors={['#6245ff', '#7b62f2']}
                            style={{ flex: 1,    alignItems: 'center', justifyContent: 'center' }}
                        >
                            
                                {renderLogo()}
                                {renderForm()}
                                {renderButton()}
                          
                        </LinearGradient>
                        
                      )
              }
           </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </>  
    )
}

export default SignUp;