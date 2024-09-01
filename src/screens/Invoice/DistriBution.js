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
  Modal
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images, baseUrl } from "../../constants"
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseApi from "../../api/BaseApi";
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';


import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from "react-native-flash-message";
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";

import QrCodeModal from "../../utils/QrCodeModal";
import { WebView } from 'react-native-webview';
import { Dropdown } from 'react-native-element-dropdown';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";




function DistriBution({ navigation }) {

  const [isloddingAction, setIsloddingAction] = useState(false);
  const [islodding, setIslodding] = useState(false);
  const [appToken, setappToken] = useState('');
  const [user, setUser] = useState('');

  const [menuBasicData, setMenuBasicData] = useState({
    "Point": 0,
    "UndeliverSalesInv": 0,
    "PartialInv": 0,
    "MyTask": 0,
    "CompleteInvoice": 0,
    "CarrierTask": 0,
  });
  const [disOption, setDisOption] = useState([
    {
      "Head": "Point",
      "status": false,
    },
    {
      "Head": "UndeliverSalesInv",
      "status": false,
    },
    {
      "Head": "Partial Inv",
      "status": false,
    },
    {
      "Head": "My Task",
      "status": true,
    },
    {
      "Head": "Complete Invoice",
      "status": false,

    },
    {
      "Head": "Carrier Task",
      "status": false,
    }

  ]);
  const [rendePointData, setRenderPointData] = useState([]);
  const [rendePIData, setRenderPIData] = useState([]);
  const [rendeMTData, setRenderMTData] = useState([]);
  const [rendeCIData, setRenderCIData] = useState([]);
  const [rendeCTData, setRenderCTData] = useState([]);
  const [rendeUSIData, setRendeUSIData] = useState([]);
  const [liveTrackingData, setLiveTrackingData] = useState([]);


  const [isModalTrns, setIsModalTrns] = useState(false);
  const [transLink, setTransLink] = useState('');


  const [modalUserName, setModalUserName] = useState('');
  const [isModal_LTA, setIsModal_LTA] = useState(false);
  const [modalstatusQr, setModalstatusQr] = useState(false);
  const [qrValue, setQrValue] = useState('none');
  const [qrtitle, setQrtitle] = useState('none');
  const [user_id, setUser_id] = useState('');
  const [qrcolor, setQrcolor] = useState(COLORS.purple);

  const [lastFewMonthscombo, setLastFewMonthscombo] = useState([]);

  const date = new Date();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var currentMonth = `${year}-${month}`;
  const [selectMonth, SetSelectMonth] = useState(currentMonth);

  invoceNOInfo

  const [invoceNOInfo, setInvoceNOInfo] = useState({});


  


  var slForPoint = 0;




  useEffect(() => {

    const focusHandler = navigation.addListener('focus', () => {
      getMenuValue();
    });
   

    return () => {
      focusHandler;
    }

  }, [navigation]);


  const getMenuValue = async (Head = "My Task") => {



    //setRenderData([]);
    var act = 'Get_' + Head.replace(" ", "");
    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');
    const userName = await AsyncStorage.getItem('userName');
    setUser_id(userID);
    setUser(userName);
    setappToken(token);
    if (token !== null) {

      try {
        setIsloddingAction(true);


        const { data } = await BaseApi.post('/DistriBution/DisUilityAPI.php', {
          token: token,
          act: act,
          userID: userID,
        });



        if (data.service_header.status_tag === 'success') {

          if (Head == 'My Task') {
            setRenderMTData(data.spw_data);
          }
          else if (Head == 'UndeliverSalesInv') {
            setRendeUSIData(data.spw_data);
            setInvoceNOInfo(data.invoceNOInfo);
            //console.log(data.spw_data);
          }
          else if (Head == 'Point') {
            setRenderPointData(data.spw_data);
            setLastFewMonthscombo(data.lastFewMonthscombo);
            //console.log(data.lastFewMonthscombo);
            SetSelectMonth(currentMonth);
          }
          else if (Head == 'Partial Inv') {

            setRenderPIData(data.spw_data);
            //console.log(data.spw_data);
          }
          else if (Head == 'Complete Invoice') {
            setRenderCIData(data.spw_data);
            //console.log(data.spw_data);
          }
          else if (Head == 'Carrier Task') {
            //console.log(data.spw_data); 
            setRenderCTData(data.spw_data);
          }

          // console.log(data.invBasicData); 
          setMenuBasicData(data.invBasicData);
        }
        else {
          await logout(navigation, data.service_header.massage);
          setRenderMTData([]);
          setRenderPointData([]);
          setRenderPIData([]);
          setRenderCIData([]);
          setRenderCTData([]);
          setRendeUSIData([]);


          setMenuBasicData(menuBasicData);
          setIsloddingAction(false);

        }

      }
      catch (error) {

        //console.log(data.spw_data);
        setRenderMTData([]);
        setRenderPointData([]);
        setRenderPIData([]);
        setRenderCIData([]);
        setRenderCTData([]);
        setRendeUSIData([]);
        setMenuBasicData(menuBasicData);
        setIsloddingAction(false);
      }
      setIsloddingAction(false);


    }
    else {


      setRenderMTData([]);
      setRenderPointData([]);
      setRenderPIData([]);
      setRenderCIData([]);
      setRenderCTData([]);
      setRendeUSIData([]);
      setMenuBasicData(menuBasicData);
    }


    cartChange(Head);

  }

  const DeleteMytask = async (invID) => {

    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);
    try {

      const { data } = await BaseApi.post('DistriBution/DisUilityAPI.php', {
        token: appToken,
        act: 'RemoveMytask',
        userID: userID,
        invID: invID,
      });

      if (data.service_header.status_tag === 'success') {
        setIsloddingAction(false);
        showMessage({
          message: "Scan Remove Sucessfully ",
          description: invID,
          duration: 2000,
          type: "success",
        });




      }
      else {
        await logout(navigation, data.service_header.massage);
        setIsloddingAction(false);
        showMessage({
          message: "Scan Remove Unsucessfully ",
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
    getMenuValue("My Task");

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
              // onPress={() => navigation.openDrawer()}
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
                DISTRIBUTION
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

            <Image source={icons.distribution_black}
              style={{
                height: scale(22),
                width: scale(22),
                tintColor: '#fff',
                marginLeft: moderateScale(4)
              }}
            />






          </View>



        </View>





      </LinearGradient>

    );
  }

  function renderMenu() {

    var [{ Head: PointHead, status: Pointstatus }] = disOption.filter((x) => x.Head == 'Point');
    var [{ Head: USItHead, status: USIstatus }] = disOption.filter((x) => x.Head == 'UndeliverSalesInv');
    var [{ Head: PIHead, status: PIstatus }] = disOption.filter((x) => x.Head == 'Partial Inv');
    var [{ Head: MTHead, status: MTstatus }] = disOption.filter((x) => x.Head == 'My Task');
    var [{ Head: CIHead, status: CIstatus }] = disOption.filter((x) => x.Head == 'Complete Invoice');
    var [{ Head: CTHead, status: CTstatus }] = disOption.filter((x) => x.Head == 'Carrier Task');




    return (
      <>
        <View style={{ width: '97%', alignSelf: 'center', marginTop: verticalScale(4) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>

            <TouchableOpacity
              style={{

                flex: 1,
                borderRadius: scale(3),
                backgroundColor: Pointstatus ? '#b380ff' : '#D1C4E9',
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
                getMenuValue(PointHead);
              }}
            >



              <View
                style={{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}>{menuBasicData["Point"]}  </Text>
                <FontAwesome5 name="coins" size={scale(11)} color='#404040' style={{ marginTop: 2 }} />
              </View>
              <View
                style={{ flexDirection: 'row', textAlign: 'center' }}>
                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>  Araange</Text>
                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}> {PointHead}</Text>

              </View>

            </TouchableOpacity>


            <TouchableOpacity
              style={{


                flex: 1,
                borderRadius: scale(3),
                backgroundColor: USIstatus ? '#b380ff' : '#D1C4E9',
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
                getMenuValue(USItHead);
              }}
            >




              <View
                style={{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}>{menuBasicData["UndeliverSalesInv"]}  </Text>

              </View>
              <View
                style={{ flexDirection: 'row', textAlign: 'center' }}>

                <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}> Undeliver Invoice</Text>

              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{


                flex: 1,
                borderRadius: scale(3),
                backgroundColor: CIstatus ? '#b380ff' : '#D1C4E9',
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
                getMenuValue(CIHead);
              }}
            >


              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["CompleteInvoice"]}</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>Done Inv (Today's)</Text>

            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4, marginTop: verticalScale(4) }}>

            <TouchableOpacity
              style={{


                flex: 1,
                borderRadius: scale(3),
                backgroundColor: MTstatus ? '#b380ff' : '#D1C4E9',
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
                getMenuValue(MTHead);
              }}
            >


              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["MyTask"]} </Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}> {MTHead} (Inv)</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={{


                flex: 1,
                borderRadius: scale(3),
                backgroundColor: PIstatus ? '#b380ff' : '#D1C4E9',
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
                getMenuValue(PIHead);
              }}
            >


              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["PartialInv"]}</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{PIHead}</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={{



                flex: 1,
                borderRadius: scale(3),
                backgroundColor: CTstatus ? '#b380ff' : '#D1C4E9',
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
                getMenuValue(CTHead);
              }}
            >

              <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["CarrierTask"]}</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{CTHead}</Text>



            </TouchableOpacity>


          </View>
        </View>
      </>
    )


  }


  const renderPoint = ({ item }) => {



    if (item.sl == 1) {
      var serial = (<FontAwesome name="trophy" size={17} color="white" />);
    }
    else {
      var serial = (<Text style={{ ...FONTS.h4, color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        {item.sl}
      </Text>);
    }

    var ecolor = COLORS.white;
    if (item.me == 1) {
      ecolor = '#ffd699';
    }

    return (

      <View
        key={item.sl}
        style={{

          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 0.69,
          borderRadius: 3,
          backgroundColor: ecolor,
          marginBottom: verticalScale(2)


        }}

      >

        <View

          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
       


          }}>
                

                


                  <View style={{ flex: 4, backgroundColor: '#cc7a00', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}>
                    <Text style={{ fontSize:scale(13), color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>{serial}</Text>
                  </View>
                  <View style={{ flex: 15, backgroundColor: '#D7CCC8', justifyContent: 'center',  }}>
                    <Text style={{fontSize: scale(11), color: '#8080ff', marginRight: 0,textAlign:'left',paddingLeft:moderateScale(6) }}>{item.arrangrBY}</Text>
                  </View>
                  <View style={{ flex: 9, backgroundColor: '#FFCC80', paddingVertical: 1, justifyContent: 'center', alignItems: "center"}}>
                    <Text style={{fontSize: scale(11), color: '#ff6666',  }}>{item.InvNO}</Text>
                  </View>
                  <View style={{ flex: 8, backgroundColor: '#B0BEC5', paddingVertical: 1, justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: scale(11), color: '#8D6E63',  }}>{item.checkPoint}</Text>
                  </View>
                  <View style={{ flex: 8, paddingVertical: 1, backgroundColor: '#4DB6AC', justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: scale(11), color: '#eee',  }}>{item.Point}</Text>
                  </View>
                  <View style={{ flex: 9,  paddingVertical: 1, backgroundColor: '#C5E1A5', justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: scale(11), color: '#880E4F',  }}>{item.totalPoint}</Text>
                  </View>



        </View>


      </View>
    )

  }

  const renderUSI = ({ item }) => {


    var ecolor = '#BCAAA4';

    if (item.pendingTask == 0) {
      ecolor = '#E57373';
    }


    return (

      <View
        key={item.arrangeID}
        style={{

        
          marginTop:verticalScale(2)
         // backgroundColor: '#F0F4C3',



        }}

      >

              


              <TouchableOpacity
               key={item.arrangeID}
                style={{

                  flexDirection: 'row',
                  justifyContent: 'space-between',
                 
                  
                }}

                onPress={() => LivetrackDetails(item.arrangrBY, item.arrangeID)}


              >


                  <View style={{ flex: 4, backgroundColor: '#78909C', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, paddingVertical:verticalScale(1.5) }}>
                    <Text style={{ fontSize:scale(13), color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>{item.sl}</Text>
                  </View>
                  <View style={{ flex: 15, backgroundColor: ecolor, justifyContent: 'center', alignItems: "center", paddingVertical:verticalScale(1.5)  }}>
                    <Text style={{fontSize: scale(11), color: '#fff', marginRight: 0 }}>{item.arrangrBY}</Text>
                  </View>
                  <View style={{ flex: 9, backgroundColor: '#4DB6AC', paddingVertical: 1, justifyContent: 'center', alignItems: "center", paddingVertical:verticalScale(1.5) }}>
                    <Text style={{fontSize: scale(11),fontWeight:'600', color: '#fff',  }}>{item.pendingTask}</Text>
                  </View>
                


            </TouchableOpacity>


      </View>
    )

  }

  const renderCompleteTasks = ({ item }) => {
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
          backgroundColor: '#EFEBE9'


        }}

        >


        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0


        }}>



          <TouchableOpacity style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}
               onPress={() =>
                navigation.navigate('InvForDeliver', {
                  InvID: item.invID,
                })
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
                <View
                  style={{
                    flexDirection: 'row', backgroundColor: '#6D4C41', flex: 3, justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                  }}
                >
                  <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                

                </View>

              </View>
              <View
                style={{ flex: 12, }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.cusName} </Text>
                

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: scale(-1) }}> {item.invID} </Text>

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
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3), borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Date</Text>
                <Text style={{ fontSize: scale(9), color: '#795548', marginTop: verticalScale(-1.5) }}>{item.time}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 1, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Sold By</Text>
                <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.ActivityBy}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),borderLeftWidth: 1, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Product No</Text>
                <Text style={{ fontSize: scale(9), color: '#FF5722', marginTop: verticalScale(-1.5) }}>{item.prdNO}</Text>

              </View>
              

            </View>

            



          </TouchableOpacity>



        </View>


        </View>

    )
  }

  const renderTasks = ({ item }) => {

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
          backgroundColor: '#FFFFFF'


        }}

        >


        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0


        }}>



          <TouchableOpacity style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}
              onPress={() =>
                navigation.navigate('InvForDeliver', {
                  InvID: item.invID,
                  Forcheck: 0
                })
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
                style={{ flex: 1.5, }}
              >
                {
                  item.arrangePrdNo == 0 ? (<TouchableOpacity
                    style={{
                      flexDirection: 'row', backgroundColor: '#388E3C', flex: 3, justifyContent: 'center',
                      alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                    }}
                    onPress={() => DeleteMytask(item.invID)}
                  >
                    <Text style={{ fontSize: scale(12), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                    <MaterialIcons name="delete" color='white' size={scale(12)} />
                  
  
                  </TouchableOpacity>) 
                  : 
                  (<TouchableOpacity
                    style={{
                      flexDirection: 'row', backgroundColor: '#6D4C41', flex: 3, justifyContent: 'center',
                      alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                    }}
                   
                  >
                    <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
           
                  
  
                  </TouchableOpacity>)
                }
                

              </View>
              <View
                style={{ flex: 12,justifyContent:'center' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.cusName} </Text>
                

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: scale(-1) }}> {item.invID} </Text>

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
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Branch</Text>
                <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.centerName}</Text>

              </View>

              <View
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
              >
                 <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500',textAlign:'left' }}>Sold By</Text>
                <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5),textAlign:'left' }}>{item.ActivityBy}</Text>
               

              </View>

              <View
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500',textAlign:'left' }}>Status</Text>
                <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5),textAlign:'left' }}>{item.statusEx}</Text>

                

              </View>

              <View
                style={{ flexDirection:'row',justifyContent:'flex-end',alignItems:'center', borderColor: '#E0E0E0', flex: 12, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
              >
                

                <Entypo name="pinterest" style={{ fontSize:scale(10), color: COLORS.purple, marginRight: 1,textAlign:'right' }} />
                  <Text style={{ fontSize:scale(11), color: '#ff6666', marginRight: 2,textAlign:'right' }}>: {item.prdNO} </Text>


                  <MaterialIcons name="done-outline" style={{ fontSize:scale(10), color: COLORS.primary, marginRight: 1,textAlign:'right'  }} />
                  <Text style={{ fontSize:scale(11), color: '#ff6666', marginRight: 1,textAlign:'right' }}>: {item.arrangePrdNo} </Text> 

              </View>
             
              

            </View>

            



          </TouchableOpacity>



        </View>


        </View>



    )

  }

  const renderPartialInv = ({ item }) => {

    return (

      // <View
      //   key={item.mondifyInvID}
      //   style={{

      //     shadowOffset: {
      //       width: 0,
      //       height: 1,
      //     },
      //     shadowOpacity: 0.22,
      //     shadowRadius: 0.69,
      //     borderRadius: 3,
      //     backgroundColor: '#FFF3E0',
      //     marginBottom: 2,



      //   }}

      // >
      //   <TouchableOpacity
      //     onPress={() =>
      //       navigation.navigate('InvForDeliver', {
      //         InvID: item.invID,
      //         Forcheck: 0
      //       })
      //     }
      //   >
      //     <View style={{
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       paddingHorizontal: SIZES.padding * 0,
      //       paddingTop: 0,
      //       paddingBottom: 0


      //     }}>
      //       <View style={{ flex: 3, backgroundColor: '#0097A7', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}>

      //         {item.arrangePrdNo == 0 ? (
      //           <TouchableOpacity onPress={() => DeleteMytask(item.invID)} style={{ flexDirection: 'row', }} >
      //             <Text style={{ ...FONTS.h5, color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}> {item.sl}</Text>
      //             <MaterialIcons name="delete" color='white' size={16} />
      //           </TouchableOpacity>
      //         )
      //           : (<Text style={{ ...FONTS.h5, color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}> {item.sl}</Text>)}



      //       </View>
      //       <View style={{ flex: 30, paddingHorizontal: 2, paddingVertical: 1 }}>

      //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

      //           <Text style={{ ...FONTS.body4, color: '#3385ff', justifyContent: 'flex-start', marginLeft: 4 }}>
      //             {item.cusName}
      //           </Text>
      //           <Text style={{ ...FONTS.body5, color: COLORS.gray, marginRight: 0 }}>  </Text>

      //           <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>


      //             <Entypo name="pinterest" style={{ ...FONTS.body5, color: COLORS.purple, marginRight: 1 }} />
      //             <Text style={{ ...FONTS.body4, color: '#ff6666', marginRight: 1 }}>: {item.prdNO} </Text>

      //             <MaterialIcons name="done-outline" style={{ ...FONTS.body5, color: COLORS.primary, marginRight: 1 }} />
      //             <Text style={{ ...FONTS.body4, color: '#ff6666', marginRight: 1 }}> {item.arrangePrdNo} </Text>



      //           </View>
      //         </View>

      //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

      //           <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>


      //             <Text style={{ ...FONTS.body5, color: '#ff6666', marginRight: 1 }}>  {item.mondifyInvID} </Text>


      //             <Text style={{ ...FONTS.body5, color: '#d966ff', marginRight: 1 }}>({item.centerName})</Text>


      //           </View>


      //           <View style={{ flexDirection: 'row', textAlign: "right", justifyContent: 'flex-end' }}>



      //             <Text style={{ ...FONTS.body5, color: COLORS.primary, marginRight: 4 }}> {item.statusEx} </Text>





      //           </View>

      //         </View>

      //       </View>



      //     </View>
      //   </TouchableOpacity>

      // </View>

      <View
      key={item.invID}
      style={{

        shadowOffset: { width: 0.0, height: 0.5, },
        shadowOpacity: 0.27,
        shadowRadius: 1.0,
        elevation: 2,
        borderRadius: 2,
        marginBottom: 3,
        backgroundColor: '#FFEBEE'


      }}

      >


      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 0,
        paddingBottom: 0


      }}>



        <TouchableOpacity style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}
            onPress={() =>
              navigation.navigate('InvForDeliver', {
                InvID: item.invID,
                Forcheck: 0
              })
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
              style={{ flex: 1.5, }}
            >
              {
                item.arrangePrdNo == 0 ? (<TouchableOpacity
                  style={{
                    flexDirection: 'row', backgroundColor: '#8D6E63', flex: 3, justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                  }}
                  onPress={() => DeleteMytask(item.invID)}
                >
                  <Text style={{ fontSize: scale(12), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                  <MaterialIcons name="delete" color='white' size={scale(12)} />
                

                </TouchableOpacity>) 
                : 
                (<TouchableOpacity
                  style={{
                    flexDirection: 'row', backgroundColor: '#8D6E63', flex: 3, justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                  }}
                 
                >
                  <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
         
                

                </TouchableOpacity>)
              }
              

            </View>
            <View
              style={{ flex: 12,justifyContent:'center' }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.cusName} </Text>
              

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: scale(-1) }}> {item.invID} </Text>

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
              style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
            >
              <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Branch</Text>
              <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.centerName}</Text>

            </View>

            <View
              style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
            >
               <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500',textAlign:'left' }}>Sold By</Text>
              <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5),textAlign:'left' }}>{item.ActivityBy}</Text>
             

            </View>

           

            <View
              style={{ flexDirection:'row',justifyContent:'flex-end',alignItems:'center', borderColor: '#E0E0E0', flex: 12, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
            >
              

              <Entypo name="pinterest" style={{ fontSize:scale(10), color: COLORS.purple, marginRight: 1,textAlign:'right' }} />
                <Text style={{ fontSize:scale(11), color: '#ff6666', marginRight: 2,textAlign:'right' }}>: {item.prdNO} </Text>


                <MaterialIcons name="done-outline" style={{ fontSize:scale(10), color: COLORS.primary, marginRight: 1,textAlign:'right'  }} />
                <Text style={{ fontSize:scale(11), color: '#ff6666', marginRight: 1,textAlign:'right' }}>: {item.arrangePrdNo} </Text> 

            </View>
           
            

          </View>

          



        </TouchableOpacity>



      </View>


      </View>
    )

  }

  

  const renderCarrierTasks = ({ item }) => {



    var Bcolor = "#C8E6C9";

    if (item.requestType == 'For Sales') {
      Bcolor = '#80CBC4';
    }

    return (

      <View
        key={item.invID}
        style={{

          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 0.69,
          borderRadius: 3,
          backgroundColor: COLORS.white,
          marginBottom: 2,



        }}

      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 0,
          backgroundColor: item.InvoiceType == 'TRANSFER' ? Bcolor : '#FFCCBC',
          shadowOffset: { width: 0, height: 0.7, },
          shadowOpacity: 0.39,
          shadowRadius: 0.69,
          elevation: 2,
          borderRadius: scale(3),
          paddingVertical: moderateScale(2)



        }}>



          <TouchableOpacity style={{ flex: 7, marginTop: 0, paddingHorizontal: moderateScale(4) }}
            onPress={() => {

              if (item.requestType == 'For Sales') {

                setModalstatusQr(true); setQrValue('id=' + item.invID + '&STOCK_REQUEST~' + user_id); setQrcolor('#80CBC4'); setQrtitle(item.requestStep)
              }
              else {
                setModalstatusQr(true); setQrValue('id=' + item.invID + '&STOCK_REQUEST~' + user_id); setQrcolor(COLORS.purple); setQrtitle(item.requestStep)

              }




            }
            }

          >









            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                paddingLeft: 3,
                marginTop: 0
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
                  <Text style={{ fontSize:scale(12), color: '#fff', paddingRight: 1 }}>{item.sl}</Text>


                </TouchableOpacity>

              </View>
              <View
                style={{ flex: 12, }}
              >

                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: verticalScale(3) }}>
                  <MaterialIcons name={item.r_state} size={scale(10)} style={{ marginRight: moderateScale(2), color: "#1B5E20" }} />

                  <Text style={{ fontSize: scale(8), fontWeight: '600', color: "#1B5E20", }}> {item.requestFrom}  </Text>

                  <Entypo name="arrow-right" size={scale(12)} style={{ color: "#9C27B0",marginTop:verticalScale(-1) }} />
                  <Text style={{ fontSize: scale(8), fontWeight: '600', color: "#E91E63" }}>  {item.requestTo}</Text>
                  <MaterialIcons name="radio-button-unchecked" size={scale(10)} style={{ marginLeft: moderateScale(2), color: "#E91E63" }} />
                </View>



                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: verticalScale(-1.5) }}> {item.mondifyInvID} </Text>

                </View>

              </View>


            </View>

            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                marginTop: verticalScale(1)
                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
              }}
            >
              <View
                style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderBottomWidth: 1, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Product</Text>
                <Text style={{ fontSize: scale(9), color: '#1B5E20', marginTop: verticalScale(-1.5) }}>{item.prdName}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', borderWidth: 1, flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderRightWidth: 0, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Quantity</Text>
                <Text style={{ fontSize: scale(9), color: '#E91E63', marginTop: verticalScale(-1.5) }}>{item.requestQty}</Text>

              </View>

            </View>



            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
              }}
            >
              <View
                style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2)}}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request Time</Text>
                <Text style={{ fontSize: scale(8), color: '#3F51B5', marginTop: verticalScale(-1.5)}}>{item.r_time}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request By</Text>
                <Text style={{ fontSize: scale(8), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.requestBy} </Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Carrier</Text>
                <Text style={{ fontSize: scale(8), color: '#795548', marginTop: verticalScale(-1.5) }}>{item.Carrier}</Text>

              </View>



            </View>

            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                display: item.InvoiceType == 'TRANSFER' ? "flex" : "none"
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

            <View
              style={{
                flexDirection: 'row', justifyContent: 'space-between',
                display: item.tranaferType == 'Frocetransfer' ? "flex" : "none"
              }}
            >
              <View
                style={{ borderColor: '#E0E0E0', flex: 2, paddingVertical: 0.5, paddingHorizontal: 2, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: 9, color: '#9E9E9E', fontWeight: '500' }}>Receiver</Text>
                <Text style={{ fontSize: 10, color: '#006064', marginTop: -2 }}>{item.requestByEx}</Text>

              </View>





            </View>









          </TouchableOpacity>




        </View>

      </View>
    )

  }

  const renderLTA = ({ item }) => {

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
          backgroundColor: '#C5CAE9'


        }}

      >
        <TouchableOpacity
          onPress={() => { setIsModal_LTA(false); ShowTransection(item.invID) }}
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
                    <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.cusName} </Text>

                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <Text style={{ fontSize: scale(9), color: "#4E342E", textAlign: 'left', marginTop: verticalScale(-2) }}> {item.invID} </Text>

                  </View>

                </View>

                

                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between',
                  marginTop: verticalScale(2) }}
                >
                  
                      <FontAwesome name="list-ul" style={{ fontSize: scale(10), color: COLORS.purple, marginRight: 1,marginTop:2 ,borderRightWidth: 1,borderColor: '#E0E0E0'}} />
                      <Text style={{ fontSize: scale(11), color: '#ff6666', marginRight: 1 }}> {item.prdNO} </Text>

                      <MaterialIcons name="done-outline" style={{ fontSize: scale(10), color: COLORS.primary, marginRight: 1,marginTop:2 }} />
                      <Text style={{ fontSize: scale(11), color: '#ff6666', marginRight: 1 }}> {item.arrangePrdNo} </Text> 

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
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3), borderBottomWidth: 1,
                   borderTopWidth: 1,borderBottomWidth:0 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Scan Time</Text>
                  <Text style={{ fontSize: scale(9), color: '#00796B', marginTop: verticalScale(-1.5) }}>{item.s_time}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', borderWidth: 1, flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3), borderRightWidth: 0,
                   borderTopWidth: 1,borderBottomWidth:0 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Branch</Text>
                  <Text style={{ fontSize: scale(9), color: '#6D4C41', marginTop: verticalScale(-1.5) }}>{item.centerName}</Text>

                </View>

                <View
                  style={{ borderColor: '#E0E0E0', borderWidth: 1, flex: 1, paddingVertical: verticalScale(0.5),
                      paddingHorizontal: moderateScale(3), borderRightWidth: 0, borderTopWidth: 1,borderBottomWidth:0 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Sold By</Text>
                  <Text style={{ fontSize: scale(9), color: '#01579B', marginTop: verticalScale(-1.5) }}>{item.ActivityBy}</Text>

                </View>

              </View>



        


            </View>



          </View>

        </TouchableOpacity>
      </View>




    )
  }

  const FetchPoint = async (month) => {



    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');
    setUser_id(userID);
    setappToken(token);
    if (token !== null) {

      try {
        setIsloddingAction(true);
        const { data } = await BaseApi.post('/DistriBution/DisUilityAPI.php', {
          token: token,
          act: 'Get_Point',
          userID: userID,
          selectMonth: month
        });



        if (data.service_header.status_tag === 'success') {
          setRenderPointData(data.spw_data);
          setLastFewMonthscombo(data.lastFewMonthscombo);
          //console.log(data.lastFewMonthscombo)

        }
        else {
          setIsloddingAction(false);

        }

      }
      catch (error) {

        //console.log(data.spw_data);
        setIsloddingAction(false);
      }
      setIsloddingAction(false);


    }
    else {
      setIsloddingAction(false);
    }



  }

  function renderBodySec() {
    var [{ Head }] = disOption.filter((x) => x.status == true);



    if (Head == 'Point') {
      slForPoint = 0;
      return (

        <>
           <View
                style={{

                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 2,
                  marginBottom: verticalScale(0),
                  marginTop: verticalScale(5),
                  paddingHorizontal: moderateScale(6)
                }}
              >
                <Text>-------------------</Text>
                <Text style={{}}> Arrange Point Section </Text>
                <Text>-------------------</Text>

              </View>
          <View
            key={0}
            style={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingHorizontal: moderateScale(6)


            }}>
            <Dropdown
              style={{
                marginVertical: verticalScale(6),
                color: '#424242',
                fontSize: scale(13),
                paddingLeft: moderateScale(8),
                backgroundColor: '#A5D6A7',
                borderRadius: scale(3),
                height: scale(30),
                shadowOffset: { width: 0, height: 0.5, },
                shadowOpacity: 0.47,
                shadowRadius: 1.49,
                elevation: 3,
              }}
              //
              itemTextStyle={{ fontSize: scale(13), }}
              itemContainerStyle={{ marginVertical: verticalScale(-7), }}
              //placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{ fontSize: scale(13) }}
              inputSearchStyle={{ height: scale(35) }}
              //iconStyle={styles.iconStyle}
              //search
              // searchPlaceholder="Search..."
              // placeholder={!isFocus ? 'Select item' : '...'}
              // onFocus={() => setIsFocus(true)}
              // onBlur={() => setIsFocus(false)}
              data={lastFewMonthscombo}
              maxHeight={scale(600)}
              labelField="label"
              valueField="value"
              placeholder='Select Month'
              value={selectMonth}
              onChange={item => {
                SetSelectMonth(item.value);
                FetchPoint(item.value);
              }}

            />

          </View>



          <View style={{ flex: 1 }}>

            

            <View
              key={0}
              style={{

                flexDirection: 'row',
                justifyContent: 'space-between',
                 paddingHorizontal: moderateScale(4)


              }}>


                  <View style={{ flex: 4, backgroundColor: '#cc7a00', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}>
                    <Text style={{ fontSize:scale(13), color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>SL</Text>
                  </View>
                  <View style={{ flex: 15, backgroundColor: '#D7CCC8', justifyContent: 'center', alignItems: "center", }}>
                    <Text style={{fontSize: scale(11), color: '#8080ff', marginRight: 0 }}>USER</Text>
                  </View>
                  <View style={{ flex: 9, backgroundColor: '#FFCC80', paddingVertical: 1, justifyContent: 'center', alignItems: "center"}}>
                    <Text style={{fontSize: scale(11), color: '#ff6666',  }}>ARNG</Text>
                  </View>
                  <View style={{ flex: 8, backgroundColor: '#B0BEC5', paddingVertical: 1, justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: scale(11), color: '#8D6E63',  }}>CHECK</Text>
                  </View>
                  <View style={{ flex: 8, paddingVertical: 1, backgroundColor: '#4DB6AC', justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: scale(11), color: '#eee',  }}>PRD</Text>
                  </View>
                  <View style={{ flex: 9,  paddingVertical: 1, backgroundColor: '#C5E1A5', justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontSize: scale(11), color: '#880E4F',  }}>T.POINT</Text>
                  </View>


            </View>


            <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(4), paddingHorizontal: moderateScale(4) }}>


              <FlatList

                data={rendePointData}
                //extraData={rendePointData}
                renderItem={renderPoint}
                keyExtractor={(item) => item.sl}
                showsVerticalScrollIndicator={false}
                refreshing={islodding}



              />
            </View>
          </View>
        </>
      )
    }
    else if (Head == 'UndeliverSalesInv') {

      return (

     


        <View style={{ flex: 1, }}>

              <View
                style={{

                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 2,
                  marginBottom: verticalScale(0),
                  marginTop: verticalScale(6),
                  paddingHorizontal: moderateScale(6)
                }}
              >
                <Text>-------------------</Text>
                <Text style={{}}> Undeliver Invoice Section </Text>
                <Text>-------------------</Text>

              </View>


              <View style={{
                    marginTop:verticalScale(4),
                    width:'97%',
                    alignSelf:'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  
                   
      
                  
                  
                  

                }}>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: scale(25),
                        backgroundColor: '#ff3399',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: scale(2),
                        marginRight: moderateScale(1),

                      }}
                      onPress={() => LivetrackDetails('UNTOUCH','')}
                    >

                        <Text style={{ fontSize:scale(9),fontWeight:'600', color: COLORS.white }}>{invoceNOInfo.UNTOUCH}</Text>
                        <Text style={{ fontSize:scale(9), color: COLORS.white,marginTop:verticalScale(-2) }}>UNTOUCH</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: scale(25),
                        backgroundColor: '#79d279',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: scale(2),
                        marginRight: 1,
                     
                      }}
                      onPress={() => LivetrackDetails('PARTIAL','')}
                    >

                        <Text style={{ fontSize:scale(9),fontWeight:'600', color: COLORS.white }}>{invoceNOInfo.PARTIAL}</Text>
                        <Text style={{ fontSize:scale(9), color: COLORS.white,marginTop:verticalScale(-2) }}> PARTIAL</Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        height: scale(25),
                        backgroundColor: '#BCAAA4',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: scale(2),
                        marginRight: 1,
                      }}
                    >

                        <Text style={{ fontSize:scale(9),fontWeight:'600', color: COLORS.white }}>{invoceNOInfo.WORKING}</Text>
                        <Text style={{ fontSize:scale(9), color: COLORS.white,marginTop:verticalScale(-2) }}> WORKING</Text>
                    </View>

                </View>




            <View
              key={0}
              style={{

                flexDirection: 'row',
                justifyContent: 'space-between',
                 paddingHorizontal: moderateScale(4),
                 marginTop:verticalScale(4)


              }}>


                  <View style={{ flex: 4, backgroundColor: '#78909C', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}>
                    <Text style={{ fontSize:scale(13), color: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>SL</Text>
                  </View>
                  <View style={{ flex: 15, backgroundColor: '#D7CCC8', justifyContent: 'center', alignItems: "center", }}>
                    <Text style={{fontSize: scale(11), color: '#8080ff', marginRight: 0 }}>ARRANGE BY</Text>
                  </View>
                  <View style={{ flex: 9, backgroundColor: '#4DB6AC', paddingVertical: 1, justifyContent: 'center', alignItems: "center"}}>
                    <Text style={{fontSize: scale(11), color: '#fff',  }}>PENDING TASK</Text>
                  </View>
                


            </View>


          <View style={{ flexDirection: 'row', flex: 1,  paddingHorizontal: moderateScale(4), marginTop:verticalScale(4) }}>


            <FlatList

              data={rendeUSIData}
              //extraData={rendePointData}
              renderItem={renderUSI}
              keyExtractor={(item) => item.sl}
              showsVerticalScrollIndicator={false}
              refreshing={islodding}



            />
          </View>

         



        </View>
      )
    }
    else if (Head == 'My Task') {

      return (

        <>

         <View
            style={{

              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: verticalScale(0),
              marginTop: verticalScale(6),
              paddingHorizontal: moderateScale(6)
            }}
          >
            <Text>-------------------</Text>
            <Text style={{}}> My Task </Text>
            <Text>-------------------</Text>

          </View>


        

        <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: moderateScale(4), marginTop:verticalScale(4)}}>
          <FlatList

            data={rendeMTData}
            //extraData={rendeMTData}
            renderItem={renderTasks}
            keyExtractor={(item) => item.invID}
            showsVerticalScrollIndicator={false}
            refreshing={islodding}



          />
        </View>

        </>
      )
    }
    else if (Head == 'Complete Invoice') {

      return (

        <>

            <View
            style={{

              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: verticalScale(0),
              marginTop: verticalScale(6),
              paddingHorizontal: moderateScale(6)
            }}
          >
            <Text>-------------------</Text>
            <Text style={{}}> Complete Invoice </Text>
            <Text>-------------------</Text>

          </View>

            <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: moderateScale(4), marginTop:verticalScale(4) }}>
              <FlatList

                data={rendeCIData}
                //extraData={rendeCIData}
                renderItem={renderCompleteTasks}
                keyExtractor={(item) => item.invID}
                showsVerticalScrollIndicator={false}
                refreshing={islodding}



              />
            </View>

        </>
      )
    }
    else if (Head == 'Partial Inv') {

      return (

        <>

         <View
            style={{

              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: verticalScale(0),
              marginTop: verticalScale(6),
              paddingHorizontal: moderateScale(6)
            }}
          >
            <Text>-------------------</Text>
            <Text style={{}}> Partial Invoice </Text>
            <Text>-------------------</Text>

          </View>
        
        


        <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: moderateScale(4), marginTop:verticalScale(4) }}>
          <FlatList

            data={rendePIData}
            //extraData={rendePIData}
            renderItem={renderPartialInv}
            keyExtractor={(item) => item.mondifyInvID}
            showsVerticalScrollIndicator={false}
            refreshing={islodding}



          />
        </View>

        </>
      )

    }
    else {

      return (

        <>

          <View
            style={{

              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              marginBottom: verticalScale(0),
              marginTop: verticalScale(6),
              paddingHorizontal: moderateScale(6)
            }}
          >
            <Text>-------------------</Text>
            <Text style={{}}> Carrier Task </Text>
            <Text>-------------------</Text>

          </View>
        
       


        <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: moderateScale(4), marginTop:verticalScale(4) }}>
          <FlatList

            data={rendeCTData}
            //extraData={rendePIData}
            renderItem={renderCarrierTasks}
            keyExtractor={(item) => item.invID}
            showsVerticalScrollIndicator={false}
            refreshing={islodding}



          />
        </View>

        </>
      )

    }




  }

  const LivetrackDetails = async (userName, arrangeID) => {

    setModalUserName(userName);



    //return false;

    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      setIsModal_LTA(true);
      // setIsModalDatalodding(true);
      setLiveTrackingData([]);
      try {

        const { data } = await BaseApi.post('/DistriBution/DisUilityAPI.php', {
          token: token,
          act: 'fetchLTA',
          arrangeID: arrangeID,
          invType: userName
        });



        if (data.service_header.status_tag === 'success') {
          setLiveTrackingData(data.spw_data);
          // console.log(data.invBasicData);         
        }
        else {
          setLiveTrackingData([]);
        }

      }
      catch (error) {
        setLiveTrackingData([]);
      }
      //setIsModalDatalodding(false);

    }
    else {
      setLastPriceData([]);
    }

  }

  function renderLivetrack_A() {
    return (
      <Modal
        animationType={'fade'}
        visible={isModal_LTA}
        transparent={isModal_LTA}


      >

        <View
          style={{
            flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end', alignItems: 'center',
          }}
         // onPress={() => setIsModal_LTA(false)}


        >
          <View
            style={{
              flex: 1,
              width: '100%',

              justifyContent: 'flex-end',

            }}
          >

                          <TouchableOpacity 
                                    style={{ 
                                        flexDirection: 'row',
                                        justifyContent:'flex-end',
                                    
                                    }}
                                    onPress={() =>  setIsModal_LTA(false)}
                                >
                                    <View

                                        style={{ 
                                            flexDirection: 'row',
                                            backgroundColor:'#EF5350',
                                            width:'30%',
                                            paddingHorizontal:moderateScale(3),
                                            paddingVertical:verticalScale(1),
                                            borderRadius:3,
                                            justifyContent:'space-between'
                                          
                                        
                                          //alignItems:'right'
                                        }}
                                        
                                    >
                                    
                                        <Text style={{textAlign:'right',color:'white',fontSize:scale(15),fontWeight:'600'}}>CLOSE</Text>
                                        <AntDesign name="closesquare" size={scale(20)} color="white" style={{textAlign:'right',}} />

                                    </View>
                                        
                                                    
                                                    

                        </TouchableOpacity>

            <View
              style={{
                paddingHorizontal: moderateScale(6),
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#fff',
                maxHeight: '75%',

                //marginBottom:20,
              }}
            >


              <Text style={{ fontSize:scale(12), color: '#b380ff', paddingVertical: verticalScale(3), textDecorationLine: 'underline' }}>{modalUserName}</Text>


              <View
                style={{

                  flexDirection: 'row',
                  // alignItems: 'center',
                  // textAlign:'center',
                  width: '100%',
                  marginBottom: verticalScale(35),

                }}
              >

                <FlatList
                  data={liveTrackingData}
                  // extraData={otpData}
                  renderItem={renderLTA}
                  keyExtractor={(item) => item.invID}
                  showsVerticalScrollIndicator={false}
                //refreshing={isModalDatalodding}
                // onRefresh={fetchInvData}


                />


              </View>



            </View>


          </View>



        </View>
      </Modal>

    )
  }

  const ShowTransection = async (invID) => {

    //setIsModal_LTA(false);
    var gg = baseUrl + 'spwsims/api/invoiceShow.php?id=' + invID;
    setTransLink(gg);
    setIsModalTrns(true);


  }

  function renderInv() {
    return (
      <Modal
        visible={isModalTrns}
        transparent={isModalTrns}

      >
        <View style={{ flex: 1, backgroundColor: '#7b62f2' }}>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between',height:verticalScale(55)  }}>

            
            <TouchableOpacity
              onPress={() => setIsModalTrns(false)}
              style={{alignItems:'center'}}
            >
              <FontAwesome name="window-close" size={scale(25)} color="white" style={{ right: 0,left:10, top: scale(32) }} onPress={() => setIsModalTrns(false)} />
            </TouchableOpacity>

          </View>


          <WebView
            source={{ uri: transLink }}
            originWhitelist={['*']}
          />




        </View>
      </Modal>

    )
  }





  return (
    <>
      <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
        {renderHeader()}
      </SafeAreaView>
      <View style={{ flex: 1, backgroundColor: 'rgba(232, 234, 246, 0.61)' }}>



        {
          isloddingAction ? (<Loading />)
            : (
              <>
                {renderMenu()}
                {renderBodySec()}
              </>

            )
        }

        {<QrCodeModal qrtitle={qrtitle} qrvalue={qrValue} color={qrcolor} size={200} setModalstatus={setModalstatusQr} modalstatus={modalstatusQr} />}
        {renderLivetrack_A()}
        {renderInv()}


      </View >
    </>




  );
}

export default DistriBution;
