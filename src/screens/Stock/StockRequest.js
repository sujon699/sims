import React, { useState, useEffect } from "react";
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
import { COLORS, SIZES, FONTS, icons, images, baseUrl } from "../../constants";
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import BaseApi from "../../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { Dropdown } from 'react-native-element-dropdown';
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
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


function StockRequest({ navigation, route }) {



    //const [Invid, setInvID] = useState(route.params?.InvID);
    const [invBasicData, setInvBasicData] = useState([]);

    const [centerComboFrom, setCenterComboFrom] = useState([]);
    const [fromCenter, setFromCenter] = useState('');
    const [toCenter, setToCenter] = useState('');


    const [invData, setInvData] = useState([]);
    const [appToken, setappToken] = useState('');
    const [islodding, setIslodding] = useState(false);
    const [isloddingAction, setIsloddingAction] = useState(false);
    const [images, setImages] = useState([]);



    const [prdData, setPrdData] = useState([]);
    const [product, setProduct] = useState('');
    const [hdnprdID, setHdnprdID] = useState('');




    const [user, setUser] = useState('');


    const [userData, setUserData] = useState([]);
    const [carrier, setCarrier] = useState('');
    const [usercombo, setUsercombo] = useState([]);

    const [isModal, setIsModal] = useState(false);
    const [modalCenter, setModalCenter] = useState('');
    const [modalCenterID, setModalCenterID] = useState('');
    const [modalprdQty, setModalprdQty] = useState('');
    const [qty, setQty] = useState('');







    useEffect(() => {
        fetchInvData();
        let cancel = false;
        return () => {
            cancel = true;
        }

    }, []);


    const fetchInvData = async () => {
        //alert(route.params?.InvID);
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        const userName = await AsyncStorage.getItem('userName');
        const center = await AsyncStorage.getItem('branchID');
        setUser(userName);
        //setCarrier(userID);

        setappToken(token);
        if (token !== null) {
            setIslodding(true);
            try {

                const { data } = await BaseApi.post('/Stock/fetchInvData.php', {
                    token: token,
                    act: 'SRCenterInfo',
                    userID: userID,
                    center: center,
                });

                if (data.service_header.status_tag === 'success') {


                    // console.log(data.spw_data);
                    setUser(userName);
                    setCenterComboFrom(data.centerComboFrom);
                    setUsercombo(data.usercombo)



                    if (data.centerComboFrom.length == 1) {
                        setFromCenter(data.centerComboFrom[0].value);
                    }


                }
                else {
                    await logout(navigation, data.service_header.massage);
                    //console.log(data.spw_data);
                    setInvData([]);
                    navigation.goBack();
                }

            }
            catch (error) {
                console.log(error);
                setInvData([]);
            }
            setIslodding(false);

        }
        else {
            setInvData([]);
        }

    }


    const GetStockData = async () => {

        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        const userName = await AsyncStorage.getItem('userName');
        const center = await AsyncStorage.getItem('branchID');
        setUser(userName);
        setappToken(token);
        if (token !== null) {
            setIslodding(true);
            try {

                if (fromCenter == '') {
                    alert('Plz Select Cenetr');
                    setIslodding(false);
                    return false;
                }
                else if (hdnprdID == '') {
                    alert('Plz Select Product');
                    setIslodding(false);
                    return false;
                }
                else {

                    const { data } = await BaseApi.post('/Stock/fetchInvData.php', {
                        token: token,
                        act: 'getPrdCenterStock',
                        prdID: hdnprdID,
                        center: fromCenter,
                        userID: userID,
                    });

                    if (data.service_header.status_tag === 'success') {

                        setInvData(data.spw_data);
                        //console.log(data.spw_data);     
                    }
                    else {
                        //console.log(data.spw_data);
                        setInvData([]);
                        //navigation.goBack();

                    }

                }


            }
            catch (error) {
                console.log(error);
                setInvData([]);
            }
            setIslodding(false);

        }
        else {
            setInvData([]);
        }



    }



    const confirmChk = async (type) => {
        Alert.alert(
            // title
            'Are You Sure ?',
            // body
            '',
            [
                {
                    text: 'YES',
                    onPress: () => {

                        if (type == 'SR') {
                            AddStockRequest();
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
        if (fromCenter == '') {
            errorNo++;
            error += errorNo + " Provide Center  \n";
        }

        if (hdnprdID == '') {
            errorNo++;
            error += errorNo + " Provide Product  \n";
        }


        return error;
    }

    const AddStockRequest = async (invID) => {


        const userID = await AsyncStorage.getItem('userID');
        const token = await AsyncStorage.getItem('token');
        setappToken(token);
        try {
            var errorMsg = await FromValidation();
            if (errorMsg.length == 0) {
                var modifyDetailsID = invData.filter((x) => x.selected == true).map(function (val, i) {
                    return {
                        "centerID": val.centerID,
                        "request_stock": val.request_stock,
                    }

                });

                if (modifyDetailsID.length == 0) {
                    errorMsg += "Plz Select Atlest One Row";

                }


            }

            if (errorMsg.length > 0) {
                setIsloddingAction(false);
                showMessage({
                    message: errorMsg,
                    description: '',
                    duration: 1500,
                    type: "danger",
                });


            }
            else {


                setIslodding(true);
                var modifyDetailsID = JSON.stringify(modifyDetailsID);
                //console.log(modifyDetailsID);
                //return false;
                const { data } = await BaseApi.post('Stock/ActionAPI.php', {
                    token: appToken,
                    act: 'SR_normal',
                    userID: userID,
                    prdID: hdnprdID,
                    fromCenter: fromCenter,
                    carrier: carrier,
                    modifyDetailsID: modifyDetailsID
                });

                //console.log(data);

                if (data.service_header.status_tag === 'success') {
                    setIslodding(false);
                    showMessage({
                        message: "Request Save Sucessfully ",
                        description: '',
                        duration: 2000,
                        type: "success",
                    });

                    navigation.goBack();



                }
                else {
                    //console.log(data.spw_data);
                    setIslodding(false);
                    showMessage({
                        message: data.service_header.message,
                        description: '',
                        duration: 2000,
                        type: "danger",
                    });
                }



            }




        }
        catch (error) {
            console.log(error);
            setIslodding(false);
        }



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
                                STOCK REQUEST
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






                    </View>


                </View>



            </LinearGradient>

        );
    }

    const HandleSearchProduct = (text) => {
        setProduct(text);
        if (text.length == 0) {
            //alert(text.length);
            setPrdData([]);
            setProduct('');
            setHdnprdID('');

        }

        if (text.length > 2) {
            debounceSeacrh(text);
            //debounce(debounceSeacrh,2000);
        }
    }



    const FetchPRDInfo_FS = async (text) => {

        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        setappToken(token);
        if (token !== null) {
            //setIslodding(true);
            try {

                const { data } = await BaseApi.post('/Utility/UtilityApi.php', {
                    token: token,
                    act: 'ProductLookUP',
                    searchText: text,
                    active_con: 1,
                    userID: userID,
                });

                if (data.service_header.status_tag === 'success') {
                    if (data.spw_data.length > 0) {
                        setPrdData(data.spw_data);

                    }

                    // console.log(data.spw_data);           
                }
                else {
                    //console.log(data.spw_data);
                    setPrdData([]);

                }

            }
            catch (error) {
                console.log(error);
                setPrdData([]);
            }
            //setIslodding(false);

        }
        else {
            setPrdData([]);
        }

    }

    const debounceSeacrh = debounce(FetchPRDInfo_FS, 300);

    const checkQty = async () => {


        if (qty > 0) {
            if (parseFloat(qty) <= parseFloat(modalprdQty)) {
                checkDetails(true, modalCenterID, parseFloat(qty));
                setIsModal(false);
            }
            else {
                alert('Qty Invalid');
                setIsModal(false);
            }

        }



    }

    const checkFor_AC = async (value, centerID) => {

        //alert(value);

        if (value == true) {
            var [{ centerID, centerName, ava_stock }] = invData.filter((x) => x.centerID == centerID);

            setQty('');
            setModalCenter(centerName);
            setModalCenterID(centerID);
            setModalprdQty(ava_stock);
            setIsModal(true);



        }
        else {
            checkDetails(value, centerID, 0);
        }

    }

    const checkDetails = async (value, centerID, RSValue) => {



        var Index = invData.findIndex(x => x.centerID === centerID)
        const newIngredients = [...invData];
        newIngredients[Index] = { ...newIngredients[Index], selected: value };
        newIngredients[Index] = { ...newIngredients[Index], request_stock: RSValue };
        setInvData(newIngredients);
    }




    const rendertop = () => {

        return (
            <View style={{ marginTop: verticalScale(4), paddingHorizontal: moderateScale(6), marginBottom: verticalScale(7), marginTop: verticalScale(8) }}>

                <View
                    style={{

                        shadowOffset: { width: 0, height: 1, },
                        shadowOpacity: 0.47,
                        shadowRadius: 1.0,
                        elevation: 3,
                        borderRadius: 6,
                        backgroundColor: COLORS.white,
                        paddingHorizontal: moderateScale(6),


                    }}

                >

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        zIndex: 0
                    }}>
                        <View
                            style={{
                                flex: 4,
                                marginRight: moderateScale(4),
                                marginTop: verticalScale(2)

                            }}
                        >

                            <Text
                                style={{
                                    color: '#757575',
                                    fontSize: scale(10),
                                    marginBottom: verticalScale(-6),
                                    marginLeft: moderateScale(2),

                                }}>
                                Request For
                            </Text>
                            <Dropdown
                                style={{
                                    marginVertical: verticalScale(7),
                                    color: '#424242',
                                    fontSize: scale(11),
                                    paddingLeft: moderateScale(9),
                                    backgroundColor: '#A5D6A7',

                                    borderRadius: 2,
                                    height: verticalScale(30),
                                    shadowOffset: { width: 0, height: 1, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 3,
                                }}
                                //
                                itemTextStyle={{ fontSize: scale(10), }}
                                itemContainerStyle={{ marginVertical: verticalScale(-7), }}
                                //placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={{ fontSize: scale(11) }}
                                inputSearchStyle={{ height: verticalScale(30) }}
                                //iconStyle={styles.iconStyle}
                                search
                                // searchPlaceholder="Search..."
                                // placeholder={!isFocus ? 'Select item' : '...'}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                data={centerComboFrom}
                                maxHeight={verticalScale(550)}
                                labelField="label"
                                valueField="value"
                                placeholder='Select Center'
                                value={fromCenter}
                                onChange={item => {

                                    if (fromCenter != item.value) {
                                        setInvData([]);
                                    }
                                    setFromCenter(item.value);
                                    // setIsFocus(false);
                                }}

                            />




                        </View>

                        <View
                            style={{
                                flex: 4,
                                marginTop: verticalScale(2)
                            }}
                        >



                            <Text
                                style={{
                                    color: '#757575',
                                    fontSize: scale(10),
                                    marginBottom: verticalScale(-6),
                                    marginLeft: moderateScale(2),

                                }}>
                                Carrier
                            </Text>


                            <Dropdown
                                style={{


                                    marginVertical: verticalScale(7),

                                    fontSize: scale(11),
                                    paddingLeft: moderateScale(9),
                                    color: '#424242',
                                    backgroundColor: '#90A4AE',

                                    borderRadius: 2,
                                    height: verticalScale(30),
                                    shadowOffset: { width: 0, height: 1, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 3,


                                }}
                                //
                                itemTextStyle={{ fontSize: scale(14), }}
                                itemContainerStyle={{ marginVertical: verticalScale(-7), }}
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


                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 0,
                        paddingBottom: verticalScale(8),
                        marginTop: verticalScale(-2)



                    }}>
                        <View
                            style={{
                                flex: 5,
                                marginRight: moderateScale(3)


                            }}
                        >


                            <TextInput
                                style={{

                                    color: '#424242',
                                    fontSize: scale(10),
                                    paddingLeft: moderateScale(8),
                                    backgroundColor: '#FFCC80',
                                    paddingVertical: verticalScale(2),
                                    borderRadius: 2,
                                    height: verticalScale(30),
                                    shadowOffset: { width: 0, height: 1, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 3,



                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="PRODUCT"
                                placeholderTextColor='#9E9E9E'
                                selectionColor={COLORS.black}
                                value={product}
                                onChangeText={HandleSearchProduct}

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
                                    data={prdData}
                                    renderItem={renderPrdItem}
                                    keyExtractor={(item) => item.product_id}
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        zIndex: 99999
                                    }}
                                />
                            </View>




                        </View>

                        <View
                            style={{
                                flex: 1,


                            }}
                        >

                            <TouchableOpacity
                                style={{
                                    height: verticalScale(30),
                                    backgroundColor: '#7E57C2',
                                    justifyContent: 'center',
                                    borderRadius: scale(4),
                                    marginLeft: moderateScale(2),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    shadowOffset: { width: 0, height: 1, },
                                    shadowOpacity: 0.47,
                                    shadowRadius: 1.49,
                                    elevation: 3,


                                }}

                                onPress={() => { GetStockData() }}

                            >
                                <Text style={{ ...FONTS.h5, color: COLORS.white, justifyContent: 'center', }}> GO</Text>
                            </TouchableOpacity>


                        </View>


                    </View>










                </View>


            </View>


        );
    }

    const renderPrdItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ padding: scale(6), flexDirection: 'row', borderBottomColor: '#F5F5F5', borderBottomWidth: 1 }}
                onPress={() => {
                    setProduct(item.product_name)
                    setHdnprdID(item.product_id)
                    setPrdData([]);
                }}
            >

                <Text style={{ fontSize: scale(11), color: '#F5F5F5', }}>{item.product_nameEx.toUpperCase()}</Text>
            </TouchableOpacity>
        )
    }


    const renderInvList = ({ item }) => {


        return (



            <View
                key={item.centerID}
                style={{


                    borderRadius: 6,
                    marginBottom: 0,
                    paddingHorizontal: moderateScale(5),
                    paddingVertical: verticalScale(2),
                    marginHorizontal: moderateScale(1),
                    justifyContent: 'space-between',
                    flexDirection: 'row',

                }}

            >





                <TouchableOpacity
                    style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#BA68C8', textAlign: 'center', marginRight: moderateScale(2), padding: scale(6)
                    }}
                    onPress={() => { checkFor_AC(!item.selected, item.centerID) }}
                >
                    <Text style={{ fontSize: scale(13), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                    <MaterialIcons name={item.selected == true ? "radio-button-checked" : "radio-button-unchecked"} size={scale(18)} color="white" style={{ textAlign: 'center' }} />

                </TouchableOpacity>

                <View
                    style={{ paddingTop: verticalScale(2), paddingLeft: moderateScale(5), flex: 7, backgroundColor: '#E0E0E0', marginRight: moderateScale(2), justifyContent: 'center' }}
                >
                    <Text style={{ fontSize: scale(9), fontWeight: '600', color: '#E91E63', }}>{item.centerName}</Text>

                </View>

                <View

                    style={{
                        flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#81C784', textAlign: 'center', marginRight: moderateScale(2), borderRadius: 2
                    }}
                    onPress={() => { }}
                >
                    <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#fff' }}>{item.ava_stock}</Text>

                </View>

                <View

                    style={{
                        flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#E57373', textAlign: 'center', marginRight: moderateScale(1), borderRadius: 2
                    }}
                    onPress={() => { }}
                >
                    <Text style={{ fontSize: scale(11), fontWeight: '600', color: '#fff' }}>{item.request_stock}</Text>

                </View>


            </View>


        );
    }

    function renderModalQty() {
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
                            width: '85%',
                            alignItems: 'center',
                            borderRadius: scale(2),
                        }}
                    >

                        <View
                            style={{
                                width: '100%',
                            }}
                        >
                            <View
                                style={{

                                    paddingHorizontal: moderateScale(2),
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    backgroundColor: '#fff'
                                }}
                            >




                                <Text style={{ fontSize: scale(12), color: '#b380ff', paddingRight: moderateScale(1) }}>{modalCenter}</Text>

                            </View>


                            <View
                                style={{



                                    backgroundColor: '#e6b3b3',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: scale(50),

                                }}
                            >


                                <TextInput
                                    style={{

                                        color: COLORS.white,
                                        fontSize: scale(42),
                                        fontWeight: '500',
                                    }}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholder='0'
                                    placeholderTextColor={COLORS.lightGray}
                                    selectionColor={COLORS.white}
                                    autoFocus={true}
                                    value={qty}
                                    onChangeText={(text) => setQty(text)}
                                    keyboardType="numeric"
                                />


                            </View>

                            <View
                                style={{ flexDirection: 'row', }}
                            >

                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: COLORS.primary,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 1,
                                        marginRight: moderateScale(1),


                                    }}
                                    onPress={() => checkQty()}
                                >

                                    <MaterialIcons name="published-with-changes" size={scale(16)} color="white" style={{ marginRight: moderateScale(5) }} />
                                    <Text style={{ fontSize: scale(13), fontWeight: '600', color: COLORS.white }}>Done</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'red',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 1,
                                        borderRadius: 1,
                                    }}
                                    onPress={() => setIsModal(false)}
                                >



                                    <Ionicons name="close-circle" size={scale(16)} color="white" style={{ marginRight: moderateScale(5) }} />
                                    <Text style={{ fontSize: scale(13), fontWeight: '600', color: COLORS.white }}>Close</Text>
                                </TouchableOpacity>

                            </View>


                        </View>

                    </View>

                </View>
            </Modal>


        )
    }



    function renderbody({ navigation }) {
        return (


            <View style={{ flex: 1, marginBottom: verticalScale(10), paddingHorizontal: moderateScale(1) }}>


                <View

                    style={{


                        borderRadius: 6,
                        marginBottom: 0,
                        paddingHorizontal: moderateScale(5),
                        paddingVertical: verticalScale(2),
                        marginHorizontal: moderateScale(1),
                        justifyContent: 'space-between',
                        flexDirection: 'row',

                    }}

                >





                    <View
                        style={{
                            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#BA68C8', textAlign: 'center', marginRight: moderateScale(2), padding: scale(6)
                        }}
                        onPress={() => { }}
                    >
                        <Text style={{ fontSize: scale(13), color: '#fff', paddingRight: 1 }}>SL</Text>


                    </View>

                    <View
                        style={{ paddingTop: verticalScale(2), paddingLeft: moderateScale(4), flex: 7, backgroundColor: '#E0E0E0', marginRight: moderateScale(2), justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: scale(12), fontWeight: '600', color: '#E91E63', textAlign: 'center' }}>Center</Text>

                    </View>

                    <View

                        style={{
                            flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#81C784', textAlign: 'center', marginRight: moderateScale(2), borderRadius: 2
                        }}

                    >
                        <Text style={{ fontSize: scale(12), fontWeight: '600', color: '#fff' }}>AQ</Text>

                    </View>

                    <View

                        style={{
                            flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#E57373', textAlign: 'center', marginRight: 1, borderRadius: 2
                        }}

                    >
                        <Text style={{ fontSize: scale(12), fontWeight: '600', color: '#fff' }}>RQ</Text>

                    </View>


                </View>


                <FlatList
                    data={invData}
                    // extraData={otpData}
                    renderItem={renderInvList}
                    keyExtractor={(item) => item.centerID}
                    showsVerticalScrollIndicator={true}
                    refreshing={islodding}
                //onRefresh={fetchInvData}


                />


            </View>
        );
    }

    function renderFotter() {



        return (
            <View

                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: verticalScale(55),
                    shadowOffset: { width: 0, height: 0, },
                    shadowOpacity: 0.47,
                    shadowRadius: 1.49,
                    elevation: 7,
                    borderTopRightRadius: 4,
                    borderTopLeftRadius: 4,
                    backgroundColor: '#EEEEEE',
                    marginBottom: 0,
                    paddingHorizontal: moderateScale(12),
                    paddingVertical: verticalScale(2),
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
                            height: verticalScale(33),
                            backgroundColor: '#7E57C2',
                            justifyContent: 'center',
                            borderRadius: scale(4),
                            flexDirection: 'row',
                            alignItems: 'center',
                            shadowOffset: { width: 0, height: 1, },
                            shadowOpacity: 0.47,
                            shadowRadius: 1.49,
                            elevation: 3,
                            flex: 6,
                            marginTop: verticalScale(4)

                        }}

                        onPress={() => {

                            if (!islodding) {
                                confirmChk('SR');
                            }


                        }
                        }

                    >


                        {
                            islodding ? (<ActivityIndicator animating={islodding} size={"small"} color={"#ffffff"} />)
                                : (<><Entypo name="save" size={scale(15)} color="white" style={{ marginRight: moderateScale(5) }} />
                                    <Text style={{
                                        fontSize: scale(14), fontWeight: '600', color: COLORS.white,
                                        justifyContent: 'center',
                                    }}> Request</Text></>)
                        }
                        {/* <ActivityIndicator animating={pendingOtpStatus} size={"small"} color={"#ffffff"}  style={{ flex: 1 }}  /> */}

                    </TouchableOpacity>











                </View>


            </View>
        )
    }




    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                style={{ flex: 1, }}
            >
                <SafeAreaView style={{ backgroundColor: COLORS.blue }}>
                    {renderHeader()}
                </SafeAreaView>


                <View style={{ flex: 1, backgroundColor: '#F3E5F5', }} onPress={Keyboard.dismiss} accessible={false}>

                    {rendertop()}


                    {
                        islodding ? (<Loading />)
                            : (renderbody({ navigation }))

                    }

                    {renderModalQty()}
                    {renderFotter()}


                </View>

            </KeyboardAvoidingView>
        </>
    );
}



export default StockRequest;

