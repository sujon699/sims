import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ScrollView
} from "react-native"
import { COLORS, SIZES, fontFamily, icons, images, baseUrl } from "../constants"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import BaseApi from "../api/BaseApi";
import Loading from "../utils/Loading";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";





function Home({ navigation }) {



  
  
      {/* 23,343 ৳   */}
  const [isbalanceStatus, setIsbalanceStatus] = useState(false);
  const [drawerbalance, setDrawerbalance] = useState('Drawer Balance');
  const [islodding, setIslodding] = useState(false)
  const [tokens, setTokens] = useState({
    tokenID: '',
    userName: '',
    userID: '',
    empID: '',
    empImg: '',
  });

  const [menuPer, setMenuPer] = useState({
    StockManagement: null,
    Distribution: null,
    MobilePurchase: null,
  });

  const fetchtoken = async () => {

    const tokenID = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('userName');
    const eimg = await AsyncStorage.getItem('empImg');
    const user_ID = await AsyncStorage.getItem('userID');
    const empid = await AsyncStorage.getItem('empID');
    const branchName = await AsyncStorage.getItem('branch');



    var newdata = {
      tokenID: tokenID,
      userName: user,
      userID: user_ID,
      empID: empid,
      empImg: eimg,
      branch : branchName

    }
    setTokens(newdata);

        try {
          var  menuList =  JSON.stringify(menuPer);
            const {data} = await BaseApi.post('/Utility/UtilityApi.php', {
                token: tokenID,
                userID: user_ID,
                act:'MenuPermission',
                menuList : menuList
            });

            if(data.service_header.status_tag === 'success')
            {
                //console.log(data.spw_data);
                setMenuPer(data.spw_data);  
                
            }
            else
            {
              //console.log(data.spw_data);
            }
            
            
        } 
        catch (error) {
            // console.log(error)  
        }




  };

  useEffect(() => {
    fetchtoken();
  }, []);



  const fetchbalance = async () => {


    const token = await AsyncStorage.getItem('token');
    const userID = await AsyncStorage.getItem('userID');

    if (token !== null) {


      try {
        setIsbalanceStatus(true);
        const { data } = await BaseApi.post('/dashboardAPI.php', {
          token: token,
          act: 'FetchDrawerbalance',
          userID: userID,
        });

        
        if(data.service_header.status_tag === 'success')  
        {
          setDrawerbalance(data.spw_data);
          setIsbalanceStatus(false);

           setTimeout(() => {
            setDrawerbalance('Drawer Balance');
          }, 4000);


        }
        else {
          await logout(navigation, data.service_header.massage);
          setIsbalanceStatus(false);
        }

      }
      catch (error) {
        setRenderPDData([]);
       // console.log(error);
       setIsbalanceStatus(false);
      }
      


    }
    else {
      setRenderPDData([]);
    
    }


    

  }
function renderHeader() {

  return (




    <LinearGradient
      colors={['#6245ff', '#7b62f2']}
      style={{ width: "100%", height: verticalScale(33), justifyContent: 'flex-end',borderRadius:scale(10),
    
         }}
    >
      
      <View
        style={{
          width:'100%',
          //height:verticalScale(34),
            flexDirection:'row',
            justifyContent:'space-between',
            paddingLeft:moderateScale(8),
            paddingRight:moderateScale(8),
            paddingBottom:verticalScale(1),
          
        }}
      >
          <TouchableOpacity 
            style={{
                  flexDirection:'row',
                  alignItems:'center',
            }}
            onPress={() => 
              {
                  navigation.navigate('ProfileScreen', {  })
              }
            }

          >
                
                  <View style={{borderColor:'#fff',borderWidth:1,borderRadius: 20,}}>
                  <ImageBackground
                    // source={require('../../assets/images/user-profile.jpg')}
                    source={{uri:baseUrl+tokens.empImg}}
                    style={{width: scale(28), height: scale(28),}}
                    imageStyle={{borderRadius: 20}} 
                    
                    
                  />

                  </View>
                
                  <View 
                      style={{
                        marginLeft:moderateScale(6),
                        //alignItems:'center'
                    }}
                  >
                    
                        <Text
                            style={{
                              fontSize:scale(12),
                              //fontWeight:'700',
                              color:'#fff',
                              fontFamily:'Roboto-Bold',
                              alignItems:'center'

                          }}
                        >
                          {tokens.userName.toLocaleUpperCase()}
                        </Text>
                        <Text
                            style={{
                              fontSize:scale(9),
                              fontWeight:'600',
                              textAlign:'left',
                              color: COLORS.yellow,
                              marginTop:verticalScale(-1),
                          }}
                        >
                          
                            {tokens.branch} <Text style={{color:'#fff'}}></Text>
                        </Text>
                  </View>



              

          </TouchableOpacity>
          <View 
            style={{
                  flexDirection:'row',
                  alignItems:'center'
            }}
                
          >
            
                 
                  <View style={{}}>


                        <TouchableOpacity style={{ backgroundColor:'#f2f2f2',borderRadius: scale(6),flexDirection:'row' }}
                              onPress={() => fetchbalance() }
                          >
                            
                              {
                                  isbalanceStatus ? (<ActivityIndicator animating={isbalanceStatus} size="large" color={"black"}   />) 
                                  : 
                                  (<>
                                    {/* {!isbalanceStatus ? (<MaterialCommunityIcons name="gesture-double-tap" size={scale(17)} color="red" />  ) : null} */}
                                  <Text style={{ fontSize:scale(10),fontWeight:'600', color: 'red',
                                    paddingHorizontal:moderateScale(6),paddingVertical:verticalScale(2),textAlign:'center',fontFamily:'Roboto-Bold' }}>
                                      {drawerbalance}
                                    </Text>
                                   </> 
                                  )
                              }
                            
                        </TouchableOpacity>
                       
                    </View>

                
                  


          </View>  


      </View>



    </LinearGradient>

  );
}

const OptionItem = ({ bgColor, icon, label, onPress }) => {
    return (
      <>
        <TouchableOpacity
            style={{ flex: 1,alignItems:'center' }}
            onPress={onPress}
        >
            <View style={{
                      shadowOffset: {
                        width: 1,
                        height: 1,
                      },
                      elevation: 3,
                      shadowOpacity: 0.20,
                      shadowRadius: 0.5,
                      width: scale(50), height: scale(50)
                    }}
            >
                <LinearGradient
                    style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: scale(6), backgroundColor: 'red' }]}
                    colors= {['#6245ff', '#7b62f2']}
                  
                >
                    <Image
                        source={icon}
                        resizeMode="cover"
                        style={{
                            tintColor: COLORS.white,
                            width: scale(26),
                            height: scale(26),
                        }}
                    />
                </LinearGradient>
            </View>
            <Text style={{ marginTop: verticalScale(3), color: '#424242', fontSize:scale(10),...fontFamily.roboto_bold }}>{label}</Text>
        </TouchableOpacity>
        </>
    )
}



