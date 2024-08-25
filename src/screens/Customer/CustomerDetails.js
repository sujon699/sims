import React,{useState,useEffect} from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList, 
    TouchableOpacity,
    ImageBackground,
    Modal,
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images,baseUrl } from "../../constants";
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import BaseApi from "../../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';
// import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";







const CustomerDetails = ({navigation, route}) => {
    

    const [transData, setTransData] = useState([]);
    const [cusBasicData, setCusBasicData] = useState([]);
    const [appToken, setappToken] = useState(''); 
    const [islodding, setIslodding] = useState(false);
    const [isloddingAction, setIsloddingAction] = useState(false);
    const [images, setImages] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [isModalTrns, setIsModalTrns] = useState(false);
    const [transLink, setTransLink] = useState('');
    const [cusC_Class, setCusC_Class] = useState(route.params?.cus_c_Class);
    const [cus_id, setCus_id] = useState(route.params?.cusID);
    const [transID, setTransID] = useState('');


    
    

    useEffect( () => {
        fetcAdData();  
        let cancel = false;
        return () => { 
            cancel = true;
        }

    }, []);

    const fetcAdData = async () =>{
         
        const token =  await AsyncStorage.getItem('token');
        setappToken(token);
        
        if(token !== null) 
        {
           setIslodding(true); 
            try 
            { 
              
               const {data} = await BaseApi.post('/CustomerLederAPI.php', {
                  token: token,
                  cusID: cus_id    
                });
                //console.log(data); 
                if(data.service_header.status_tag === 'success')
                {
                   // console.log(data);
                   setTransData(data.spw_data);
                   setCusBasicData(data.cusBasicData[0]); 
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    setTransData([]);
                    setCusBasicData([]);
                }
              
            } 
            catch (error) 
            {
                setTransData([]);
                setCusBasicData([]);
                console.log(error);
            }
            setIslodding(false);
              
        }
        else
        {
            setTransData([]);
            setCusBasicData([]);
        }
        
    }

 const SelimageView = async (ImgPaths) =>{

        if(ImgPaths.length > 0)
        {
            var imgObjects = [];

            ImgPaths.map((x) =>{

                let imgO = {
                    "url": baseUrl+x.img,
                    "props" : {

                    },
                }
                imgObjects.push(imgO);

            });

            setImages(imgObjects);
            setIsModal(true);

        } 
   } 
   
  const ShowTransection = async (invID) =>{

        var gg = baseUrl+'spwsims/api/invoiceShow.php?id='+invID;
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
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={scale(24)} color='#fff' style={{ marginRight: moderateScale(10), marginTop: verticalScale(4) }} />
            </TouchableOpacity>

                <View style={{}}>

                    <Text style={{ fontSize:scale(10),fontWeight:'600', color:'white',marginTop:2}}>Cus Ledger</Text> 
                    <TouchableOpacity style={{ backgroundColor:'#f2f2f2',borderRadius: scale(4), }} >
                        <Text style={{ fontSize:scale(11),fontWeight:'600', color:cusBasicData.CurBalance > 0 ? 'red':'green',paddingHorizontal:moderateScale(3),textAlign:'center' }}>
                        {cusBasicData.CurBalanceWithNumber}
                      
                        </Text>
                    </TouchableOpacity>
                </View>

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
                  fontSize: scale(10),
                  fontWeight: '700',
                  color: '#fff',
                  textAlign: 'right'
                }}
              >
                {route.params?.cusName}
              </Text>
              <Text
                style={{
                  fontSize: scale(9),
                  fontWeight: '500',
                  textAlign: 'left',
                  color: COLORS.yellow,
                  textAlign: 'right'
                }}
              >
                RU : {cusBasicData.rUser}
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

        //  <View style={{ width:"100%",backgroundColor:COLORS.blue,height:58 }}>
            
              
        //         <View style={{ flexDirection: 'row',justifyContent: 'space-between',marginTop:SIZES.padding * 0.5, paddingHorizontal: SIZES.padding * 1.2 }}>
        //               <View style={{ flex: 1,flexDirection: 'row', }}>
        //                   <TouchableOpacity
        //                     onPress={() => navigation.goBack()}
        //                   >
        //                       <Ionicons name="arrow-back" size={30} color="white" style={{ marginRight:8,marginTop:8 }}  />
        //                   </TouchableOpacity>   
                          

                         


        //               </View>

                      

        //               <View style={{   }}>
        //                   <Text style={{ ...FONTS.body4, color:'white',textAlign:'right' }}>{route.params?.cusName}</Text>

        //                   <View style={{flexDirection: 'row',justifyContent:'flex-end'}}>
                              
        //                       <Entypo name="triangle-down" size={22} color="white" />

        //                       <Text style={{ ...FONTS.body5,color: '#ffc34d' }}> Class :</Text> 
        //                       <Text style={{ ...FONTS.body5, color: COLORS.primary ,marginRight:4}}> {cusC_Class}</Text> 

        //                       <Text style={{ ...FONTS.body5, color: '#ffc34d' }}> RU :</Text>
        //                       <Text style={{ ...FONTS.body5, color: '#47d1d1' }}> {cusBasicData.rUser}</Text> 
                        
        //                   </View>
                          
        //               </View>
                       
                   

        //         </View>

        //  </View>   
    );
}

