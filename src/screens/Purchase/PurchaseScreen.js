import React, { useState, useEffect, useRef } from "react";
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
    KeyboardAvoidingView
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images, baseUrl } from "../../constants";
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';



import BaseApi from "../../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { Dropdown } from 'react-native-element-dropdown';
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
// import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, useCameraDevice,useCodeScanner } from 'react-native-vision-camera';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import LinearGradient from 'react-native-linear-gradient';


let timer;
const debounce = function (fn, d) {

    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(null, args);
        }, d);
    };

};


function PurchaseScreen({ navigation, route }) {



    const [Invid, setInvID] = useState(route.params?.InvID);
    const [invBasicData, setInvBasicData] = useState([]);


    const [centerCombo, setCenterCombo] = useState([]);




    const [p_typeCombo, setP_typeCombo] = useState([
        { label: 'T', value: 'T' },
        { label: 'B', value: 'B' },

    ]);


    const [p_type, setP_type] = useState('T');
    const [disType, setDisType] = useState('P');




    const [invData, setInvData] = useState([]);
    const [appToken, setappToken] = useState('');
    const [islodding, setIslodding] = useState(false);
    const [isloddingAction, setIsloddingAction] = useState(false);
    const [images, setImages] = useState([]);

    const [isModal, setIsModal] = useState(false);
    const [modalValue, setModalValue] = useState('0');
    const [modalPrdName, setModalPrdName] = useState('');
    const [m_type, setM_type] = useState('');
    const [modalRqstID, setModalRqstID] = useState('');


    const [supData, setSupData] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [hdnsupID, setHdnsupID] = useState('');




    const [user, setUser] = useState('');

    const [purToken, setPurToken] = useState('');
    const [purcenter, setPurcenter] = useState('');
    //const [isFocus, setIsFocus] = useState(false);

    const [isOtpModal, setIsOtpModal] = useState(false);

    const [OtpList, setOtpList] = useState([]);

    const [otpType, setOtpType] = useState('');

    const [pendingOtpStatus, setPendingOtpStatus] = useState(false);

    const [otpRemarks, setOtpRemarks] = useState('');
    const [overallDis, setOverallDis] = useState('0');
    const [isModalDisType, setIsModalDisType] = useState(false);
    const [modaldistype, setModaldistype] = useState('PERCENTAGE');


    const [lastPriceData, setLastPriceData] = useState([]);
    const [isModalLP, setIsModalLP] = useState(false);

    const [isModalDatalodding, setIsModalDatalodding] = useState(false);

    const [isBootomOpen, setIsBootomOpen] = useState(false);
    const sheetRef = useRef(null);
    const snapPoint = ["45%"];
    const [scanned, setScanned] = useState(false);
    const [scanInterface, setScanInterface] = useState(true);
   


    useEffect(() => {

        requestCameraPermission();
        fetchInvData();
        let cancel = false;

        return () => {
            cancel = true;
            setScanned(true); setScanInterface(false);
        }

    }, []);



    // const devices = useCameraDevices();
    // const device = devices.back;
    const device = useCameraDevice('back');

    const requestCameraPermission = async () => {
       const permission  = await Camera.requestCameraPermission();

       if(permission === 'denied')
       {
          await Linking.openSettings();
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
           //console.log(code.type); // <-- ❌ On iOS, we receive 'ean-13'
            onBarCodeRead(code.value);
          }
        }
    })


    const fetchInvData = async () => {
        //alert(route.params?.InvID);
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        const userName = await AsyncStorage.getItem('userName');
        setUser(userName);
        setappToken(token);
        if (token !== null) {
            setIslodding(true);

            try {

                const { data } = await BaseApi.post('/MobilePurchase/fetchDataAPI.php', {
                    token: token,
                    act: 'Purchase_Draft_detailsNew',
                    draftID: Invid,
                    userID: userID
                });

                if (data.service_header.status_tag === 'success') {
                    // var kk = Object.entries(data.spw_data.otpDetails); 
                    //console.log(kk);   
                    setInvData(data.spw_data);
                    // console.log(data.spw_data);
                    setInvBasicData(data.invBasicData);
                    setHdnsupID(data.invBasicData.supID);
                    setSupplier(data.invBasicData.supName);
                    setPurToken(data.invBasicData.purToken);
                    setPurcenter(data.invBasicData.purcenter);
                    setPendingOtpStatus(data.invBasicData.otpStatus);
                    setCenterCombo(data.centerCombo);

                    if (data.centerCombo.length == 1) {
                        setPurcenter(data.centerCombo[0].value);
                    }



                }
                else {
                    await logout(navigation, data.service_header.massage);
                    //console.log(data.spw_data);
                    setInvData([]);
                    setInvBasicData([]);
                    setCenterCombo([]);

                    navigation.goBack();



                }

            }
            catch (error) {
                console.log(error);
                setInvData([]);
                setInvBasicData([]);
                setCenterCombo([]);
            }
            setIslodding(false);

        }
        else {
            setInvData([]);
            setInvBasicData([]);
            setCenterCombo([]);
        }

    }




    const OpenInputModal = async (rID, Type) => {

        try {



            if (Type == 'OVERALL DISCOUNT') {
                setModalPrdName('');
                setModalRqstID('');
                setM_type(Type);
                setModalValue(overallDis);
                setIsModal(true);
            }
            else {
                var [{ prdName, p_qty, p_price, ad_price, disType, disValue }] = invData.filter((x) => x.rqstID == rID);
                setModalPrdName(prdName);
                setModalRqstID(rID);
                setM_type(Type);
                if (Type == 'QUANTITY') {
                    setModalValue(p_qty + '');
                }
                else if (Type == 'AD.PRICE') {
                    setModalValue(ad_price + '');
                }
                else if (Type == 'P.PRICE') {
                    if (p_price == 1) {
                        setModalValue('');
                    }
                    else {
                        // alert(p_price);
                        setModalValue(p_price + '');
                    }


                }
                else if (Type == 'DISCOUNT') {
                    setIsModalDisType(disType);
                    if (disValue == 0) {
                        setModalValue('');
                    }
                    else {
                        setModalValue(disValue);
                    }


                }

                if (Type != 'DISCOUNT') {
                    setIsModal(true);
                }
                else {
                    setIsModalDisType(true);
                }



            }
        }
        catch (e) {
            console.log(e);
        }



    }

    function isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }

    function calPrdDisAmount(disType, disvalue, PP) {


        var disAmt = 0;
        if (disType == 'FIXED') {
            disAmt = disvalue;
        }
        else if (disType == 'PERCENTAGE') {
            disAmt = ((PP * disvalue) / 100);
            if (isInt(disAmt) == false) {
                disAmt = disAmt.toFixed(2);
            }
        }

        return disAmt;

    }

    const SetValue = async (rID, Type) => {

        var [{ p_qty: PQ, p_price: PP, otp_price: OP, otp_qty: OQ, ad_price: AP, UDP: UDP, disType: DT, disValue: DV, disAmt: DA }] = invData.filter((x) => x.rqstID == rID);

        var m_value = parseFloat(modalValue);

        if (m_value >= 0) {
            var Index = invData.findIndex(x => x.rqstID === rID)
            const newIngredients = [...invData];
            if (Type == 'QUANTITY') {
                newIngredients[Index] = { ...newIngredients[Index], p_qty: m_value };
                if (parseFloat(m_value) != parseFloat(OQ)) {
                    newIngredients[Index] = { ...newIngredients[Index], isLodding_Qty: true };
                }
                else {
                    newIngredients[Index] = { ...newIngredients[Index], isLodding_Qty: false };
                }
            }
            else if (Type == 'P.PRICE') {

                if (m_value < AP) {
                    newIngredients[Index] = { ...newIngredients[Index], p_price: m_value };
                }
                else {
                    newIngredients[Index] = { ...newIngredients[Index], p_price: m_value };
                }

                if (m_value > parseFloat(OP)) {
                    newIngredients[Index] = { ...newIngredients[Index], isLodding_Price: true };
                }
                else {
                    newIngredients[Index] = { ...newIngredients[Index], isLodding_Price: false };
                }

                var disAmt = calPrdDisAmount(DT, DV, m_value);
                var UDP = (m_value - disAmt);
                if (isInt(UDP) == false) {
                    UDP = UDP.toFixed(2);
                }
                newIngredients[Index] = { ...newIngredients[Index], disAmt: disAmt };
                //newIngredients[Index] = {...newIngredients[Index], ad_price: UDP};
                newIngredients[Index] = { ...newIngredients[Index], UDP: UDP };



            }
            else if (Type == 'DISCOUNT') {
                if (PP > 1) {
                    newIngredients[Index] = { ...newIngredients[Index], disType: modaldistype };
                    newIngredients[Index] = { ...newIngredients[Index], disValue: m_value };
                    var disAmt = calPrdDisAmount(modaldistype, m_value, PP);
                    var UDP = (PP - disAmt);
                    if (isInt(UDP) == false) {
                        UDP = UDP.toFixed(2);
                    }
                    newIngredients[Index] = { ...newIngredients[Index], disAmt: disAmt };
                    //newIngredients[Index] = {...newIngredients[Index], ad_price: UDP};
                    newIngredients[Index] = { ...newIngredients[Index], UDP: UDP };

                }



            }
            setInvData(newIngredients);
            setIsModal(false);
            setIsModalDisType(false);

        }
        else {
            alert('Invalid Value');
            setIsModal(false);
        }



    }



    const confirmChk = async (ID, type) => {
        Alert.alert(
            // title
            'Are You Sure ?',
            // body
            '',
            [
                {
                    text: 'YES',
                    onPress: () => {

                        if (type == 'DELETE_DRAFT') {
                            DeleteDraft(ID);
                        }
                        else if (type == 'SAVE_PURCHASE') {
                            SavePurchase(ID);
                        }
                        else if (type == 'SEND_OTP') {
                            SendOtp(ID);
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

    const FromValidation = async () => {

        var error = "";
        var errorNo = 0;
        if (purToken.trim().length < 2) {
            errorNo++;
            error += errorNo + " Provide Valid Token  \n";
        }

        if (purcenter == '') {
            errorNo++;
            error += errorNo + " Provide Purchase Center \n";
        }

        if (hdnsupID == '') {
            errorNo++;
            error += errorNo + " Provide Supplier Name \n";
        }


        return error;
    }

    const OtpCheck = async () => {


        //setPriceOtpList([]);
        var otpNO = 0;
        var PriceOtpItem = invData.map(function (item, i) {


            if (parseFloat(item.p_price) > parseFloat(item.otp_price)) {
                var Index = invData.findIndex(x => x.rqstID === item.rqstID)
                const newIngredients = [...invData];
                newIngredients[Index] = { ...newIngredients[Index], isLodding_Price: true };
                setInvData(newIngredients);
                otpNO++;
                return {
                    sl: otpNO,
                    invDetailsID: item.invDetailsID,
                    draftDetailsID: item.draftDetailsID,
                    rqstID: item.rqstID,
                    prdName: item.prdName,
                    p_qty: item.p_qty,
                    p_price: item.p_price,
                    ad_price: item.ad_price,
                    otp_price: item.p_price,
                    expected: item.otp_price,
                    requested: item.p_price,
                    effected_feield: "Tag",
                    disType: item.disType,
                    disValue: item.disValue,
                    disAmt: item.disAmt,

                }

            }
            else {
                return {}

            }



        });

        var PriceOtpItem = PriceOtpItem.filter(element => {
            if (Object.keys(element).length !== 0) {
                return true;
            }

            return false;
        });

        if (PriceOtpItem.length > 0) {
            setOtpType('PRICE');
            setIsOtpModal(true);
            setOtpList(PriceOtpItem);
        }
        else {
            var QuantityOtpItem = invData.map(function (item, i) {


                if (parseFloat(item.p_qty) != parseFloat(item.otp_qty)) {
                    var Index = invData.findIndex(x => x.rqstID === item.rqstID)
                    const newIngredients = [...invData];
                    newIngredients[Index] = { ...newIngredients[Index], isLodding_Qty: true };
                    setInvData(newIngredients);
                    otpNO++;
                    return {
                        sl: otpNO,
                        invDetailsID: item.invDetailsID,
                        draftDetailsID: item.draftDetailsID,
                        rqstID: item.rqstID,
                        prdName: item.prdName,
                        p_qty: item.p_qty,
                        p_price: item.p_price,
                        ad_price: item.ad_price,
                        otp_qty: item.p_qty,
                        expected: item.otp_qty,
                        requested: item.p_qty,
                        effected_feield: "otp_qty_tag",
                        disType: item.disType,
                        disValue: item.disValue,
                        disAmt: item.disAmt,

                    }
                }
                else {
                    return {}

                }



            });

            var QuantityOtpItem = QuantityOtpItem.filter(element => {
                if (Object.keys(element).length !== 0) {
                    return true;
                }

                return false;
            });

            if (QuantityOtpItem.length > 0) {
                setOtpType('QUANTITY');
                setIsOtpModal(true);
                setOtpList(QuantityOtpItem);

            }



        }




        return otpNO;

    }

    const SendOtp = async (dfratID) => {

        const userID = await AsyncStorage.getItem('userID');
        try {


            if (otpRemarks.trim().length <= 2) {
                showMessage({
                    message: "Plz Provide OTP Remarks... ",
                    description: '',
                    duration: 2000,
                    type: "danger",
                });

            }
            else if (OtpList.length > 0) {
                setIslodding(true);
                var modifyDetailsID = JSON.stringify(OtpList);
                //console.log(modifyDetailsID);
                const { data } = await BaseApi.post('MobilePurchase/thisUilityAPI.php', {
                    token: appToken,
                    act: 'SendOTPNew',
                    userID: userID,
                    otpType: otpType,
                    SupID: hdnsupID,
                    center: purcenter,
                    purToken: purToken,
                    otpRemarks: otpRemarks,
                    dfratID: dfratID,
                    modifyDetailsID: modifyDetailsID
                });

                if (data.service_header.status_tag === 'success') {
                    // console.log(data.spw_data);

                    // setIsloddingAction(false);
                    showMessage({
                        message: "OTP Send Sucessfully ",
                        description: '',
                        duration: 2000,
                        type: "success",
                    });

                    fetchInvData();
                    setIsOtpModal(false);


                }
                else {
                    await logout(navigation, data.service_header.massage);
                    //console.log(data.spw_data);

                    showMessage({
                        message: "OTP Send Unsucessfully ",
                        description: '',
                        duration: 2000,
                        type: "danger",
                    });

                    setIsOtpModal(false);
                }
                setIslodding(false);








            }


        }
        catch (error) {
            console.log(error);
            // setIsloddingAction(false);
        }




    }

    const PickLP = async (sumName, supID, ppvalue, rID) => {


        var [{ p_qty: PQ, p_price: PP, otp_price: OP, otp_qty: OQ, ad_price: AP, UDP: UDP, disType: DT, disValue: DV, disAmt: DA }] = invData.filter((x) => x.rqstID == rID);
        var Index = invData.findIndex(x => x.rqstID === rID)
        const newIngredients = [...invData];
        newIngredients[Index] = { ...newIngredients[Index], p_price: ppvalue };


        if (parseFloat(ppvalue) > parseFloat(OP)) {
            newIngredients[Index] = { ...newIngredients[Index], isLodding_Price: true };
        }
        else {
            newIngredients[Index] = { ...newIngredients[Index], isLodding_Price: false };
        }

        var disAmt = calPrdDisAmount(DT, DV, ppvalue);
        var UDP = (ppvalue - disAmt);
        if (isInt(UDP) == false) {
            UDP = UDP.toFixed(2);
        }
        newIngredients[Index] = { ...newIngredients[Index], disAmt: disAmt };
        //newIngredients[Index] = {...newIngredients[Index], ad_price: UDP};
        newIngredients[Index] = { ...newIngredients[Index], UDP: UDP };
        setInvData(newIngredients);

        // if (hdnsupID.length == 0) 
        {
            setSupplier(sumName);
            setHdnsupID(supID);

        }
        setIsModalLP(false);


    }



    const SavePurchase = async (invID) => {
        const userID = await AsyncStorage.getItem('userID');

        try {
            var errorMsg = await FromValidation();
            if (errorMsg.length == 0) {
                var otpNo = await OtpCheck();
            }



            if (errorMsg.length > 0) {
                setIslodding(false);
                setPendingOtpStatus(false);
                showMessage({
                    message: errorMsg,
                    description: '',
                    duration: 2500,
                    type: "danger",
                });


            }
            else if (otpNo == 0) {

                var totalPrice = invData.reduce((acc, curr) => acc + (curr.p_qty * curr.p_price), 0);
                var totalPrdDiscount = invData.reduce((acc, curr) => acc + (curr.disAmt * curr.p_qty), 0);


                if (isInt(totalPrdDiscount) == false) {
                    totalPrdDiscount = totalPrdDiscount.toFixed(2);
                }
                totalPrdDiscount = parseFloat(totalPrdDiscount);

                var totalDis = totalPrdDiscount + parseFloat(overallDis);

                if (isInt(totalDis) == false) {
                    totalDis = totalDis.toFixed(2);
                }


                //alert('done');
                setIslodding(true);
                setPendingOtpStatus(true);
                var modifyDetailsID = JSON.stringify(invData);
                //console.log(modifyDetailsID);

                const { data } = await BaseApi.post('MobilePurchase/ActionAPI.php', {
                    token: appToken,
                    act: 'SavePurchaseNew',
                    userID: userID,
                    dfratID: invID,
                    SupID: hdnsupID,
                    center: purcenter,
                    purToken: purToken,
                    p_type: p_type,
                    over_all_discount: parseFloat(overallDis),
                    total_amt: totalPrice,
                    total_discount: totalDis,
                    modifyDetailsID: modifyDetailsID
                });

                if (data.service_header.status_tag === 'Token Exist') {
                    setIslodding(false);
                    setPendingOtpStatus(false);
                    showMessage({
                        message: "Token Exist ",
                        description: '',
                        duration: 2000,
                        type: "danger",
                    });

                }
                else if (data.service_header.status_tag === 'success') {
                    setIslodding(false);
                    setPendingOtpStatus(false);
                    showMessage({
                        message: "Purchase Save Sucessfully ",
                        description: '',
                        duration: 2000,
                        type: "success",
                    });

                    navigation.goBack();



                }
                else {
                    await logout(navigation, data.service_header.massage);
                    setIslodding(false);
                    setPendingOtpStatus(false);
                    showMessage({
                        message: "Purchase Save Unsucessfully ",
                        description: '',
                        duration: 2000,
                        type: "danger",
                    });
                }

                fetchInvData();

            }




        }
        catch (error) {
            console.log(error);
            setIsloddingAction(false);
        }



    }

    const DeleteDraft = async (ID) => {
        const userID = await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try {

            const { data } = await BaseApi.post('MobilePurchase/ActionAPI.php', {
                token: appToken,
                act: 'Delete_Draft',
                userID: userID,
                draftDetailsID: ID,
            });

            if (data.service_header.status_tag === 'success') {
                setIsloddingAction(false);
                showMessage({
                    message: "Delete Sucessfully ",
                    description: ID,
                    duration: 2000,
                    type: "success",
                });

                if (data.spw_data == 1) {
                    navigation.goBack();
                }


            }
            else {
                await logout(navigation, data.service_header.massage);
                setIsloddingAction(false);
                showMessage({
                    message: "Delete Unsucessfully ",
                    description: ID,
                    duration: 2000,
                    type: "danger",
                });
            }





        }
        catch (error) {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();

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
                        paddingLeft: moderateScale(8),
                        paddingRight: moderateScale(8),
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
                                PURCHASE DRAFT
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

                                {user.toUpperCase()}
                            </Text>

                        </View>

                        <FontAwesome5 name="shopping-bag" size={scale(21)} style={{ marginLeft: verticalScale(5) }} color='#fff' />






                    </View>


                </View>



            </LinearGradient>

        );
    }

    const HandleSearchSupplier = (text) => {
        setSupplier(text);
        if (text.length == 0) {
            //alert(text.length);
            setSupData([]);
            setSupplier('');
            setHdnsupID('');

        }

        if (text.length > 1) {
            debounceSeacrh(text);
            //debounce(debounceSeacrh,2000);
        }
    }



    const FetchSUpInfo_FS = async (text) => {

        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        setappToken(token);
        if (token !== null) {
            //setIslodding(true);
            try {

                const { data } = await BaseApi.post('/Utility/UtilityApi.php', {
                    token: token,
                    act: 'supplierLookUP',
                    searchText: text,
                    active_con: 1,
                    userID: userID,
                });

                if (data.service_header.status_tag === 'success') {
                    if (data.spw_data.length > 0) {
                        setSupData(data.spw_data);

                    }

                    // console.log(data.spw_data);           
                }
                else {
                    //console.log(data.spw_data);
                    setSupData([]);

                }

            }
            catch (error) {
                console.log(error);
                setSupData([]);
            }
            //setIslodding(false);

        }
        else {
            setSupData([]);
        }

    }

    const debounceSeacrh = debounce(FetchSUpInfo_FS, 500);


    const rendertop = () => {

        return (
            <View style={{ marginTop: verticalScale(4), paddingHorizontal: moderateScale(4), marginBottom: verticalScale(1), }}>

                <View
                    style={{

                        shadowOffset: { width: 0, height: 1, },
                        shadowOpacity: 0.47,
                        shadowRadius: 1.0,
                        elevation: 3,
                        borderRadius: scale(5),
                        backgroundColor: COLORS.white,
                        paddingHorizontal: moderateScale(7),
                        paddingVertical: verticalScale(6)

                    }}

                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        //  marginTop: verticalScale(-3),


                    }}>
                        <View
                            style={{
                                flex: 1,
                                marginBottom: verticalScale(4),
                            }}
                        >


                            <TextInput
                                style={{
                                    //marginVertical: SIZES.padding,
                                    color: '#424242',
                                    fontSize: scale(12),
                                    paddingLeft: verticalScale(7),
                                    backgroundColor: '#D7CCC8',
                                    paddingVertical: verticalScale(2),
                                    borderRadius: 2,
                                    height: scale(30),
                                    shadowOffset: { width: 0, height: 1, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 3,


                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="SUPPLIER"
                                placeholderTextColor='#9E9E9E'
                                selectionColor={COLORS.black}
                                value={supplier}
                                onChangeText={HandleSearchSupplier}

                            />

                            <View
                                style={{
                                    width: '100%',
                                    backgroundColor: '#000000AA',
                                    borderRadius: 2,
                                    zIndex: 99999,
                                    position: 'relative',
                                    maxHeight: verticalScale(500)

                                }}
                            >
                                <FlatList
                                    data={supData}
                                    renderItem={renderSupItem}
                                    keyExtractor={(item) => item.suplier_id}
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        zIndex: 99999
                                    }}
                                />
                            </View>


                        </View>


                    </View>


                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        zIndex: 0,
                        //marginTop: verticalScale(-3),
                    }}>
                        <View
                            style={{
                                flex: 4,
                                marginRight: moderateScale(4),
                            }}
                        >



                            <View
                                style={{ flexDirection: 'row' }}
                            >

                                <Dropdown
                                    style={{
                                        color: '#424242',
                                        fontSize: scale(12),
                                        paddingLeft: moderateScale(8),
                                        backgroundColor: '#ff99c2',
                                        borderRadius: 2,
                                        height: scale(30),
                                        shadowOffset: { width: 0, height: 1, },
                                        shadowOpacity: 0.47,
                                        shadowRadius: 1.49,
                                        elevation: 3,
                                        flex: 1,
                                        marginRight: moderateScale(1)
                                    }}
                                    //
                                    itemTextStyle={{ fontSize: scale(12), marginHorizontal: moderateScale(-3) }}
                                    itemContainerStyle={{}}
                                    //placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={{ fontSize: scale(12) }}
                                    //inputSearchStyle={{height: 20}}
                                    //iconStyle={styles.iconStyle}
                                    //search
                                    // searchPlaceholder="Search..."
                                    // placeholder={!isFocus ? 'Select item' : '...'}
                                    // onFocus={() => setIsFocus(true)}
                                    // onBlur={() => setIsFocus(false)}
                                    data={p_typeCombo}
                                    maxHeight={scale(400)}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='PT'
                                    value={p_type}
                                    onChange={item => {
                                        setP_type(item.value);
                                        // setIsFocus(false);
                                    }}

                                />

                                <View style={{ flex: 5 }} >
                                    <TextInput
                                        style={{
                                            color: '#424242',
                                            fontSize: scale(12),
                                            paddingLeft: moderateScale(8),
                                            backgroundColor: '#FFCDD2',
                                            borderRadius: 2,
                                            height: scale(30),
                                            shadowOffset: { width: 0, height: 1, },
                                            shadowOpacity: 0.47,
                                            shadowRadius: 1.49,
                                            elevation: 3,

                                        }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="TOKEN"
                                        placeholderTextColor='#9E9E9E'
                                        selectionColor={COLORS.black}
                                        value={purToken}
                                        keyboardType="numeric"
                                        onChangeText={(text) => setPurToken(text)}
                                    />

                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: -5,
                                            bottom: verticalScale(-2),
                                            height: scale(28),
                                            width: scale(28)
                                        }}
                                        onPress={() => { setIsBootomOpen(true); setScanned(false); setScanInterface(true); }}
                                    >
                                        <MaterialIcons name="qr-code-scanner" size={scale(20)} color="black" />
                                    </TouchableOpacity>


                                </View>


                            </View>


                        </View>

                        <View
                            style={{
                                flex: 3,
                            }}
                        >


                            <Dropdown
                                style={{

                                    color: '#424242',
                                    fontSize: scale(11),
                                    paddingLeft: moderateScale(8),
                                    backgroundColor: '#E1BEE7',
                                    borderRadius: 2,
                                    height: scale(30),
                                    shadowOffset: { width: 0, height: 1, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 3,
                                }}
                                //
                                itemTextStyle={{ fontSize: scale(11) }}
                                itemContainerStyle={{}}
                                //placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={{ fontSize: scale(11) }}
                                //inputSearchStyle={{height: 20}}
                                //iconStyle={styles.iconStyle}
                                //search
                                // searchPlaceholder="Search..."
                                // placeholder={!isFocus ? 'Select item' : '...'}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                data={centerCombo}
                                maxHeight={scale(400)}
                                labelField="label"
                                valueField="value"
                                placeholder='Select Center'
                                value={purcenter}
                                onChange={item => {
                                    setPurcenter(item.value);
                                    // setIsFocus(false);
                                }}

                            />

                        </View>






                    </View>





                </View>


            </View>


        );
    }

    const renderSupItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ padding: SIZES.padding, flexDirection: 'row', borderBottomColor: '#F5F5F5', borderBottomWidth: 1 }}
                onPress={() => {
                    setSupplier(item.supName)
                    setHdnsupID(item.suplier_id)
                    setSupData([]);
                }}
            >

                <Text style={{ fontSize: scale(10), color: '#F5F5F5', }}>{item.company_name.toUpperCase()}</Text>
            </TouchableOpacity>
        )
    }

    const lastPrice = async (prdName, prdID, rID) => {



        setModalPrdName(prdName);

        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        if (token !== null) {
            setIsModalLP(true);
            setIsModalDatalodding(true);
            setLastPriceData([]);
            setModalRqstID(rID);
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
            setIsModalDatalodding(false);

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
                    backgroundColor: '#DCEDC8',
                    marginBottom: verticalScale(2),
                    paddingHorizontal: moderateScale(2),
                    paddingVertical: verticalScale(2),
                    marginHorizontal: moderateScale(2)



                }}

            >
                <TouchableOpacity
                    style={{ marginBottom: verticalScale(1), paddingVertical: moderateScale(2) }}
                    onPress={() => PickLP(item.supplierName, item.supplierID, item.p_price, modalRqstID)}
                >


                    <Text style={{ fontSize: scale(12), color: '#7986CB', paddingTop: verticalScale(2), paddingLeft: moderateScale(4), flex: 7 }}>{item.supplierName}</Text>

                    <Text style={{ fontSize: scale(11), color: '#616161', marginTop: 1 }}>
                        Purchase Date  : <Text style={{ fontSize: scale(12), fontWeight: '600', color: '#8BC34A', paddingLeft: moderateScale(4), }}> {item.p_date}</Text>
                    </Text>
                    <Text style={{ fontSize: scale(11), color: '#616161', marginTop: 1 }}>
                        Purchase Price : <Text style={{ fontSize: scale(12), fontWeight: '600', color: '#EF5350', paddingLeft: moderateScale(4), }}> {item.p_price}</Text>
                    </Text>

                </TouchableOpacity>



            </View>
        );

    }


    const renderInvList = ({ item }) => {


        return (



            <View
                key={item.rqstID}
                style={{

                    shadowOffset: { width: 1, height: 1, },
                    shadowOpacity: 0.47,
                    shadowRadius: 1.0,
                    elevation: 3,
                    borderRadius: scale(3),
                    backgroundColor: COLORS.white,
                    marginBottom: verticalScale(2),
                    paddingHorizontal: moderateScale(6),
                    marginTop: verticalScale(3),
                    marginHorizontal: moderateScale(1),

                }}

            >










                <View
                    style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        paddingLeft: moderateScale(2),
                        marginTop: verticalScale(3)
                        //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                    }}
                >
                    <View
                        style={{ flex: 2, }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row', backgroundColor: '#E57373', flex: 3, justifyContent: 'center',
                                alignContent: 'center', alignItems: 'center', borderRadius: scale(6),
                            }}
                            onPress={() => confirmChk(item.draftDetailsID, 'DELETE_DRAFT')}

                        >
                            <Text style={{ fontSize: scale(11), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                            <MaterialIcons name="delete" color='white' size={scale(11)} />


                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity
                        style={{ flex: 18, }}
                        onPress={() => lastPrice(item.prdName, item.prdID, item.rqstID)}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#E91E63" }}>  {item.prdName} </Text>
                        </View>



                        <View
                            style={{
                                flexDirection: 'row', justifyContent: 'center',
                                marginTop: verticalScale(2)
                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                            }}
                        >


                            <Text style={{ fontSize: 11, color: '#512DA8', paddingLeft: 2, marginTop: -4 }}>
                                <Text style={{ fontSize: 11, color: '#388E3C', }}>S.Qty :</Text> {item.s_qty}

                                <Text style={{ fontSize: 11, color: '#388E3C', }}>  | S.Price :</Text> {item.s_price}

                                <Text style={{ fontSize: 11, color: '#388E3C', }}>  | S.Center :</Text> {item.centerName}
                                <Text style={{ fontSize: 11, color: '#388E3C', }}>  | U:</Text> {item.s_soldBy}
                            </Text>


                        </View>



                    </TouchableOpacity>


                </View>



                <View
                    style={{ marginRight: moderateScale(1), flexDirection: 'row', marginTop: verticalScale(3) }}

                >




                    <View style={{ flex: 2.9, marginRight: moderateScale(1) }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',


                            }}
                        >


                            <TouchableOpacity
                                onPress={() => OpenInputModal(item.rqstID, 'DISCOUNT')}
                                style={{
                                    borderRadius: scale(2), backgroundColor: '#F57C00', flex: 1, paddingRight: moderateScale(5), paddingVertical: verticalScale(1.5)
                                }}
                            >
                                <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#fff', textAlign: 'right', }}>{item.disAmt}</Text>
                            </TouchableOpacity>

                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: scale(8), fontWeight: '500', color: '#F57C00', textAlign: 'left', paddingLeft: moderateScale(1), marginTop: verticalScale(1) }}>
                                {item.disType == 'PERCENTAGE' ? 'P' : 'F'} | {item.disValue}
                            </Text>
                            <Text style={{ fontSize: scale(8), fontWeight: '500', color: '#F57C00', textAlign: 'right', paddingLeft: moderateScale(1), marginTop: verticalScale(1) }}>DIS</Text>


                        </View>


                    </View>
                    <View style={{ flex: 5, marginRight: moderateScale(1) }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >


                            <View
                                // onPress={() => OpenInputModal(item.rqstID,'AD.PRICE')}
                                style={{
                                    borderRadius: 3, backgroundColor: '#90A4AE', flex: 1, paddingRight: moderateScale(5), paddingVertical: verticalScale(1.5)
                                }}
                            >
                                <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#fff', textAlign: 'right', }}>{item.UDP}</Text>
                            </View>

                        </View>
                        <Text style={{ fontSize: scale(8), fontWeight: '500', color: '#90A4AE', textAlign: 'right', paddingRight: moderateScale(1), marginTop: verticalScale(1) }}>UDP</Text>


                    </View>



                    <View style={{ flex: 4, marginRight: moderateScale(1) }}>

                        <TouchableOpacity
                            onPress={() => OpenInputModal(item.rqstID, 'QUANTITY')}
                            style={{
                                borderRadius: 3, backgroundColor: '#ac6953', flex: 2, paddingRight: moderateScale(5), paddingVertical: verticalScale(1.5)
                            }}
                        >
                            <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#fff', textAlign: 'right', }}>{item.p_qty}</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',


                            }}
                        >

                            <ActivityIndicator animating={item.isLodding_Qty} size={"small"} color={"#E53935"} style={{ flex: 4 }} />
                            <Text style={{ fontSize: scale(8), fontWeight: '500', color: '#ac6953', textAlign: 'right', paddingRight: moderateScale(1), marginTop: verticalScale(1), flex: 10 }}>QTY</Text>


                        </View>



                    </View>



                    <View style={{ flex: 5, marginRight: moderateScale(1) }}>

                        <TouchableOpacity
                            onPress={() => OpenInputModal(item.rqstID, 'P.PRICE')}
                            style={{
                                borderRadius: 3, backgroundColor: '#00897B', flex: 2, paddingRight: moderateScale(5), paddingVertical: verticalScale(1.5)
                            }}
                        >
                            <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#fff', textAlign: 'right', }}>{item.p_price}</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',


                            }}
                        >

                            <ActivityIndicator animating={item.isLodding_Price} size={"small"} color={"#E53935"} style={{ flex: 4 }} />
                            <Text style={{ fontSize: scale(8), fontWeight: '500', color: '#00897B', textAlign: 'right', paddingRight: moderateScale(1), marginTop: verticalScale(1), flex: 10 }}>P.PRICE</Text>


                        </View>



                    </View>


                </View>







            </View>


        );
    }

    const renderOtpList = ({ item }) => {


        return (



            <View
                key={item.rqstID}
                style={{

                    shadowOffset: { width: 1, height: 1, },
                    shadowOpacity: 0.47,
                    shadowRadius: 1.0,
                    elevation: 3,
                    borderRadius: 2,
                    backgroundColor: COLORS.white,
                    marginBottom: verticalScale(2),
                    paddingHorizontal: moderateScale(5),
                    paddingVertical: verticalScale(2),
                    marginHorizontal: verticalScale(2),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // #BCAAA4


                }}

            >

                <View style={{ flex: 1, marginRight: moderateScale(1), }}>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: verticalScale(1),

                        }}
                    >

                        <View

                            style={{
                                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: '#E57373', textAlign: 'center', marginRight: moderateScale(1), borderRadius: scale(4)
                            }}

                        >
                            <Text style={{ fontSize: scale(13), color: '#fff', marginLeft: moderateScale(2), }}>{item.sl}</Text>


                        </View>
                        <Text style={{ fontSize: scale(11), color: '#3949AB', paddingTop: verticalScale(2), paddingLeft: moderateScale(7), flex: 7 }}>{item.prdName}</Text>



                    </View>

                    <View style={{ marginBottom: 1, marginTop: verticalScale(2) }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',


                            }}
                        >
                            <Text style={{ fontSize: scale(9), fontWeight: '500', color: '#66BB6A', flex: 5, paddingLeft: moderateScale(4), paddingVertical: verticalScale(2), marginRight: verticalScale(2) }}>EXPECTED </Text>

                            <View

                                style={{
                                    borderRadius: 4, backgroundColor: '#66BB6A', flex: 2, paddingRight: moderateScale(4), paddingVertical: verticalScale(2)
                                }}
                            >
                                <Text style={{ fontSize: scale(9), fontWeight: '600', color: '#fff', textAlign: 'right', }}>{item.expected}</Text>
                            </View>

                        </View>

                    </View>

                    <View style={{ marginBottom: 1 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',


                            }}
                        >

                            <Text style={{ fontSize: scale(9), fontWeight: '500', color: '#8D6E63', flex: 5, paddingLeft: moderateScale(4), paddingVertical: verticalScale(2), marginRight: verticalScale(2) }}>REQUESTED </Text>

                            <View

                                style={{
                                    borderRadius: 4, backgroundColor: '#8D6E63', flex: 2, paddingRight: moderateScale(4), paddingVertical: verticalScale(2)
                                }}
                            >

                                <Text style={{ fontSize: scale(9), fontWeight: '600', color: '#fff', textAlign: 'right', }}>{item.requested}</Text>
                            </View>

                        </View>

                    </View>
                </View>

            </View>


        );
    }



    function renderbody({ navigation }) {
        return (


            <View style={{ flex: 1, marginBottom: verticalScale(70), paddingHorizontal: moderateScale(3) }}>


                <FlatList
                    data={invData}
                    // extraData={otpData}
                    renderItem={renderInvList}
                    keyExtractor={(item) => item.rqstID}
                    showsVerticalScrollIndicator={true}
                    refreshing={islodding}
                //onRefresh={fetchInvData}


                />


            </View>
        );
    }

    function renderFotter() {

        var totalPrice = invData.reduce((acc, curr) => acc + (curr.p_qty * curr.p_price), 0);
        var totalPrdDiscount = invData.reduce((acc, curr) => acc + (curr.disAmt * curr.p_qty), 0);


        if (isInt(totalPrdDiscount) == false) {
            totalPrdDiscount = totalPrdDiscount.toFixed(2);
        }
        totalPrdDiscount = parseFloat(totalPrdDiscount);

        var totalDis = totalPrdDiscount + parseFloat(overallDis);

        if (isInt(totalDis) == false) {
            totalDis = totalDis.toFixed(2);
        }

        var netAmt = totalPrice - totalDis;
        if (isInt(netAmt) == false) {
            netAmt = netAmt.toFixed(2);
        }

        return (
            <View

                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: verticalScale(65),
                    shadowOffset: { width: 0, height: 0.5, },
                    shadowOpacity: 0.47,
                    shadowRadius: 1.49,
                    elevation: 7,
                    // background color must be set
                    // invisible color


                    borderTopRightRadius: scale(4),
                    borderTopLeftRadius: scale(4),
                    backgroundColor: '#EEEEEE',
                    marginBottom: 0,
                    paddingHorizontal: moderateScale(7),
                    paddingVertical: verticalScale(5),
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >



                    <TouchableOpacity
                        style={{
                            height: scale(36),
                            backgroundColor: '#7E57C2',
                            justifyContent: 'center',
                            borderRadius: scale(4),
                            marginRight: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            shadowOffset: { width: 0, height: 1, },
                            shadowOpacity: 0.47,
                            shadowRadius: 1.49,
                            elevation: 3,
                            flex: 6,

                        }}

                        onPress={() => {

                            if (pendingOtpStatus) {
                                fetchInvData();
                            }
                            else {
                                confirmChk(Invid, 'SAVE_PURCHASE');
                            }

                        }
                        }

                    >


                        {
                            pendingOtpStatus ? (<ActivityIndicator animating={pendingOtpStatus} size={"small"} color={"#ffffff"} />)
                                : (<><Entypo name="save" size={scale(13)} color="white" style={{ marginRight: moderateScale(5) }} />
                                    <Text style={{
                                        fontSize: scale(14), color: COLORS.white,
                                        justifyContent: 'center',
                                    }}> Purchase</Text></>)
                        }
                        {/* <ActivityIndicator animating={pendingOtpStatus} size={"small"} color={"#ffffff"}  style={{ flex: 1 }}  /> */}

                    </TouchableOpacity>






                    <TouchableOpacity
                        onPress={() => OpenInputModal('', 'OVERALL DISCOUNT')}
                        style={{

                            marginHorizontal: moderateScale(6),
                            flex: 6,



                        }}
                    >


                        <View
                            style={{
                                flexDirection: 'row', justifyContent: 'space-between',
                                marginTop: verticalScale(2)
                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                            }}
                        >
                            <View
                                style={{ borderColor: '#E0E0E0', flex: 2, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(4), borderBottomWidth: 1, }}
                            >
                                <Text style={{ fontSize: scale(7), color: '#F57C00', fontWeight: '500', textAlign: 'right' }}>Prd Dis</Text>
                                <Text style={{ fontSize: scale(9), color: '#F57C00', marginTop: verticalScale(-1), textAlign: 'right' }}>{totalPrdDiscount}</Text>

                            </View>
                            <View
                                style={{ borderColor: '#E0E0E0', flex: 2, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(4), borderBottomWidth: 1, borderLeftWidth: 1 }}
                            >
                                <Text style={{ fontSize: scale(7), color: '#757575', fontWeight: '500', textAlign: 'right' }}>Overall Dis</Text>
                                <Text style={{ fontSize: scale(9), color: '#757575', marginTop: verticalScale(-1), textAlign: 'right' }}>{parseFloat(overallDis)}</Text>

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
                                style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(1), borderBottomWidth: 0, }}
                            >
                                <Text style={{ fontSize: scale(7), color: '#EC407A', fontWeight: '500', textAlign: 'right' }}>Total Discount</Text>
                                <Text style={{ fontSize: scale(9), color: '#EC407A', marginTop: verticalScale(-1), textAlign: 'right' }}>{totalDis}</Text>

                            </View>


                        </View>


                    </TouchableOpacity>




                    <View
                        style={{


                            marginHorizontal: moderateScale(4),
                            paddingLeft: 6,
                            flex: 5,


                        }}

                    >




                        <View
                            style={{
                                flexDirection: 'row', justifyContent: 'space-between',
                                marginTop: verticalScale(1)
                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                            }}
                        >
                            <View
                                style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(1), borderBottomWidth: 1, }}
                            >
                                <Text style={{ fontSize: scale(7), color: '#2E7D32', fontWeight: '500', textAlign: 'right' }}>Total Amount</Text>
                                <Text style={{ fontSize: scale(10), fontWeight: '600', color: '#2E7D32', marginTop: verticalScale(-1), textAlign: 'right' }}>{totalPrice}</Text>

                            </View>


                        </View>

                        <View
                            style={{
                                flexDirection: 'row', justifyContent: 'space-between',
                                marginTop: verticalScale(1)
                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                            }}
                        >
                            <View
                                style={{ borderColor: '#E0E0E0', flex: 4, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(1), borderBottomWidth: 0, }}
                            >
                                <Text style={{ fontSize: scale(7), color: '#7E57C2', fontWeight: '500', textAlign: 'right' }}>Net Amount</Text>
                                <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#7E57C2', marginTop: verticalScale(-1), textAlign: 'right' }}>{netAmt} TK</Text>

                            </View>


                        </View>



                    </View>





                </View>


            </View>
        )
    }

    function renderOtpModal() {
        return (

            <Modal
                animationType={'fade'}
                visible={isOtpModal}
                transparent={isOtpModal}

            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    style={{ flex: 1 }}
                >
                    <View style={{
                        flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center',
                    }}

                    >
                        <View
                            style={{

                                alignContent: 'center',
                                backgroundColor: '#F5F5F5',
                                alignItems: 'center',
                                borderRadius: scale(5),
                                width: '90%',
                                height: '70%'
                            }}
                        >

                            <View
                                style={{
                                    //flexDirection:"row",
                                    paddingHorizontal: moderateScale(8),
                                    marginTop: verticalScale(8),

                                }}
                            >

                                <Text style={{ fontSize: scale(15), fontWeight: '700', color: COLORS.purple, }}>{otpType} <Text style={{ fontSize: scale(15), fontWeight: '700', color: COLORS.red, marginTop: verticalScale(9), }}>OTP</Text></Text>

                            </View>

                            <View style={{ flex: 1, width: '100%', marginTop: verticalScale(3), marginBottom: verticalScale(70), paddingHorizontal: moderateScale(6) }}>


                                <FlatList
                                    data={OtpList}
                                    // extraData={otpData}
                                    renderItem={renderOtpList}
                                    keyExtractor={(item) => item.rqstID}
                                    showsVerticalScrollIndicator={true}
                                    refreshing={islodding}
                                //onRefresh={fetchInvData}


                                />


                            </View>


                            <TextInput
                                style={{
                                    marginVertical: SIZES.padding,
                                    color: '#424242',
                                    fontSize: scale(12),
                                    paddingLeft: moderateScale(8),
                                    backgroundColor: '#ffcccc',
                                    paddingVertical: 1,
                                    borderRadius: 2,
                                    height: scale(40),
                                    position: 'absolute',
                                    bottom: scale(28),
                                    left: 0,
                                    right: 0,
                                    shadowOffset: { width: 0, height: 0, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 7,

                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Remarks...."
                                placeholderTextColor='#9E9E9E'
                                selectionColor={COLORS.black}
                                value={otpRemarks}
                                multiline={true}
                                onChangeText={(text) => setOtpRemarks(text)}

                            />



                            <View

                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    shadowOffset: { width: 0, height: 0, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 7,
                                    // background color must be set
                                    // invisible color
                                    backgroundColor: '#EEEEEE',

                                    flexDirection: "row"
                                }}
                            >





                                <TouchableOpacity
                                    style={{
                                        height: scale(28),
                                        backgroundColor: '#EF5350',
                                        borderRadius: 1,
                                        shadowOffset: { width: 0, height: 1, },
                                        shadowOpacity: 0.47,
                                        shadowRadius: 1.49,
                                        elevation: 3,
                                        flex: 1,
                                        marginRight: 1,
                                        flexDirection: "row",
                                        alignItems: 'center',
                                        justifyContent: 'center'

                                    }}
                                    onPress={() => setIsOtpModal(false)}
                                //confirmChk(Invid,'SAVE_PURCHASE')
                                >



                                    {/* <ActivityIndicator animating={true} size={"small"} color={"#ffffff"}  style={{ flex: 1 }}  /> */}

                                    <MaterialIcons name="close" size={scale(15)} color="white" style={{ marginRight: 4 }} />
                                    <Text style={{ fontSize: scale(15), color: COLORS.white, }}> CLOSE </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        height: scale(28),
                                        backgroundColor: '#7E57C2',
                                        borderRadius: 1,
                                        shadowOffset: { width: 0, height: 1, },
                                        shadowOpacity: 0.47,
                                        shadowRadius: 1.49,
                                        elevation: 3,
                                        flex: 1,
                                        flexDirection: "row",
                                        alignItems: 'center',
                                        justifyContent: 'center'

                                    }}
                                    onPress={() => confirmChk(Invid, 'SEND_OTP')}
                                //
                                >



                                    {/* <ActivityIndicator animating={true} size={"small"} color={"#ffffff"}  style={{ flex: 1 }}  /> */}

                                    <MaterialIcons name="lock-open" size={scale(15)} color="white" style={{ marginRight: 4 }} />
                                    <Text style={{ fontSize: scale(15), color: COLORS.white, }}> OTP </Text>
                                </TouchableOpacity>





                            </View>





                        </View>



                    </View>
                </KeyboardAvoidingView>
            </Modal>

        );

    }

    function renderInputModal() {

        return (

            <Modal
                animationType={'fade'}
                visible={isModal}
                transparent={isModal}

            >
                <View style={{
                    flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center',
                }}

                >
                    <View
                        style={{

                            alignContent: 'center',
                            backgroundColor: '#fff',

                            alignItems: 'center',
                            borderRadius: 2,
                            width: '95%',
                        }}
                    >


                        <View
                            style={{

                                paddingHorizontal: moderateScale(4),
                                width: '100%',
                                alignItems: 'center',
                                textAlign: 'center',
                                backgroundColor: '#EEEEEE'
                            }}
                        >


                            <Text style={{ fontSize: scale(10), color: '#EC407A', paddingRight: moderateScale(1), paddingVertical: verticalScale(2) }}>{modalPrdName}</Text>

                        </View>




                        <View
                            style={{ flexDirection: 'row', }}
                        >


                            <View
                                style={{

                                    //paddingHorizontal: SIZES.padding * 1 ,
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#D1C4E9',
                                    flex: 1,
                                    //marginVertical: verticalScale(1),
                                }}
                            >


                                <Text style={{ fontSize: scale(16), fontWeight: '500', color: '#b380ff', textAlign: 'right', }}>{m_type}</Text>

                            </View>
                            <View
                                style={{
                                    backgroundColor: '#e6b3b3',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    flex: 1,
                                    // marginVertical: verticalScale(1),

                                }}
                            >


                                <TextInput
                                    style={{

                                        color: COLORS.white,
                                        fontSize: scale(32),
                                        fontWeight: '500',
                                    }}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholder='0'
                                    autoFocus={true}
                                    placeholderTextColor={COLORS.lightGray}
                                    selectionColor={COLORS.white}
                                    value={modalValue}
                                    onChangeText={(text) => setModalValue(text)}
                                    keyboardType="numeric"
                                />


                            </View>


                        </View>

                        <View
                            style={{ flexDirection: 'row', }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: verticalScale(4),
                                    backgroundColor: 'red',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}
                                onPress={() => setIsModal(false)}
                            >



                                <Ionicons name="close-circle" size={scale(17)} color="white" style={{ marginRight: moderateScale(5) }} />
                                <Text style={{ fontSize: scale(14), fontWeight: '600', color: COLORS.white }}>CLOSE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,

                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,

                                    flexDirection: 'row',
                                    paddingVertical: 6,


                                }}
                                onPress={() => {
                                    if (m_type == 'OVERALL DISCOUNT') {
                                        setOverallDis(modalValue); setIsModal(false)
                                    }
                                    else {
                                        SetValue(modalRqstID, m_type)
                                    }

                                }


                                }
                            >

                                <MaterialIcons name="published-with-changes" size={scale(17)} color="white" style={{ marginRight: moderateScale(5) }} />
                                <Text style={{ fontSize: scale(14), fontWeight: '600', color: COLORS.white }}>DONE</Text>
                            </TouchableOpacity>


                        </View>


                    </View>



                </View>
            </Modal>

        );

    }

    function renderInputModalDisType() {
        return (

            <Modal
                animationType={'fade'}
                visible={isModalDisType}
                transparent={isModalDisType}

            >
                <View style={{
                    flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center',
                }}

                >
                    <View
                        style={{

                            alignContent: 'center',
                            backgroundColor: '#fff',

                            alignItems: 'center',
                            borderRadius: scale(2),
                            width: '95%',
                        }}
                    >


                        <View
                            style={{

                                paddingHorizontal: moderateScale(4),
                                width: '100%',
                                alignItems: 'center',
                                textAlign: 'center',
                                backgroundColor: '#EEEEEE'
                            }}
                        >


                            <Text style={{ fontSize: scale(10), color: '#EC407A', paddingRight: moderateScale(1), paddingVertical: verticalScale(2) }}>{modalPrdName}</Text>

                        </View>




                        <View
                            style={{ flexDirection: 'row', }}
                        >


                            <View
                                style={{

                                    //paddingHorizontal: SIZES.padding * 1 ,
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#D1C4E9',
                                    flex: 5,
                                    // marginVertical: 1,
                                }}
                            >


                                <Text style={{ fontSize: scale(18), fontWeight: '500', color: '#b380ff', textAlign: 'right' }}>{m_type}</Text>

                            </View>


                            <Dropdown
                                style={{

                                    backgroundColor: '#8D6E63',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    flex: 4,
                                    paddingLeft: moderateScale(6),
                                    color: '#FFFFFF'



                                }}
                                //
                                itemTextStyle={{ fontSize: scale(11), marginHorizontal: 0 }}
                                itemContainerStyle={{}}
                                //placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={{ fontSize: scale(11) }}
                                //inputSearchStyle={{height: 20}}
                                //iconStyle={styles.iconStyle}
                                //search
                                // searchPlaceholder="Search..."
                                // placeholder={!isFocus ? 'Select item' : '...'}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                data={[
                                    { label: 'PERCENTAGE', value: 'PERCENTAGE' },
                                    { label: 'FIXED', value: 'FIXED' },

                                ]}
                                maxHeight={scale(400)}
                                labelField="label"
                                valueField="value"
                                placeholder='PERCENTAGE'
                                value={modaldistype}
                                onChange={item => {
                                    setModaldistype(item.value);
                                    // setIsFocus(false);
                                }}

                            />

                            <View
                                style={{



                                    backgroundColor: '#e6b3b3',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    flex: 5,



                                }}
                            >


                                <TextInput
                                    style={{

                                        color: COLORS.white,
                                        fontSize: scale(30),
                                        fontWeight: '500',
                                    }}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholder='0'
                                    autoFocus={true}
                                    placeholderTextColor={COLORS.lightGray}
                                    selectionColor={COLORS.white}
                                    value={modalValue}
                                    onChangeText={(text) => setModalValue(text)}
                                    keyboardType="numeric"
                                />


                            </View>


                        </View>

                        <View
                            style={{ flexDirection: 'row', }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: verticalScale(5),
                                    backgroundColor: 'red',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    //marginRight: 1,
                                }}
                                onPress={() => setIsModalDisType(false)}
                            >



                                <Ionicons name="close-circle" size={scale(17)} color="white" style={{ marginRight: moderateScale(5) }} />
                                <Text style={{ fontSize: scale(13), fontWeight: '600', color: COLORS.white }}>CLOSE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,

                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    flexDirection: 'row',
                                    paddingVertical: verticalScale(5),


                                }}
                                onPress={() => SetValue(modalRqstID, m_type)}
                            >

                                <MaterialIcons name="published-with-changes" size={scale(17)} color="white" style={{ marginRight: moderateScale(5) }} />
                                <Text style={{ fontSize: scale(13), fontWeight: '600', color: COLORS.white }}>DONE</Text>
                            </TouchableOpacity>


                        </View>


                    </View>



                </View>
            </Modal>

        );

    }

    function renderLastprice() {
        return (
            <Modal
                animationType={'fade'}
                visible={isModalLP}
                transparent={isModalLP}

            >

                <TouchableOpacity
                    style={{
                        flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end', alignItems: 'center',
                    }}
                    onPress={() => setIsModalLP(false)}


                >

                    {
                        isModalDatalodding ? (<Loading />)
                            : (
                                <View
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        justifyContent: 'flex-end',

                                    }}
                                >

                                    <View
                                        style={{
                                            paddingHorizontal: moderateScale(5),
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            backgroundColor: '#fff',
                                            //marginBottom:20,
                                        }}
                                    >


                                        <Text style={{ fontSize: scale(10), color: '#b380ff', paddingRight: moderateScale(1), paddingVertical: verticalScale(3), textDecorationLine: 'underline' }}>{modalPrdName}</Text>


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
                                            //refreshing={isModalDatalodding}
                                            // onRefresh={fetchInvData}


                                            />


                                        </View>



                                    </View>


                                </View>
                            )

                    }





                </TouchableOpacity>
            </Modal>

        )
    }

    const onBarCodeRead = async ( data ) => {

        setPurToken(data);
        setScanned(true);
        setIsBootomOpen(false);
        //setScanInterface(false); 

    }



    function renderBootomSheet() {

        if (isBootomOpen) {


            return (

                <BottomSheet
                    ref={sheetRef}
                    snapPoints={snapPoint}
                    enablePanDownToClose={true}

                    onClose={() => setIsBootomOpen(false)}
                // backgroundStyle={{backgroundColor:'#9E87F1'}}

                >
                    <BottomSheetView
                        style={{ flex: 1, width: '100%' }}

                    >

                        {
                            scanInterface ? (<Camera
                                device={device}
                                isActive={true}
                                enableZoomGesture
                                codeScanner={codeScanner}
                                style={{ width: '100%', flex: 1, }}
                               // onBarcodeScanned={scanned ? undefined : onBarCodeRead}
                            ></Camera>) : <View style={{ flex: 1 }}></View>
                        }





                    </BottomSheetView>

                </BottomSheet>

            );

        }
        else {
            return null;
        }

    }




    return (
        <>
            <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
                {renderHeader()}
            </SafeAreaView>

            <View style={{ flex: 1, backgroundColor: '#F3E5F5', }}>

                {rendertop()}

                {
                    islodding ? (<Loading />)
                        : (renderbody({ navigation }))

                }

                {renderFotter()}
                {renderInputModal()}
                {renderInputModalDisType()}
                {renderOtpModal()}
                {renderLastprice()}
                {renderBootomSheet()}


            </View>
        </>
    );
}



export default PurchaseScreen;

