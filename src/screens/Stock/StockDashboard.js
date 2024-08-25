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
  Alert,
  Modal,
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images, baseUrl } from "../../constants"
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseApi from "../../api/BaseApi"
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import { showMessage } from "react-native-flash-message";
import LinearGradient from 'react-native-linear-gradient';
import Loading from "../../utils/Loading";
import QrCodeModal from "../../utils/QrCodeModal";
import { logout } from "../../utils/utility";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";






function StockDashboard({ navigation }) {


  const [isloddingAction, setIsloddingAction] = useState(false);
  const [appToken, setappToken] = useState('');
  const [user_id, setUser_id] = useState('');

  const [menuBasicData, setMenuBasicData] = useState({
    "RequestVerify": 0,
    "TransferVerify": 0,
    "StockRequest": 0,
    "userPre": "",
  });
  const [disOption, setDisOption] = useState([
    {
      "Head": "Request Verify",
      "status": false,
    },
    {
      "Head": "Transfer Verify",
      "status": false,
    },
    {
      "Head": "Stock Request",
      "status": true,
    },


  ]);
  const [renderRVData, setRenderRVData] = useState([]);
  const [renderTVData, setRenderTVData] = useState([]);
  const [renderSRData, setRenderSRData] = useState([]);


  const [modalstatusQr, setModalstatusQr] = useState(false);
  const [qrValue, setQrValue] = useState('none');
  const [qrtitle, setQrtitle] = useState('none');
  const [qrcolor, setQrcolor] = useState(COLORS.purple);




  useEffect(() => {

    getMenuValue();
    const focusHandler = navigation.addListener('focus', () => {
      getMenuValue();
    });

    return () => {
      focusHandler;
    }



  }, [navigation]);


  const getMenuValue = async (Head = "Stock Request") => {

    var act = 'Get_' + Head.replace(" ", "");
    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');
    const center = await AsyncStorage.getItem('branchID');

    setUser_id(userID);
    setappToken(token);
    if (token !== null) {


      try {
        setIsloddingAction(true);
        const { data } = await BaseApi.post('/Stock/thisUilityAPI.php', {
          token: token,
          act: act,
          userID: userID,
          center: center,
        });

        if (data.service_header.status_tag === 'success') {
          //console.log(data.spw_data);
          //console.log(data.invBasicData.chequey);
          if (Head == "Request Verify") {
            setRenderRVData(data.spw_data);
          }
          else if (Head == "Transfer Verify") {
            setRenderTVData(data.spw_data);
          }
          else if (Head == "Stock Request") {
            setRenderSRData(data.spw_data);
          }

          //console.log(data.invBasicData); 
          setMenuBasicData(data.invBasicData);
        }
        else {
          await logout(navigation, data.service_header.massage);
          setRenderRVData([]);
          setRenderTVData([]);
          setRenderSRData([]);
          setMenuBasicData(menuBasicData);
          //   console.log(data.invBasicData);
          setIsloddingAction(false);

        }

      }
      catch (error) {
        setRenderRVData([]);
        setRenderTVData([]);
        setRenderSRData([]);
        setMenuBasicData([]);
        setIsloddingAction(false);
        console.log(error);
      }
      setIsloddingAction(false);


    }
    else {
      setRenderRVData([]);
      setRenderTVData([]);
      setRenderSRData([]);
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

    var [{ Head: RVHead, status: RVstatus }] = disOption.filter((x) => x.Head == 'Request Verify');
    var [{ Head: TVHead, status: TVstatus }] = disOption.filter((x) => x.Head == 'Transfer Verify');
    var [{ Head: SRHead, status: SRstatus }] = disOption.filter((x) => x.Head == 'Stock Request');


    return (
      <>
        <View style={{ width: '97%', alignSelf: 'center', marginTop: verticalScale(4) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>

            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: scale(3),
                backgroundColor: SRstatus ? '#b380ff' : '#D1C4E9',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                elevation:3,
                shadowOpacity: 0.37,
                shadowRadius: 1.49,
                padding: scale(4),
                height: scale(34)

              }}
              onPress={() => {
                getMenuValue(SRHead);
              }}
            >

              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["StockRequest"]}</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{SRHead.toLocaleUpperCase()}</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: scale(3),
                backgroundColor: RVstatus ? '#b380ff' : '#D1C4E9',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                elevation:3,
                shadowOpacity: 0.37,
                shadowRadius: 1.49,
                padding: scale(4),
                height: scale(34)

              }}
              onPress={() => {
                getMenuValue(RVHead);
              }}
            >
              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["RequestVerify"]}</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{RVHead.toLocaleUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: scale(3),
                backgroundColor: TVstatus ? '#b380ff' : '#D1C4E9',
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                elevation:3,
                shadowOpacity: 0.37,
                shadowRadius: 1.49,
                padding: scale(5),
                height: scale(34)
              }}
              onPress={() => {
                getMenuValue(TVHead);
              }}
            >
              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["TransferVerify"]}</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{TVHead.toLocaleUpperCase()}</Text>
            </TouchableOpacity>




          </View>

        </View>
      </>
    )


  }

  const confirmChk = async (ID, type) => {
    Alert.alert(
      // title
      'Are You Sure ?',
      // body
      '',
      [
        {
          text: 'YES',
          onPress: () => {

            if (type == 'DELETE_REQUEST') {
              DeleteSR(ID);
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



  const DeleteSR = async (invID) => {

    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);
    try {

      const { data } = await BaseApi.post('Stock/ActionAPI.php', {
        token: appToken,
        act: 'DELETE_SR',
        userID: userID,
        invID: invID,
      });

      if (data.service_header.status_tag === 'success') {
        setIsloddingAction(false);
        showMessage({
          message: "Request Delete Sucessfully ",
          description: invID,
          duration: 2000,
          type: "success",
        });




      }
      else {
        await logout(navigation, data.service_header.massage);
        setIsloddingAction(false);
        showMessage({
          message: "Request Delete Unsucessfully ",
          description: invID,
          duration: 2000,
          type: "danger",
        });
      }





    }
    catch (error) {
      console.log(error);
      setIsloddingAction(false);
    }
    getMenuValue("Stock Request");

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
            paddingLeft: moderateScale(8),
            paddingRight: moderateScale(8),
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
                STOCK MANAGEMENT
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

                {menuBasicData["userPre"]}
              </Text>


            </View>

            <Image source={ icons.stock }
                        style={{
                            height: scale(22),
                            width: scale(22),
                            tintColor: '#fff',
                            marginLeft:moderateScale(4) 
                        }}
              />






          </View>
        


        </View>



      </LinearGradient>

    );
  }


  const renderTransferverify = ({ item }) => {

    var Bcolor = '#D7CCC8';

    if (item.tranaferType == 'Frocetransfer') {
      Bcolor = '#FFCCBC';
    }
    else if (item.requestType == 'For Sales') {
      Bcolor = '#B2DFDB';
    }

    return (

      <View
        key={item.invID}
        style={{

          shadowOffset: { width: 0, height: 1, },
          shadowOpacity: 0.47,
          shadowRadius: 0.67,
          elevation: 2,
          borderRadius: 3,
          backgroundColor: COLORS.white,
          marginBottom: verticalScale(3),
          backgroundColor: Bcolor


        }}

      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StockRequestDetails', {
              TransID: item.invID,
            })
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
                  flexDirection: 'row', justifyContent: 'space-between',
                  paddingLeft: moderateScale(3),
                  marginTop: verticalScale(1)
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ flex: 1, }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row', backgroundColor: '#757575', flex: 3, justifyContent: 'center',
                      alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                    }}

                  >
                    <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>


                  </TouchableOpacity>

                </View>
                <View
                  style={{ flex: 12, }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.requestTo} </Text>
                    <Entypo name="arrow-right" size={scale(13)} style={{ color: "#9C27B0", }} />
                    <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#1B5E20", }}> {item.requestFrom}  </Text>

                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <Text style={{ fontSize: scale(9), color: "#4E342E", textAlign: 'left', marginTop: verticalScale(-2) }}> {item.mondifyInvID} </Text>

                  </View>

                </View>


              </View>

              <View
                style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  marginTop: verticalScale(2)
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >



                <View
                  style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderBottomWidth: 1, borderTopWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Product</Text>
                  <Text style={{ fontSize: scale(9), color: '#009688', marginTop: verticalScale(-1.5) }}>{item.prdname}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', borderWidth: 1, flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderRightWidth: 0, borderTopWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Quantity</Text>
                  <Text style={{ fontSize: scale(9), color: '#E91E63', marginTop: verticalScale(-1.5) }}>{item.R_Qty}</Text>

                </View>

              </View>



              <View
                style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2) }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request Time</Text>
                  <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.Rdate}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request By</Text>
                  <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.requestBy}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Carrier</Text>
                  <Text style={{ fontSize: scale(9), color: '#795548', marginTop: verticalScale(-1.5) }}>{item.Carrier}</Text>

                </View>



              </View>

              <View
                style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ borderColor: '#E0E0E0', flex: 2, paddingVertical: 0.5, paddingHorizontal: 2, borderTopWidth: 1 }}
                >
                  <Text style={{ fontSize: 9, color: '#9E9E9E', fontWeight: '500' }}>Tranfer Time</Text>
                  <Text style={{ fontSize: 10, color: '#006064', marginTop: -2 }}>{item.t_time}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: 0.5, paddingHorizontal: 2, borderLeftWidth: 1, borderTopWidth: 1 }}
                >
                  <Text style={{ fontSize: 9, color: '#9E9E9E', fontWeight: '500' }}>Transfer By</Text>
                  <Text style={{ fontSize: 10, color: '#006064', marginTop: -2 }}>{item.TranferBy}</Text>

                </View>




              </View>



            </View>



          </View>

        </TouchableOpacity>
      </View>
    )

  }

  const renderRequestverify = ({ item }) => {

    var Bcolor = '#FFF3E0';
    if (item.requestType == 'For Sales') {
      Bcolor = '#B2DFDB';
    }

    return (

      <View
        key={item.invID}
        style={{

          shadowOffset: { width: 0, height: 1, },
          shadowOpacity: 0.47,
          shadowRadius: 0.67,
          elevation: 2,
          borderRadius: 3,
          backgroundColor: COLORS.white,
          marginBottom: verticalScale(3),
          backgroundColor: Bcolor


        }}

      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StockRequestDetails', {
              TransID: item.invID,
            })
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
                  flexDirection: 'row', justifyContent: 'space-between',
                  paddingLeft: moderateScale(3),
                  marginTop: verticalScale(1)
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ flex: 1, }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row', backgroundColor: '#757575', flex: 3, justifyContent: 'center',
                      alignContent: 'center', alignItems: 'center', borderRadius: scale(6),
                    }}

                  >
                    <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>


                  </TouchableOpacity>

                </View>
                <View
                  style={{ flex: 12, }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.requestTo} </Text>
                    <Entypo name="arrow-right" size={scale(13)} style={{ color: "#9C27B0", }} />
                    <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#1B5E20", }}> {item.requestFrom}  </Text>

                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <Text style={{ fontSize: scale(9), color: "#4E342E", textAlign: 'left', marginTop: verticalScale(-2) }}> {item.mondifyInvID} </Text>

                  </View>

                </View>


              </View>

              <View
                style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  marginTop: verticalScale(2)
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderBottomWidth: 1, borderTopWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Product</Text>
                  <Text style={{ fontSize: scale(9), color: '#00796B', marginTop: verticalScale(-1.5) }}>{item.prdname}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', borderWidth: 1, flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderRightWidth: 0, borderTopWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Quantity</Text>
                  <Text style={{ fontSize: scale(9), color: '#E91E63', marginTop: verticalScale(-1.5) }}>{item.R_Qty}</Text>

                </View>

              </View>



              <View
                style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                }}
              >
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2) }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request Time</Text>
                  <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.Rdate}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request By</Text>
                  <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.requestBy}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Carrier</Text>
                  <Text style={{ fontSize: scale(9), color: '#795548', marginTop: verticalScale(-1.5) }}>{item.Carrier}</Text>

                </View>



              </View>


            </View>



          </View>

        </TouchableOpacity>
      </View>
    )

  }



  const renderSR = ({ item }) => {

    var Bcolor = '#FFEBEE';
    if (item.requestType == 'For Sales') {
      Bcolor = '#B2DFDB';
    }



    return (

      <View
        key={item.invID}
        style={{

          shadowOffset: { width: 0.0, height: 0.5, },
          shadowOpacity: 0.27,
          shadowRadius: 1.0,
          elevation: 2,
          borderRadius: 2,
          marginBottom: 3,
          backgroundColor: Bcolor


        }}

      >


        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0


        }}>



          <TouchableOpacity style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}
            onPress={() => {
              if (item.requestType == 'For Sales') {
                setModalstatusQr(true); setQrValue('id=' + item.invID + '&STOCK_REQUEST~' + user_id); setQrcolor('#80CBC4'); setQrtitle('STOCK REQUEST VERIFY')
              }
              else {

                setModalstatusQr(true); setQrValue('id=' + item.invID + '&STOCK_REQUEST~' + user_id); setQrcolor(COLORS.purple); setQrtitle('STOCK REQUEST VERIFY')
              }

            }
            }

          >


            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                paddingLeft: moderateScale(3)
                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
              }}
            >
              <View
                style={{ flex: 1, }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row', backgroundColor: '#F44336', flex: 3, justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                  }}
                  onPress={() => confirmChk(item.invID, 'DELETE_REQUEST')}
                >
                  <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                  <MaterialIcons name="delete" color='white' size={scale(12)} />

                </TouchableOpacity>

              </View>
              <View
                style={{ flex: 12, }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.requestTo} </Text>
                  <Entypo name="arrow-right" size={scale(13)} style={{ color: "#9C27B0", marginTop: scale(-1) }} />
                  <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#1B5E20", }}> {item.requestFrom}  </Text>

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: scale(-1) }}> {item.mondifyInvID} </Text>

                </View>

              </View>


            </View>





            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                marginTop: verticalScale(2)
                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
              }}
            >
              <View
                style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(1), borderBottomWidth: 1, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Product</Text>
                <Text style={{ fontSize: scale(9), color: '#00796B', marginTop: verticalScale(-1.5) }}>{item.prdname}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', borderWidth: 1, flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(4), borderRightWidth: 0, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Quantity</Text>
                <Text style={{ fontSize: scale(9), color: '#E91E63', marginTop: verticalScale(-1.5) }}>{item.R_Qty}</Text>

              </View>

            </View>

            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
              }}
            >
              <View
                style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2) }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request Time</Text>
                <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.Rdate}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request By</Text>
                <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.requestBy}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Carrier</Text>
                <Text style={{ fontSize: scale(9), color: '#795548', marginTop: verticalScale(-1.5) }}>{item.Carrier}</Text>

              </View>



            </View>



          </TouchableOpacity>



        </View>


      </View>
    )

  }


  function renderBodySec() {
    var [{ Head }] = disOption.filter((x) => x.status == true);


    if (Head == 'Request Verify') {

      return (
        <>

          <View
            style={{

              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: verticalScale(3),
              marginTop: verticalScale(3),
              paddingHorizontal: moderateScale(6)
            }}
          >
            <Text>----------------------</Text>
            <Text style={{}}> Request Verify </Text>
            <Text>----------------------</Text>

          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(2), paddingHorizontal: moderateScale(6) }}>
            <FlatList

              data={renderRVData}
              // extraData={renderRVData}
              renderItem={renderRequestverify}
              keyExtractor={(item) => item.invID}
              showsVerticalScrollIndicator={false}
            // refreshing={islodding}



            />
          </View>

        </>
      )
    }
    else if (Head == 'Transfer Verify') {

      return (
        <>

          <View
            style={{

              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: verticalScale(3),
              marginTop: verticalScale(6),
              paddingHorizontal: moderateScale(6)
            }}
          >
            <Text>------------------------</Text>
            <Text style={{}}> Transfer Verify </Text>
            <Text>------------------------</Text>

          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(2), paddingHorizontal: moderateScale(6) }}>


            <FlatList

              data={renderTVData}
              //extraData={renderTVData}
              renderItem={renderTransferverify}
              keyExtractor={(item) => item.invID}
              showsVerticalScrollIndicator={false}
            //refreshing={islodding}



            />
          </View>

        </>
      )
    }
    else if (Head == 'Stock Request') {

      return (

        <>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(5),
            marginTop: verticalScale(6),

          }}>



            <TouchableOpacity
              style={{
                flex: 7,
                height: verticalScale(27),
                backgroundColor: '#388E3C',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                flexDirection: 'row',
                borderRadius: 2,
                shadowOffset: { width: 0, height: 1, },
                shadowOpacity: 0.47,
                shadowRadius: 1.09,
                elevation: 2,
              }}
              onPress={() => navigation.navigate('StockRequest', {})}
            >
              <Ionicons name="add-circle" size={scale(15)} color="white" style={{ marginRight: moderateScale(7) }} />
              <Text style={{ fontSize: scale(12), color: COLORS.white, fontWeight: '700' }}>ADD REQUEST</Text>
            </TouchableOpacity>

          </View>

          <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(7), paddingHorizontal: moderateScale(5), }}>

            <FlatList

              data={renderSRData}
              //extraData={renderSRData}
              renderItem={renderSR}
              keyExtractor={(item) => item.invID}
              showsVerticalScrollIndicator={false}
            //refreshing={islodding}
            />
          </View>

        </>
      )

    }




  }


  return (
    <>
      <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
        {renderHeader()}
      </SafeAreaView>
      <View style={{ flex: 1, backgroundColor: '#EEEEEE', }}>

        {
          isloddingAction ? (<Loading />)
            : (<>
              {renderMenu()}
              {renderBodySec()}
            </>)
        }

        {<QrCodeModal qrtitle={qrtitle} qrvalue={qrValue} color={qrcolor} size={200} setModalstatus={setModalstatusQr} modalstatus={modalstatusQr} />}



      </View >

    </>




  );
}

export default StockDashboard;
