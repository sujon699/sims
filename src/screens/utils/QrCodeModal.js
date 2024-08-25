import React,{useState,useEffect} from "react";
import {
    View, 
    StyleSheet,
    ActivityIndicator,
    Platform,
    Modal,
    TouchableOpacity,
    Text
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { Feather } from '@expo/vector-icons'; 
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";
import QRCode from 'react-native-qrcode-svg';




export default function QrCodeModal ({qrtitle,modalstatus,setModalstatus,qrvalue,color,size}) {
    return (
                <Modal 
                            //animationType={'fade'}
                            visible={modalstatus} 
                            transparent={modalstatus}       
                >
                
                    <TouchableOpacity 
                        style={{ flex: 1,backgroundColor:'#000000AA', justifyContent:'flex-end',alignItems:'center',
                        }}
                        onPress={() =>  setModalstatus(false)}

                    
                    >
                        {/* <QRCode value="sujon" > */}
                            <View 
                                style={{ 
                                    flex:1, 
                                    width:'70%',
                                    justifyContent:'center',
                                    
                                }}
                            >
                                    
                                        <View 
                                            style={{ 
                                                paddingHorizontal: SIZES.padding * 0.1 ,
                                                paddingVertical: SIZES.padding * 2.5 ,
                                        
                                                alignItems: 'center',
                                                textAlign:'center',
                                                backgroundColor:'#fff',
                                            //marginBottom:20,
                                            }}
                                            >
                                                <Text
                                                style={{
                                                    justifyContent:'center',
                                                    color:COLORS.red,
                                                    fontSize:13,
                                                    fontWeight:'600',
                                                   marginBottom:10
                                                }}
                                                >{qrtitle}</Text>
                                          
                                            <QRCode value={qrvalue} size={size}  color={color} />
                                        </View>
                                            

                                </View>
                                        
                            

                    </TouchableOpacity>         
                </Modal>
    )
}

//export default Loading;