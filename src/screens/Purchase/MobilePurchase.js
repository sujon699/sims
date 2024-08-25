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
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';

import { showMessage } from "react-native-flash-message";
import { WebView } from 'react-native-webview';
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import LinearGradient from 'react-native-linear-gradient';






function MobilePurchase({ navigation }) {




  const [isloddingAction, setIsloddingAction] = useState(false);
  const [islodding, setIslodding] = useState(false);
  const [appToken, setappToken] = useState('');
  const [user, setUser] = useState('');

  const [isModal, setIsModal] = useState(false);
  const [modalPrdName, setModalPrdName] = useState('');
  const [isModalDatalodding, setIsModalDatalodding] = useState(false);

  const [menuBasicData, setMenuBasicData] = useState({
    "PurchaseDraft": 0,
    "CompletePurchase": 0,
    "RequestProducts": 0
  });
  const [disOption, setDisOption] = useState([
    {
      "Head": "Purchase Draft",
      "status": false,
    },
    {
      "Head": "Complete Purchase",
      "status": false,
    },
    {
      "Head": "Request Products",
      "status": true,
    },


  ]);
  const [renderPDData, setRenderPDData] = useState([]);
  const [renderCPData, setRenderCPData] = useState([]);
  const [renderRPData, setRenderRPData] = useState([]);




  const [lastPriceData, setLastPriceData] = useState([]);

  const [isModalTrns, setIsModalTrns] = useState(false);
  const [transLink, setTransLink] = useState('');
  const [transID, setTransID] = useState('');



  useEffect(() => {


    const focusHandler = navigation.addListener('focus', () => {
      getMenuValue();
    });

    return () => {
      focusHandler;
    }



  }, [navigation]);


  const getMenuValue = async (Head = "Request Products") => {




    var act = 'Get_' + Head.replace(" ", "");
    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');
    const userName = await AsyncStorage.getItem('userName');
    setUser(userName);
    setappToken(token);
    if (token !== null) {


      try {
        setIsloddingAction(true);
        const { data } = await BaseApi.post('/MobilePurchase/thisUilityAPI.php', {
          token: token,
          act: act,
          userID: userID,
        });

        if (data.service_header.status_tag === 'success') {
          if (Head == "Request Products") {
            setRenderRPData(data.spw_data);
            //console.log(data.spw_data); 

          }
          else if (Head == "Purchase Draft") {
            setRenderPDData(data.spw_data);

          }
          else if (Head == "Complete Purchase") {
            setRenderCPData(data.spw_data);

          }

          //console.log(data.spw_data); 
          setMenuBasicData(data.invBasicData);
        }
        else {
          await logout(navigation, data.service_header.massage);
          setRenderPDData([]);
          setRenderCPData([]);
          setRenderRPData([]);
          setMenuBasicData(menuBasicData);
          //   console.log(data.invBasicData);
          setIsloddingAction(false);

        }

      }
      catch (error) {
        setRenderPDData([]);
        setRenderCPData([]);
        setRenderRPData([]);
        setMenuBasicData(menuBasicData);
        setIsloddingAction(false);
        console.log(error);
      }
      setIsloddingAction(false);


    }
    else {
      setRenderPDData([]);
      setRenderCPData([]);
      setRenderRPData([]);
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

    var [{ Head: PDHead, status: PDstatus }] = disOption.filter((x) => x.Head == 'Purchase Draft');
    var [{ Head: CPHead, status: CPstatus }] = disOption.filter((x) => x.Head == 'Complete Purchase');
    var [{ Head: RPHead, status: RPstatus }] = disOption.filter((x) => x.Head == 'Request Products');


    return (
      <>
        <View style={{  width: '97%', alignSelf: 'center',marginTop:verticalScale(4) }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: RPstatus ? '#b380ff' : '#D1C4E9',
                  borderRadius: scale(4),
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
                  getMenuValue(RPHead);
                }}
              >
                   <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["RequestProducts"]}</Text>
                   <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{RPHead}</Text> 

                  
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: scale(4),
                  backgroundColor: PDstatus ? '#b380ff' : '#D1C4E9',
                  borderRadius: scale(3),
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
                  getMenuValue(PDHead);
                }}
              >

                  <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["PurchaseDraft"]}</Text>
                   <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{PDHead}</Text>


              </TouchableOpacity>

              

              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: CPstatus ? '#b380ff' : '#D1C4E9',
                  borderRadius: scale(3),
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
                  getMenuValue(CPHead);
                }}
              >
   
             

                  <Text style={{ fontSize: scale(12), fontWeight: "600", color: '#F4511E', textAlign: 'center' }}> {menuBasicData["CompletePurchase"]}</Text>
                   <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center' }}>{CPHead}</Text>


              </TouchableOpacity>



         

              

           </View>
        </View>
      </>
    )


  }

  const confirmChk = async (type) => {
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
              DeleteRqst();
            }
            else {
              AddDraft();
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

  const DeleteRqst = async () => {

    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);
    try {
      var modifyID = renderRPData.filter((x) => x.selected == true).map(function (val, i) {
        return {
          "rqstID": val.rqstID
        }

      });


      if (modifyID.length == 0) {
        setIsloddingAction(false);
        showMessage({
          message: "Plz Select Atlest One Row",
          description: '',
          duration: 2000,
          type: "danger",
        });


      }
      else {
        modifyID = JSON.stringify(modifyID);
        const { data } = await BaseApi.post('MobilePurchase/ActionAPI.php', {
          token: appToken,
          act: 'DeleteRequest',
          userID: userID,
          modifyID: modifyID
        });

        if (data.service_header.status_tag === 'success') {
          setIsloddingAction(false);
          showMessage({
            message: "Update Sucessfully ",
            description: '',
            duration: 2000,
            type: "success",
          });


        }
        else {
          await logout(navigation, data.service_header.massage);
          setIsloddingAction(false);
          showMessage({
            message: "Update Unsucessfully ",
            description: '',
            duration: 2000,
            type: "danger",
          });
        }

      }



    }
    catch (error) {
      console.log(error);
      setIsloddingAction(false);
    }
    getMenuValue();

  }

  const AddDraft = async () => {

    const userID = await AsyncStorage.getItem('userID');
    setIsloddingAction(true);
    try {
      var modifyID = renderRPData.filter((x) => x.selected == true).map(function (val, i) {
        return {
          "rqstID": val.rqstID
        }

      });


      if (modifyID.length == 0) {
        setIsloddingAction(false);
        showMessage({
          message: "Plz Select Atlest One Row",
          description: '',
          duration: 2000,
          type: "danger",
        });


      }
      else {
        modifyID = JSON.stringify(modifyID);
        const { data } = await BaseApi.post('MobilePurchase/ActionAPI.php', {
          token: appToken,
          act: 'Add_Pur_Draft',
          userID: userID,
          modifyID: modifyID
        });

        if (data.service_header.status_tag === 'success') {
          setIsloddingAction(false);
          showMessage({
            message: "Draft Add Sucessfully ",
            description: '',
            duration: 2000,
            type: "success",
          });

          navigation.navigate('PurchaseScreen', {
            InvID: data.spw_data,
          })


        }
        else {
          await logout(navigation, data.service_header.massage);
          console.log(data.spw_data);
          setIsloddingAction(false);
          showMessage({
            message: "Draft Add Unsucessfully ",
            description: '',
            duration: 2000,
            type: "danger",
          });
        }

      }



    }
    catch (error) {
      console.log(error);
      setIsloddingAction(false);
    }
    getMenuValue();

  }

  const ShowTransection = async (invID) => {

    var gg = baseUrl + 'spwsims/api/invoiceShow.php?id=' + invID;
    setTransLink(gg);
    setIsModalTrns(true);
    setTransID(invID);


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
                MOBILE PURCHASE
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

            
            <Image source={ icons.mobile_purchase_black }
                        style={{
                            height: scale(23),
                            width: scale(23),
                            tintColor: '#fff',
                            marginLeft:moderateScale(4) 
                        }}
              />






          </View>


        </View>



      </LinearGradient>

    );
  }

  const checkDetails = async (value, ID) => {


    // var objectNo = invData.findIndex(x=>x.InvoiceDetailsID === invdetailsID)
    const newIngredients = renderRPData.map((item) => {
      if (item.rqstID != ID) {
        return item;
      }
      else {
        return { ...item, selected: value };
      }
    });
    setRenderRPData(newIngredients);
  }


  const renderRequestPrd = ({ item }) => {

    var checkBoxSection = "";
    var rInfo = (  <>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Branch</Text>
                  <Text style={{ fontSize: scale(9), color: '#E64A19', marginTop: verticalScale(-1.5) }}>{item.centerName}</Text>

                </View>

                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Sold By</Text>
                  <Text style={{ fontSize: scale(9), color: '#E64A19', marginTop: verticalScale(-1.5) }}>{item.soldBy}</Text>

                </View>
                <View
                  style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                >
                  <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Sales Price</Text>
                  <Text style={{ fontSize: scale(9), color: '#E64A19', marginTop: verticalScale(-1.5) }}>{item.s_price}</Text>

                </View>
    </>);
    
    if (item.selected == true) {
      checkBoxSection = (

        <TouchableOpacity
          key={item.InvoiceDetailsID}
          style={{ flexDirection: 'row', flex: 4, backgroundColor: '#AED581', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}
          onPress={() => checkDetails(!item.selected, item.rqstID)}
        >
          <Text style={{ ...FONTS.body4, color: '#fff', paddingRight: 1 }}>{item.sl}</Text>
          <MaterialIcons name="radio-button-checked" size={20} color="white" style={{ textAlign: 'center' }} />

        </TouchableOpacity>

      );
    }
    else if (item.selected == false) {
      checkBoxSection = (

        <TouchableOpacity
          style={{ flexDirection: 'row', backgroundColor: '#ff4d88', flex: 4, justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}
          key={item.InvoiceDetailsID}

          onPress={() => checkDetails(!item.selected, item.rqstID)}
        >
          <Text style={{ ...FONTS.body4, color: '#fff', paddingRight: 1 }}>{item.sl}</Text>
          <MaterialIcons name="radio-button-unchecked" size={20} color="white" style={{ textAlign: 'center' }} />

        </TouchableOpacity>

      )
    }
    else {
      checkBoxSection = (

        <TouchableOpacity
          style={{ flexDirection: 'row', backgroundColor: '#A1887F', flex: 4, justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 1, }}
          key={item.InvoiceDetailsID}
        >
          <Text style={{ ...FONTS.body4, color: '#fff', paddingRight: 1 }}>{item.sl}</Text>

        </TouchableOpacity>

      )





      rInfo = (<View
        style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
      >
        <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Working On</Text>
        <Text style={{ fontSize: scale(9), color: '#6D4C41', marginTop: verticalScale(-1.5) }}>{item.workingOn}</Text>

      </View>);

    }

    var bcolor = COLORS.white;

    if (item.myWork == 1) {
      bcolor = '#D7CCC8';
    }



    return (

      <View
        key={item.rqstID}
        style={{

          shadowOffset: { width: 0, height: 1, },
          shadowOpacity: 0.47,
          shadowRadius: 0.67,
          elevation: 3,
          borderRadius: 3,
          backgroundColor: bcolor,
          marginBottom: 3.5


        }}

      >

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: SIZES.padding * 0,
          paddingTop: 0,
          paddingBottom: 0,



        }}>

          {checkBoxSection}

          <View style={{ flex: 30, paddingHorizontal: 2, paddingVertical: 1, }}>
            <TouchableOpacity
              onPress={() => lastPrice(item.rqstID)}
            >
             
                    
                
                  <View
                    style={{
                      flexDirection: 'row', justifyContent: 'space-between',
                      marginTop: verticalScale(2),
                 
                      //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                    }}
                  >
                        <View
                          style={{ borderColor: '#E0E0E0', flex: 8, paddingVertical: verticalScale(1.0), paddingHorizontal: moderateScale(2), borderBottomWidth: 1, }}
                        >
                          <Text style={{ fontSize: scale(9), color: '#2E7D32',  }}>{item.prdName}</Text>

                        </View>
                        <View
                          style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(1.0), paddingHorizontal: moderateScale(2), borderBottomWidth: 1,
                          flexDirection: 'row', justifyContent: 'flex-end'  }}
                        >
                           <FontAwesome name="list-ul" style={{ fontSize:scale(9), color: '#455A64',marginRight:moderateScale(3),marginTop:verticalScale(1) }} />
                            <Text style={{ fontSize: scale(9), color: '#E91E63', }}>{item.r_qty}</Text>

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
                        <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Time</Text>
                        <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.r_date}</Text>

                      </View>
                      <View
                        style={{ borderColor: '#E0E0E0', flex: 1, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(2), borderLeftWidth: 1 }}
                      >
                        <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Request By</Text>
                        <Text style={{ fontSize: scale(9), color: '#3F51B5', marginTop: verticalScale(-1.5) }}>{item.requestBy}</Text>

                      </View>

                       {rInfo}
                     
                   



                  </View>
                   



                  

              
            </TouchableOpacity>
          </View>



        </View>


      </View>
    )

   



  }

  const renderDraft = ({ item }) => {



 

    return (
    
        <View
        key={item.InvoiceID}
        style={{

          shadowOffset: { width: 0.0, height: 0.5, },
          shadowOpacity: 0.27,
          shadowRadius: 1.0,
          elevation: 2,
          borderRadius: 2,
          marginBottom: 3,
          backgroundColor: '#AED581'


        }}

      >


        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,
         


        }}>



          <TouchableOpacity style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(3) }}
              onPress={() => {
                        navigation.navigate('PurchaseScreen', {
                          InvID: item.InvoiceID,
                        })
              }}

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
                    flexDirection: 'row', backgroundColor: '#455A64', flex: 3, justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                  }}
                >
                  <Text style={{ fontSize: scale(12), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                

                </View>

              </View>
              <View
                style={{ flex: 12, }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scale(10), fontWeight: '600', color: "#E91E63" }}>  {item.SupllierName} </Text>
                

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: scale(-1) }}> {item.d_date} </Text>

                </View>

              </View>

              <View
                style={{ flex: 2, }}
              >
                
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

                    <FontAwesome name="list-ul" style={{  fontSize:scale(11), color: '#6D4C41',marginTop:verticalScale(2) }} />
                    <Text style={{ fontSize: scale(13),fontWeight:'600', color: '#ff6666', marginRight: 1 }}> {item.prdNO} </Text>
                </View>

              </View>



            </View>

            



          </TouchableOpacity>



        </View>


      </View>

    )

    

  }



  const renderCP = ({ item }) => {

    

    return (
      <View
        key={item.InvoiceID}
        style={{

          shadowOffset: { width: 0.0, height: 0.5, },
          shadowOpacity: 0.27,
          shadowRadius: 1.0,
          elevation: 2,
          borderRadius: 2,
          marginBottom: 3,
          backgroundColor: '#E0F7FA'


        }}

      >


        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0


        }}>



          <TouchableOpacity style={{ flex: 30, paddingHorizontal: moderateScale(2), paddingVertical: verticalScale(1) }}
              onPress={() => ShowTransection(item.InvoiceID)}

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
                    flexDirection: 'row', backgroundColor: '#455A64', flex: 3, justifyContent: 'center',
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
                  <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.SupllierName} </Text>
                

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={{ fontSize: scale(8), color: "#4E342E", textAlign: 'left', marginTop: scale(-1) }}> {item.InvoiceID} </Text>

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
                <Text style={{ fontSize: scale(9), color: '#00796B', marginTop: verticalScale(-1.5) }}>{item.p_date}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 1, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Prepare By</Text>
                <Text style={{ fontSize: scale(9), color: '#00796B', marginTop: verticalScale(-1.5) }}>{item.purchaseBy}</Text>

              </View>
              <View
                style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),borderLeftWidth: 1, borderTopWidth: 1 }}
              >
                <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Product No</Text>
                <Text style={{ fontSize: scale(9), color: '#00796B', marginTop: verticalScale(-1.5) }}>{item.prdNO}</Text>

              </View>
              

            </View>

            



          </TouchableOpacity>



        </View>


      </View>
    )

  }


  function renderBodySec() {
    var [{ Head }] = disOption.filter((x) => x.status == true);


    if (Head == 'Purchase Draft') {

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
            <Text style={{}}> Purchase Draft </Text>
            <Text>----------------------</Text>

          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(4),marginBottom:verticalScale(55), paddingHorizontal: moderateScale(6) }}>
            <FlatList

              data={renderPDData}
              // extraData={renderPDData}
              renderItem={renderDraft}
              keyExtractor={(item) => item.InvoiceID}
              showsVerticalScrollIndicator={false}
              refreshing={islodding}



            />
          </View>

        </>
      )
    }
    else if (Head == 'Complete Purchase') {

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
            <Text style={{}}> Complete Purchase </Text>
            <Text>----------------------</Text>

          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(4),marginBottom:verticalScale(55), paddingHorizontal: moderateScale(6) }}>
            <FlatList

              data={renderCPData}
              extraData={renderCPData}
              renderItem={renderCP}
              keyExtractor={(item) => item.InvoiceID}
              showsVerticalScrollIndicator={false}
              refreshing={islodding}



            />
          </View>

        </>
      )
    }
    else if (Head == 'Request Products') {

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
            <Text style={{}}> Request Products </Text>
            <Text>----------------------</Text>

          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: verticalScale(4),marginBottom:verticalScale(55), paddingHorizontal: moderateScale(6) }}>

            <FlatList

              data={renderRPData}
              //extraData={renderRPData}
              renderItem={renderRequestPrd}
              keyExtractor={(item) => item.invDetailsID}
              showsVerticalScrollIndicator={false}
              refreshing={islodding}



            />
          </View>

          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: verticalScale(55),
            flexDirection: 'row',
            justifyContent: 'space-between',
             paddingTop: verticalScale(6),
             paddingHorizontal: moderateScale(10),
             backgroundColor:'#fff',
             shadowOffset: { width: 0,height: 0,},
                        shadowOpacity: 0.47,
                        shadowRadius: 1.49,
                        elevation: 7,
                        borderTopRightRadius:4,
                        borderTopLeftRadius:4,
            
            
            

          }}>

              <TouchableOpacity
                style={{
                  flex: 5,
                  height: scale(37),
                  backgroundColor: '#ff3399',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: scale(5),
                  marginRight: moderateScale(1),

                }}
                onPress={() => confirmChk('DELETE_REQUEST')}
              >



                <MaterialIcons name="delete" size={scale(15)} color="white" style={{ marginRight: moderateScale(5) }} />

                <Text style={{ fontSize:scale(12), color: COLORS.white }}> Delete Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 7,
                  height: scale(37),
                  backgroundColor: '#79d279',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: scale(5),
                  marginRight: 1,
                }}
                onPress={() => confirmChk('DRAFT')}
              >



                <Entypo name="shopping-cart" size={scale(14)} color="white" style={{ marginRight: moderateScale(5) }} />

                <Text style={{ fontSize:scale(12), color: COLORS.white }}> DRAFT</Text>
              </TouchableOpacity>

          </View>



        </>
      )

    }




  }

  const lastPrice = async (rID) => {


    var [{ prdName, prdID }] = renderRPData.filter((x) => x.rqstID == rID);

    setModalPrdName(prdName);

    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');
    if (token !== null) {
      setIsModal(true);
      setIsloddingAction(true);
      setLastPriceData([]);
      try {

        const { data } = await BaseApi.post('/MobilePurchase/fetchDataAPI.php', {
          token: token,
          act: 'fetchLast_Pur_price',
          prdID: prdID,
          userID: userID
        });

        if (data.service_header.status_tag === 'success') {
          setLastPriceData(data.spw_data);
          // console.log(data.spw_data);         
        }
        else {
          await logout(navigation, data.service_header.massage);
          setLastPriceData([]);
        }

      }
      catch (error) {
        setLastPriceData([]);
      }
      setIsloddingAction(false);

    }
    else {
      setLastPriceData([]);
    }

  }



  const renderLastPriceList = ({ item }) => {


    return (
      <View
        key={item.supplierID}
        style={{

          shadowOffset: { width: 1, height: 1, },
          shadowOpacity: 0.47,
          shadowRadius: 1.0,
          elevation: 2,
          borderRadius: scale(4),
          backgroundColor: '#F1F8E9',
          marginBottom: verticalScale(2),
          paddingHorizontal: moderateScale(8),
          paddingVertical: verticalScale(4),
          marginHorizontal: moderateScale(2)



        }}

      >
        <View style={{ marginBottom: verticalScale(1), paddingVertical: verticalScale(2) }}>

          <Text style={{ fontSize: scale(12), color: '#7986CB', paddingTop: verticalScale(2), paddingLeft: moderateScale(4), flex: 7 }}>{item.supplierName}</Text>

          <Text style={{ fontSize: scale(11), color: '#616161', paddingLeft: moderateScale(4), marginTop: verticalScale(1) }}>
            Purchase Date  : <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#8D6E63', paddingLeft: moderateScale(4), }}> {item.p_date}</Text>
          </Text>
          <Text style={{ fontSize: scale(12), color: '#616161', paddingLeft: moderateScale(4), marginTop: verticalScale(1) }}>
            Purchase Price : <Text style={{ fontSize: scale(12), fontWeight: '600', color: '#EF5350', paddingLeft: moderateScale(4), }}> {item.p_price}</Text>
          </Text>

        </View>



      </View>
    );

  }

  function ModalLastPrice() {
    return (
            <Modal
             // animationType={'fade'}
              visible={isModal}
              transparent={isModal}

            >

              <TouchableOpacity
                style={{
                  flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end', alignItems: 'center',
                }}
                onPress={() => setIsModal(false)}


              >
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'flex-end',

                  }}
                >

                  <View
                    style={{
                      paddingHorizontal: SIZES.padding * 1.5,
                      alignItems: 'center',
                      textAlign: 'center',
                      backgroundColor: '#fff',
                      //marginBottom:20,
                    }}
                  >


                    <Text style={{ ...FONTS.body4, color: '#b380ff', paddingRight: 1, paddingVertical: 3, textDecorationLine: 'underline' }}>{modalPrdName}</Text>


                    <View
                      style={{

                        flexDirection: 'row',
                        // alignItems: 'center',
                        // textAlign:'center',
                        width: '100%',
                        marginVertical: 1,
                        marginBottom: verticalScale(30),

                      }}
                    >

                      <FlatList
                        data={lastPriceData}
                        // extraData={otpData}
                        renderItem={renderLastPriceList}
                        keyExtractor={(item) => item.supplierID}
                        showsVerticalScrollIndicator={false}
                        refreshing={isModalDatalodding}
                      // onRefresh={fetchInvData}


                      />


                    </View>



                  </View>


                </View>



              </TouchableOpacity>
            </Modal>

    )
  }

  function ModalPurchaseInvView()
  {
     return (
                <Modal
                  visible={isModalTrns}
                  transparent={isModalTrns}

                >
                  <View style={{ flex: 1, backgroundColor: '#7b62f2' }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 90 }}>

                      <TouchableOpacity
                        onPress={() => printTransection()}

                      >
                        <Entypo name="print" size={32} color="white" style={{ left: 12, top: 54 }} onPress={() => printTransection()} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setIsModalTrns(false)}
                      >
                        <FontAwesome name="window-close" size={35} color="white" style={{ right: 10, top: 54 }} onPress={() => setIsModalTrns(false)} />
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
      <View style={{ flex: 1, backgroundColor: '#EEEEEE', }}>

        {
          isloddingAction ? (<Loading />)
            : (
              <>
                 {renderMenu()}
                {renderBodySec()}
              </>
              
              )
        }


         {ModalLastPrice()}
         {ModalPurchaseInvView()}
        



      </View >

    </>




  );
}

export default MobilePurchase;