const renderTransit = () => {

 
  return(
        <>
            { cusBasicData.conditionTransit > 0 ?
                <View
                    style={{ 
                        borderRadius:scale(1),
                        backgroundColor:'#f2f2f2',
                        marginBottom:verticalScale(1)
                        }}  
                    
                >
                            <View style={{ 
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: moderateScale(4) ,

                            }}> 
                                <View style={{ flex: 1,flexDirection: 'row' }}>
                                    <Text style={{ fontSize:scale(11), color: "green",textAlign:'left' }}> Condition (Transit)</Text>
                                </View>
                                <View style={{  }}>
                                    <Text style={{ fontSize:scale(11), color: "green",textAlign:'right'}}> {cusBasicData.conditionTransit_NUM}</Text>
                                </View>
                            </View>   
                            
                </View>
                : <></>
                }

                { cusBasicData.digitalCashTransit > 0 ?
                    <View
                        style={{ 
                            borderRadius:scale(1),
                            backgroundColor:'#f2f2f2',
                            marginBottom:verticalScale(1)
                            }}  
                        
                    >
                                <View style={{ 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: moderateScale(4) ,
                                
                                    
                                

                                }}> 
                                    <View style={{ flex: 1,flexDirection: 'row' }}>
                                        <Text style={{ fontSize:scale(11), color: "green",textAlign:'left' }}> Digital Cash (Transit)</Text>
                                    </View>
                                    <View style={{  }}>
                                        <Text style={{ fontSize:scale(11), color: "green",textAlign:'right'}}> {cusBasicData.digitalCashTransit_NUM}</Text>
                                    </View>
                                </View>   
                                
                    </View>
                    : <></>
                }
                { cusBasicData.chequeTransit > 0 ?

                    <View
                        style={{ 
                            borderRadius:scale(1),
                            backgroundColor:'#f2f2f2',
                            marginBottom:verticalScale(1)
                            }}  
                        
                    >
                                <View style={{ 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: moderateScale(4) ,
                                    
                                    
                                

                                }}> 
                                    <View style={{ flex: 1,flexDirection: 'row' }}>
                                        <Text style={{ fontSize:scale(11), color: "green",textAlign:'left' }}> Cheque (Transit)</Text>
                                    </View>
                                    <View style={{  }}>
                                        <Text style={{ fontSize:scale(11), color: "green",textAlign:'right'}}> {cusBasicData.chequeTransit_NUM}</Text>
                                    </View>
                                </View>   
                                
                    </View>
                    : <></>
                 }
                 { cusBasicData.onlineDepositTransit > 0 ?
                    <View
                        style={{ 
                            borderRadius:scale(1),
                            backgroundColor:'#f2f2f2',
                            marginBottom:verticalScale(1)
                            }}  
                        
                    >
                                        <View style={{ 
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: moderateScale(4) ,
                                            
                                            
                                        

                                        }}> 
                                            <View style={{ flex: 1,flexDirection: 'row' }}>
                                                <Text style={{ fontSize:scale(11), color: "green",textAlign:'left' }}> Online Deposit (Transit)</Text>
                                            </View>
                                            <View style={{  }}>
                                                <Text style={{ fontSize:scale(11), color: "green",textAlign:'right'}}> {cusBasicData.onlineDepositTransit_NUM}</Text>
                                            </View>
                                        </View>   
                                        
                            </View>
                    : <></>
                 }
                 { cusBasicData.totalActualbal != cusBasicData.CurBalance ?
                    <View
                        style={{ 
                            borderRadius:scale(1),
                            backgroundColor:COLORS.gray,
                            marginBottom:verticalScale(1)
                            }}  
                        
                    >
                                <View style={{ 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: moderateScale(4) ,

                                }}> 
                                    <View style={{ flex: 1,flexDirection: 'row' }}>
                                        <Text style={{ fontSize:scale(12),fontWeight:'600', color: "#795548",textAlign:'left' }}> Total Balance :</Text>
                                    </View>
                                    <View style={{  }}>
                                        <Text style={{ fontSize:scale(12), fontWeight:'600',color: "#795548",textAlign:'right'}}> {cusBasicData.totalActualbal_NUM}</Text>
                                    </View>
                                </View>   
                                
                    </View>
                    : <></>
                 }
        </>
          
          

  );
}

