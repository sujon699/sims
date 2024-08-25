import React,{useState,useEffect} from "react";
import {
    View,
} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation,errorMsg) =>{

    if( errorMsg == 'Time Out')
    {
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('userID')
        await AsyncStorage.removeItem('empID')
        await AsyncStorage.removeItem('expoToken')
        navigation.replace('SignUp');

    }
    
}

export function dateFormater(date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var day = date.getDate();
    // get month from 0 to 11
    var month = date.getMonth();
    // conver month digit to month name
    month = months[month];
    var year = date.getFullYear();
  
    // show date in two digits
    if (day < 10) {
      day = '0' + day;
    }
  
    // now we have day, month and year
    // arrange them in the format we want
    return  day+'-'+month +'-'+year;
  }


export function getDistanceFromLatLonInKm(lat1,long1,lat2,long2,disType = 'METER')
{
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLong = deg2rad(long2 - long1);
    var a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLong /2) *
        Math.sin(dLong /2) ;
    
        var c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
        var d = R * c ;

        if(disType == 'KM')
        {
            return d;
        }
        else
        {
            return d * 1000;
        }
        

    
    
}
function deg2rad(deg)
{
    return deg *(Math.PI/180)
}