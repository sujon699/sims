import React,{useState,useEffect,useRef} from "react";
import {
    Modal,
    View,
    Text,
    Image,
    FlatList, 
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput,
    StyleSheet,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    
    
} from "react-native";

import { COLORS, SIZES, FONTS, icons, images,baseUrl } from "../../constants";
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import BaseApi from "../../api/BaseApi" 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import BottomSheet,{BottomSheetView} from "@gorhom/bottom-sheet";
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";

import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";




const Profile = ({navigation, route}) => {

  
 

  const [isloddingAction, setIsloddingAction] = useState(false);
  const [isBootomOpen, setIsBootomOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoint = ["55%","75%"];

  const [oP, setOP] = useState('');
  const [nP, setNP] = useState('');
  const [cNP, setCNP] = useState('');

  const [isLowercase, setIsLowercase] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isChar_length, setIsChar_length] = useState(false);
  const [allPassrules, setAllPassrules] = useState(false);

  const [cPstatus, setCPstatus] = useState(false);

  const [showOP, setShowOP] = useState(false);
  const [showNP, setShowNP] = useState(false);
  const [showCNP, setShowCNP] = useState(false);

  const [empNumbers, setEmpNumbers] = useState([]);


  


  const [tokens, setTokens] = useState({
      tokenID: '',
      userName: '',
      userID: '',
      empID: '',
      empName: '',
      empImg: '',
      officePhone:'',
      userName:'',
      empDesignation:'',
      branch:''

  });

 


  useEffect(() => {

    // const keyboardDidShowListener = Keyboard.addListener(
    //     'keyboardDidShow',
    //     () => setKeyboardVisible(1),
    // );
    // const keyboardDidHideListener = Keyboard.addListener(
    //     'keyboardDidHide',
    //     () => setKeyboardVisible(0),
    // );



   // fetchProfileData();
    const focusHandler = navigation.addListener('focus', () => {
      fetchProfileData();
      //alert('sujon');
    });

    return () => { 
      focusHandler;
    }

  }, [navigation]);

  const fetchProfileData = async () => {
        const tokenID = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('userName');
        const eimg = await AsyncStorage.getItem('empImg');
        const user_ID = await AsyncStorage.getItem('userID');
        const empid = await AsyncStorage.getItem('empID');
        const empname = await AsyncStorage.getItem('empName');
        const OP = await AsyncStorage.getItem('officePhone');
        const UN = await AsyncStorage.getItem('userName');
        const empDeg = await AsyncStorage.getItem('empDesignation');
        const Branch = await AsyncStorage.getItem('branch');


        var newdata = {
          tokenID: tokenID,
          userName: user,
          userID: user_ID,
          empID: empid,
          empName:empname,
          empImg: eimg,
          officePhone:OP,
          userName:UN,
          empDesignation:empDeg,
          branch:Branch
        }
        setTokens(newdata); 

        if(tokenID !== null && user_ID !== null) 
        {
          
            try 
            {
              
              const {data} = await BaseApi.post('/profile/profileSettingsAPI.php', {
                  token: tokenID,
                  act:'fetchEmpNumber',
                  empID:empid,
                  userID:user_ID
                });

                if(data.service_header.status_tag === 'success')
                {   
                    setEmpNumbers(data.spw_data);  
                    //console.log(data.spw_data) ;     
                }
                else
                {
                  await logout(navigation,data.service_header.massage);
                  setEmpNumbers([]);
                }
              
            } 
            catch (error) 
            {
                console.log(error);
                setEmpNumbers([]); 
            }
              
        }
        





  };



  const confirmChk = async (empID,type) =>{
    Alert.alert(
      // title
      'Are You Sure ?',
      // body
      '',
      [
        {
          text:'YES',
          onPress: () => {

              if(type == 'SAVE_PROFILE')
              {
                 UpdateProfile(empID);
              }
              else if(type == "CHANGE_PASSWORD")
              {
                ChangePassword(empID);
              }
             
                
          }
        },
        {
          text:'NO',
          onPress: () => {
            
          }
        }

      ]
    )
  }

  const ChangePassword = async (empID) =>{

    const userID =  await AsyncStorage.getItem('userID');
        
    try 
    {
       
        if(!allPassrules)
        {
            setIsloddingAction(false);
            showMessage({
                message: 'Plz Follow Password Rules',
                description:'',
                duration:2500,
                type: "danger",
            });
            
        
        }
        else if(nP != cNP)
        {
          setIsloddingAction(false);
          showMessage({
              message: 'Password Do not Match',
              description:'',
              duration:2500,
              type: "danger",
          });

        }
        else 
        {
             

            setCPstatus(true);
            const {data} = await BaseApi.post('profile/profileSettingsAPI.php', {
                token: tokens.tokenID,
                act:'UpdatePassWord',
                empID:empID,
                oldPW : oP,
                newPW :nP,
                userID : userID,
            });

            if(data.service_header.status_tag === 'success')
            {
              // console.log(data.spw_data);
                showMessage({
                    message: "Password Update Sucessfully ",
                    description:'',
                    duration:2000,
                    type: "success",
                    });
                setIsBootomOpen(false);
                
            }
            else
            {
              await logout(navigation,data.service_header.massage);
                //console.log(data.spw_data);
              // setIsloddingAction(false);
                showMessage({
                message: data.message,
                description:'',
                duration:2000,
                type: "danger",
                });

             
            }
              
            setCPstatus(false);   
           // fetchProfileData();

        }
        

      
      
    } 
    catch (error) 
    {
        console.log(error);
        setCPstatus(false);
    }

}

  

  const PassCheck = async (text) =>{

      setNP(text);

      var x = 0;
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
       if(await text.match(lowerCaseLetters)) {  
            setIsLowercase(true);
            x++;
        }
        else
        {
          setIsLowercase(false);
          x--;
        }
        
        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(await text.match(upperCaseLetters)) 
        {  
          setIsUppercase(true);
           x++;
        }
        else 
        {
          setIsUppercase(false);
            x--;
        }
      
        // Validate numbers
        var numbers = /[0-9]/g;
        if(await text.match(numbers)) 
        {  
            setIsNumber(true);
             x++;
        } 
        else
        {
           setIsNumber(false);
            x--;
        }
        
        // Validate length
        if(await text.length >= 8) 
        {
          setIsChar_length(true);
          x++;
        } 
        else 
        {
          setIsChar_length(false);
          x--;
        }
      
        if(x==4)
        {
          setAllPassrules(true);
        }
        else
        {
          setAllPassrules(false);
        }
      


  }


 

  function renderHeader() {

    return (




      <LinearGradient
        colors={['#6245ff', '#7b62f2']}
        style={{ width: "100%", height: verticalScale(31), justifyContent: 'flex-end', borderRadius: scale(8) }}
      >

        <View
          style={{
            width: '100%',
            //height:verticalScale(34),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: moderateScale(7),
            paddingRight: moderateScale(5),
            paddingBottom: verticalScale(2)
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >

            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={scale(24)} color='#fff' style={{ marginRight: moderateScale(14), marginTop: verticalScale(4) }} />
            </TouchableOpacity>

          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}

          >

            <View
              style={{
                marginLeft: moderateScale(10),
                alignItems:'center',
              }}
            >
              <Text
                style={{
                  fontSize: scale(14),
                  fontWeight: '700',
                  color: '#fff',
                  textAlign: 'right',
                  
                }}
              >
                PROFILE
              </Text>
             


            </View>

            <FontAwesome
              name="user-o"
              size={scale(20)}
              style={{
                marginTop: verticalScale(2),
                color: '#fff',
                marginLeft: moderateScale(5)
              }}
            />
            

          </View>


        </View>



      </LinearGradient>

    );
  }

  function rendertop() {
      return (
        <View style={{ flexDirection: 'row',marginTop:'5%', paddingHorizontal: moderateScale(8),marginBottom:verticalScale(10) }}>
               
              <View style={{flex:1,flexDirection:'row'}}>
                   

                            <ImageBackground
                              source={{uri:baseUrl+tokens.empImg}}
                              style={{height: scale(87), width: scale(87)}}
                              imageStyle={{borderRadius: scale(8)}}>
                          
                            </ImageBackground>

                            <View
                               style={{ marginLeft:15}}
                            
                            >

                                 <Text
                                    style={{
                                      color: COLORS.purple,
                                      fontSize: scale(13),
                                      fontWeight:'600',
                                      marginTop: 0,
                                    }}>
                                    { tokens.empName} 
                                  </Text>
                              
                                    <Text
                                      style={{
                                        color: '#757575',
                                        fontSize: scale(12),
                                        //marginRight: 5,
                                        marginTop:verticalScale(2)
                                      }}>
                                        {tokens.empDesignation}
                                    </Text>

                                    <Text
                                      style={{
                                        color: '#757575',
                                        fontSize: scale(12),
                                        //marginRight: 5,
                                        marginTop:verticalScale(2)
                                      }}>
                                       <FontAwesome name="user" size={scale(13)} color='#757575' />  {tokens.userName.toLocaleUpperCase()}
                                    </Text>

                                    <Text
                                      style={{
                                        color: '#757575',
                                        fontSize: scale(12),
                                        //marginRight: 5,
                                        marginTop:verticalScale(2)
                                      }}>
                                        <FontAwesome name="building" size={scale(13)} color='#757575' />  {tokens.branch}
                                    </Text>

                                    <Text
                                      style={{
                                        color: '#757575',
                                        fontSize: scale(12),
                                        //marginRight: 5,
                                        marginTop:verticalScale(2)
                                      }}>
                                       <FontAwesome name="phone" size={scale(13)} color='#757575' />  {tokens.officePhone}
                                    </Text>

                              
                            </View>

                            

                        
                   
              </View>

        </View>

        

      );
  }

 

  function renderbody() {
    return (
      <>
      <View  style={{  marginTop:verticalScale(2),paddingHorizontal: moderateScale(8), marginBottom:verticalScale(8),marginTop:verticalScale(10), }  }>   
           {renderNumbers()}
           {renderBasicInfo()} 
           
       </View>
       
       </>
    )
  }

  function renderNumbers()
  {
    return (

                <View
                style={{ 
            
                  borderBottomColor: '#CE93D8',
                  borderBottomWidth: 1,
                  borderTopColor: '#CE93D8',
                  borderTopWidth: 1,
                  flexDirection: 'row',
                  height: scale(45),
                  
                  }}  
              
          >

         
                      <View 
                      style={{width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightColor: '#CE93D8',
                      borderRightWidth: 1,}}
                      >
                        <Text style={{color:COLORS.purple,fontSize:scale(14),fontWeight:'600'}}>TK {empNumbers.curDra_Bal == "" ? 0 : empNumbers.curDra_Bal}</Text>
                        <Text>Drawer</Text>
                      </View>
                      <View
                        style={{width: '50%',
                        alignItems: 'center',
                        justifyContent: 'center'}}
                       >
                        <Text style={{color:COLORS.purple,fontSize:scale(14),fontWeight:'600'}}>{empNumbers.curPoint == "" ? 0 : empNumbers.curPoint} </Text>
                        <Text>Points </Text>
                      </View>
                



          </View>

    )    
  }        

  function renderBasicInfo()
  {
    return (

                <View
                style={{ 
            
                  shadowOffset: { width: 0,height: 0.5,},
                  shadowOpacity: 0.47,
                  shadowRadius: 1.0,
                  elevation: 3,
                  borderRadius:4,
                  backgroundColor:COLORS.white,
                  paddingVertical:6,
                  paddingHorizontal:8,
                  marginBottom:6,
                  marginTop:15
                  
                  }}  
              
          >

                <TouchableOpacity
                  onPress={() =>  navigation.navigate('ProfileModify', {
                     empName: tokens.empName,
                     empImg: tokens.empImg,
                     })
                  }
                  style={{ 
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop:2,
                                paddingVertical:5,
                                borderColor:'#BDBDBD',
                                borderBottomWidth:1
                              

                      }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                 <FontAwesome name="user" size={18} color={COLORS.purple} />
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                       Edit Profile
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setIsBootomOpen(true)}
                  style={{ 
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop:5,
                                paddingVertical:0,
                                borderColor:'#BDBDBD',
                               // borderBottomWidth:1
                              

                      }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                 {/* <FontAwesome name="key-0" size={18} color={COLORS.purple} /> */}
                                                 <FontAwesome5 name="key" size={16} color={COLORS.purple} />
                                               
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                      Change Password
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

               

                <TouchableOpacity style={{ 
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                               marginTop:5,
                              paddingVertical:5,
                              borderColor:'#BDBDBD',
                              borderBottomWidth:1,
                              display:'none'
                             

                    }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                 <FontAwesome name="user-o" size={18} color={COLORS.purple} />
                                               
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                      My Customer (Ref)
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                               marginTop:5,
                              paddingVertical:5,
                              borderColor:'#BDBDBD',
                              borderBottomWidth:1,
                              display:'none'
                             

                    }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                 <FontAwesome5 name="clock" size={17} color={COLORS.purple} />
                                                 
                                               
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                      Reminder
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                               marginTop:5,
                              paddingVertical:5,
                              borderColor:'#BDBDBD',
                              borderBottomWidth:1,
                              display:'none'
                             

                    }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                
                                                 <Ionicons name="notifications" size={18} color={COLORS.purple} />
                                                 
                                               
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                      Notification
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

                <TouchableOpacity style={{ 
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                               marginTop:5,
                              paddingVertical:5,
                              borderColor:'#BDBDBD',
                              borderBottomWidth:1,
                              display:'none'
                             

                    }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                 <FontAwesome name="dot-circle-o" size={18} color={COLORS.purple} />
                                                 
                                               
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                        Attandance
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

               
                <TouchableOpacity style={{ 
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                               marginTop:5,
                              paddingVertical:3,
                              display:'none'
                             
                             

                    }}
                >

                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection:'row'
                                 
                                  
                                }}
                                >                
                                                  <Ionicons name="settings-outline" size={18} color={COLORS.purple} />
                                               
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:14,
                                                          fontWeight:'500',
                                                          marginLeft:10
                                                      }}
                                                    
                                                  >
                                                      Settings
                                                  </Text>
                                                
                                </View> 
                                <View
                                style={{
                                  flex: 1,
                                }}
                                > 
                                                  <Text
                                                      style={{
                                                          color:'#616161',
                                                          fontSize:11,
                                                          marginLeft:2,
                                                          textAlign:'right'
                                                      }}
                                                    
                                                  >
                                                     <Entypo name="chevron-right" size={22} color={COLORS.purple} />
                                                     
                                                  </Text>
                                                
                                </View>                    
                                
                            
                </TouchableOpacity>

               
                

                
            
                
          </View>  

    )
  }

  function renderBootomSheetCP()
  {

      if(isBootomOpen)
      {

        
        return (
          
                <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoint}
                enablePanDownToClose={true}
                onClose={() => setIsBootomOpen(false)}
                backgroundStyle={{backgroundColor:'#9E87F1'}}
          
                >
                  <BottomSheetView
                      style={{  flex: 1,paddingHorizontal: moderateScale(8) }}
                  
                  >
                     
                     <View
                            style={{  flexDirection: 'row',  justifyContent: 'space-between', }}
                       >
                         <Text style={{  marginVertical:verticalScale(12), textAlign:'left',color:'white',fontSize:scale(15),fontWeight:'700',flex:3  } }>CHANGE PASSWORD </Text>
                         <TouchableOpacity
                                            style={{ 
                                                height: scale(25),
                                                backgroundColor: '#7E57C2',
                                                justifyContent:'center',
                                                borderRadius: scale(4),
                                                marginRight:moderateScale(1),
                                                flexDirection:'row',
                                                alignItems: 'center',
                                                shadowOffset: { width: 0,height: 1,},
                                                shadowOpacity: 0.47,
                                                shadowRadius: 1.49,
                                                elevation: 3,
                                                flex:1,
                                                marginTop:verticalScale(10)
                                                
                                            }}
                                            
                                            onPress={() => { confirmChk(tokens.empID,'CHANGE_PASSWORD');}}               
                          >
                                         {
                                            cPstatus ? (<ActivityIndicator animating={cPstatus} size={"small"} color={"#ffffff"}   />) 
                                            : (<>
                                            <Text style={{ fontSize:scale(12), color: COLORS.white, 
                                                justifyContent: 'center', }}> Save</Text></>)
                                        }

                          </TouchableOpacity>

                      </View>
                    
                    
                    <View  style={{  flexDirection:'row', justifyContent:'space-between' }  }>  

                            <View
                                style={{
                                  flex: 19,
                                 // marginRight:4,
                                
                              }}
                            >
                                          <View>
                                             <Text
                                                style={{
                                                     color:COLORS.lightpurple,
                                                     fontSize:scale(9),
                                                    
                                                }}
                                               
                                             >
                                                  OLD PASSWORD
                                                </Text>
                                               <TextInput
                                                    style={{
                                                        marginVertical: verticalScale(3),
                                                        color: COLORS.yellow,
                                                        fontSize:scale(12),
                                                        paddingLeft:moderateScale(6),
                                                        backgroundColor:COLORS.purple,
                                                        opacity:0.8,
                                                        height:scale(30),
                                                       paddingVertical:verticalScale(4),
                                                       borderRadius:2,
                                                       shadowOffset: { width: 0,height: 1,},
                                                       shadowOpacity: 0.47,
                                                       shadowRadius: 1.49,
                                                       elevation: 3,
                                                    
                                                      
                                                    }}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    placeholder="OLD PASSWORD"
                                                    placeholderTextColor='#9E9E9E'
                                                    selectionColor={COLORS.black}
                                                    value={oP}
                                                    secureTextEntry={!showOP}
                                                    onChangeText={(text) => setOP(text)}
                                                    
                                                />
                                                 <TouchableOpacity
                                                      style={{
                                                          position: 'absolute',
                                                          right: 0,
                                                          bottom: scale(8),
                                                          height: scale(20),
                                                          width: scale(20)
                                                      }}
                                                      onPress={() => setShowOP(!showOP)}
                                                  >
                                                      <Image
                                                          source={showOP ? icons.disable_eye : icons.eye}
                                                          style={{
                                                              height: scale(13),
                                                              width: scale(13),
                                                              tintColor: COLORS.white
                                                          }}
                                                      />
                                                  </TouchableOpacity>


                                          </View>    
                                          <View>
                                                <Text
                                                style={{
                                                     color:COLORS.lightpurple,
                                                     fontSize:scale(9),

                                                
                                                }}
                                               
                                             >
                                                  NEW PASSWORD
                                                </Text>
                                               <TextInput
                                                    style={{
                                                        marginVertical: verticalScale(3),
                                                        color: COLORS.yellow,
                                                        fontSize:scale(12),
                                                        paddingLeft:moderateScale(6),
                                                        backgroundColor:COLORS.purple,
                                                        opacity:0.8,
                                                        height:scale(30),
                                                       paddingVertical:verticalScale(4),
                                                       borderRadius:scale(2),
                                                       shadowOffset: { width: 0,height: 1,},
                                                       shadowOpacity: 0.47,
                                                       shadowRadius: 1.49,
                                                       elevation: 3,
                                                    
                                                      
                                                    }}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    placeholder="NEW PASSWORD"
                                                    placeholderTextColor='#9E9E9E'
                                                    selectionColor={COLORS.black}
                                                    value={nP}
                                                    secureTextEntry={!showNP}
                                                    onChangeText={PassCheck}
                                                    
                                                />
                                                <TouchableOpacity
                                                      style={{
                                                          position: 'absolute',
                                                          right: 0,
                                                          bottom: scale(8),
                                                          height: scale(20),
                                                          width: scale(20)
                                                      }}
                                                      onPress={() => setShowNP(!showNP)}
                                                  >
                                                      <Image
                                                          source={showNP ? icons.disable_eye : icons.eye}
                                                          style={{
                                                            height: scale(13),
                                                            width: scale(13),
                                                              tintColor: COLORS.white
                                                          }}
                                                      />
                                                  </TouchableOpacity>
                                            </View>
                                            <View>

                                           
                                                <Text
                                                style={{
                                                     color:COLORS.lightpurple,
                                                     fontSize:scale(9),
                                                }}
                                               
                                             >
                                                 CONFIRM NEW PASSWORD
                                                </Text>
                                               <TextInput
                                                    style={{
                                                        marginVertical: verticalScale(3),
                                                        color: COLORS.yellow,
                                                        fontSize:scale(12),
                                                        paddingLeft:moderateScale(6),
                                                        backgroundColor:COLORS.purple,
                                                        opacity:0.8,
                                                       paddingVertical:verticalScale(4),
                                                       borderRadius:scale(2),
                                                       height:scale(30),
                                                       shadowOffset: { width: 0,height: 1,},
                                                       shadowOpacity: 0.47,
                                                       shadowRadius: 1.49,
                                                       elevation: 3,
                                                    
                                                      
                                                    }}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    placeholder="CONFIRM PASSWORD"
                                                    placeholderTextColor='#9E9E9E'
                                                    selectionColor={COLORS.black}
                                                    value={cNP}
                                                    secureTextEntry={!showCNP}
                                                    onChangeText={(text) => setCNP(text)}
                                                    
                                                />
                                                 <TouchableOpacity
                                                      style={{
                                                          position: 'absolute',
                                                          right: 0,
                                                          bottom: scale(8),
                                                          height: scale(20),
                                                          width: scale(20)
                                                      }}
                                                      onPress={() => setShowCNP(!showCNP)}
                                                  >
                                                      <Image
                                                          source={showCNP ? icons.disable_eye : icons.eye}
                                                          style={{
                                                              height: scale(13),
                                                              width: scale(13),
                                                              tintColor: COLORS.white
                                                          }}
                                                      />
                                                  </TouchableOpacity>
                                            </View>


                            </View>

                          

                            <View
                                style={{
                                  flex: 14,
                                  marginLeft:moderateScale(8),
                                 
                              }}
                            >


                               
                                        <Text style={{  marginVertical:verticalScale(12),marginTop:verticalScale(12), textAlign:'center',color:'white',fontSize:scale(10),fontWeight:'500' } } >
                                            ** Password Must Contain the Following **
                                        </Text>

                                   

                                   

                                      <Text style={{  color:COLORS.yellow,fontSize:scale(11),fontWeight:'500',marginBottom:verticalScale(8)  } } >
                                        {isLowercase ? (<><FontAwesome name="check" size={scale(15)} color="green"  /> A Lowercase Letter</>) 
                                          :
                                          (<><FontAwesome name="close" size={scale(15)} color="red"  /> A Lowercase Letter</>)
                                        }
                                         
                                      </Text>

                                      <Text style={{   color:COLORS.yellow,fontSize:scale(11),fontWeight:'500',marginBottom:verticalScale(8)  } } >
                                        {isUppercase ? (<><FontAwesome name="check" size={scale(15)} color="green"  /> A Uppercase Letter</>) 
                                          :
                                          (<><FontAwesome name="close" size={scale(15)} color="red"  /> A Uppercase Letter</>)
                                        }
                                         
                                      </Text>
                                      <Text style={{   color:COLORS.yellow,fontSize:scale(11),fontWeight:'500',marginBottom:verticalScale(8)  } } >
                                        {isNumber ? (<><FontAwesome name="check" size={scale(15)} color="green"  /> A Number</>) 
                                            :
                                            (<><FontAwesome name="close" size={scale(15)} color="red"  /> A Number</>)
                                          }
                                       
                                      </Text>
                                      <Text style={{   color:COLORS.yellow,fontSize:scale(11),fontWeight:'500',marginBottom:verticalScale(8)  } } >
                                        
                                         {isChar_length ? (<><FontAwesome name="check" size={17} color="green"  /> (Mini) 8 Charecter</>) 
                                            :
                                            (<><FontAwesome name="close" size={scale(15)} color="red"  /> (Mini) 8 Charecter</>)
                                          }
                                      </Text>
                            </View>
                                             

                      </View>
                  </BottomSheetView>
          
                </BottomSheet>
        
         );

      }
      else
      {
        return null;
      }
    
  }


  return (
        <>
           <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                style={{ flex: 1 }}
            >
              <SafeAreaView style={{backgroundColor: COLORS.blue}}>
              {renderHeader()}
              </SafeAreaView>

             
             
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}  >
             
                
                 <View
                 style={{ flex: 1, backgroundColor: '#F7F7FF' }}
                 >   
                     
                      <ScrollView >
                      {
                          isloddingAction ? (<Loading />) 
                          : 
                          (
                            <>
                              {rendertop()}
                              {renderbody({navigation})}
                            </>
                           
                          )
                          
                      }
                      
                      </ScrollView>
                      
                    
                 
                      {renderBootomSheetCP()}
                    
                  </View>
                   
                   
                    
            </TouchableWithoutFeedback> 
            </KeyboardAvoidingView> 
           
        </>
  );
};

export default Profile;




