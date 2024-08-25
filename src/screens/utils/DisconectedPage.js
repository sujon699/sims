import React,{useState,useEffect} from "react";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    TouchableOpacity
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import Feather from 'react-native-vector-icons/dist/Feather';




const DisconectedPage = () => {
   



    function renderLogo() {
        return (
            <View
                style={{
                    
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Feather name="wifi-off" size={140} color="black" />
                <Text style={{ fontSize:16,fontWeight:"600",color:COLORS.red,textAlign:'center',marginTop:10 }}>No Internet Connection</Text>
            </View>
        )
    }



    



   

    

    return (
        <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                    {renderLogo()}
        </View>
    )
}

export default DisconectedPage;