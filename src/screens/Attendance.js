import React,{useState,useEffect} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Circle, Callout } from 'react-native-maps'

import { COLORS, FONTS, icons, SIZES } from "../constants"
import Geolocation from 'react-native-geolocation-service';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import {getDistanceFromLatLonInKm} from '../utils/utility';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';


const Attendance = ({ navigation }) => {

    const [remarks, setRemarks] = useState("");
    const [distance, setDistance] = useState(0);
    const [currentLocation, setcurrentLocation] = useState({});

 

    const [mapRegion, setmapRegion] = useState({
        latitude: 23.73036101486009,
        longitude: 90.4074055112353,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      });


   



    const locationFetch = async () =>{


            await getCurrentLocation();
            setmapRegion({...mapRegion,latitude:currentLocation.latitude,longitude:currentLocation.longitude});
            let dis =  getDistanceFromLatLonInKm(23.73036101486009,90.4074055112353,currentLocation.latitude,currentLocation.longitude)
            setDistance(dis);  
           // alert(location.coords.latitude); 
      
    }  

    const getCurrentLocation =  () =>{
            Geolocation.getCurrentPosition(
                (position) => {
                    const {latitude,longitude} = position.coords;
                    setcurrentLocation({latitude,longitude})
                // console.log(position.coords);
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                
            ); 
        
    }


    useEffect(() => {  
        requestLocationPermission();
        let changemap =  setInterval(()=> locationFetch(),3000) ;
        return () => {
             clearInterval(changemap);
        };
    }, [mapRegion,distance,remarks]);

    const requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Cool Photo App Location Permission',
              message:
                'Cool Photo App needs access to your Location ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      };


    function renderMap() {
        

        return (
            <TouchableWithoutFeedback style={{ flex: 1 }} >
                <MapView
                    onPress={Keyboard.dismiss}
                 
                    provider={PROVIDER_GOOGLE}
                    initialRegion={mapRegion}
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                >
                    
            
                    <Marker
                        coordinate={{ latitude : 23.73036101486009 , longitude : 90.4074055112353 }}
                        pinColor={'black'}
                       
                    >
                         <Callout>
                            <Text>BHUIYA</Text>
                        </Callout>
                    </Marker>    

                    <Circle
                        center={{ latitude : 23.73036101486009 , longitude : 90.4074055112353 }}
                        radius={60}
                        strokeWidth={2}
                        zIndex={1}
                        fillColor={"rgba(128, 179, 255,0.3)"}
                    />
                     <Circle  
                        center={{ latitude : 23.730919894259024 , longitude : 90.4086551323361 }}
                        radius={60}
                        strokeWidth={2}
                        zIndex={1}
                        fillColor={'rgba(255, 153, 221,0.3)'}
                    />
                    
                    
                    <Marker
                        coordinate={{ latitude : 23.730919894259024 , longitude : 90.4086551323361 }}

                    >
                         <Callout>
                            <Text>SK TOWER</Text>
                        </Callout>
                         
                    </Marker>    

                </MapView>
            </TouchableWithoutFeedback>
        )
    }

 

    function renderFotter() {
         return (
                <View 
                    
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 200,
                        padding: SIZES.padding * 2,
                        borderTopLeftRadius: SIZES.radius,
                        borderTopRightRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                        <View
                            style={{
                                width: SIZES.width * 0.9,
                                marginTop:-5
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                

                                <View style={{ flex: 1, marginLeft: SIZES.padding }}>
                                   
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...FONTS.h4 }}>SK Tower</Text>
                                        <View >
                                            <Text style={{ ...FONTS.body4 }}>
                                               <Text style={{ color:'red'}}> {distance.toFixed(2)} </Text> Meters Far
                                            </Text>
                                        </View>
                                    </View>

                                  
                                  
                                    
                                </View>
                            </View>

                            {/* Buttons */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    justifyContent: 'space-between'
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        height: 45,
                                        marginRight: 10,
                                        backgroundColor: COLORS.primary,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                        flexDirection: 'row',
                                    }}
                                    onPress={() => navigation.navigate("Home")}
                                >
                                   
                                    <SimpleLineIcons name="login" size={20} color="white" style={{marginRight:5}} />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>IN</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        height: 45,
                                        backgroundColor: COLORS.secondary,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                        flexDirection: 'row',
                                    }}
                                    onPress={() => navigation.goBack()}
                                >
                                    <SimpleLineIcons name="logout" size={20} color="white" style={{marginRight:5}} />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>OUT</Text>
                                </TouchableOpacity>
                              


                            </View>
                            <TextInput
                                    style={{
                                        marginTop: 10,
                                        borderStartWidth:1,
                                        borderBottomWidth:1,
                                        borderTopWidth:1,
                                        borderEndWidth:1,
                                        height: 80,
                                        paddingLeft:5
                                    }}
                                    multiline={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder="Remarks...."
                                    placeholderTextColor={COLORS.black}
                                    selectionColor={COLORS.white}
                                    value={remarks}
                                    onChangeText={(text) => setRemarks(text)}
                                />

                        </View>
                    
                </View>
         )  
    }

    function renderBackButton() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 10,
                }}
            >
                {/* Zoom In */}
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                
            </View>

        )
    }

    

    function renderButtons() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: SIZES.height * 0.35,
                    right: SIZES.padding * 2,
                    width: 60,
                    height: 130,
                    justifyContent: 'space-between'
                }}
            >
                {/* Zoom In */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => zoomIn()}
                >
                    <Text style={{ ...FONTS.body1 }}>+</Text>
                </TouchableOpacity>

                {/* Zoom Out */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => zoomOut()}
                >
                    <Text style={{ ...FONTS.body1 }}>-</Text>
                </TouchableOpacity>
            </View>

        )
    }

    return (
        <KeyboardAvoidingView
                   behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1 }} >
            <SafeAreaView  style={{ flex: 1 }}>

                    {renderMap()}
                    {/* {renderButtons()} */}
                    {renderBackButton()}
                    {renderFotter()}

                
            </SafeAreaView>
           
            
        </KeyboardAvoidingView>
    )
}



export default Attendance;