const renderTransection = ({item}) => {

    if(item.t_type === "MINUS" )
    {
        var tMount = (
            <>
                <FontAwesome name="minus" size={7} color="red" style={{ marginTop:verticalScale(7) }} />
                <Text style={{ fontSize:scale(10), color: "red",textAlign:'right',  marginTop:verticalScale(4) }}> {item.t_amount}</Text>
            </>
            
        );

        var ParticularSection = (
            <>
               <TouchableOpacity onPress={() => ShowTransection(item.transID) }>
                      <Text style={{ fontSize:scale(10), color: 'red',marginRight:moderateScale(2),marginTop:verticalScale(4) }}> {item.particular}  </Text>
                </TouchableOpacity> 
            </>
                  
        )
    }
    else if(item.t_type === "ADD")
    {
        var tMount =(
            <>
                <FontAwesome name="plus" size={7} color="green" style={{ marginTop:verticalScale(7) }} />
                <Text style={{ fontSize:scale(10), color: "green",textAlign:'right',marginTop:verticalScale(4) }}> {item.t_amount}</Text>
            </>
            
        );

      
        var ParticularSection = (
            <>
               <TouchableOpacity onPress={() => ShowTransection(item.transID) }>
                      <Text style={{ fontSize:scale(10), color: 'green',marginRight:moderateScale(2),marginTop:verticalScale(3) }}> {item.particular}  </Text>
                </TouchableOpacity> 
            </>
                  
        )
    }
    else if(item.t_type === "TRANSIT")
    {
        var tMount =(
            <>
                   <FontAwesome name="stop" size={7} color="gray" style={{ marginTop:verticalScale(7) }} />
                  <Text style={{ fontSize:scale(10), color:"gray",textAlign:'right',marginTop:verticalScale(4) }}> {item.t_amount}</Text>
            </>
            
        );
        
        var ParticularSection = (
            <>
               <TouchableOpacity onPress={() => ShowTransection(item.transID) }>
                      <Text style={{ fontSize:scale(10), color: 'gray',marginRight:moderateScale(2),marginTop:verticalScale(3) }}> {item.particular}  </Text>
                </TouchableOpacity> 
            </>
                  
        )
    }

    if(item.t_img.length > 0)
    {
        var DateSection = (
            <>
            <TouchableOpacity onPress={() => SelimageView(item.t_img) }>
                <View style={{flexDirection: 'row',marginTop:verticalScale(4)}}>
                                    <Text style={{ fontSize:scale(9), color: COLORS.purple,textAlign:'left' }}> {item.t_date}  </Text>               
               </View>
               <Text style={{ fontSize:scale(8), color: COLORS.purple,marginRight:0,textAlign:'left',marginLeft:moderateScale(2) }}>{item.activityBy}</Text>
            </TouchableOpacity>  
                
            </> 
            
        )
    }
    else
    {
        var DateSection = (
            <>
            <TouchableOpacity onPress={() => SelimageView(item.t_img) }>
                <View style={{flexDirection: 'row',marginTop:0,}}>
                       <Text style={{ fontSize:scale(9), color: '#e67300', }}> {item.t_date}  </Text>                     
               </View>
               <Text style={{ fontSize:scale(8), color: '#e67300',marginRight:0,textAlign:'left',marginLeft:moderateScale(2) }}>{item.activityBy}</Text> 
            </TouchableOpacity>   
               
            </>
            
        ) 
    }
    
    
  return(

          <View
              style={{ 
                  borderRadius:scale(1),
                  backgroundColor:COLORS.white,
                  marginBottom:verticalScale(0.5),
                }}  
            
          >

                    <View style={{ 
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: moderateScale(2) ,
                        paddingVertical:verticalScale(1),
                    

                    }}> 
                        <View style={{ flex: 1,marginRight:moderateScale(5),textAlign:'left' }}>
                            
                            
                            {DateSection}

                           
                            
                        </View>
                        <View style={{ flex: 3,borderRightWidth:scale(0.5),borderColor:COLORS.lightGray,borderLeftWidth:scale(0.5),
                           borderColor:COLORS.lightGray,paddingHorizontal:moderateScale(2) }}>
                            
                            <View style={{flexDirection: 'row'}}> 
                                       {ParticularSection}   
                            </View>

                        
                            
                        </View>
                        <View 
                           style={{ flexDirection: 'row',flex: 1,
                           justifyContent:'flex-end',
                           textAlign:'right',
                           borderRightWidth:scale(0.5),
                           borderColor:COLORS.lightGray,
                           paddingHorizontal:moderateScale(6)
                           
                         }} 
                           >
                                 {tMount}
                        </View>
                        <View style={{ flexDirection: 'row',flex: 1.2,justifyContent:'flex-end',marginTop:verticalScale(3),textAlign:'right' }}>
                                <Text style={{ fontSize:scale(10), color: COLORS.purple,textAlign:'right',paddingRight:moderateScale(1) }}>{item.balance}</Text>  
                        </View>
                        
                     

                    </View>

          </View>

  );
}

