import React,{useState,useEffect} from "react";
import {
    View, 
    StyleSheet,
    ActivityIndicator,
    Platform
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { withTiming, Easing } from 'react-native-reanimated';
import { MotiView } from "moti";

const _color = COLORS.purple;
const _size = Platform.OS === 'ios' ? 80 : 70;


export default function Loading () {


    return (
        <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
            <View
                style={[{ height:_size,width:_size,borderRadius:_size, backgroundColor:_color},{alignItems: 'center',justifyContent: 'center', }]}
            >
                {[...Array(4).keys()].map((index) =>{
                    return (
                        <MotiView
                         from={{opacity:0.7,scale:1}}
                         animate={{opacity:0,scale:4}}
                         transition={{
                            type:'timing',
                            duration:2000,
                            easing: Easing.out(Easing.ease),
                            delay:index*400,
                           // repeatReverse:false,
                            loop:true
                         }}
                         key={index}
                         style={[StyleSheet.absoluteFillObject,{height:_size,width:_size,borderRadius:_size, backgroundColor:_color}]}
                        
                        />
                    );
                })}
                <ActivityIndicator animating={true} size={14} color={"#fff"}    />
            </View>
        </View>
    )
}

//export default Loading;