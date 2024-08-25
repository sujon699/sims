import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images, baseUrl } from "../constants"
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseApi from "../api/BaseApi"
// import Otp from 'Otp';
// import A_Limit from 'A_Limit';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { showMessage } from "react-native-flash-message";
import ImageViewer from 'react-native-image-zoom-viewer';
import Loading from "../utils/Loading";
import { logout } from "../utils/utility";

import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";




function Permissiontab({ navigation }) {

  const [isloddingAction, setIsloddingAction] = useState(false);
  const [islodding, setIslodding] = useState(false);
  const [appToken, setappToken] = useState('');
  const [user, setUser] = useState('');
  const [images, setImages] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const [menuBasicData, setMenuBasicData] = useState({
    "ADLIMIT": 0,
    "OTP": 0,

  });
  const [disOption, setDisOption] = useState([
    {
      "Head": "AD LIMIT",
      "status": true,
    },
    {
      "Head": "OTP",
      "status": false,
    },


  ]);
  //const [renderData, setRenderData] = useState([]);

  const [renderALData, setRenderALData] = useState([]);
  const [renderOTPData, setRenderOTPData] = useState([]);


  useEffect(() => {
    getMenuValue();
    let cancel = false;
    return () => {
      cancel = true;
    }

  }, []);


  const getMenuValue = async (Head = "AD LIMIT") => {

    if (Head == "AD LIMIT") {
      var apiPath = '/AdLimitAPI.php';
      var act = 'fetchRequestAdLimit';
    }
    else {
      var apiPath = '/OtpAPI.php';
      var act = 'fetchPendingOTP';
    }


    //var act = 'Get_'+Head.replace(" ", "");
    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');
    const userName = await AsyncStorage.getItem('userName');
    setUser(userName);
    setappToken(token);
    if (token !== null) {

      try {

        setIsloddingAction(true);
        const { data } = await BaseApi.post(apiPath, {
          token: token,
          act: act,
          userID: userID
        });


        if (data.service_header.status_tag === 'success') {

          if (Head == "AD LIMIT") {
            setRenderALData(data.spw_data);
            setMenuBasicData(data.invBasicData);
          }
          else {
            setRenderOTPData(data.spw_data);
            setMenuBasicData(data.invBasicData);
          }



        }
        else {
          await logout(navigation, data.service_header.massage);
          setRenderALData([]);
          setRenderOTPData([]);
          setMenuBasicData(menuBasicData);
          setIsloddingAction(false);

        }

      }
      catch (error) {
        setRenderALData([]);
        setRenderOTPData([]);
        setMenuBasicData(menuBasicData);
        setIsloddingAction(false);
      }
      setIsloddingAction(false);


    }
    else {
      setRenderALData([]);
      setRenderOTPData([])
      setMenuBasicData(menuBasicData);
    }


    cartChange(Head);

  }



  const cartChange = async (head) => {


    const newIngredients = disOption.map((item) => {
      if (item.Head != head) {
        return { ...item, status: false };
      }
      else {
        return { ...item, status: true };
      }
    });
    setDisOption(newIngredients);
    //await getMenuValue(head);

  }



  function renderMenu() {

    var [{ Head: adlimitHead, status: adlimitstatus }] = disOption.filter((x) => x.Head == 'AD LIMIT');
    var [{ Head: otpHead, status: otpstatus }] = disOption.filter((x) => x.Head == 'OTP');




    return (
      <>
        <View style={{ width: '97%', alignSelf: 'center', marginTop: verticalScale(4) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>

            <TouchableOpacity
              style={{

                flex: 1,
                borderRadius: scale(3),
                backgroundColor: adlimitstatus ? '#b380ff' : '#D1C4E9',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                elevation: 3,
                shadowOpacity: 0.37,
                shadowRadius: 1.49,
                padding: scale(4),
                height: scale(34)



              }}
              onPress={() => {
                getMenuValue(adlimitHead);
              }}
            >




              <View
                style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>  {adlimitHead}</Text>
                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#E91E63', textAlign: 'center' }}>  {menuBasicData["ADLIMIT"]}</Text>

              </View>

            </TouchableOpacity>


            <TouchableOpacity
              style={{


                flex: 1,
                borderRadius: scale(3),
                backgroundColor: otpstatus ? '#b380ff' : '#D1C4E9',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                elevation: 3,
                shadowOpacity: 0.37,
                shadowRadius: 1.49,
                padding: scale(4),
                height: scale(34)



              }}
              onPress={() => {
                getMenuValue(otpHead);
              }}
            >




              <View
                style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>  {otpHead}</Text>
                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#E91E63', textAlign: 'center' }}>  {menuBasicData["OTP"]}</Text>

              </View>
            </TouchableOpacity>


          </View>


        </View>
      </>
    )


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
              onPress={() => navigation.navigate('Home', {  }) }
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
                marginLeft: moderateScale(8),
                //alignItems:'center'
              }}
            >
              <Text
                style={{
                  fontSize: scale(11),
                  fontWeight: '700',
                  color: '#fff',
                  textAlign: 'right'
                }}
              >
                PERMISSION
              </Text>
              <Text
                style={{
                  fontSize: scale(10),
                  fontWeight: '500',
                  textAlign: 'left',
                  color: COLORS.yellow,
                  textAlign: 'right'
                }}
              >
                {user}
              </Text>


            </View>

            <FontAwesome
              name="unlock-alt"
              size={scale(22)}
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


  const SelimageView = async (ImgPath) => {
    setImages([
      {
        url: baseUrl + ImgPath,
        props: {

        },
      }
    ]);

    setIsModal(true);
  }


  const confirmChk = async (ID, type) => {
    Alert.alert(
      // title
      'Are You Sure ?',
      // body
      type,
      [
        {
          text: 'YES',
          onPress: () => {
            if (type == 'DENY_LIMIT') {
              DenyLimitRqst(ID);
            }
            else if (type == 'APPROVE_LIMIT') {
              ApproveLimitRqst(ID);
            }
            else if (type == 'DENY_OTP') {
              DenyOtpRqst(ID);
            }
            else if (type == 'APPROVE_OTP') {
              ApproveOtpRqst(ID);
            }


          }
        },
        {
          text: 'NO',
          onPress: () => {

          }
        }

      ]
    )
  }

  const DenyLimitRqst = async (adID) => {

    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);

    try {

      const { data } = await BaseApi.post('/AdLimitAPI.php', {
        token: appToken,
        act: 'adLimitDeny',
        approve_by: userID,
        ad_rqst_id: adID

      });

      if (data.service_header.status_tag === 'success') {
        setIsloddingAction(false);

        showMessage({
          message: "Deny SuccessFully ",
          description: adID,
          duration: 2000,
          type: "success",
        });


      }
      else {
        setIsloddingAction(false);
        await logout(navigation, data.service_header.massage);

        showMessage({
          message: "Deny UnsuccessFully ",
          description: adID,
          duration: 2000,
          type: "danger",
        });
      }





    }
    catch (error) {
      setIsloddingAction(false);
    }

    getMenuValue('AD LIMIT');


  }

  const ApproveLimitRqst = async (adID) => {


    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);

    try {

      const { data } = await BaseApi.post('/AdLimitAPI.php', {
        token: appToken,
        act: 'adLimitApprove',
        approve_by: userID,
        ad_rqst_id: adID

      });

      if (data.service_header.status_tag === 'success') {
        setIsloddingAction(false);

        showMessage({
          message: "Approve Done ",
          description: adID,
          duration: 2000,
          type: "success",
        });


      }
      else {
        setIsloddingAction(false);
        await logout(navigation, data.service_header.massage);

        showMessage({
          message: "Approve Unsucessfully ",
          description: adID,
          duration: 2000,
          type: "danger",
        });
      }





    }
    catch (error) {
      setIsloddingAction(false);
    }

    getMenuValue('AD LIMIT');




  }

  const DenyOtpRqst = async (otpID) => {
    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);
    try {
      const { data } = await BaseApi.post('/OtpAPI.php', {
        token: appToken,
        act: 'OTPDeny',
        approve_by: userID,
        otp_id: otpID

      });

      if (data.service_header.status_tag === 'success') {
        setIsloddingAction(false);
        showMessage({
          message: "Deny SuccessFully ",
          description: otpID,
          duration: 2000,
          type: "success",
        });
      }
      else {
        await logout(navigation, data.service_header.massage);
        setIsloddingAction(false);
        showMessage({
          message: "Deny UnsuccessFully ",
          description: otpID,
          duration: 2000,
          type: "danger",
        });
      }
    }
    catch (error) {
      setIsloddingAction(false);
    }
    getMenuValue('OTP');


  }

  const ApproveOtpRqst = async (otpID) => {
    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);
    try {

      var otpIndex = renderOTPData.findIndex(x => x.otp_id === otpID)

      var modifyDetailsID = renderOTPData[otpIndex].otpDetails.filter((x) => x.selected == true).map(function (val, i) {
        return {
          "otp_detailsID": val.otp_detailsID
        }

      })

      if (modifyDetailsID.length == 0) {
        DenyLimitRqst(otpID)
      }

      modifyDetailsID = JSON.stringify(modifyDetailsID);


      const { data } = await BaseApi.post('/OtpAPI.php', {
        token: appToken,
        act: 'OTPApprove',
        approve_by: userID,
        otp_id: otpID,
        otpDetails: modifyDetailsID
      });

      if (data.service_header.status_tag === 'success') {
        setIsloddingAction(false);
       // console.log(data);
        showMessage({
          message: "Approve Done ",
          description: otpID,
          duration: 2000,
          type: "success",
        });


      }
      else {
        await logout(navigation, data.service_header.massage);
        setIsloddingAction(false);
        showMessage({
          message: "Approve Unsucessfully ",
          description: otpID,
          duration: 2000,
          type: "danger",
        });
      }

    }
    catch (error) {
      setIsloddingAction(false);
    }
    getMenuValue('OTP');

  }


  const renderADLIMIT = ({ item }) => {

    return (
      <View
        listKey={item.ad_rqst_id}
        style={{

          shadowOffset: {
            width: 0,
            height: 0.5,
          },
          shadowOpacity: 0.47,
          shadowRadius: 0.5,
          elevation:2,
          borderRadius: scale(3),
          backgroundColor: COLORS.white,
          marginBottom: verticalScale(3)


        }}

      >


          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: SIZES.padding * 0,
            paddingTop: 0,
            paddingBottom: 0


          }}>



            <View style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}>


               

                 <View
                    style={{
                      flexDirection: 'row',
                      marginTop: verticalScale(2),
                      borderWidth:1,borderTopWidth: 0,borderLeftWidth:0,borderRightWidth:0,borderColor: '#E0E0E0'
                    }}
                  >

                    <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CustomerDetails', {
                            cusName: item.cusName,
                            cusID: item.cusID,
                            cus_c_Class: item.c_class,
                          })
                        }
                        style={{ paddingHorizontal:moderateScale(3),flex: 12,paddingBottom:verticalScale(1)  }}
                      > 
                        

                        <View style={{flexDirection: 'row',}} >
                            <Text style={{ fontSize: scale(10), fontWeight: '600', color: "#673AB7" }}>
                              {item.cusName}
                            </Text>

                        </View>

                        <View style={{ flexDirection: 'row',  }}>
                          <Text style={{ fontSize: scale(9), color: item.cusThatTimeBal > 0  ? COLORS.red : COLORS.primary, textAlign: 'left', marginTop: verticalScale(-1) }}>
                            Balance : {item.cusThatTimeBalWithNum} | </Text>
                            <Text style={{ fontSize: scale(9), color: item.verified_type == 'BlackListed' ? COLORS.red : '#2E7D32',marginTop: verticalScale(-1) }}>{item.verified_type} | </Text>
                            <Text style={{ fontSize: scale(9), color: '#FF5722', marginTop: verticalScale(-1) }}>{item.PR}% | </Text>
                            <Text style={{ fontSize: scale(9), color: '#BA68C8', marginTop: verticalScale(-1) }}>{item.c_class}</Text>
                        </View>
                        

                    </TouchableOpacity>

                      <View
                      
                        style={{
                          flexDirection: 'row', backgroundColor: '#757575', flex: 3, justifyContent: 'center',
                          alignContent: 'center', alignItems: 'center', borderRadius: scale(6),flex: 1,paddingBottom:verticalScale(1) 
                        }}
                      >
                          <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                      </View>


                  </View>

                  

              <View
                style={{
                  flexDirection: 'row', justifyContent: 'space-between',marginTop:verticalScale(1)
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 0 }}
                >
                    <TouchableOpacity onPress={() => SelimageView(item.img)} >
                        <FontAwesome5 name="images" size={scale(22)} color="#5cd6d6"  />
                      </TouchableOpacity>

                </View>
               
             

                 <View
                        style={{ borderColor: '#E0E0E0', borderWidth: 0, flex: 2, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(1),justifyContent:'center' }}
                      >
                        <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Entry Date</Text>
                        <Text style={{ fontSize: scale(9), color: '#43A047', marginTop: verticalScale(-1.5) }}>{item.entry_date}</Text>

                 </View>

                 <View
                        style={{ borderColor: '#E0E0E0', borderWidth: 0, flex: 2, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2) ,justifyContent:'center' }}
                      >
                        <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request By</Text>
                        <Text style={{ fontSize: scale(9), color: '#795548', marginTop: verticalScale(-1.5) }}>{item.RequestBy}</Text>

                 </View>
                
               
                <View
                  style={{ borderColor: '#E0E0E0', flex: 2.5, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2),justifyContent:'center' }}
                >
                  <View style={{flexDirection: 'row',justifyContent:'flex-end'}} >
                        <Text style={{ fontSize: scale(10), fontWeight: '500', color: '#795548'}}>{item.cmt_date}</Text>

                    </View>

                    <View style={{ flexDirection: 'row',justifyContent:'flex-end'  }}>
                      <Text style={{ fontSize: scale(8), color:  '#9E9E9E' , marginTop: verticalScale(-1) }}>Commitment Date</Text>
                    </View>
                 
                  
                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2) }}
                >
                  <View style={{flexDirection: 'row',justifyContent:'flex-end'}} >
                        <Text style={{ fontSize: scale(12), fontWeight: '600', color: COLORS.red }}>
                          {item.limitAmount}
                        </Text>

                    </View>

                    <View style={{ flexDirection: 'row',justifyContent:'flex-end'  }}>
                      <Text style={{ fontSize: scale(8), color:  '#9E9E9E' , textAlign: 'left', marginTop: verticalScale(-1) }}>Request Amount</Text>
                    </View>
                 
                  
                </View>



              </View>


            </View>



          </View>

          <View style={{

            paddingHorizontal: moderateScale(4),
            paddingVertical: 3,
            backgroundColor: '#fff0e6'

            }}>
            <View style={{}}>
              <Text style={{ fontSize:scale(9), color: COLORS.secondary, lineHeight: scale(12), }}>
                {item.cmt_remarks}
              </Text>
            </View>

          </View>

          <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 1,

              }}>


                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: scale(25),
                    marginRight: moderateScale(1),
                    backgroundColor: '#79d279',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    flexDirection: 'row',
                  }}
                  onPress={() => confirmChk(item.ad_rqst_id, 'APPROVE_LIMIT')}
                >


                  <Ionicons name="ios-checkmark-done-sharp" size={scale(16)} color="white" style={{ marginRight: moderateScale(5) }} />
                  <Text style={{ fontSize:scale(13),fontWeight:'600', color: COLORS.white }}>APPROVE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: scale(25),
                    backgroundColor: '#ff4d4d',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    flexDirection: 'row',
                  }}
                  onPress={() => confirmChk(item.ad_rqst_id, 'DENY_LIMIT')}
                >

                  <MaterialIcons name="cancel" size={scale(16)} color="white" style={{ marginRight: moderateScale(5) }} />
                  <Text style={{ fontSize:scale(13),fontWeight:'600', color: COLORS.white }}>DENY</Text>
                </TouchableOpacity>

          </View>




      </View>

    );

  }

  const renderOTP = ({ item }) => {

    return (
      <View
        listKey={item.otp_id}
        style={{

          shadowOffset: {
            width: 0,
            height: 0.5,
          },
          shadowOpacity: 0.47,
          shadowRadius: 0.5,
          elevation:2,
          borderRadius: scale(3),
          backgroundColor: COLORS.white,
          marginBottom: verticalScale(3)


        }}

      >

            <View
              style={{
                flexDirection:'row',
                justifyContent:'space-between',
                paddingVertical: verticalScale(1),
                backgroundColor:'#BCAAA4'
              
              }}
            >
                
                    <View
                      
                      style={{
                        flexDirection: 'row', backgroundColor: '#757575', flex: 3, justifyContent: 'center',
                        alignContent: 'center', alignItems: 'center', borderRadius: scale(2),flex: 1,paddingBottom:verticalScale(1) 
                      }}
                    >
                        <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                    </View>
                    <Text style={{textAlign:'center',flex:5}}>{item.otp_type}</Text>
          </View>
                
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: SIZES.padding * 0,
            paddingTop: 0,
            paddingBottom: 0


          }}>

         
          
            <View style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}>


                

                

                 <View
                    style={{
                      flexDirection: 'row',
                      marginTop: verticalScale(2),
                    
                    }}
                  >

                    <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CustomerDetails', {
                            cusName: item.cusName,
                            cusID: item.cusID,
                            cus_c_Class: item.c_class,
                          })
                        }
                        style={{ paddingHorizontal:moderateScale(3),flex: 12,paddingBottom:verticalScale(1)  }}
                      > 
                        

                        <View style={{flexDirection: 'row',}} >
                            <Text style={{ fontSize: scale(10), fontWeight: '600', color: "#673AB7" }}>
                              {item.cusName}
                            </Text>

                        </View>

                        <View style={{ flexDirection: 'row',  }}>
                            <Text style={{ fontSize: scale(9), color: '#FF5722', marginTop: verticalScale(-1) }}>{item.otp_time} | </Text>
                            <Text style={{ fontSize: scale(9), color: '#5D4037', marginTop: verticalScale(-1) }}>{item.RequestBy}</Text>
                        </View>
                        

                    </TouchableOpacity>

                      <TouchableOpacity onPress={() => SelimageView(item.img)}   style={{
                         flex: 1, justifyContent: 'flex-end',
                        }} >
                        <FontAwesome5 name="images" size={scale(22)} color="#5cd6d6"  />
                      </TouchableOpacity>


                  </View>

                  

                  
                  
             


            </View>

            



          </View>

          <FlatList
                    listKey={item.otp_id}
                    data={item.otpDetails}
                    extraData={item.otpDetails}
                    renderItem={renderOtpDetails}
                    keyExtractor={(item) => item.otp_detailsID}
                    showsVerticalScrollIndicator={false}
                  // onRefresh={renderOtpDetails}   
                  />

          <View style={{

            paddingHorizontal: moderateScale(4),
            paddingVertical: 3,
            backgroundColor: '#fff0e6'

            }}>
            <View style={{}}>
              <Text style={{ fontSize:scale(9), color: COLORS.secondary, lineHeight: scale(12), }}>
                {item.cmt_remarks}
              </Text>
            </View>

          </View>

          <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 1,

              }}>


                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: scale(25),
                    marginRight: moderateScale(1),
                    backgroundColor: '#79d279',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    flexDirection: 'row',
                  }}
                  onPress={() => confirmChk(item.otp_id, 'APPROVE_OTP')}
                >


                  <Ionicons name="ios-checkmark-done-sharp" size={scale(16)} color="white" style={{ marginRight: moderateScale(5) }} />
                  <Text style={{ fontSize:scale(13),fontWeight:'600', color: COLORS.white }}>APPROVE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: scale(25),
                    backgroundColor: '#ff4d4d',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    flexDirection: 'row',
                  }}
                  onPress={() => confirmChk(item.otp_id, 'DENY_OTP')}
                >

                  <MaterialIcons name="cancel" size={scale(16)} color="white" style={{ marginRight: moderateScale(5) }} />
                  <Text style={{ fontSize:scale(13),fontWeight:'600', color: COLORS.white }}>DENY</Text>
                </TouchableOpacity>

          </View>




      </View>

    );

  }

  const renderOtpDetails = ({ item }) => {
    var otpIndex = renderOTPData.findIndex(x => x.otp_id === item.otp_id)
    var otpDetailsIndex = renderOTPData[otpIndex].otpDetails.findIndex(x => x.otp_detailsID === item.otp_detailsID)

    return (
      <>
        <View style={{

          paddingTop: 0,
          paddingBottom: 0,
          backgroundColor: '#d1d1e0',
          marginBottom: verticalScale(1),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            key={item.otp_detailsID}
            style={{ flex: 1, textAlign: "right", justifyContent: 'center', backgroundColor: '#bf80ff', textAlign: 'center' }}
            onPress={() => checkDetails(!renderOTPData[otpIndex].otpDetails[otpDetailsIndex].selected, otpIndex, otpDetailsIndex)}
          >

            {
              renderOTPData[otpIndex].otpDetails[otpDetailsIndex].selected == true
                ? (<MaterialIcons name="radio-button-checked" size={scale(17)} color="white" style={{ textAlign: 'center' }} />)
                :
                (<MaterialIcons name="radio-button-unchecked" size={scale(17)} color="white" style={{ textAlign: 'center' }} />)

            }

          </TouchableOpacity>
          <View style={{ flex: scale(12), paddingHorizontal: moderateScale(0), }}>
            {
              item.otptextRows.map(function (text, i) {
                return (<Text style={{ fontSize:scale(10), color: COLORS.purple,paddingVertical:verticalScale(2), borderColor:COLORS.gray, borderWidth:1,borderBottomWidth:0,borderRightWidth:0,borderLeftWidth:0,borderTopWidth:0,
                 textAlign: 'left' }} key={i}>{text.otp_text}</Text>);
              })
            }
          </View>





        </View>

      </>

    );

  }

  const checkDetails = async (value, otpIndex, otpDetailsIndex) => {

    // alert(value);
    // alert(otpIndex);
    // alert(otpDetailsIndex);
    const newIngredients = [...renderOTPData];
    newIngredients[otpIndex].otpDetails[otpDetailsIndex] = { ...newIngredients[otpIndex].otpDetails[otpDetailsIndex], selected: value };
    setRenderOTPData(newIngredients);
    // getMenuValue('OTP');
  }




  function renderBodySec() {
    var [{ Head }] = disOption.filter((x) => x.status == true);


    if (Head == 'AD LIMIT') {

      return (

        <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(4), paddingHorizontal: moderateScale(6) }}>
          <FlatList
            listKey="1.1"
            data={renderALData}
            //extraData={renderALData}
            renderItem={renderADLIMIT}
            keyExtractor={(item) => item.ad_rqst_id}
            showsVerticalScrollIndicator={false}
            //refreshing={islodding}



          />
        </View>
      )
    }
    else {

      return (

        <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(3), paddingHorizontal: moderateScale(6) }}>
          <FlatList
            listKey="1.2"
            data={renderOTPData}
            renderItem={renderOTP}
            extraData={renderOTPData}
            keyExtractor={(item) => item.otp_id}
            showsVerticalScrollIndicator={false}
            refreshing={islodding}



          />
        </View>
      )

    }




  }





  return (

    <>
      <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
        {renderHeader()}
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: '#E8EAF6' }}>



        {
          isloddingAction ? (<Loading />)
            : (
              <>
                {renderMenu()}
                {renderBodySec()}
              </>

            )
        }

        <Modal
          visible={isModal}
          transparent={isModal}
        >

          <TouchableOpacity
            onPress={() => setIsModal(false)}
            style={{ top: verticalScale(42), right: moderateScale(-18), zIndex: 999999 }}
          >
            <FontAwesome name="close" size={scale(22)} color="white" />

          </TouchableOpacity>
          <ImageViewer imageUrls={images} />
        </Modal>



      </View >


    </>


  );
}

export default Permissiontab;


