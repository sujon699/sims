import React,{useState,useEffect} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Button, 
    Linking
} from "react-native"
// import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { COLORS, FONTS, SIZES, icons, images } from "../constants";

const ScanInterface = ({ navigation }) => {
   // const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanInterface, setScanInterface] = useState(true);


  
    useEffect(() => {

        requestCameraPermission();
      const timer = setTimeout(() => {
        setScanned(true) ;
         setScanInterface(false);
      }, 20000);

      return () =>{
        clearTimeout(timer);
      } 

    }, [scanInterface]);

    // const devices = useCameraDevice();
    // const device = devices.back;
     const device = useCameraDevice('back');

    const requestCameraPermission = async () => {
       const permission  = await Camera.requestCameraPermission();

       if(permission === 'denied')
       {
        console.log('kk'); 
         // await Linking.openSettings();
       }
    }  
  
  
    
    
    // if (permission === 'denied') {
    //     return (
    //                 <View style={{flex: 1,
    //                     justifyContent: 'center',}}>
    //                     <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
    //                     <Button onPress={requestCameraPermission} title="grant permission" />
    //                 </View>
    //     )
    // }

    const codeScanner = useCodeScanner({
        // codeTypes: ['upc-a'], // <-- ✅ We configure for 'upc-a' types
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
          for (const code of codes) {
           // console.log(code.type); // <-- ❌ On iOS, we receive 'ean-13'
            //alert( code.value) ;
             onBarCodeRead(code.value);
          }
        }
    })
  

    function renderScanFocus() {
        return (
            <View
                style={{
                    
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={images.focus}
                    resizeMode="stretch"
                    style={{
                        marginTop: "-210%",
                        width: 350,
                        height: 350
                    }}
                />
            </View>
        )
    }

    function renderButton() {
        if(!scanned)
        {
            return <View></View>
        }
        else
        {
            return (
                
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 120,
                        padding: SIZES.padding * 3,
                        borderTopLeftRadius: SIZES.radius,
                        borderTopRightRadius: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                >
                      
                        <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        height: 30,
                                        marginRight:1,
                                        backgroundColor: '#79d279',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        flexDirection: 'row',
                                    }}
                                    onPress={() =>{ setScanned(false) ; setScanInterface(true);  } }
                                >
                                    
                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Scan Again</Text>
                        </TouchableOpacity>

                </View>
            )

        }
        
    }

  
    const onBarCodeRead = async (data) => {
        //console.log(data);
        setScanned(true);

        var str = data.split("=");

        if(str[1] === undefined)
        {
           alert('Invalid Qr Code ');
           return false;
        }


        str = str[1];
        var str = str.split("&");
        var ID = str[0];
        var ref = str[1];
      
        if(ref === undefined)
        {
           alert('Invalid Qr Code ');
           return false;
        }
        var str = ref.split("~");
        ref = str[0];

        
      

        if(ref == 'STOCK_REQUEST')
        {
            setScanInterface(false);  
            navigation.navigate('StockRequestDetails', {
                TransID: ID, 
                user_id:str[1],
                fromScan:true,
            })
 
        }
        else if(ref == 'Forcheck')
        {
            
            setScanInterface(false);  
            navigation.navigate('InvForDeliver', {
                InvID: ID,
                Forcheck : 1 
            }) 

        }
        else
        {
            setScanInterface(false);  
            navigation.navigate('InvForDeliver', {
                InvID: ID,
                Forcheck : 0 
            }) 

        }


            //setScanned(false);    
            
        //alert(data);
      };

    //   const handleBarCodeScanned = ({ type, data }) => {
    //     setScanned(true);
    //     (async () => {
    //       try {
    //         const response = await axios.post(`http://${localIP}:5000/api/qr/scanQr`, { data })
    //         const { message } = response.data;
    //         // automatically restoring scanned to keep the ball rolling on the onBarCodeScanned callback
    //         setScanned(false);
    //       } catch (e) {
    //         alert("ERR : ", e);
    //       }
    //     })();
    //   };

      
 
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.transparent }}>
            {
                scanInterface ?  (<Camera
                device={device}
                isActive={true}
                enableZoomGesture
                codeScanner={codeScanner}
                style={{ flex: 1 }}
               // onBarcodeScanned={scanned ? undefined : onBarCodeRead}
                />) : <View style={{ flex: 1 }}></View>
            }
           
             
                 {renderScanFocus()}
                 {renderButton()}
          
        </View>
    )
}

export default ScanInterface;