const rendertop = () => {

  return (
      <View style={{ marginTop: verticalScale(4), width:'97%',alignSelf:'center',height:verticalScale(150) }}>

          <View
              style={{
                  borderRadius: scale(6),
                  backgroundColor: COLORS.white,
                  padding:scale(2)

              }}

          >
              <Image
                   // source={images.banner}
                    source={require('../../assets/images/banner.jpg')}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        //borderRadius: scale(5),
                    }}
                />

          </View>
      </View>


  );
}

function Options()
{
    return(
      <>

     <View style={{ width: '97%', alignSelf: 'center', marginTop: verticalScale(12) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: scale(2) }}>

             

                          <OptionItem
                              icon={icons.carrier}
                              bgColor={['#ffc465', '#ff9c5f']}
                              label="Carrier"
                              onPress={() => { console.log("Hotel") }}
                          />
                          <OptionItem
                              icon={icons.fund_transfer}
                              bgColor={['#7cf1fb', '#4ebefd']}
                              label="Fund Transfer"
                              onPress={() => { console.log("Eats") }}
                          />
                          <OptionItem
                              icon={icons.point}
                              bgColor={['#7be993', '#46caaf']}
                              label="Point"
                              onPress={() => { console.log("Adventure") }}
                          />
                           <OptionItem
                              icon={icons.transection}
                              bgColor={['#fca397', '#fc7b6c']}
                              label="Transection"
                              onPress={() => { console.log("Event") }}
                          />




        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: scale(2),marginTop:verticalScale(8) }}>

             

                          <OptionItem
                              icon={icons.attendance}
                              bgColor={['#ffc465', '#ff9c5f']}
                              label="Attendance"
                              onPress={() => { console.log("Hotel") }}
                          />
                           <OptionItem
                              icon={icons.bell}
                              bgColor={['#7cf1fb', '#4ebefd']}
                              label="Notification"
                              onPress={() => { console.log("Eats") }}
                          />
                          <OptionItem
                              icon={icons.alarm}
                              bgColor={['#7be993', '#46caaf']}
                              label="Reminder"
                              onPress={() => { console.log("Adventure") }}
                          />
                         
                          <OptionItem
                              icon={icons.user}
                              bgColor={['#fca397', '#fc7b6c']}
                              label="Profile"
                              onPress={() => 
                                {
                                    navigation.navigate('ProfileScreen', {  })
                                }
                              }
                          />




        </View>
      </View>      
      
          
        </>
    )
}