const decodeHTMLEntities = async (text) =>{  
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}




function imageModal()
{
    return (

        <Modal 
                visible={isModal} 
                transparent={isModal} 
            >
                
                <TouchableOpacity
                    onPress={() => setIsModal(false)}
                    style={{top:scale(50),right:verticalScale(-12),zIndex:999999}}
                >
                    <FontAwesome name="close" size={scale(22)} color="white"  />

                </TouchableOpacity>   
                <ImageViewer imageUrls={images}/>
        </Modal>

    )
   
}

function webviewModal()
{
    return (

        <Modal 
                    visible={isModalTrns} 
                    transparent={isModalTrns} 
                    
        >
            <View style={{ flex: 1, backgroundColor: '#7b62f2' }}>

                    
                    <View style={{ flexDirection: 'row',justifyContent: 'space-between',height:scale(60) }}>

                     
                        <TouchableOpacity
                                onPress={() => setIsModalTrns(false)}
                            >
                                <FontAwesome name="window-close" size={scale(23)} color="white" style={{left:scale(4),top:46}} onPress={() => setIsModalTrns(false)} />
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

function renderbody() {
  return (
    
        
        <View style={{ flex:1, marginTop:verticalScale(2), paddingHorizontal: moderateScale(4)}  }>
                   
                  <FlatList
                           data={transData}
                           renderItem={renderTransection}
                           keyExtractor={(item) => item.sl}
                           showsVerticalScrollIndicator={false}
                           refreshing={islodding}
                           onRefresh={fetcAdData}
                         
                  /> 
        </View>
  );
}





  return (
      <>
          <SafeAreaView style={{backgroundColor: COLORS.blue}}>
            {renderHeader()}
            </SafeAreaView> 
            <View style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
               
                 {
                    islodding ? (<Loading/>) 
                    : (
                        <>
                            <View style={{  marginTop:verticalScale(2), paddingHorizontal: moderateScale(4) }}>
                                {renderTransit()}
                            </View> 
                            
                            {renderbody()}
                        </>
                        
                        )
                }
                
                   {imageModal()}
                   {webviewModal()}
                

                    
                
            </View>

      </>
      

  )
}

export default CustomerDetails;