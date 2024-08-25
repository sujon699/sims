import React, { useState, useEffect, useRef } from "react";
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
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images, baseUrl } from "../../constants";
import { dateFormater } from '../../utils/utility';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Feather from 'react-native-vector-icons/dist/Feather';

import BaseApi from "../../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
// import * as ImagePicker from 'expo-image-picker';
// import { Camera, CameraType } from 'expo-camera';
import { Camera, useCameraDevice,useCodeScanner } from 'react-native-vision-camera';
import ImagePicker from 'react-native-image-crop-picker';

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
import DocumentScanner from 'react-native-document-scanner-plugin'

import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";


const ProfileModify = ({ navigation, route }) => {


  const [image, setImage] = useState(baseUrl +route.params?.empImg);
  const [tmpImage, setTmpImage] = useState(null);

  const [changeImage, setChangeImage] = useState(0);




  const [isModalCamera, setIsModalCamera] = useState(false);
  const [isloddingAction, setIsloddingAction] = useState(false);
  const [islodding, setIslodding] = useState(false);


  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);


  const cameraRef = useRef(null);

  const [isBootomOpen, setIsBootomOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoint = ["15%"];

  const [empData, setEmpData] = useState([]);




  const [empAddress, setEmpAddress] = useState('');
  const [empNameEx, setEmpNameEx] = useState(route.params?.empName);
  const [empMail, setEmpMail] = useState('');
  const [empPerPhone, setEmpPerPhone] = useState('');
  const [empAltrPhone, setEmpAltrPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('01-Feb-2000');


  const [genderCombo, setGenderCombo] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' },

  ]);

  const [gender, setGender] = useState('Male');

  const [mSCombo, setMSCombo] = useState([
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Seperated', value: 'Seperated' },
    { label: 'Not Specified', value: 'Not Specified' },


  ]);

  const [ms, setMS] = useState('Single');



  const [tokens, setTokens] = useState({
    tokenID: '',
    userName: '',
    userID: '',
    empID: '',
    empName: '',
    empImg: '',
  });




  useEffect(() => {
    fetchProfileData();

    requestCameraPermission();


  }, []);

    const device = useCameraDevice('back');
   // const device = devices.back;

    const requestCameraPermission = async () => {
       const permission  = await Camera.requestCameraPermission();

       if(permission === 'denied')
       {
          await Linking.openSettings();
       }
    }

  const scanDocument = async () => {
    //setIsModalCamera(true);
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 100,

    })

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      //setScannedImage(scannedImages[0]);
      SaveImage();
    }
  }

  const fetchProfileData = async () => {

    const tokenID = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('userName');
    const eimg = await AsyncStorage.getItem('empImg');
    const user_ID = await AsyncStorage.getItem('userID');
    const empid = await AsyncStorage.getItem('empID');
    const empname = await AsyncStorage.getItem('empName');



    var newdata = {
      tokenID: tokenID,
      userName: user,
      userID: user_ID,
      empID: empid,
      empName: empname,
      empImg: eimg,

    }
    setTokens(newdata);
    setImage(baseUrl + eimg);


    if (tokenID !== null) {
      setIsloddingAction(true);
      try {

        const { data } = await BaseApi.post('/profile/profileSettingsAPI.php', {
          token: tokenID,
          act: 'fetchEmpInfo',
          empID: empid,
          userID: user_ID
        });

        if (data.service_header.status_tag === 'success') {
          // var kk = Object.entries(data.spw_data.otpDetails); 
          //console.log(kk);   
          setEmpData(data.spw_data);
          // console.log(data.spw_data);
          setEmpNameEx(data.spw_data.emp_name);
          setEmpMail(data.spw_data.mail_address);
          setEmpPerPhone(data.spw_data.per_mobile_no);
          setEmpAltrPhone(data.spw_data.alternate_mobile_no);
          setEmpAddress(data.spw_data.address);
          setGender(data.spw_data.gender);
          setDateOfBirth(data.spw_data.date_of_birthEX);
          setMS(data.spw_data.marital_status);



        }
        else {
          //console.log(data.spw_data);
          await logout(navigation, data.service_header.massage);
          setEmpData([]);

        }

      }
      catch (error) {
        console.log(error);
        setEmpData([]);
      }
      setIsloddingAction(false);

    }
    else {
      setEmpData([]);
    }





  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  }

  const OnchangeDate = ({ type }, selectedDate) => {
    if (type == "set") {
      var curDate = selectedDate;
      setDate(curDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(dateFormater(selectedDate));
      }

    }
    else {
      toggleDatePicker();
    }
  }
  const ConfirmDate = () => {
    toggleDatePicker();
    setDateOfBirth(dateFormater(date));
  }


  const confirmChk = async (empID, type) => {
    Alert.alert(
      // title
      'Are You Sure ?',
      // body
      '',
      [
        {
          text: 'YES',
          onPress: () => {

            if (type == 'SAVE_PROFILE') {
              UpdateProfile(empID);
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

  const FromValidation = async () => {

    var error = "";
    var errorNo = 0;
    if (empNameEx.trim().length <= 3) {
      errorNo++;
      error += errorNo + " Employee Name  Must be 4 Characters  \n";
    }

    if (tokens.empID.trim().length <= 3) {
      errorNo++;
      error += errorNo + " Employee ID Not Found  \n";
    }






    return error;
  }

  const UpdateProfile = async (empID) => {

    const userID = await AsyncStorage.getItem('userID');

    try {
      var errorMsg = await FromValidation();
      var successMsg = "";


      if (errorMsg.length > 0) {
        setIsloddingAction(false);
        showMessage({
          message: errorMsg,
          description: '',
          duration: 2500,
          type: "danger",
        });


      }
      else 
      {
          ////////////   image section //////////////////////////////
          if (changeImage == 1) 
          {
              var formData = new FormData();
              formData.append('token', tokens.tokenID);
              formData.append('act', 'UpdateProfile');
              formData.append('imgID', empID);
              formData.append('folderName', 'employee');
              formData.append('img', {
                name: 'sujon',
                uri: image,
                type: 'image/jpg'
              });

              setIsloddingAction(true);
              const { data } = await BaseApi.post('profile/profileAPI.php', formData,
                {
                  headers: {
                    Accept: 'application/json', 'Content-Type': 'multipart/form-data'
                  }

                }
              );


              if (data.service_header.status_tag === 'success') {
                await AsyncStorage.setItem('empImg', data.spw_data);
                setIsloddingAction(false);
              }
              else {
                await logout(navigation, data.service_header.massage);
                setIsloddingAction(false);
              }

          }

          setIsloddingAction(true);
          const { data } = await BaseApi.post('profile/profileSettingsAPI.php', {
            token: tokens.tokenID,
            act: 'UpdateBasicInfo',
            empID: empID,
            userID: userID,
            empName: empNameEx,
            empPerPhone: empPerPhone,
            empMail: empMail,
            empAltrPhone: empAltrPhone,
            gender: gender,
            dateOfBirth: dateOfBirth,
            ms: ms,
            empAddress: empAddress
          });

          if (data.service_header.status_tag === 'success') {
            // console.log(data.spw_data);
            showMessage({
              message: "Employee Info Update Sucessfully ",
              description: '',
              duration: 2000,
              type: "success",
            });

          }
          else {
            await logout(navigation, data.service_header.massage);
            //console.log(data.spw_data);
            // setIsloddingAction(false);
            showMessage({
              message: "Employee Info Update Unsuccessfully ",
              description: '',
              duration: 2000,
              type: "danger",
            });


          }

          setIsloddingAction(false);
          fetchProfileData();

      }




    }
    catch (error) {
      console.log(error);
      setIsloddingAction(false);
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

            

            <TouchableOpacity
              onPress={() => { confirmChk(tokens.empID, 'SAVE_PROFILE'); }}
              style={{ backgroundColor: COLORS.yellow, borderRadius: 2, paddingHorizontal: 6, paddingVertical: 3.5 }}
            >
              {
                islodding ? (<ActivityIndicator animating={islodding} size={"small"} color="black" />)
                  : (<><Text style={{ fontSize: 14, fontWeight: '600' }}> <Feather name="edit" size={14} color="black" />  Edit Profile</Text></>)
              }

            </TouchableOpacity>
            

          </View>


        </View>



      </LinearGradient>

    );
  }

  const TakePhoto = async () => {

    setIsBootomOpen(false);
    // if (cameraRef) {
    //   try {
    //     let option = {
    //       quality: 1,
    //       base64: true,
    //     }

    //     const data = await cameraRef.current.takePictureAsync(option);
    //     setTmpImage(data.uri);

    //     //console.log(data.base64);
    //     // setImage(data.uri);
    //     // setIsModalCamera(false);

    //   }
    //   catch (err) {
    //     console.log(err)
    //   }

    // }


    ImagePicker.openCamera({   
      width: 1200,
      height: 1200,
      cropping: true,
    }).then(image => {
      //console.log(image);
      alert(JSON.stringify(image));
      setTmpImage(image.path);
      setImage(image.path);
    //  setIsModalCamera(false);
      setChangeImage(1);
    }).catch(err => {
       // alert(err);
    });

    // ImagePicker.openCamera({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    // }).then(image => {
    //   console.log(image);
    // });

    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 400,
    //   cropping: true
    // }).then(image => {
    //   console.log(image);
    // });


  }

  const SaveImage = () => {

    setImage(tmpImage);
    setTmpImage(null);
   // setIsModalCamera(false);
    setChangeImage(1);

  }

  const takePhotoFromgallary = async () => {

     setIsBootomOpen(false);
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [5, 4],
    //   quality: 0.6,
    //   base64: true
    // });

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      //console.log(image);
      //alert(JSON.stringify(image));
       setTmpImage(image.path);
       setImage(image.path);
       setChangeImage(1);
    }).catch(err => {
      //  alert(err);
    });

  


  }

  function rendertop() {
    return (
      <View style={{ flexDirection: 'row', marginTop: '5%',  marginBottom: verticalScale(10) }}>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => setIsBootomOpen(true)}>
            <View
              style={{
                height: scale(92),
                width: scale(92),
                borderRadius: scale(10),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: scale(1),
                borderColor: COLORS.purple

              }}>
              <ImageBackground
                source={{ uri: image }}

                style={{ height: scale(88), width: scale(88) }}
                imageStyle={{ borderRadius: scale(10) }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',

                  }}>

                  <Entypo
                    name="camera"
                    size={scale(25)}
                    color="#ECEFF1"
                    style={{
                      opacity: 0.9,
                      // alignItems: 'center',
                      //justifyContent: 'center',
                      position: 'absolute',
                      bottom: 0,
                      left: scale(60),
                      right: 0,

                      // borderWidth: 1,
                      // borderColor: '#fff',

                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: '1.%', fontSize: scale(18), fontWeight: 'bold', color: '#9575CD' }}>
            {empData.emp_name}
          </Text>
        </View>

      </View>



    );
  }



  function renderbody() {
    return (
      <>
        <View style={{  paddingHorizontal: moderateScale(6), marginBottom: verticalScale(8),  }}>
          {renderBasicInfo()}
          {renderEditableInfo()}
        </View>

      </>
    )
  }

  function renderBasicInfo() {
    return (

      <View
        style={{

          shadowOffset: { width: 0, height: 0.5, },
          shadowOpacity: 0.47,
          shadowRadius: 1.0,
          elevation: 3,
          borderRadius: scale(5),
          backgroundColor: COLORS.white,
          paddingHorizontal:moderateScale(8),
          paddingVertical: verticalScale(4),
        }}

      >

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,



        }}
        >

          <View
            style={{
              flex: 1,

            }}
          >
            <Text
              style={{
                color: '#757575',
                fontSize: scale(9)
              }}

            >
              User
            </Text>
            <TextInput
              style={{
                marginVertical: verticalScale(1),
                color: '#424242',
                fontSize: scale(11),
                paddingLeft: moderateScale(6),
                backgroundColor: '#EEEEEE',
                paddingVertical: verticalScale(1),
                borderRadius: scale(2),
                height: scale(25),
                marginRight:moderateScale(1)

              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Name"
              placeholderTextColor='#9E9E9E'
              selectionColor={COLORS.black}
              value={empData.user}
              editable={false}


            />
          </View>
          <View
            style={{
              flex: 1,

            }}
          >
            <Text
              style={{
                color: '#757575',
                fontSize: scale(9)
              }}

            >
              Branch
            </Text>
            <TextInput
             style={{
              marginVertical: verticalScale(1),
              color: '#424242',
              fontSize: scale(11),
              paddingLeft: moderateScale(6),
              backgroundColor: '#EEEEEE',
              paddingVertical: verticalScale(1),
              borderRadius: scale(2),
              height: scale(25),
              marginRight:moderateScale(1)

            }}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Name"
            placeholderTextColor='#9E9E9E'
            selectionColor={COLORS.black}
            value={empData.branch}
            editable={false}

            />
          </View>

        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,
    
          display: 'none'
        }}
        >

          <View
            style={{
              flex: 1,
              marginRight: 3

            }}
          >
            <Text
              style={{
                color: '#757575',
                fontSize: 11,
                marginBottom: -7,
                marginLeft: 2
              }}

            >
              Department
            </Text>
            <TextInput
              style={{
                marginVertical: SIZES.padding,
                color: '#424242',
                fontSize: 13,
                paddingLeft: 10,
                backgroundColor: '#EEEEEE',
                paddingVertical: 1,
                borderRadius: 2,
                height: 30,

              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Name"
              placeholderTextColor='#9E9E9E'
              selectionColor={COLORS.black}
              value={empData.dept_id}
              editable={false}


            />
          </View>
          <View
            style={{
              flex: 1,

            }}
          >
            <Text
              style={{
                color: '#757575',
                fontSize: 11,
                marginBottom: -7,
                marginLeft: 2
              }}

            >
              Designation
            </Text>
            <TextInput
              style={{
                marginVertical: SIZES.padding,
                color: '#424242',
                fontSize: 13,
                paddingLeft: 10,
                backgroundColor: '#EEEEEE',
                paddingVertical: 1,
                borderRadius: 2,
                height: 30,

              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Email"
              placeholderTextColor='#9E9E9E'
              selectionColor={COLORS.black}
              value={empData.desig_id}
              editable={false}

            />
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,




        }}
        >

          <View
            style={{
              flex: 1,

            }}
          >
            <Text
              style={{
                color: '#757575',
                fontSize: scale(9),
        
              }}

            >
              Office Pnone
            </Text>
            <TextInput
              style={{
                marginVertical: verticalScale(1),
                color: '#424242',
                fontSize: scale(11),
                paddingLeft: moderateScale(6),
                backgroundColor: '#EEEEEE',
                marginRight: moderateScale(1),
                paddingVertical: verticalScale(1),
                borderRadius: scale(2),
                height: scale(25),

              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Office Pnone"
              placeholderTextColor='#9E9E9E'
              selectionColor={COLORS.black}
              value={empData.officePhone}
              editable={false}


            />
          </View>
          <View
            style={{
              flex: 1,

            }}
          >
            <Text
              style={{
                color: '#757575',
                fontSize: scale(9),
              }}

            >
              NID
            </Text>
            <TextInput
              style={{
                marginVertical: verticalScale(1),
                color: '#424242',
                fontSize: scale(11),
                paddingLeft: moderateScale(6),
                backgroundColor: '#EEEEEE',
                paddingVertical: verticalScale(1),
                borderRadius: scale(2),
                height: scale(25),

              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="NID"
              placeholderTextColor='#9E9E9E'
              selectionColor={COLORS.black}
              value={empData.national_id}
              editable={false}

            />
          </View>
        </View>


      </View>

    )
  }

  function renderEditableInfo() {
    return (

      <>
        <Text
          style={{
            color: COLORS.purple,
            fontSize: scale(12),
            marginLeft: moderateScale(4),
            marginBottom: 0,
            marginTop: verticalScale(6)
          }}>
          EDITABLE INFO
        </Text>

        <View
          style={{

            shadowOffset: { width: 0, height: 0.5, },
            shadowOpacity: 0.47,
            shadowRadius: 1.0,
            elevation: 3,
            borderRadius: 6,
            backgroundColor: COLORS.white,

            paddingHorizontal: verticalScale(6),
            paddingVertical: verticalScale(4),
          }}

        >

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          >

            <View
              style={{
                flex: 2,
              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
             
                }}

              >
                Full Name
              </Text>
              <TextInput
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),
                  marginRight:moderateScale(1)

                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Full Name"
                placeholderTextColor='#9E9E9E'
                selectionColor={COLORS.black}
                value={empNameEx}
                onChangeText={(text) => setEmpNameEx(text)}

              />
            </View>
            <View
              style={{
                flex: 1,

              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
                }}

              >
                Personal Phone No
              </Text>
              <TextInput
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),
              



                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Email"
                placeholderTextColor='#9E9E9E'
                keyboardType="numeric"
                selectionColor={COLORS.black}
                value={empPerPhone}
                onChangeText={(text) => setEmpPerPhone(text)}

              />
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
  



          }}
          >

            <View
              style={{
                flex: 2,
                marginRight: 3

              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
            
                }}

              >
                Email
              </Text>
              <TextInput
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),
                  marginRight:moderateScale(1)

                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Full Name"
                placeholderTextColor='#9E9E9E'
                selectionColor={COLORS.black}
                value={empMail}
                onChangeText={(text) => setEmpMail(text)}

              />
            </View>
            <View
              style={{
                flex: 1,

              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
               
                }}

              >
                Alternate Mobile
              </Text>
              <TextInput
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),

                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Alternate Mobile"
                keyboardType="numeric"
                placeholderTextColor='#9E9E9E'
                selectionColor={COLORS.black}
                value={empAltrPhone}
                onChangeText={(text) => setEmpAltrPhone(text)}

              />
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
   



          }}
          >

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
          
                }}

              >
                Gender
              </Text>

              <Dropdown
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),
                  marginRight:moderateScale(1)

                }}
                //
                itemTextStyle={{ fontSize: scale(11) }}
                itemContainerStyle={{}}
                //placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={{ fontSize: scale(11) }}
                //inputSearchStyle={{height: 20}}
                //iconStyle={styles.iconStyle}
                //search
                // searchPlaceholder="Search..."
                // placeholder={!isFocus ? 'Select item' : '...'}
                // onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                data={genderCombo}
                maxHeight={scale(400)}
                labelField="label"
                valueField="value"
                placeholder='Select Center'
                value={gender}
                onChange={item => {
                  setGender(item.value);
                  // setIsFocus(false);
                }}

              />
            </View>


            <View
              style={{
                flex: 1,
         

              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
                 
                }}

              >
                Date of Birth
              </Text>





              <Pressable
                onPress={toggleDatePicker}
              >
                <TextInput
                  style={{
                    marginVertical: verticalScale(1),
                    color: '#424242',
                    fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),
                  marginRight:moderateScale(1)

                  }}
                  placeholder="Date of Birth"
                  placeholderTextColor='#9E9E9E'
                  selectionColor={COLORS.black}
                  value={dateOfBirth}
                  editable={false}
                  onPressIn={toggleDatePicker}

                />
              </Pressable>




            </View>
            <View
              style={{
                flex: 1,


              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
                
                }}

              >
                Marital Status
              </Text>
              <Dropdown
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(11),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(1),
                  borderRadius: scale(2),
                  height: scale(25),
             

                }}
                //
                itemTextStyle={{ fontSize: scale(11) }}
                itemContainerStyle={{}}
                //placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={{ fontSize: scale(11) }}
                //inputSearchStyle={{height: 20}}
                //iconStyle={styles.iconStyle}
                //search
                // searchPlaceholder="Search..."
                // placeholder={!isFocus ? 'Select item' : '...'}
                // onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                data={mSCombo}
                maxHeight={scale(400)}
                labelField="label"
                valueField="value"
                placeholder='Select Status'
                value={ms}
                onChange={item => {
                  setMS(item.value);
                  // setIsFocus(false);
                }}

              />
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
         



          }}
          >

            <View
              style={{
                flex: 1,

              }}
            >
              <Text
                style={{
                  color: '#757575',
                  fontSize: scale(9),
               
                }}

              >
                Address
              </Text>
              <TextInput
                style={{
                  marginVertical: verticalScale(1),
                  color: '#424242',
                  fontSize: scale(9),
                  paddingLeft: moderateScale(6),
                  backgroundColor: '#EEEEEE',
                  paddingVertical: verticalScale(2),
                  borderRadius: scale(2),
                  height: scale(38),

                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Address"
                placeholderTextColor='#9E9E9E'
                selectionColor={COLORS.black}
                value={empAddress}
                multiline={true}
                onChangeText={(text) => setEmpAddress(text)}

              />
            </View>


          </View>




        </View>




      </>
    )
  }

  function renderdatePicker() {
    return (

      <View

        style={{
          position: 'absolute',
          bottom: 15,
          left: 0,
          right: 0,
          height: 150,
          marginBottom: 10,
          paddingBottom: 40,
          paddingHorizontal: SIZES.padding * 0.5,
          //paddingVertical:SIZES.padding * 1.0 ,
        }}
      >

        {showPicker && Platform.OS === "ios" && (
          <View
            style={{ flexDirection: "row", justifyContent: 'space-around' }}
          >



            <TouchableOpacity
              style={{
                backgroundColor: '#000000aa',
                justifyContent: 'center',
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 5,
                opacity: 0.8


              }}

              onPress={() => { toggleDatePicker() }}

            >


              <Text style={{ ...FONTS.h5, color: COLORS.white, justifyContent: 'center', }}> Cancle</Text>


            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#7E57C2',
                justifyContent: 'center',
                borderRadius: 4,
                paddingHorizontal: 8,
                opacity: 0.8

              }}

              onPress={() => { ConfirmDate() }}

            >
              <Text style={{ ...FONTS.h5, color: COLORS.white, justifyContent: 'center', }}> Confirm</Text>


            </TouchableOpacity>



          </View>
        )}

        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={OnchangeDate}
            style={{ height: 150, marginTop: 0 }}
          //maximumDate={new Date('2005-1-1')}
          />
        )}



      </View>




    )
  }



  function renderBootomSheet() {

    if (isBootomOpen) {


      return (

        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoint}
          enablePanDownToClose={true}

          onClose={() => setIsBootomOpen(false)}
          backgroundStyle={{ backgroundColor: '#9E87F1' }}

        >
          <BottomSheetView
            style={{ flex: 1, }}

          >
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <TouchableOpacity 
                onPress={() => {  TakePhoto(); }
                } 
                style={{ marginRight: 120, }} 
              >
                <Entypo name="camera" size={55} color="white" />
                <Text style={{ fontSize: 11, justifyContent: 'center', color: 'white' }} >Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => takePhotoFromgallary(false)} style={{ marginLeft: 20, }}  >
                <FontAwesome name="image" size={55} color="white" />
                <Text style={{ fontSize: 11, justifyContent: 'center', color: 'white' }} >From Gallery</Text>
              </TouchableOpacity>

            </View>
          </BottomSheetView>

        </BottomSheet>

      );

    }
    else {
      return null;
    }

  }





  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={{ flex: 1, }}
      >
       



        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}  >
    
          <View
            style={{ flex: 1, backgroundColor: '#F7F7FF' }}
          >
             <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
              {renderHeader()}
            </SafeAreaView>


            {
              isloddingAction ? (<Loading />)
                : (
                  <>
                      {rendertop()}
                      {renderbody({ navigation })}
                  </>


                )

            }

            
            {renderdatePicker()}
            {renderBootomSheet()}
          
          </View>
        
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileModify;