function renderMenu() {


  return (
    <>
      <View style={{ width: '90%', alignSelf: 'center', marginTop: verticalScale(8) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: scale(10) }}>

          <TouchableOpacity
            style={{

              flex: 1,
              borderRadius: scale(5),
              backgroundColor: COLORS.white,
              justifyContent: 'center',
              alignItems: 'center',
              shadowOffset: {
                width: 0,
                height: 0.8,
              },
              elevation: 3,
              shadowOpacity: 0.20,
              shadowRadius: 2.49,
              padding: scale(4),
              height: scale(120)



            }}
           
            onPress={() =>{
                    
              if(menuPer.Distribution != 'none')
              {
                navigation.navigate('DistriBution', {
                  // cusName: item.cusName,
                  // cusID: item.cusID,
                  // cus_c_Class: item.c_class,
                })
              }

            }       
            }

            

            
            
          >



            <ImageBackground
                // source={require('../../assets/images/user-profile.jpg')}
                source={icons.distribution_color}
                style={{width: scale(45), height: scale(45),}}
              />
            <View style={{ textAlign: 'center',marginTop:verticalScale(5) }}>
                
                       

                  
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center',fontFamily:'Matemasie-Regular' }}>DISTRIBUTION</Text>
              <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#E91E63', textAlign: 'center',fontFamily:'Roboto-Bold' }}>Products</Text>

            </View>



          </TouchableOpacity>


          <TouchableOpacity
            style={{


              flex: 1,
              borderRadius: scale(5),
              backgroundColor: COLORS.white,
              justifyContent: 'center',
              alignItems: 'center',
              shadowOffset: {
                width: 0,
                height: 0.8,
              },
              elevation: 3,
              shadowOpacity: 0.20,
              shadowRadius: 2.49,
              padding: scale(4),
              height: scale(120)



            }}
            onPress={() =>{
              
              if(menuPer.MobilePurchase != 'none')
              {
                navigation.navigate('MobilePurchaseDashboard', {
                  // cusName: item.cusName,
                  // cusID: item.cusID,
                  // cus_c_Class: item.c_class,
                })

              }
              

            }

            }
          >




                <ImageBackground
                      // source={require('../../assets/images/user-profile.jpg')}
                      source={icons.mobile_purchase_color}
                      style={{width: scale(45), height: scale(45),}}
                    />
                  <View style={{ textAlign: 'center',marginTop:verticalScale(5) }}>
                      
                            

                        
                    <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center',fontFamily:'Matemasie-Regular' }}>MOBILE PURCHASE</Text>
                    <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#E91E63', textAlign: 'center',fontFamily:'Roboto-Bold' }}>For Sales</Text>

                  </View>
                  
          </TouchableOpacity>


        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: scale(10),marginTop:verticalScale(9) }}>

            <TouchableOpacity
              style={{

                flex: 1,
                borderRadius: scale(5),
                backgroundColor: COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 0.8,
                },
                elevation: 3,
                shadowOpacity: 0.20,
                shadowRadius: 2.49,
                padding: scale(4),
                height: scale(120)



              }}
              onPress={() =>
                navigation.navigate('Permissiontab', {
                  // cusName: item.cusName,
                  // cusID: item.cusID,
                  // cus_c_Class: item.c_class,
                })
              }
  
              
            >



                  <ImageBackground
                      // source={require('../../assets/images/user-profile.jpg')}
                      source={icons.unlocked_color}
                      style={{width: scale(45), height: scale(45),}}
                    />
                  <View style={{ textAlign: 'center',marginTop:verticalScale(5) }}>
                    <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#424242', textAlign: 'center',fontFamily:'Matemasie-Regular' }}>PERMISSION</Text>
                    <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#E91E63', textAlign: 'center',fontFamily:'Roboto-Bold' }}>Otp,Ad-limit</Text>

                  </View>
             

            </TouchableOpacity>


            <TouchableOpacity
              style={{


                flex: 1,
                borderRadius: scale(5),
                backgroundColor:  COLORS.white,
                justifyContent: 'center',
                alignItems: 'center',
                shadowOffset: {
                  width: 0,
                  height: 0.8,
                },
                elevation: 3,
                shadowOpacity: 0.20,
                shadowRadius: 2.49,
                padding: scale(4),
                height: scale(120)



              }}
              onPress={() =>{

                if(menuPer.StockManagement != 'none')
               {
                  navigation.navigate('StockDashboard', {
                    // cusName: item.cusName,
                    // cusID: item.cusID,
                    // cus_c_Class: item.c_class,
                  }) 

               }
                
              }
              }
            >


                  <ImageBackground
                      // source={require('../../assets/images/user-profile.jpg')}
                      source={icons.stock_color}
                      style={{width: scale(45), height: scale(45),}}
                    />
                  <View style={{ textAlign: 'center',marginTop:verticalScale(5) }}>
                      
                            

                        
                    <Text style={{ fontSize: scale(9), fontWeight: "600", color: '#424242', textAlign: 'center',fontFamily:'Matemasie-Regular' }}>STOCK MANAGEMNT</Text>
                    <Text style={{ fontSize: scale(10), fontWeight: "600", color: '#E91E63', textAlign: 'center',fontFamily:'Roboto-Bold' }}>Products</Text>

                  </View>
                  

              
            </TouchableOpacity>


        </View>


      </View>
    </>
  )


}







  return (
    <>
    
    
        <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
                  {renderHeader()}
        </SafeAreaView> 
      
          <ScrollView style={{ flex: 1, backgroundColor: '#F3E5F5', }}>

              {rendertop()}

              {
                  islodding ? (<Loading />)
                      : 
                      <>
                      
                        {renderMenu()}
                        {Options() }

                      </>
                    

              }

          


          </ScrollView>
      

     

    </>

  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: COLORS.white
  },
  shadow: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
  }
});