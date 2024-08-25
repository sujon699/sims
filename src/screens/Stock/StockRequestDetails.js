import React,{useState,useEffect} from "react";
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
    Platform,
    KeyboardAvoidingView,
    Keyboard
} from "react-native"

import { COLORS, SIZES, FONTS, icons, images,baseUrl } from "../../constants";
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';


import BaseApi from "../../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { Dropdown } from 'react-native-element-dropdown';

import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, moderateVerticalScale, scale, verticalScale } from "react-native-size-matters";


let timer;
const debounce = function (fn,d) {
    
    return function (...args)  {
         if(timer)  clearTimeout(timer);
         timer = setTimeout(() => {
            fn.apply(null,args);
         },d);
    };

};


function StockRequestDetails({navigation,route}) {
      
      const [carrier, setCarrier] = useState('');
      const [hdnuserID, sethHdnuserID] = useState('');
    

      const [transID, setTransID] = useState(route.params?.TransID);
      const [fromScan, setFromScan] = useState(route.params?.fromScan);

      const [invBasicData, setInvBasicData] = useState({});

    
      const [appToken, setappToken] = useState(''); 
      const [islodding, setIslodding] = useState(false);
      const [isloddingAction, setIsloddingAction] = useState(false);
      const [isModal, setIsModal] = useState(false);
      const [modalValue, setModalValue] = useState('0');
      const [modalPrdName, setModalPrdName] = useState('');
      const [m_type, setM_type] = useState('');
      const [modalRqstID, setModalRqstID] = useState('');


      const [usercombo, setUsercombo] = useState([]);
   
      const [user, setUser] = useState('');


      const [remarks, setRemarks] = useState('');

      const [dqty, setDqty] = useState('0');
  

      
      
      



      
      

      useEffect( () => {
        fetchInvData();  
          let cancel = false;
          return () => { 
              cancel = true;
          }

      }, []); 


      const fetchInvData = async () =>{
         //alert(route.params?.InvID);
          const token =  await AsyncStorage.getItem('token');
          const userID =  await AsyncStorage.getItem('userID');
          const userName =  await AsyncStorage.getItem('userName');
          setUser(userName);
          setappToken(token);

         


          if(token !== null) 
          {
            setIslodding(true);
              try 
              {
                   var carrierEx = route.params?.user_id; 
                 
                    setCarrier(carrierEx);
                    if(route.params?.user_id === undefined)
                    {
                        carrierEx = "";
                       
                    }
                    setCarrier(carrierEx);
                    
                
                const {data} = await BaseApi.post('/Stock/fetchInvData.php', {
                    token: token,
                    act:'StockTransferDetails',
                    InvID : route.params?.TransID,
                    userID : userID,
                    carrierEx : carrierEx,
                  });
    
                  if(data.service_header.status_tag === 'success')
                  {   
                    
                            //console.log(data.spw_data);
                            setInvBasicData(data.spw_data);
                       
                          //alert(route.params?.user_id);
                          setCarrier(data.spw_data.CarrierID);
                          sethHdnuserID(data.spw_data.CarrierID);
                          setUsercombo(data.usercombo);
  

                    
                            
                  }
                  else
                  {
                    await logout(navigation,data.service_header.massage);
                    //console.log(data.spw_data)
                        showMessage({
                            message: data.service_header.message,
                            description:'',
                            duration:2000,
                            type: "danger",
                        });
                     
                     
                      navigation.goBack();

                  }
                
              } 
              catch (error) 
              {
                  //console.log(error);
                  showMessage({
                    message: 'Somethings is wrong',
                    description:'',
                    duration:2000,
                    type: "danger",
                });
                //navigation.goBack();
            
               
              }
              setIslodding(false);
                
          }
          else
          {
             
         
          }
        
      } 



      
      const OpenInputModal = async (Type) =>{

  
            setModalValue('');
            setIsModal(true);
        
      
      }

      const SetValue = async () =>{
       
        
        if(modalValue > 0)
        {   
            // if(modalValue > invBasicData.requestQty)
            // {
            //     alert('Invalid Quantity');   
            //     setIsModal(false);
            // }
            // else
            // {
                setDqty(modalValue);
                setIsModal(false);

            //}
           
           
        }
        else
        {
           
        }



      } 

      

      const confirmChk = async (ID,type) =>{
          Alert.alert(
            // title
            'Are You Sure ?',
            // body
            '',
            [
              {
                text:'YES',
                onPress: () => {

                    if(type == 'DELETE_REQUEST')
                    {
                        DeleteRequest(ID);
                    }
                    else if(type == 'ACCEPT_REQUEST')
                    {
                        AcceptRqst(ID); 
                    }
                    else if(type == 'RECIEVED_TRANSFER')
                    {
                        ReceivedTransfer(ID);
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



     

      const FromValidation = async() =>{
             
        var error = "";
        var errorNo =0;
       
        
        if(carrier == '' || carrier == null)
        {
            errorNo++;
            error +=errorNo+" Provide Carrier Name \n";
        }
        
        if((invBasicData.requestQty < dqty || dqty == 0) && invBasicData.requestType == 'Normal')
        {
            errorNo++;
            error +=errorNo+"Invalid Quantity \n";
        }
      

        if(dqty > invBasicData.ava_stock)
        {
            errorNo++;
            error +=errorNo+"Invalid Quantity \n";
        }

        
        return error;
  }

      

      const AcceptRqst = async (invID) =>{
            const userID =  await AsyncStorage.getItem('userID');
         
            try 
            {
                var errorMsg = await FromValidation();
               
                
            

                if(errorMsg.length > 0)
                {
                    setIslodding(false);
                    showMessage({
                        message: errorMsg,
                        description:'',
                        duration:2500,
                        type: "danger",
                     });
                    //alert(errorMsg);
                    
                
                }
                else 
                {
                    
                
                    //alert('done');
                    setIslodding(true);
               
                        const {data} = await BaseApi.post('Stock/fetchInvData.php', {
                            token: appToken,
                            act:'AcceptTRNEW',
                            userID:userID,
                            invID:invID,
                            Carrier:carrier,
                            acceptQty:modalValue,
                            requestBY:invBasicData.requestByID
                        });
                        
                        if(data.service_header.status_tag === 'success')
                        {
                            //console.log(data.spw_data);
                            setIslodding(false);
                            showMessage({
                                message: "Stock Transfer  Sucessfully ",
                                description:'',
                                duration:2000,
                                type: "success",
                                });

                                setTimeout(() => {

                                    if(fromScan)
                                    {
                                        navigation.navigate('Home', { });
                                    }
                                    else
                                    {
                                        navigation.goBack();
                                    }
  
                                }, 1500);
                                  
                            
                        }
                        else
                        {
                            await logout(navigation,data.service_header.massage);
                            //console.log(data.spw_data)
                            setIsloddingAction(false);
                            showMessage({
                            message: "Stock Transfer  Unsucessfully ",
                            description:'',
                            duration:2000,
                            type: "danger",
                            });
                        }
                        
                       // fetchInvData();

                }
                

               
              
            } 
            catch (error) 
            {
                console.log(error);
                setIsloddingAction(false);
            }
           
           
      
      }

      const ReceivedTransfer = async (invID) =>{
        const userID =  await AsyncStorage.getItem('userID');
     
        try 
        {
            
                
            
                //alert('done');
                setIslodding(true);
           
                    const {data} = await BaseApi.post('Stock/fetchInvData.php', {
                        token: appToken,
                        act:'RecevedTR',
                        userID:userID,
                        invID:invID,
                    
                    });
                    
                    if(data.service_header.status_tag === 'success')
                    {
                        setIslodding(false);
                        showMessage({
                            message: "Stock Received  Sucessfully ",
                            description:'',
                            duration:2000,
                            type: "success",
                            });

                            setTimeout(() => {

                                if(fromScan)
                                {
                                    navigation.navigate('Home', { });
                                }
                                else
                                {
                                    navigation.goBack();
                                }

                            }, 3000);

                            //console.log(data.spw_data);
                              
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIslodding(false);
                        showMessage({
                        message: "Stock Received  Unsucessfully ",
                        description:'',
                        duration:2000,
                        type: "danger",
                        });
                    }
                    
                   // fetchInvData();

            
            

           
          
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
       
       
  
       }

      

     const DeleteRequest = async (ID) =>{
        const userID =  await AsyncStorage.getItem('userID');
        setIslodding(true);
        try 
        {
            
                const {data} = await BaseApi.post('Stock/fetchInvData.php', {
                    token: appToken,
                    act:'DenyTransferRequest',
                    userID:userID,
                    invID:ID,
                });

                if(data.service_header.status_tag === 'success')
                {
                    setIslodding(false);
                    showMessage({
                        message: "Delete Sucessfully ",
                        description:ID,
                        duration:2000,
                        type: "success",
                        });

                        
                        setTimeout(() => {
                                        
                            if(fromScan)
                            {
                                navigation.navigate('Home', { });
                            }
                            else
                            {
                                navigation.goBack();
                            }

                        }, 2500);

                    
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    setIslodding(false);
                    showMessage({
                    message: "Delete Unsucessfully ",
                    description:ID,
                    duration:2000,
                    type: "danger",
                    });
                }

            

           
          
        } 
        catch (error) 
        {
            console.log(error);
            setIslodding(false);
        }
       // fetchInvData();
  
     }

      

   

    function renderHeader() {

        return (
    
    
    
    
          <LinearGradient
            colors={['#6245ff', '#7b62f2']}
            style={{ width: "100%", height: verticalScale(31), justifyContent: 'flex-end',borderRadius:scale(8) }}
          >
            
            <View
              style={{
                width:'100%',
                //height:verticalScale(34),
                 flexDirection:'row',
                 justifyContent:'space-between',
                 paddingLeft:moderateScale(8),
                 paddingRight:moderateScale(8),
                 paddingBottom:verticalScale(2)
              }}
            >
                <View 
                  style={{
                        flexDirection:'row',
                        alignItems:'center'
                  }}
                >
        
                        <TouchableOpacity
                                     onPress={() => navigation.goBack()}
                                   >
                                       <Ionicons name="arrow-back" size={scale(24)} color='#fff' style={{ marginRight:moderateScale(14), marginTop:verticalScale(4) }}  />
                        </TouchableOpacity> 
    
                </View>
                <View 
                  style={{
                        flexDirection:'row', 
                        alignItems:'center'
                  }}
                     
                >
                  
                        <View 
                            style={{
                              marginLeft:moderateScale(8),
                              //alignItems:'center'
                          }}
                        >
                              <Text
                                  style={{
                                    fontSize:scale(11),
                                    fontWeight:'700',
                                    color:'#fff',
                                    textAlign:'right'
                                }}
                              >
                           
                                 {invBasicData.InvoiceType == 'REQUEST' ? 'Stock Request Verify' : 'Stock Transfer Verify'}
                              </Text>
                              <Text
                                  style={{
                                    fontSize:scale(10),
                                    fontWeight:'500',
                                    textAlign:'left',
                                    color: COLORS.yellow,
                                  textAlign:'right'
                                }}
                              >
                               
                               {invBasicData.requestType} {invBasicData.tranaferType}
                               </Text>
                              
                        </View>
                            
    
                      
                       
    
    
                </View>  
    
    
            </View>
    
    
    
          </LinearGradient>
    
        );
      }
   


    const rendertop = () => {


            

          return(
             
             <>
                   <View
                       style={{ 
                             marginTop:verticalScale(7),
                             paddingHorizontal: moderateScale(8),
                             marginBottom:verticalScale(1),
                             paddingVertical:verticalScale(4)
                            
                           }}  
                       
                   >
                               <View style={{ 
                                   flexDirection: 'row',
                                   justifyContent: 'space-between',
                                   paddingHorizontal: moderateScale(1),
                                   backgroundColor: invBasicData.InvoiceType == 'TRANSFER' ? "#B2DFDB" : '#FFCCBC',
                                   shadowOffset: { width: 0,height: 0.7,},
                                   shadowOpacity: 0.39,
                                   shadowRadius: 1.49,
                                   elevation: 3,
                                   borderRadius:scale(3),
                                   paddingVertical:verticalScale(2)
                                  
                                   
   
                               }}> 




                                   <View style={{ flex: 7,marginTop:verticalScale(3),paddingHorizontal:moderateScale(4) }}>

                                   <View 
                                      style={{ 
                                          flexDirection: 'row',justifyContent: 'space-between',
                                          paddingLeft:moderateScale(3),
                                          marginTop:verticalScale(0)
                                          //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                                      }}
                                    >
                                          
                                          <View
                                                style={{flex:12,}}
                                          >
                                                <View style={{ flexDirection: 'row',justifyContent:'center'}}>
                                                        <Text style={{ fontSize:scale(9),fontWeight:'600', color: "#E91E63" }}>  {invBasicData.requestTo} </Text>
                                                        <Entypo name="arrow-right" size={scale(14)}  style={{  color: "#9C27B0", }} />
                                                        <Text style={{ fontSize:scale(9),fontWeight:'600', color: "#1B5E20", }}> {invBasicData.requestFrom}  </Text>
                                                      
                                              </View> 

                                              <View style={{ flexDirection: 'row',justifyContent: 'center',}}>
                                                    <Text style={{ fontSize:scale(8), color: "#4E342E",textAlign:'left',marginTop:verticalScale(-1) }}> {transID} </Text>

                                              </View>
                                                
                                          </View>
                                    
                                      
                                  </View> 

                                  <View 
                                      style={{ 
                                          flexDirection: 'row',justifyContent: 'space-between',
                                          marginTop:verticalScale(1)
                                          //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                                      }}
                                  >
                                                  <View
                                                      style={{borderColor:'#E0E0E0',flex:4,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:1}}
                                                  >
                                                      <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Product</Text>
                                                      <Text style={{fontSize:scale(9), color: '#009688',marginTop:verticalScale(-1.5) }}>{invBasicData.prdName}</Text>

                                                  </View>
                                                  <View
                                                      style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderRightWidth:0,borderTopWidth:1}}
                                                  >
                                                      <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Quantity</Text>
                                                      <Text style={{fontSize:scale(10), color: '#E91E63',marginTop:verticalScale(-1.5) }}>{invBasicData.requestQty}</Text>

                                                  </View>

                                  </View>  
                                  
                             

                                  <View 
                                      style={{ 
                                          flexDirection: 'row',justifyContent: 'space-between',
                                       
                                      }}
                                      >
                                              <View
                                                  style={{borderColor:'#E0E0E0',flex:1,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2)}}
                                              >
                                                  <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Request Time</Text>
                                                  <Text style={{fontSize:scale(10), color: '#3F51B5',marginTop:verticalScale(-1.5) }}>{invBasicData.time}</Text>

                                              </View>
                                              <View
                                                  style={{borderColor:'#E0E0E0',flex:1,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderLeftWidth:1}}
                                              >
                                                  <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Request By</Text>
                                                  <Text style={{fontSize:scale(10), color: '#3F51B5',marginTop:verticalScale(-1.5) }}>{invBasicData.requestBy}</Text>

                                              </View>
                                              <View
                                                  style={{borderColor:'#E0E0E0',flex:1,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderLeftWidth:1}}
                                              >
                                                  <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Carrier</Text>
                                                  <Text style={{fontSize:scale(10), color: '#795548',marginTop:verticalScale(-1.5) }}>{invBasicData.CarrierName}</Text>

                                              </View>

                                            

                                  </View>

                                  <View 
                                      style={{ 
                                          flexDirection: 'row',justifyContent: 'space-between',
                                          display:invBasicData.InvoiceType == 'TRANSFER' ? "flex" : "none"
                                      }}
                                      >
                                              <View
                                                  style={{borderColor:'#E0E0E0',flex:2,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderTopWidth:1}}
                                              >
                                                  <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Tranfer Time</Text>
                                                  <Text style={{fontSize:scale(9), color: '#006064',marginTop:verticalScale(-1.5) }}>{invBasicData.t_time}</Text>

                                              </View>
                                              <View
                                                  style={{borderColor:'#E0E0E0',flex:1,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderLeftWidth:1,borderTopWidth:1}}
                                              >
                                                  <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Transfer By</Text>
                                                  <Text style={{fontSize:scale(9), color: '#006064',marginTop:verticalScale(-1.5) }}>{invBasicData.TranferBy}</Text>

                                              </View>
                                              

                                            

                                  </View>
                                   
                                       
                                       
                                   </View>

                                   
                                   
                                   
                               </View> 
                               
                              

                               
                   </View>
                   
             </>    
             
               
                 

      
            );
      }

     


     
     function renderProduct (){

        return(
                    <View
                     
                        style={{ 
                            
                            shadowOffset: { width: 1,height: 1,},
                            shadowOpacity: 0.47,
                            shadowRadius: 1.0,
                            elevation: 3,
                            borderRadius:4,
                            backgroundColor:COLORS.white,
                            marginBottom:verticalScale(5),
                            paddingHorizontal: moderateScale(8) ,
                            paddingVertical:verticalScale(6) ,
                            marginHorizontal:moderateScale(2),
                            flexDirection: 'row',
                            justifyContent: 'space-between',  
                        
                            

                            }}  
                        
                    >


                    
                                    
                                    <View style={{ flex: scale(18)   ,marginRight:moderateScale(1),  }}> 
                                        <View style={{marginBottom:verticalScale(2),paddingVertical:0}}>
                                            <View
                                                style={{flexDirection: 'row',
                                                justifyContent: 'center',
                                                paddingVertical:verticalScale(6),
                                                
                                                }}
                                            >
                                                <Text style={{  fontSize:scale(13),color: '#E91E63',paddingTop:verticalScale(2), }}>	{invBasicData.prdName} </Text>
                                                   
                                            

                                            </View>
                                        
                                            
                                        

                                    </View>
                                    <View style={{marginBottom:2.5}}>
                                            <View
                                                style={{flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                display:invBasicData.InvoiceType == 'REQUEST' ? "flex" : "none"
                                                
                                                
                                                }} 
                                            >
                                                <Text style={{  fontSize:scale(13),fontWeight:'500',color: '#78909C',flex:3,paddingLeft:moderateScale(4),paddingVertical:verticalScale(2) }}>AVAILABLE QUANTITY</Text>
                                                
                                               
                                                <Text style={{fontSize:scale(15),fontWeight:'700',color: '#78909C',textAlign:'right',}}>{invBasicData.ava_stock}</Text> 
                                    

                                            </View>
                                        
                                    </View>
                                    <View style={{marginBottom:2.5}}>
                                            <View
                                                style={{flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                
                                                
                                                }}
                                            >
                                                <Text style={{  fontSize:scale(13),fontWeight:'500',color: '#795548',flex:3,paddingLeft:moderateScale(4),paddingVertical:verticalScale(2) }}>REQUEST QUANTITY</Text>
                                                <Text style={{fontSize:scale(15),fontWeight:'700',color: '#795548',textAlign:'right',}}>{invBasicData.requestQty}</Text> 
                                              

                                            </View>
                                        
                                    </View>
                         
                                    <View style={{marginBottom:0.5}}>
                                            <View
                                                style={{flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                display:invBasicData.InvoiceType == 'REQUEST' ? "flex" : "none"
                                                
                                                
                                                }}
                                            >
                                                <Text style={{  fontSize:scale(13),fontWeight:'500',color: '#00897B',flex:5,paddingLeft:moderateScale(4),paddingVertical:verticalScale(2) }}>DELIVERY QUANTITY</Text>
                                                <ActivityIndicator animating={false} size={"small"} color={"#E53935"}  style={{ flex: 1 }}  />
                                                <TouchableOpacity 
                                                    onPress={() => OpenInputModal('QUANTITY')}
                                                    style={{  
                                                        borderRadius:4,backgroundColor:'#00897B',flex:2,paddingRight:6,paddingVertical:1.5 }}
                                                >
                                                <Text style={{fontSize:16,fontWeight:'600',color: '#fff',textAlign:'right',}}>{dqty}</Text> 
                                                </TouchableOpacity>

                                            </View>
                                        
                                    </View>

                                
                                        
                                        
                                    </View> 
                                    
                                    
                                    
                                
                                
                    </View>

        )

     }

     function note()
     {
        return(
            <View  style={{  marginTop:verticalScale(1),paddingHorizontal:moderateScale(2), marginBottom:verticalScale(2) }  }>   

            <View
                 style={{ 
             
                    shadowOffset: { width: 0,height: 1,},
                    shadowOpacity: 0.47,
                    shadowRadius: 1.0,
                    elevation: 3,
                    borderRadius:4,
                    backgroundColor:COLORS.white,
                    paddingHorizontal: moderateVerticalScale(8),
                    paddingVertical:verticalScale(6) ,
                    display:invBasicData.note == '' || invBasicData.note == null ? 'none' : 'flex'
                    }} 
               
                
            >



                   <View style={{ 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                    }}>
                            <View
                                        style={{
                                            flex: 3,
                                            marginRight:moderateScale(4),
                                            marginTop:verticalScale(-3)
                                            
                                        }}
                            >

                                                   <Text
                                                      style={{
                                                          color:'#757575',
                                                          fontSize:scale(10),
                                                          marginBottom:verticalScale(-7),
                                                          marginLeft:moderateScale(2)
                                                      }}
                                                    
                                                  >
                                                    Note
                                                  </Text>
                                                <TextInput
                                                      style={{
                                                          marginVertical: SIZES.padding,
                                                          color: '#FFF',
                                                          fontSize:scale(12),
                                                          paddingLeft:moderateScale(9),
                                                          backgroundColor:'#A1887F',
                                                        paddingVertical:verticalScale(1),
                                                        borderRadius:2,
                                                        height:scale(32), 
                                                        
                                                      }}
                                                      autoCapitalize="none"
                                                      autoCorrect={false}
                                                      placeholder="Note"
                                                      placeholderTextColor='#9E9E9E'
                                                      selectionColor={COLORS.white}
                                                      value={invBasicData.note}
                                                      editable={false}
                                                      multiline={true}
                                                  
                                                      
                                                  />
                                            

                            </View>

                            
                            

                                       




                    </View>
                   
                   

                    

                    



            </View>
             
               
            </View>        

      
            );
     }

     function renderEaditableSection (){

        return(
            <View  style={{  marginTop:verticalScale(1),paddingHorizontal:moderateScale(2), marginBottom:verticalScale(2), }  }>   

            <View
                 style={{ 
             
                    shadowOffset: { width: 0,height: 1,},
                    shadowOpacity: 0.47,
                    shadowRadius: 1.0,
                    elevation: 3,
                    borderRadius:6,
                    backgroundColor:COLORS.white,
                   
                    paddingHorizontal: moderateScale(8) ,
                    paddingVertical:verticalScale(4) ,
                    }}  
                
            >



                   <View style={{ 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                    }}>
                            <View
                                        style={{
                                            flex: 3,
                                            marginRight:moderateScale(3),
                                            marginTop:verticalScale(-3)
                                            
                                        }}
                            >

                                                   <Text
                                                      style={{
                                                          color:'#757575',
                                                          fontSize:scale(10),
                                                          marginBottom:verticalScale(-7),
                                                          marginLeft:moderateScale(2)
                                                      }}
                                                    
                                                  >
                                                     Date
                                                  </Text>
                                                <TextInput
                                                      style={{
                                                          marginVertical: SIZES.padding,
                                                          color: '#424242',
                                                          fontSize:scale(12),
                                                          paddingLeft:moderateScale(9),
                                                          backgroundColor:'#EEEEEE',
                                                        paddingVertical:1,
                                                        borderRadius:2,
                                                        height:verticalScale(26), 
                                                        
                                                      }}
                                                      autoCapitalize="none"
                                                      autoCorrect={false}
                                                      placeholder="Name"
                                                      placeholderTextColor='#9E9E9E'
                                                      selectionColor={COLORS.black}
                                                      value={invBasicData.curDate}
                                                      editable={false}
                                                  
                                                      
                                                  />
                                            

                            </View>

                            <View
                                        style={{
                                            flex: 3,
                                            marginTop:verticalScale(-3),
                                            display:invBasicData.InvoiceType == 'REQUEST' ? "flex" : "none"
                                        }}
                            >

                                                <Text
                                                      style={{
                                                          color:'#757575',
                                                          fontSize:scale(10),
                                                          marginBottom:verticalScale(-7),
                                                          marginLeft:moderateScale(2)
                                                      }}
                                                    
                                                  >
                                                     Carrier
                                                  </Text>
                                               

                                                       <Dropdown
                                                             style={{
                                                                marginVertical: SIZES.padding,
                                                                color: '#424242',
                                                                fontSize:scale(12),
                                                                paddingLeft:moderateScale(9),
                                                                backgroundColor:'#E1BEE7',
                                                              paddingVertical:verticalScale(1),
                                                              borderRadius:2,
                                                              height:verticalScale(26), 
                                                              
                                                            }}
                                                                //
                                                                itemTextStyle={{fontSize:scale(13),}}
                                                                itemContainerStyle={{marginVertical:verticalScale(-7),}}
                                                                //item
                                                                //placeholderStyle={styles.placeholderStyle}
                                                                //selectedTextStyle={{fontSize:11}}
                                                                //inputSearchStyle={{height: 30}}
                                                                //iconStyle={styles.iconStyle}
                                                                search
                                                                // searchPlaceholder="Search..."
                                                                // placeholder={!isFocus ? 'Select item' : '...'}
                                                                // onFocus={() => setIsFocus(true)}
                                                                // onBlur={() => setIsFocus(false)}
                                                                //onChangeText={(text) => alert(text)}
                                                                data={usercombo}
                                                                maxHeight={verticalScale(550)}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder='Select Carrier'
                                                                value={carrier}
                                                                onChange={item => {
                                                                    setCarrier(item.value);
                                                                    // setIsFocus(false);
                                                                }}
                                                            
                                                            
                                                                
                                                            />

                            </View>

                                       




                    </View>
            

            </View>
             
               
            </View>        

      
            );
     }

     function renderInputModal ()
      {
         return(

                <Modal 
                animationType={'fade'}
                visible={isModal} 
                transparent={isModal} 
                
                >
                    <View style={{ flex: 1,backgroundColor:'#000000aa', justifyContent:'center',alignItems:'center',
                    }}
                    
                    >
                            <View 
                                style={{ 
                                    
                                    alignContent:'center',
                                    backgroundColor:'#fff',
                                    
                                    alignItems:'center',
                                    borderRadius:2,
                                    width:'90%',
                                }}
                            >
                                    
                            
                                        <View 
                                        style={{ 
                                            
                                            paddingHorizontal: moderateScale(4) ,
                                             width:'100%',
                                            alignItems: 'center',
                                            textAlign:'center',
                                            backgroundColor:'#EEEEEE'
                                            }}
                                        >
                                            
                                                
                                            <Text style={{ fontSize:scale(13),color: '#EC407A',paddingRight:moderateScale(1),paddingVertical:verticalScale(2) }}>{modalPrdName}</Text>

                                        </View>
                                    

                                    

                                        <View
                                            style={{ flexDirection: 'row',}}
                                        >


                                            <View 
                                                    style={{ 
                                                        
                                                        //paddingHorizontal: SIZES.padding * 1 ,
                                                        width:'100%',
                                                        alignItems: 'center',
                                                        justifyContent:'center',
                                                        backgroundColor:'#D1C4E9',
                                                        flex:1,
                                                        marginVertical:verticalScale(1),
                                                        }}
                                                >
                                                    
                                                        
                                                    <Text style={{ fontSize:scale(18),fontWeight:'500',color: '#b380ff',textAlign:'right',}}>QUANTITY</Text>

                                                </View>
                                                <View 
                                                    style={{ 
                                                        
                                                    
                                                    
                                                        backgroundColor: '#e6b3b3',
                                                        alignItems: 'center',
                                                        textAlign:'center',
                                                        flex:1,
                                                        marginVertical:verticalScale(1),

                                                        }}
                                                    >
                                                        
                                                            
                                                            <TextInput
                                                                style={{
                                                                    
                                                                    color: COLORS.white,
                                                                    fontSize:scale(30),
                                                                    fontWeight:'500',  
                                                                }}
                                                                autoCapitalize='none'
                                                                autoCorrect={false}
                                                                placeholder='0'
                                                                placeholderTextColor={COLORS.lightGray}
                                                                selectionColor={COLORS.white}
                                                                value={modalValue}
                                                                autoFocus={true}
                                                                onChangeText={(text) => setModalValue(text)}
                                                                keyboardType="numeric"
                                                            />

                                                    
                                                    </View>


                                        </View>

                                        <View
                                            style={{ flexDirection: 'row',}}
                                        >
                                            <TouchableOpacity
                                                            style={{
                                                                flex:1,
                                                                paddingVertical:verticalScale(5),
                                                                backgroundColor: 'red',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            flexDirection:'row',
                                                            marginRight:moderateScale(1),
                                                            }}
                                                            onPress={() =>  setIsModal(false)}
                                                        >
                                                            
                                                            
                                                    
                                                            <Ionicons name="close-circle"  size={scale(17)} color="white" style={{marginRight:moderateScale(5)}} />
                                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Close</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                            style={{
                                                                flex:1,
                                                            
                                                                backgroundColor: COLORS.primary,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                borderRadius: 1,
                                                                flexDirection:'row',
                                                                paddingVertical:verticalScale(5),
                                                            
                                                            
                                                            }}
                                                            onPress={() => SetValue(modalRqstID,m_type)}
                                                        >
                                                            
                                                            <MaterialIcons name="published-with-changes" size={scale(18)} color="white" style={{marginRight:moderateScale(5)}}  />
                                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>DONE</Text>
                                                </TouchableOpacity>
                                                

                                        </View>
                                            

                                </View>
                                        
                            

                    </View>         
                </Modal>

         );

      }

      function renderActionButton()
      {
            return(

                

                        <View style={{ 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: moderateScale(6) ,
                            marginVertical:verticalScale(4),
                            marginTop:verticalScale(5)

                        }}>

                                            <TouchableOpacity
                                                style={{
                                                    flex: 2,
                                                    height: verticalScale(30),
                                                    backgroundColor: '#C62828',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 4,
                                                    flexDirection: 'row',
                                                    marginRight:moderateScale(1),
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                    display:invBasicData.InvoiceType == 'REQUEST' ? "flex" : "none"
                                                }}
                                                onPress={() => confirmChk(transID,'DELETE_REQUEST')}
                                            >
                                            
                                            <Text style={{ fontSize:scale(13), color: COLORS.white,fontWeight:'700' }}>DENY</Text>
                                            
                                                
                                                
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                style={{
                                                    flex: 4,
                                                    height: verticalScale(30),
                                                    backgroundColor: '#388E3C',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 4,
                                                    marginRight:moderateScale(2),
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                    
                                                }}
                                                onPress={() => 
                                                    {
                                                        if(invBasicData.InvoiceType == 'REQUEST')
                                                        {
                                                            confirmChk(transID,'ACCEPT_REQUEST')
                                                        }
                                                        else
                                                        {
                                                            confirmChk(transID,'RECIEVED_TRANSFER')
                                                        }
                                                        
                                                        
                                                    }
                                               }
                                            >
                                            
                                            
                                                <Text style={{ fontSize:scale(13), color: COLORS.white,fontWeight:'700' }}>{invBasicData.InvoiceType == 'REQUEST' ? "ACCEPT" : "RECEIVED"}</Text>
                                                
                                                
                                        </TouchableOpacity>
                            

                        </View>
                       

                
            )
      }
       
      function renderbody({navigation}) {
          return (
            
            
              <View style={{ flex:1, marginTop:SIZES.padding * 0.5,marginBottom:70,paddingHorizontal:6 }  }>


                    {renderProduct()}
                    {renderEaditableSection()}
                    {note()}
                    {renderActionButton()}

                         
              </View>
          );
      }

      return (  
        <>
            <SafeAreaView style={{backgroundColor: COLORS.blue}}>
            {renderHeader()}
            </SafeAreaView> 
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}  >

            <View style={{ flex: 1, backgroundColor: '#E8EAF6', }}>

                    

                    {
                        islodding ? (<Loading />) 
                        : (
                            <>
                               {rendertop()}
                              {renderbody({navigation})}
                            </>
                          
                            )
                        
                    }

                    
                    {renderInputModal()}
        
          

                
            </View> 
            </TouchableWithoutFeedback> 
        </>    
      );
}



export default StockRequestDetails;

