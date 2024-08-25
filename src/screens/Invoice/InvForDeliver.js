import React,{useState,useEffect,useRef, version} from "react";
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
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Animated
} from "react-native"
import { COLORS, SIZES, FONTS, icons, images,baseUrl } from "../../constants";
import { FontAwesome } from '@expo/vector-icons';


import Entypo from 'react-native-vector-icons/dist/Entypo';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import BaseApi from "../../api/BaseApi"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
// import * as Print from 'expo-print';
import Loading from "../../utils/Loading";
import { logout } from "../../utils/utility";
import QrCodeModal from "../../utils/QrCodeModal";
import QRCode from 'react-native-qrcode-svg';

import BottomSheet,{BottomSheetView} from "@gorhom/bottom-sheet";
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

let timer;
const debounce = function (fn,d) {
    
    return function (...args)  {
         if(timer)  clearTimeout(timer);
         timer = setTimeout(() => {
            fn.apply(null,args);
         },d);
    };

};



  


function InvForDeliver({navigation, route}) {

      const [Invid, setInvID] = useState(route.params?.InvID);
      const [forcheck, setForcheck] = useState(route.params?.Forcheck);

      
      
      const [invBasicData, setInvBasicData] = useState([]);
      const [invData, setInvData] = useState([]);
      const [appToken, setappToken] = useState(''); 
      const [islodding, setIslodding] = useState(false);
      const [isloddingAction, setIsloddingAction] = useState(false);
      const [isModal, setIsModal] = useState(false);
      const [isModalForCommon, setIsModalForCommon] = useState(false);
      const [lastPriceData, setLastPriceData] = useState([]);
      const [isModalDatalodding, setIsModalDatalodding] = useState(false);
      
      const [qty, setQty] = useState('');
      const [modalPrdName, setModalPrdName] = useState('');
      const [modalprdDetailsID, setModalprdDetailsID] = useState('');
      const [modalprdQty, setModalprdQty] = useState('');
      
     
      const [modalstatus, setModalstatus] = useState(false);
      const [qrValue, setQrValue] = useState('none');
      const [qrtitle, setQrtitle] = useState('none');


      const [user_id, setUser_id] = useState('');

      
      const [otherCenterSR, setOtherCenterSR] = useState([]);

      const [modalSR, setModalSR] = useState(false);
      const [ismodalLodding, setIsmodalLodding] = useState(false);

      const [modalstatusEx, setModalstatusEx] = useState(false);
      const [qrValueEx, setQrValueEx] = useState('');
      const [isModalForNote, setIsModalForNote] = useState(false);
      const [distributionNote, setDistributionNote] = useState('');

      const [carrier, setCarrier] = useState('');
      

      const [showChallantoggle, setShowChallantoggle] = useState(false);
      const [showShipmetToggle, setShowShipmetToggle] = useState(false);
      
      const fadeAnimChallan = useRef(new Animated.Value(0)).current;
      
      const [challnData, setChallnData] = useState([]);
      const [challanDetailsData, setChallanDetailsData] = useState([]);
      
      
      const [modalCommonFor, setModalCommonFor] = useState('');
      const [modalTitle, setModalTitle] = useState('');
       
      const [prdManageStockData, setPrdManageStockData] = useState([]);
      
      const [isBootomOpen, setIsBootomOpen] = useState(false);
      const sheetRef = useRef(null);
      const snapPoint = ["65%","75%"];

      const [courierCombo, setCourierCombo] = useState([]);
      const [shipmentCombo, setShipmentCombo] = useState([]);
      const [divisioncombo, setDivisioncombo] = useState([]);
      const [districtcombo, setDistrictcombo] = useState([]);
      const [usercombo, setUsercombo] = useState([]);
      
     
      const [selectAddress, setSelectAddress] = useState();
      const [division, setDivision] = useState();
      const [district, setDistrict] = useState();
      const [cp_name, setCp_name] = useState('');
      const [cp_mobile, setCp_mobile] = useState(0);
      const [selectCourier, setSelectCourier] = useState('');
      const [couriername, setCouriername] = useState('');

      const [shipExist, setShipExist] = useState(0);
      

      const [shipaddress, setShipaddress] = useState('');
      const [hdnConditionConf, setHdnConditionConf] = useState(0);
      const [cnd_amount, setCnd_amount] = useState(0);
      const [con_additional_rmks, setCon_additional_rmks] = useState('');

      
      const [ismodalDeliver, setIsmodalDeliver] = useState(false);
      const [speceficChallanDetail, setSpeceficChallanDetails] = useState('');
      const [user, setUser] = useState('');



    useEffect( () => {
    fetchInvData();  
        let cancel = false;
        return () => { 
            cancel = true;
        }

    }, []);


    const fetchInvData = async () =>{
        //alert(route.params?.InvID);
        const token =  await AsyncStorage.getItem('token');
        const userID =  await AsyncStorage.getItem('userID');
        const userName =  await AsyncStorage.getItem('userName');
        setUser(userName);
        setUser_id(userID);
        setappToken(token);
        if(token !== null) 
        {
        setIslodding(true);
        setIsloddingAction(true);
            try 
            {
            
            const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                token: token,
                act:'PathForInv',
                InvID : route.params?.InvID,
                userID : userID,
                forcheck : forcheck
                });
               

                if(data.service_header.status_tag === 'success')
                {
                    //console.log(data.spw_data); 
                    setInvData(data.spw_data);
                     //console.log(data.invBasicData); 
                    setInvBasicData(data.invBasicData); 
                    setChallnData(data.invBasicData.challanList);  
                    setShipmentCombo(data.invBasicData.shipmentcombo);  
                    setCourierCombo(data.invBasicData.couirercombo);
                    setDivisioncombo(data.invBasicData.divisioncombo);
                    setDistrictcombo(data.invBasicData.districtcombo);
                    setUsercombo(data.invBasicData.usercombo);
                    
                    
              
                    
                    if(data.invBasicData.isShipmentEX == 1)
                    {
                        setShipExist(1);
                        setSelectAddress(data.invBasicData.challanShipInfo.selectAddress);
                        setDivision(data.invBasicData.challanShipInfo.division);
                        setDistrict(data.invBasicData.challanShipInfo.district);
                        setCp_name(data.invBasicData.challanShipInfo.cp_name);
                        setCp_mobile(data.invBasicData.challanShipInfo.cp_mobile);
                        setSelectCourier(data.invBasicData.challanShipInfo.courier);
                        setShipaddress(data.invBasicData.challanShipInfo.shipaddress); 
                        setCouriername(data.invBasicData.challanShipInfo.couriername);
                        setCnd_amount(data.invBasicData.challanShipInfo.cnd_amount)
                    }
                    else
                    {
                        setShipExist(0);
                    }
                  
                    

                   //console.log(data.invBasicData.isShipmentEX);   
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    setInvData([]);
                    setInvBasicData([]);
                    setChallnData([]);
                    setShipmentCombo([]);
                    setCourierCombo([]);
                    //console.log(data.spw_data)
                    showMessage({
                        message: data.service_header.message,
                        description:'',
                        duration:2000,
                        type: "danger",
                    });
                    navigation.goBack();

                }
            
            } 
            catch (error) 
            {
                setInvData([]);
                setInvBasicData([]);
                setChallnData([]);
                setShipmentCombo([]);
            }
            setIslodding(false);
            setIsloddingAction(false);
            
        }
        else
        {
            setOtpData([]);
        }

       
    
    } 


    const confirmChk = async (ID,type,others="") =>{
        Alert.alert(
        // title
        'Are You Sure ?',
        // body
        ID,
        [
            {
            text:'YES',
            onPress: () => {
                if(type == 'Arrange')
                {
                    UpdateArrangeBy(ID); 
                }
                else if(type == "Checked" ){
                    UpdateCheckedBy(ID);
                }
                else if(type == "PURCHASE_REQUEST" ){
                    PrdRequest(ID,type);
                }
                else if(type == "STOCK_REQUEST_EX"){
                    StockRequest(ID,others);
                }
                else if(type == "STOCK_REQUEST"){
                    PrdRequest(ID,type);
                    setModalSR(false);
                }
                else if(type == "Remove_Arrange"){
                    RemoveArrange(ID,type);
                }
                else if(type == "ModifyShipment")
                {
                    ModifyShipment(ID,others);
                }
                else if(type == "Deliver")
                {
                    SalesDeliver(ID);
                }
                else if(type == 'Undeliver_Inv')
                {
                    UndeliverInvioce(ID);
                }
                else if(type == 'DeleteInv')
                {
                    DeleteInvioce(ID);
                }
                else if(type == 'DeleteChallan')
                {
                    DeleteChallan(ID,others);
                }
                else if(type == 'DeleteChallanPrd')
                {
                    DeleteChallanPrd(ID,others);
                }

                
                
                

                
                    
            }
            },
            {
            text:'NO',
            onPress: () => {
                
            }
            }

        ]
        )
    }

      
    const PrdRequest = async (invID,Type) =>{
        

    
        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
            var modifyDetailsID =  invData.filter((x)=> x.selected == true).map(function(val, i){
                    return {
                        "InvoiceDetailsID" : val.InvoiceDetailsID,
                        "qty" : val.qty,
                        "prdID" : val.prdID,
                    
                    }

            })

            //  console.log(modifyDetailsID);
            //  console.log(invID);
            // return false;



            if(modifyDetailsID.length == 0)
            {
                setIsloddingAction(false);
                showMessage({
                    message: "Plz Select Atlest One Row",
                    description:invID,
                    duration:2000,
                    type: "danger",
                });
                
            
            }
            else
            {
                    modifyDetailsID =  JSON.stringify(modifyDetailsID);
                    const {data} = await BaseApi.post('/DistriBution/ProductRequestAPI.php', {
                        token: appToken,
                        act:'PrdRequest',
                        userID:userID,
                        invID:invID,
                        modifyDetailsID: modifyDetailsID,
                        requestType : Type,
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        setIsloddingAction(false);
                        showMessage({
                            message: data.service_header.message,
                            description:invID,
                            duration:2000,
                            type: "success",
                            });
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIsloddingAction(false);
                        showMessage({
                        message: data.service_header.message,
                        description:invID,
                        duration:2000,
                        type: "danger",
                        });
                    }

            }
            

        
        
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();

    }

    const StockRequest = async (salesDetsilsID,requestCenter) =>{
        
    
        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
            
            

            const {data} = await BaseApi.post('/Stock/ActionAPI.php', {
                token: appToken,
                act:'StockRequestNew',
                userID:userID,
                carrier:carrier,
                invID:invBasicData.InvID,
                requestQty:modalprdQty,
                salesDetsilsID : salesDetsilsID,
                requestCenter : requestCenter,
            });

            if(data.service_header.status_tag === 'success')
            {
                
                setIsloddingAction(false);
                showMessage({
                    message: "Stock Request Sucessfully ",
                    description:salesDetsilsID,
                    duration:3000,
                    type: "success",
                    });



                
            }
            else
            {
                await logout(navigation,data.service_header.massage);
                setIsloddingAction(false);
                showMessage({
                message: data.service_header.message, 
                description:salesDetsilsID,
                duration:3000,
                type: "danger",
                });
                
            }

            
            
            
        
        
        
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
            setModalSR(false);
        }
        fetchInvData(); 

    }


    const UpdateArrangeBy = async (invID) =>{

        
       if(invBasicData.InvoiceType != 'PARTIAL')
       {
         var act = 'UpdateArrangeBy';
         var challanID = "CHALLAN-01";
       }
       else
       {
        var act = 'UpdateArrangeBy_Prtial';
        var challanID = invBasicData.running_challan_no;
       }

        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
            var modifyDetailsID =  invData.filter((x)=> x.selected == true).map(function(val, i){
                    return {
                        "InvoiceDetailsID" : val.InvoiceDetailsID,
                        "prdID": val.prdID,
                        "qty": val.qty,
                        "delivery_qty": val.delivery_qty,
                        "challan_qty": val.challan_qty,
                        

                    }

            })

            if(modifyDetailsID.length == 0)
            {
                setIsloddingAction(false);
                showMessage({
                    message: "Plz Select Atlest One Row",
                    description:invID,
                    duration:2000,
                    type: "danger",
                    });
                
            
            }
            else
            {
                      modifyDetailsID =  JSON.stringify(modifyDetailsID);
                        const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                            token: appToken,
                            act: act,
                            userID:userID,
                            invID:invID,
                            modifyDetailsID: modifyDetailsID,
                            challanID: challanID
                        });

                    
                   
    
                    if(data.service_header.status_tag === 'success')
                    {
                        // console.log(data.spw_data);
                        setIsloddingAction(false);
                        showMessage({
                            message: "Update Sucessfully ",
                            description:invID,
                            duration:2000,
                            type: "success",
                            });
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIsloddingAction(false);
                        showMessage({
                        message: "Update Unsucessfully ",
                        description:invID,
                        duration:2000,
                        type: "danger",
                        });
                    }

            }

            
            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
    
    }

    const UpdateCheckedBy = async (invID) =>{

        

        if(invBasicData.InvoiceType != 'PARTIAL')
        {
          var act = 'UpdateCheckedBy_new';
          var challanID = "CHALLAN-01";
        }
        else
        {
         var act = 'UpdateCheckedBy_Partial';
         var challanID = invBasicData.running_challan_no;
        }


        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
            
            
            var modifyDetailsID =  invData.filter((x)=> (x.selected == true) && x.arangeByID != userID && x.arrangeStatus == 'Done').map(function(val, i){
                return {
                    "InvoiceDetailsID" : val.InvoiceDetailsID
                }

            });

                var Rest_CheckNO =  invData.filter((x)=> x.checkedBy.length == 0).map(function(val, i){
                    return {
                        "InvoiceDetailsID" : val.InvoiceDetailsID
                    }

                });
                 
                

               
 
               if(modifyDetailsID.length == 0 && Rest_CheckNO.length != 0)
                {
                    setIsloddingAction(false);
                    showMessage({
                        message: "Plz Select Atlest One Row",
                        description:invID,
                        duration:2000,
                        type: "danger",
                    });
                    
                    
                
                }
                else
                {
                   
                    if(Rest_CheckNO.length == 0)
                    {
                        modifyDetailsID =  invData.filter((x)=> x.checkedBy.length > 0).map(function(val, i){
                            return {
                                "InvoiceDetailsID" : val.InvoiceDetailsID,
                                "prdID": val.prdID,
                                "qty": val.qty,
                                "delivery_qty": val.delivery_qty,
                                "challan_qty": val.challan_qty,
                            }
        
                        });
                      

                    }


                    modifyDetailsID =  JSON.stringify(modifyDetailsID);
                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:act,
                        userID:userID,
                        invID:invID,
                        modifyDetailsID: modifyDetailsID,
                        challanID:challanID
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        console.log(data.spw_data);
                        setIsloddingAction(false);
                        showMessage({
                            message: "Update Sucessfully ",
                            description:invID,
                            duration:2000,
                            type: "success",
                            });
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        console.log(data.spw_data);
                        setIsloddingAction(false);
                        showMessage({
                        message: "Update Unsucessfully ",
                        description:invID,
                        duration:2000,
                        type: "danger",
                        });
                    }

                }
                


            
            

            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
    
    }

    const RemoveArrange = async (invID) =>{

        if(invBasicData.InvoiceType != 'PARTIAL')
        {
          var act = 'RemoveArrange';
          var challanID = "CHALLAN-01";
        }
        else
        {
         var act = 'RemoveArrange_Partial';
         var challanID = invBasicData.running_challan_no;
        }


        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
            
                
                var modifyDetailsID =  invData.filter((x)=> (x.selected == true) && x.arangeByID != userID && x.arrangeStatus == 'Done' ).map(function(val, i){
                    return {
                        "InvoiceDetailsID" : val.InvoiceDetailsID,
                        "prdID": val.prdID,
                        "qty": val.qty,
                        "delivery_qty": val.delivery_qty,
                        "challan_qty": val.challan_qty,
                    }

                });

                
                
              if(modifyDetailsID.length == 0)
                {
                    setIsloddingAction(false);
                    showMessage({
                        message: "Plz Select Atlest One Row",
                        description:invID,
                        duration:2000,
                        type: "danger",
                    });
                    
                
                }
                else
                {
                    modifyDetailsID =  JSON.stringify(modifyDetailsID);
                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:act,
                        userID:userID,
                        invID:invID,
                        modifyDetailsID: modifyDetailsID,
                        challanID:challanID
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        setIsloddingAction(false);
                        showMessage({
                            message: "Update Sucessfully ",
                            description:invID,
                            duration:2000,
                            type: "success",
                            });
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIsloddingAction(false);
                        showMessage({
                        message: "Update Unsucessfully ",
                        description:invID,
                        duration:2000,
                        type: "danger",
                        });
                    }

                }
                


            
            

            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
    
    }

    const UndeliverInvioce = async (invID) =>{

        if(invBasicData.InvoiceType != 'PARTIAL')
        {
          var act = 'UndeliverSales';
          var challanID = "CHALLAN-01";
        }
        else
        {
         var act = 'Undeliver_Partial';
         var challanID = invBasicData.running_challan_no;
        }


        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {

               
                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:act,
                        userID:userID,
                        invID:invID,
                        challanID:challanID
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        setIsloddingAction(false);
                        showMessage({
                            message: "Update Sucessfully ",
                            description:invID,
                            duration:2000,
                            type: "success",
                            });
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIsloddingAction(false);
                        showMessage({
                        message: "Update Unsucessfully ",
                        description:invID,
                        duration:2000,
                        type: "danger",
                        });
                    }

            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
    
    }

    const DeleteInvioce = async (invID) =>{

        if(invBasicData.InvoiceType != 'PARTIAL')
        {
          var act = 'DeleteSales';
          var challanID = "CHALLAN-01";
        }
        else
        {
         var act = 'Delete_Partial';
         var challanID = invBasicData.running_challan_no;
        }


        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:act,
                        userID:userID,
                        invID:invID,
                        challanID:challanID
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        setIsloddingAction(false);
                        showMessage({
                            message: data.service_header.message,
                            description:'',
                            duration:2000,
                            type: "success",
                            });

                            setTimeout(() => {
                                navigation.goBack();
                            }, 2500);
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIsloddingAction(false);
                        showMessage({
                        message: data.service_header.message,
                        description:'',
                        duration:2000,
                        type: "danger",
                        });
                    }

                
                


            
            

            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
    
    }

    const DeleteChallan = async (invID,challanID) =>{

     
         var act = 'Delete_Partial_challan';
         //var challanID = invBasicData.running_challan_no;

        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:act,
                        userID:userID,
                        invID:invID,
                        challanID:challanID
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        //console.log(data);
                        setIsModalForCommon(false);
                        setIsloddingAction(false);
                        showMessage({
                            message: data.service_header.message,
                            description:'',
                            duration:2000,
                            type: "success",
                            });

                            // setTimeout(() => {
                            //     navigation.goBack();
                            // }, 2500);
    
                        
                    }
                    else
                    {
                        setIsModalForCommon(false);
                        //console.log(data);
                        await logout(navigation,data.service_header.massage);
                        setIsloddingAction(false);
                        showMessage({
                        message: data.service_header.message,
                        description:'',
                        duration:2000,
                        type: "danger",
                        });
                    }

                
                


            
            

            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
    
    }

    const DeleteChallanPrd = async (challanID,invdetailsID) =>{

     
        var act = 'Delete_Partial_challan_prd';
        //var challanID = invBasicData.running_challan_no;

       const userID =  await AsyncStorage.getItem('userID');
       setIsloddingAction(true);
       try 
       {
                   const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                       token: appToken,
                       act:act,
                       userID:userID,
                       invdetailsID:invdetailsID,
                       challanID:challanID,
                       invID:Invid
                   });
   
                   if(data.service_header.status_tag === 'success')
                   {
                       //console.log(data);
                       setIsModalForCommon(false);
                       setIsloddingAction(false);
                       showMessage({
                           message: data.service_header.message,
                           description:'',
                           duration:2000,
                           type: "success",
                           });

                           // setTimeout(() => {
                           //     navigation.goBack();
                           // }, 2500);
   
                       
                   }
                   else
                   {
                       setIsModalForCommon(false);
                       //console.log(data);
                       await logout(navigation,data.service_header.massage);
                       setIsloddingAction(false);
                       showMessage({
                       message: data.service_header.message,
                       description:'',
                       duration:2000,
                       type: "danger",
                       });
                   }

               
               


           
           

           
       } 
       catch (error) 
       {
           console.log(error);
           setIsloddingAction(false);
       }
       fetchInvData();
   
   }

    

    

    

    const AddNote = async() =>{

        var Index = invData.findIndex(x=>x.InvoiceDetailsID === modalprdDetailsID)
        const newIngredients = [...invData];
        newIngredients[Index] = {...newIngredients[Index], reference: distributionNote};
        setInvData(newIngredients);
                                                            
        
        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        try 
        {
                var note = distributionNote.trim();
                if(note.length <= 39)
                {
                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:'DisNoteAdd',
                        userID:userID,
                        invID:Invid,
                        note: note,
                        InvoiceDetailsID: modalprdDetailsID
                    });
    
                    if(data.service_header.status_tag === 'success')
                    {
                        setIsModalForNote(false);
                        setIsloddingAction(false);
                        showMessage({
                            message: "Update Sucessfully ",
                            description:Invid,
                            duration:2000,
                            type: "success",
                            });
    
                        
                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        setIsModalForNote(false);
                        setIsloddingAction(false);
                        showMessage({
                        message: "Update Unsucessfully ",
                        description:Invid,
                        duration:2000,
                        type: "danger",
                        });
                    }

                }
                else
                {
                    showMessage({
                    message: "Note Must be 40 Charecters",
                    description:Invid,
                    duration:2000,
                    type: "danger",
                    });

                }
                

                
                
            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        setIsModalForNote(false); 
               


    }

    const ModifyShipment = async(invID,challanID) =>{

             //alert(challanID);
        const userID =  await AsyncStorage.getItem('userID');
        setIsloddingAction(true);
        setIsBootomOpen(false);setShowChallantoggle(false);
        try 
        {
          
               var add_cnd_amountex = parseFloat(cnd_amount);
               if((selectAddress == '' || selectAddress == null))
               {
                    showMessage({
                        message: "Select Shipment Address",
                        description:Invid,
                        duration:2000,
                        type: "danger",
                    });
                    setIsloddingAction(false);
                    return false;
                  
               }
               else if((selectCourier == '' || selectCourier == null) && selectAddress != 'ON HAND')
               {
                    showMessage({
                        message: "Select Courier Address",
                        description:Invid,
                        duration:2000,
                        type: "danger",
                    });
                    setIsloddingAction(false);
                    return false;

               }
               else if(isNaN(add_cnd_amountex) )
               {
                  
                    showMessage({
                        message: "Invalid Condition Amount",
                        description:Invid,
                        duration:2000,
                        type: "danger",
                    });
                    setIsloddingAction(false);
                    return false;
               }
               else
               {

                    const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                        token: appToken,
                        act:'ModifyShipment',
                        userID:userID,
                        invID:invID,
                        challanID: challanID,
                        selectAddress:selectAddress,
                        division:division,
                        district:district,
                        cp_name:cp_name,
                        cp_mobile:cp_mobile,
                        selectCourier:selectCourier,
                        shipaddress:shipaddress,
                        hdnConditionConf:hdnConditionConf,
                        cnd_amount:add_cnd_amountex,
                        con_additional_rmks:con_additional_rmks,
                        cusID:invBasicData.cusID

                        
                    


                    });
        
                    if(data.service_header.status_tag === 'success')
                    {
                        //console.log(data.spw_data);
                        setIsloddingAction(false);
                        showMessage({
                            message: "Shipment Update Sucessfully ",
                            description:Invid,
                            duration:2000,
                            type: "success",
                        });

                    }
                    else
                    {
                        await logout(navigation,data.service_header.massage);
                        //console.log(data.spw_data);
                        showMessage({
                            message: "Shipment Update Unsucessfully",
                            description:Invid,
                            duration:2000,
                            type: "danger",
                        });
                        setIsloddingAction(false);
                       

                    }

               }
   
            
        } 
        catch (error) 
        {
            console.log(error);
            setIsloddingAction(false);
        }
        fetchInvData();
  
               


    }

    const SalesDeliver = async(invID) =>{

        setIsmodalDeliver(false);
         if(invBasicData.InvoiceType != 'PARTIAL')
         {
           var act = 'Deliver_Sales';
           var challanID = "CHALLAN-01";
         }
         else
         {
          var act = 'Deliver_Partial'; 
          var challanID = invBasicData.running_challan_no;
         }
 
 
         const userID =  await AsyncStorage.getItem('userID');
         setIsloddingAction(true);
         try 
         {
                    
               
                const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                    token: appToken,
                    act:act,
                    userID:userID,
                    invID:invID,
                    challanID:challanID
                });

                if(data.service_header.status_tag === 'success')
                {
                    //console.log(data.spw_data);
                    setIsloddingAction(false);
                    showMessage({
                        message: "Deliver Sucessfully ",
                        description:invID,
                        duration:2000,
                        type: "success",
                        });

                    
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    //console.log(data.spw_data);
                    setIsloddingAction(false);
                    showMessage({
                    message: "Deliver Unsucessfully ",
                    description:invID,
                    duration:2000,
                    type: "danger",
                    });
                }
 
                 
                 
 
 
             
             
 
             
         } 
         catch (error) 
         {
             console.log(error);
             setIsloddingAction(false);
         }
         fetchInvData();
  
               


    }

    


    const lastPrice = async (prdName,prdID) => {

       
        setModalTitle(prdName);
        setModalCommonFor('LastPurchasePrice');
        
       
        const token =  await AsyncStorage.getItem('token');
        const userID =  await AsyncStorage.getItem('userID');
        if(token !== null) 
        {
            setIsModalForCommon(true);
            setIsModalDatalodding(true);
            setLastPriceData([]);
            try 
            {
              
              const {data} = await BaseApi.post('/MobilePurchase/fetchDataAPI.php', {
                  token: token,
                  act:'fetchLast_Pur_price',
                  prdID : prdID,
                  userID : userID
                });
  
                if(data.service_header.status_tag === 'success')
                { 
                    setLastPriceData(data.spw_data);
                    //console.log(data.spw_data);         
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    setLastPriceData([]);
                }
              
            } 
            catch (error) 
            {
              setLastPriceData([]);
              //console.log(error);
            }
            setIsModalDatalodding(false);
              
        }
        else
        {
          setLastPriceData([]);
        }
        
    }
    
    
   

    const ProcessSR = async () =>{

        try 
        {
            
                var RequestPrd =  invData.filter((x)=> x.selected == true).map(function(val, i){
                        return {
                            "InvoiceDetailsID" : val.InvoiceDetailsID,
                            "qty" : val.qty,
                            "prdID" : val.prdID,
                            "prdDetails" : val.prdDetails,
                            "prdName" : val.prdName,
                        
                        }

                });

                if(RequestPrd.length == 0)
                {
                    showMessage({
                        message: "Plz Select Atlest One Row",
                        description:'',
                        duration:3000,
                        type: "danger",
                    });

                }
                else
                {

                   
                    
                    setIsmodalLodding(true);
                    const userID =  await AsyncStorage.getItem('userID');
                    const userNAME =  await AsyncStorage.getItem('userName');

                   setCarrier(userID);
  




                    const {data} = await BaseApi.post('/Stock/fetchInvData.php', {
                        token: appToken,
                        act:'anotherStockInfoNew',
                        pID : RequestPrd[0].prdID,
                        userID : userID,
                        selfCenter: invBasicData.brnchCode
                    });



                       
        
                        if(data.service_header.status_tag === 'success')
                        { 
                            var stockDetails =  data.spw_data;
                            var str = stockDetails.split('/');
                            var otherCenterStock = [];
                            str.forEach((stock) => {
                                var info =   stock.split('~');
                                if(info[0] != invBasicData.centerShortName && info[0] != '')
                                {
                                
                                    otherCenterStock.push( {
                                        "InvoiceDetailsID" : RequestPrd[0].InvoiceDetailsID,
                                        "center" : info[0],
                                        "centerQty" : info[1],
                                        "prdID" : RequestPrd[0].prdID,
                                        "salesQty" : RequestPrd[0].qty,
                                    }) 
                                    
                                }
                                
                            });

                            if(otherCenterStock.length == 0)
                            {
                                alert('Another Center Stock Insufficient ');
                                return false;
                            }
                            else
                            {
                                
                                setOtherCenterSR(otherCenterStock);
                                setModalPrdName(RequestPrd[0].prdName);
                                if(invBasicData.InvoiceType != 'PARTIAL')
                                {
                                    setModalprdQty(RequestPrd[0].qty);
                                }
                                else
                                {
                                    setModalprdQty('0');
                                }
                                
                                setModalSR(true);

                            }
                                
                        }
                        else
                        {
                            await logout(navigation,data.service_header.massage);
                            alert('Another Center Stock Insufficient');
                        }
                        setIsmodalLodding(false);
                    
                    } 
                    
        


                }

        catch (error) 
        {
            
            console.log(error);
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
                    {invBasicData.DistributionType}
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
                    {user}
                  </Text>
    
    
                </View>
    
                
                {/* <Image source={ icons.distribution_black }
                            style={{
                                height: scale(23),
                                width: scale(23),
                                tintColor: '#fff',
                                marginLeft:moderateScale(4) 
                            }}
                  /> */}

                 <FontAwesome5 name="file-invoice" size={scale(20)}   style={{
                                color: '#fff',
                                marginLeft:moderateScale(5) 
                  }} />
    
    
    
    
    
    
              </View>
    
    
            </View>
    
    
    
          </LinearGradient>
    
        );
    }
    


    const rendertop = () => {

            var ActionButton = ""; 
            if(invBasicData.isAdmin == 1 && invBasicData.InvoiceType != 'PARTIAL')
            {
                        ActionButton = ( 
                            <>
                                    
                                    <TouchableOpacity
                                            style={{
                                                flex: 3,
                                                height: scale(30),
                                                backgroundColor: '#FF7043',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: scale(2),
                                                flexDirection: 'row',
                                                shadowOffset: { width: 0,height: 1,},
                                                shadowOpacity: 0.47,
                                                shadowRadius: 1.49,
                                                elevation: 3,
                                                marginRight:moderateScale(2)
                                            }}
                                            onPress={() => confirmChk(invBasicData.InvID,'Remove_Arrange')}
                                        >
                                            <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>Remove Arrange</Text>
                                    </TouchableOpacity>

                                   { invBasicData.InvoiceStatus == 'Deliver' ? <>
                                    <TouchableOpacity
                                                style={{
                                                    flex: 3,
                                                    height: scale(30),
                                                    backgroundColor: '#8D6E63',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: scale(2),
                                                    flexDirection: 'row',
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                    marginRight:moderateScale(2)
                                                }}
                                                onPress={() => confirmChk(invBasicData.InvID,'Undeliver_Inv')}
                                            >
                                                <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>UNDELIVER</Text>
                                        </TouchableOpacity>
                                    </> 
                                    : <></>} 

                                    {invBasicData.checkDone == 0 ? 
                                    (<>
                                        
                                        <TouchableOpacity
                                                style={{
                                                    flex: 4,
                                                    height: scale(30),
                                                    backgroundColor: '#009688',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: scale(2),
                                                    flexDirection: 'row',
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                    marginRight:moderateScale(2)
                                                }}
                                                onPress={() => confirmChk(invBasicData.InvID,'Checked')}
                                            >
                                                
                                                <MaterialIcons name="published-with-changes" size={scale(17)} color="white" style={{marginRight:moderateScale(4)}}  />
                                                <Text style={{  fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>Checked</Text>
                                        </TouchableOpacity>
                                    </>) : 
                                    (<></>)
                                    }
                                     {invBasicData.checkDone == 1 && invBasicData.InvoiceStatus != 'Deliver' ? 
                                    (<>
                                       <TouchableOpacity
                                                style={{
                                                    flex: 4,
                                                    height: scale(30),
                                                    backgroundColor: '#2E7D32',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: scale(2),
                                                    flexDirection: 'row',
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                }}
                                                onPress={() => setIsmodalDeliver(true)}
                                            >
                                                
                                                <MaterialIcons name="published-with-changes" size={scale(17)} color="white" style={{marginRight:moderateScale(4)}}  />
                                                <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>Deliver</Text>
                                        </TouchableOpacity>
                                      </>)
                                      :
                                      <></>
                                    }

                                  
                                    
                                    <TouchableOpacity
                                                style={{
                                                    flex: 3,
                                                    height: scale(30),
                                                    backgroundColor: '#F44336',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: scale(2),
                                                    flexDirection: 'row',
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                }}
                                                onPress={() => confirmChk(invBasicData.InvID,'DeleteInv')}
                                            >
                                                
                                                <MaterialIcons name="delete" size={scale(15)} color="white" style={{marginRight:moderateScale(4)}}  />
                                                <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>DELETE</Text>
                                        </TouchableOpacity>
                                    
                            

                            
                            
                            
                        </>
                    );

            }
            else if(invBasicData.DistributionType != 'Invoice' && forcheck == 0)
            {
                ActionButton = (
                            <>
                                    <TouchableOpacity
                                        style={{
                                            flex: 3,
                                            height: scale(30),
                                            backgroundColor: '#9C27B0',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            flexDirection: 'row',
                                            marginRight:2,
                                            shadowOffset: { width: 0,height: 1,},
                                            shadowOpacity: 0.47,
                                            shadowRadius: 1.49,
                                            elevation: 3,
                                        }}
                                        onPress={() => { setModalstatusEx(true); setQrValueEx('id='+invBasicData.InvID+'&Forcheck~1');  }  }
                                    >
                                    
                                    <Ionicons name="qr-code-sharp" size={scale(20)} color="white" style={{marginRight:0}}  />
                                    
                                        
                                        
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={{
                                            flex: 4,
                                            height: scale(30),
                                            backgroundColor: '#ff8c66',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            marginRight:moderateScale(2),
                                            shadowOffset: { width: 0,height: 1,},
                                            shadowOpacity: 0.47,
                                            shadowRadius: 1.49,
                                            elevation: 3,
                                            
                                        }}
                                        onPress={() => confirmChk(invBasicData.InvID,'PURCHASE_REQUEST')}
                                    >
                                    
                                    
                                        <Text style={{  fontSize:scale(12),fontWeight:'600', color: COLORS.white, }}>PR</Text>
                                        
                                        
                                </TouchableOpacity>
                                <TouchableOpacity
                                        style={{
                                            flex: 4,
                                            height: scale(30),
                                            backgroundColor: '#ff3399',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            marginRight:moderateScale(2),
                                            shadowOffset: { width: 0,height: 1,},
                                            shadowOpacity: 0.47,
                                            shadowRadius: 1.49,
                                            elevation: 3,
                                            
                                        }}
                                        onPress={() => { ProcessSR()}}
                                    >
                                    
                                        <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white, }}>SR</Text>
                                        
                                </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flex: 7,
                                            height: scale(30),
                                            backgroundColor: '#00b300',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 1,
                                            flexDirection: 'row',
                                            marginRight:moderateScale(2),
                                            borderRadius: 2,
                                
                                            shadowOffset: { width: 0,height: 1,},
                                            shadowOpacity: 0.47,
                                            shadowRadius: 1.49,
                                            elevation: 3,
                                        }}
                                        onPress={() => confirmChk(invBasicData.InvID,'Arrange')}
                                    >
                                        
                                        <MaterialIcons name="published-with-changes" size={18} color="white" style={{marginRight:5}}  />
                                        
                                        <Text style={{  fontSize:scale(12),fontWeight:'600', color: COLORS.white, }}>Arrange</Text>
                                </TouchableOpacity>
                                

                            </>
                            );

            }
            else if(invBasicData.isCheckPer == '1' && forcheck == 1) 
            {
                        ActionButton = (
                            <>
                                <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                height: scale(30),
                                                backgroundColor: '#9C27B0',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: scale(2),
                                                flexDirection: 'row',
                                                marginRight:moderateScale(2),
                                                shadowOffset: { width: 0,height: 1,},
                                                shadowOpacity: 0.47,
                                                shadowRadius: 1.49,
                                                elevation: 3,
                                            }}
                                            onPress={() => { setModalstatusEx(true); setQrValueEx('id='+invBasicData.InvID+'&Forcheck~1');  }  }
                                        >
                                        
                                        <Ionicons name="qr-code-sharp" size={scale(22)} color="white" style={{marginRight:0}}  />
                                        
                                            
                                            
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                            style={{
                                                flex: 3,
                                                height: scale(30),
                                                backgroundColor: '#FF7043',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: scale(2),
                                                flexDirection: 'row',
                                                shadowOffset: { width: 0,height: 1,},
                                                shadowOpacity: 0.47,
                                                shadowRadius: 1.49,
                                                elevation: 3,
                                                marginRight:moderateScale(2)
                                            }}
                                            onPress={() => confirmChk(invBasicData.InvID,'Remove_Arrange')}
                                        >
                                            <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>Remove Arrange</Text>
                                    </TouchableOpacity>

                                    {invBasicData.checkDone == 0 ? 
                                    (<>
                                        
                                        <TouchableOpacity
                                                style={{
                                                    flex: 4,
                                                    height: scale(30),
                                                    backgroundColor: '#009688',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: scale(2),
                                                    flexDirection: 'row',
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                    marginRight:moderateScale(2)
                                                }}
                                                onPress={() => confirmChk(invBasicData.InvID,'Checked')}
                                            >
                                                
                                                <MaterialIcons name="published-with-changes" size={scale(17)} color="white" style={{marginRight:moderateScale(4)}}  />
                                                <Text style={{  fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>Checked</Text>
                                        </TouchableOpacity>
                                    </>) : 
                                    (<></>)
                                    }
                                     {invBasicData.checkDone == 1 && invBasicData.InvoiceStatus != 'Deliver' ? 
                                    (<>
                                       <TouchableOpacity
                                                style={{
                                                    flex: 4,
                                                    height: scale(30),
                                                    backgroundColor: '#2E7D32',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: scale(2),
                                                    flexDirection: 'row',
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 1.49,
                                                    elevation: 3,
                                                }}
                                                onPress={() => setIsmodalDeliver(true)}
                                            >
                                                
                                                <MaterialIcons name="published-with-changes" size={scale(17)} color="white" style={{marginRight:moderateScale(4)}}  />
                                                <Text style={{ fontSize:scale(12),fontWeight:'600', color: COLORS.white }}>Deliver</Text>
                                        </TouchableOpacity>
                                      </>)
                                      :
                                      <></>
                                    }
                               

                               
                               
                               
                        </>
                    );

            }
            else
            {

                    ActionButton = (
                        <>
                         <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                height: scale(30),
                                                backgroundColor: '#9C27B0',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 2,
                                                flexDirection: 'row',
                                                marginRight:moderateScale(2),
                                                shadowOffset: { width: 0,height: 1,},
                                                shadowOpacity: 0.47,
                                                shadowRadius: 1.49,
                                                elevation: 3,
                                            }}
                                            onPress={() => { setModalstatusEx(true); setQrValueEx('id='+invBasicData.InvID+'&Forcheck~1');  }  }
                                        >
                                        
                                        <Ionicons name="qr-code-sharp" size={23} color="white" style={{marginRight:0}}  />
                                        
                                            
                                            
                                    </TouchableOpacity>
                        </>
                );

            }

            var topColor = '#f2f2f2';
            if(invBasicData.InvTypeShot == 'P')
            {
                topColor = "#EFEBE9";
            }

        return(
            
            <>
                    <View style={{ 
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: moderateScale(3) ,
                        marginTop:verticalScale(3),

                    }}>
                    
                        {ActionButton} 

                    </View>
                    <TouchableOpacity
                        style={{ 
                            marginTop:verticalScale(3),
                            paddingHorizontal:  moderateScale(3),
                            marginBottom:0,
                            
                            
                            }}  
                        onPress={() => fetchInvData()}    
                        
                    >
                        
                                <View style={{ 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: moderateScale(4),
                                    backgroundColor:topColor,
                                    shadowOffset: { width: 0,height: 0.5,},
                                    shadowOpacity: 0.47,
                                    shadowRadius: 0.49,
                                    elevation: 2,
                                    borderRadius:2,
                                    
                                    
    
                                }}> 
                                    <View style={{ flex: 7,paddingHorizontal:moderateScale(2),paddingVertical:verticalScale(0.2)  }}>

                                        <View 
                                            style={{ 
                                                flexDirection: 'row',justifyContent: 'space-between',
                                                marginTop:2
                                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                                            }}
                                        >
                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:12,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Customer</Text>
                                                            <Text style={{fontSize:scale(9), color: '#E91E63',marginTop:verticalScale(-1.5) }}>{invBasicData.cusName}</Text>

                                                        </View>

                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:4,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0,borderLeftWidth:1}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500',paddingLeft:moderateScale(2) }}>Type</Text>
                                                            <Text style={{fontSize:scale(9), color: "#795548",marginTop:verticalScale(-1.5),paddingLeft:moderateScale(2) }}>{invBasicData.InvoiceType}</Text>

                                                        </View>
                                                        

                                        </View>

                                        <View 
                                            style={{ 
                                                flexDirection: 'row',justifyContent: 'space-between',
                                                marginTop:2
                                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                                            }}
                                        >
                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:6,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0,borderRightWidth:1}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500', }}>Invoice ID</Text>
                                                            <Text style={{fontSize:scale(9), color: "green",marginTop:verticalScale(-1.5), }}>{invBasicData.modifyinvID}</Text>

                                                        </View>

                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:4,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0,borderRightWidth:1}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500',paddingLeft:moderateScale(2) }}>Date</Text>
                                                            <Text style={{fontSize:scale(9), color: "green",marginTop:verticalScale(-1.5),paddingLeft:moderateScale(2) }}>{invBasicData.time}</Text>

                                                        </View>

                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:3,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500',paddingLeft:2 }}>Sold By</Text>
                                                            <Text style={{fontSize:scale(9), color: '#512DA8',marginTop:verticalScale(-1.5),paddingLeft:moderateScale(2) }}>{invBasicData.ActivityBy}</Text>

                                                        </View>
                                                        

                                        </View>

                                        <View 
                                            style={{ 
                                                flexDirection: 'row',justifyContent: 'space-between',
                                                marginTop:2
                                                //display:item.InvoiceType == 'TRANSFER' ? "flex" : "none"
                                            }}
                                        >
                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:6,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0,borderRightWidth:1}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500', }}>Braanch</Text>
                                                            <Text style={{fontSize:scale(9), color: "#1A237E",marginTop:verticalScale(-1.5), }}>{invBasicData.centerName}</Text>

                                                        </View>

                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:4,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0,borderRightWidth:1}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500',paddingLeft:2 }}>Print No</Text>
                                                            <Text style={{fontSize:scale(9), color: "#EC407A",marginTop:verticalScale(-1.5),paddingLeft:moderateScale(2) }}>{invBasicData.print_no}</Text>

                                                        </View>

                                                        <View
                                                            style={{borderColor:'#E0E0E0',flex:3,paddingVertical:verticalScale(0.5),paddingHorizontal:moderateScale(2),borderBottomWidth:1,borderTopWidth:0}}
                                                        >
                                                            <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500',paddingLeft:2 }}>Status</Text>
                                                            <Text style={{fontSize:scale(9), color: '#6D4C41',marginTop:verticalScale(-1.5),paddingLeft:moderateScale(2) }}>{invBasicData.InvoiceStatus}</Text>

                                                        </View>
                                                        

                                        </View>

 
                                    </View>
                                    
                                    
                                </View> 
                                
                                

                                
                    </TouchableOpacity>

                    {renderPartialChallanANDShipInfo()}
               


               
            </>    

    
        );
    }

    
    const PrdManageStock = async (PrdID,prdName,r_qty) =>
    {
      
        setModalTitle(prdName);
        setModalCommonFor('PrdManageStock');
        
       
        const token =  await AsyncStorage.getItem('token');
        const userID =  await AsyncStorage.getItem('userID');

        
        if(token !== null) 
        {
            setIsModalForCommon(true);
            setIsModalDatalodding(true);
            setPrdManageStockData([]);
            try 
            { 
                const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                  token: token,
                  act:'PrdManageStock',
                  PrdID : PrdID,
                  userID : userID,
                  salesCenter : invBasicData.brnchCode,
                  r_qty : r_qty,
                  invType : invBasicData.InvoiceType,
              
                });
  
                if(data.service_header.status_tag === 'success')
                { 
                    setPrdManageStockData(data.spw_data);
                   // console.log(data.spw_data);         
                }
                else
                {
                    setPrdManageStockData([]);
                }
              
            } 
            catch (error) 
            {
                setPrdManageStockData([]);
              //console.log(error);
            }
            setIsModalDatalodding(false);
              
        }
        else
        {
            setPrdManageStockData([]);
        }
        
    }

    

    const renderPrdManageStock = ( {item}) => {
        
        var color = '#7F465A'
        if(item.short_name == 'BS')
        {
           color = '#3F51B5';
        }
        else if(item.short_name == 'SA')
        {
           color = '#388E3C';
        }
        else if(item.short_name == 'Elite')
        {
            color = '#F44336';
        }
        else if(item.short_name == 'L6G')
        {
            color = '#546E7A';
        }
        else if(item.short_name == 'Purchase Required')
        {
            color = '#26A69A';
        }
    
        return(
            <View
            key={item.SalesCenterID}
            style={{ 
                
                shadowOffset: { width: 1,height: 1,},
                shadowOpacity: 0.47,
                shadowRadius: 1.0,
                elevation: 2,
                borderRadius:scale(3),
                backgroundColor:color,
                marginBottom:verticalScale(2),
                paddingHorizontal: moderateScale(4) ,
                paddingVertical:verticalScale(6) ,
                marginHorizontal:moderateScale(2)
            
                

                }}  
            
        >
                        <TouchableOpacity
                            style=
                            {{
                                flexDirection:'row',
                                justifyContent:'space-between'
                            }}
                            onPress={() => {
                                  
                                 if(item.short_name == 'Purchase Required')
                                 {
                                    lastPrice(modalTitle,item.PrdID);
                                 }
                               }
                            }
                          
                        
                        >
                            <Text style={{ fontSize:scale(11), color: COLORS.white,fontWeight:'600',flex: 7,paddingHorizontal:moderateScale(5) }}>{item.centerName}</Text>
                            <Text style={{ fontSize:scale(13), color: COLORS.gray,fontWeight:'700',flex: 7,textAlign:'right',paddingHorizontal:moderateScale(8) }}>{item.centerQty}</Text>

                        </TouchableOpacity>


                    
                    
            </View> 
            );

    }

    const renderChallananList = ( {item}) => {
        
        
    
        return(
            <TouchableOpacity
              onPress={() => ChallanDetails(Invid,item.challan_id) }
            >
                    <View style={{ flexDirection: 'row',justifyContent: 'space-between',backgroundColor:'#8D6E63',marginBottom:verticalScale(1)}}>
                        <Text style={{ fontSize:scale(11), color: "#FFF",textAlign:'left',paddingRight:moderateScale(3),paddingVertical:verticalScale(3),  }}> {item.challan_id} </Text>
                        <Text style={{ fontSize:scale(10), color: "#FFF",textAlign:'right',paddingRight:moderateScale(3),paddingVertical:verticalScale(3) , }}>{item.challanDate}</Text>
                        <Text style={{ fontSize:scale(10), color: "#FFF",textAlign:'left',paddingRight:moderateScale(3),paddingVertical:verticalScale(3) , }}>{item.challanshipID}</Text>
                        <Text style={{ fontSize:scale(11), color: "#FFF",textAlign:'left',paddingRight:moderateScale(3),paddingVertical:verticalScale(3) , }}>{item.deliver_status}</Text>
                    </View>
            </TouchableOpacity>

        )

    } 
    
    const ChallanDetails = async ( InvID,challan_id) =>
    {
   
        setModalTitle(challan_id);
        setModalCommonFor('Challan');
        
       
        const token =  await AsyncStorage.getItem('token');
        const userID =  await AsyncStorage.getItem('userID');
        if(token !== null) 
        {
            setIsModalForCommon(true);
            setIsModalDatalodding(true);
            setChallanDetailsData([]);
            try 
            {
              
              const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                  token: token,
                  act:'ChallanDetails',
                  InvID : InvID,
                  challan_id : challan_id,
                  userID : userID
                });
  
                if(data.service_header.status_tag === 'success')
                { 
                    setChallanDetailsData(data.spw_data);
                    setSpeceficChallanDetails(data.challanShipInfo);
                    //console.log(data.challanShipInfo);         
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    setChallanDetailsData([]);
             
                }
              
            } 
            catch (error) 
            {
                setChallanDetailsData([]);
              //console.log(error);
            }
            setIsModalDatalodding(false);
              
        }
        else
        {
          setLastPriceData([]);
        }
        
    }

    const renderChallanData = ( {item}) => {
        
        
    
        return(
            <View
            key={item.InvoiceDetailsID}
            style={{ 
                
                    shadowOffset: { width: 1,height: 0,},
                    shadowOpacity: 0.47,
                    shadowRadius: 0.77,
                    elevation: 2,
                    borderRadius:scale(4),
                    backgroundColor:'#EEEEEE',
                    marginBottom:verticalScale(2),
                    paddingHorizontal: moderateScale(6) ,
                    flexDirection:'row'

                }}  
            
        >
                            <View style={{flex:2,marginRight:moderateScale(2)}}>
                               <TouchableOpacity
                                    style={{
                                    flexDirection: 'row', backgroundColor: '#E57373', flex: 3, justifyContent: 'center',
                                    alignContent: 'center', alignItems: 'center', borderRadius: scale(5),
                                    }}
                                    onPress={() =>  {
                                         
                                        if(invBasicData.isAdmin == 1)
                                        {
                                            confirmChk(item.challan_id,'DeleteChallanPrd',item.InvoiceDetailsID)
                                        }
                                        

                                       }
                                        
                                    }
                                >
                                    <Text style={{ fontSize: scale(12), color: '#fff', paddingRight: moderateScale(1) }}>{item.sl}</Text>
                                    {invBasicData.isAdmin == 1 ? (<MaterialIcons name="delete" color='white' size={scale(12)} />) : ""}
                                
                
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:22}}>
          

                                <View
                                    style={{
                                        flexDirection: 'row', justifyContent: 'space-between',
                                    }}
                                >
                                  
                                        <View
                                            style={{ flex: 12, }}
                                        >
                                            <View style={{ flexDirection: 'row',paddingTop:verticalScale(1) }}>
                                                <Text style={{ fontSize: scale(9), fontWeight: '600', color: "#3F51B5", }}>  {modalCommonFor == 'Challan' ? item.prdName : item.challan_id } </Text>
                                            </View>

                                            

                                        </View>

                                        <View
                                        style={{ flex: 2, }}
                                            >
                                            <View
                                                    style={{ borderColor: '#E0E0E0', flex: 3, paddingHorizontal: moderateScale(3),paddingTop:verticalScale(1)  }}
                                             >
                                                    <Text style={{ fontSize: scale(11),fontWeight:'600', color: "#E91E63",textAlign:'right' }}>{item.challan_qty}</Text>
                                                </View>
                                        </View>

                                        


                                    


                                </View>
                                
                                <View
                                    style={{
                                        flexDirection: 'row', justifyContent: 'space-between',
                                 
                                    }}
                                >
                                   

                                    <View
                                            style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
                                        >
                                            <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500' }}>Time</Text>
                                            <Text style={{ fontSize: scale(8), color: '#FF7043', marginTop: verticalScale(-1.5) }}>{item.challanDate }</Text>

                                        </View>

                                        <View
                                            style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
                                        >
                                            <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500',textAlign:'left' }}>Arrange By</Text>
                                            <Text style={{ fontSize: scale(8), color: '#795548', marginTop: verticalScale(-1.5),textAlign:'left' }}>{item.arrangeBy}</Text>
                                        

                                        </View>

                                        <View
                                            style={{ borderColor: '#E0E0E0', flex: 3, paddingVertical: verticalScale(0.5), paddingHorizontal: moderateScale(3),  borderLeftWidth: 0, borderTopWidth: 1 }}
                                        >
                                            <Text style={{ fontSize: scale(7), color: '#9E9E9E', fontWeight: '500',textAlign:'left' }}>Check By</Text>
                                            <Text style={{ fontSize: scale(8), color: '#3F51B5', marginTop: verticalScale(-1.5),textAlign:'left' }}>{item.checkBy}</Text>

                                            

                                        </View>


                                
                                </View>

                            </View>


                    
                    
            </View> 
            );

    }
   
    
    

    

    const renderPartialChallanANDShipInfo = () => {

        var topColor = '#f2f2f2';
        
        var partab = <></>;
        if( invBasicData.InvoiceType != 'PARTIAL' && invBasicData.isShipmentEX == 1)
        {
            partab = <>
                                  <TouchableOpacity
                                                style={{ flexDirection: 'row',backgroundColor:'#FFAB91', borderRadius:1,justifyContent:'center',flex:1 }}
                                                onPress={() => {
                                                    if(showShipmetToggle)
                                                    {
                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 200,
                                                            useNativeDriver: false,
                                                        }).start();
                                                      
                                                        setIsBootomOpen(false);

                                                         
                                                    }
                                                    else
                                                    {
                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 200,
                                                            useNativeDriver: false,
                                                        }).start();

                                                        setIsBootomOpen(true);
                                                       
                                                    } 
                                                    setShowShipmetToggle(!showShipmetToggle)
                                                    setShowChallantoggle(false);
                                                    
                                                   }
                                                }
                                            >
                                                <Text style={{ fontSize:scale(11), color: "#424242",fontWeight:'600',textAlign:'center',marginRight:moderateScale(4),paddingVertical:verticalScale(2)  }}>
                                                SHIPMENT INFO  
                                               </Text>
                                               <AntDesign name={showShipmetToggle ? "upcircle" : "downcircle" } size={scale(13)} color="#424242" style={{ marginTop:verticalScale(2)  }} />

                                 </TouchableOpacity>
                                     
            </>

        }
        else if(  invBasicData.DistributionType == 'Invoice' && invBasicData.InvoiceType == 'PARTIAL')
        {
             partab = <>
                                     <TouchableOpacity
                                                style={{ flexDirection: 'row',backgroundColor:'#A1887F', borderRadius:1,justifyContent:'center',flex:1,marginRight:1 }}
                                                onPress={() => {
                                                    if(showChallantoggle)
                                                    {
                                                        setIsBootomOpen(false);

                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 400,
                                                            useNativeDriver: false,
                                                          }).start();

                                                         


                                                    }
                                                    else
                                                    {
                                                        setIsBootomOpen(false);

                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 150,
                                                            duration: 400,
                                                            useNativeDriver: false,
                                                          }).start();
                                                       
                                                    } 
                                                    setShowChallantoggle(!showChallantoggle)
                                                    setShowShipmetToggle(false)
                                                    
                                                   }
                                                }
                                            >
                                                <Text style={{ fontSize:scale(11), color: "#424242",fontWeight:'600',textAlign:'center',marginRight:moderateScale(4),paddingVertical:verticalScale(2)   }}>
                                                CHALLAN HISTORY
                                               </Text>
                                               <AntDesign name={showChallantoggle ? "upcircle" : "downcircle" } size={scale(13)} color="#424242" style={{ marginTop:verticalScale(2)  }} />

                                            </TouchableOpacity>

                                           
                                  <TouchableOpacity
                                                style={{ flexDirection: 'row',backgroundColor:'#FFAB91', borderRadius:1,justifyContent:'center',flex:1 }}
                                                onPress={() => {
                                                    if(showShipmetToggle)
                                                    {
                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 200,
                                                            useNativeDriver: false,
                                                        }).start();
                                                      
                                                        setIsBootomOpen(false);

                                                         
                                                    }
                                                    else
                                                    {
                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 200,
                                                            useNativeDriver: false,
                                                        }).start();

                                                        setIsBootomOpen(true);
                                                       
                                                    } 
                                                    setShowShipmetToggle(!showShipmetToggle)
                                                    setShowChallantoggle(false);
                                                    
                                                   }
                                                }
                                            >
                                                <Text style={{ fontSize:scale(11), color: "#424242",fontWeight:'600',textAlign:'center',marginRight:moderateScale(4),paddingVertical:verticalScale(2)  }}>
                                                SHIPMENT INFO  
                                               </Text>
                                               <AntDesign name={showShipmetToggle ? "upcircle" : "downcircle" } size={scale(13)} color="#424242" style={{ marginTop:verticalScale(2)  }} />

                                 </TouchableOpacity>
                                     
            


                                           
            </>

        }
        else if((forcheck == 1 || invBasicData.isAdmin == 1) && invBasicData.checkDone == 1)
        {
             partab = <>
                                  <TouchableOpacity
                                                style={{ flexDirection: 'row',backgroundColor:'#FFAB91', borderRadius:1,justifyContent:'center',flex:1 }}
                                                onPress={() => {
                                                    if(showShipmetToggle)
                                                    {
                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 200,
                                                            useNativeDriver: false,
                                                        }).start();
                                                      
                                                        setIsBootomOpen(false);

                                                         
                                                    }
                                                    else
                                                    {
                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 200,
                                                            useNativeDriver: false,
                                                        }).start();

                                                        setIsBootomOpen(true);
                                                       
                                                    } 
                                                    setShowShipmetToggle(!showShipmetToggle)
                                                    setShowChallantoggle(false);
                                                    
                                                   }
                                                }
                                            >
                                                <Text style={{ fontSize:scale(11), color: "#424242",fontWeight:'600',textAlign:'center',marginRight:moderateScale(4),paddingVertical:verticalScale(2) }}>
                                                SHIPMENT INFO  
                                               </Text>
                                               <AntDesign name={showShipmetToggle ? "upcircle" : "downcircle" } size={scale(13)} color="#424242" style={{ marginTop:verticalScale(2)  }} />

                                 </TouchableOpacity>
                                     
            </>
         
        }
        else if((forcheck == 0 || invBasicData.isAdmin == 1) && invBasicData.InvoiceType == 'PARTIAL')
        {
             partab = <>
                                 
                                 <TouchableOpacity
                                                style={{ flexDirection: 'row',backgroundColor:'#A1887F', borderRadius:1,justifyContent:'center',flex:1,marginRight:1 }}
                                                onPress={() => {
                                                    if(showChallantoggle)
                                                    {
                                                        setIsBootomOpen(false);

                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 0,
                                                            duration: 400,
                                                            useNativeDriver: false,
                                                          }).start();

                                                         


                                                    }
                                                    else
                                                    {
                                                        setIsBootomOpen(false);

                                                        Animated.timing(fadeAnimChallan, {
                                                            toValue: 150,
                                                            duration: 400,
                                                            useNativeDriver: false,
                                                          }).start();
                                                       
                                                    } 
                                                    setShowChallantoggle(!showChallantoggle)
                                                    setShowShipmetToggle(false)
                                                    
                                                   }
                                                }
                                            >
                                                <Text style={{ fontSize:scale(11), color: "#424242",fontWeight:'600',textAlign:'center',marginRight:moderateScale(4),paddingVertical:verticalScale(2)  }}>
                                                CHALLAN HISTORY
                                               </Text>
                                               <AntDesign name={showChallantoggle ? "upcircle" : "downcircle" } size={scale(13)} color="#424242" style={{ marginTop:verticalScale(2)  }} />

                                    </TouchableOpacity>
            </>

        }
        

       

        return(
            
            <>
                    
                    <View
                            style={{ 
                            marginTop:verticalScale(3),
                            paddingHorizontal:  moderateScale(3),
                            marginBottom:0,
                        
                        
                        }}
                    >            
                                   
                        
                                 <View
                                   style={{ flexDirection: 'row',
                                   justifyContent: 'space-between',
                                   }}
                                 
                                 >
                                         
                                      {partab}
       
                                 </View> 

                                <Animated.View 
                                    style={{ 
                                    backgroundColor:'#A1887F',
                                    borderRadius:1,
                                    maxHeight:fadeAnimChallan,
                                    
                                    

                                }}> 
                                        <View style={{ paddingHorizontal:0,paddingVertical:verticalScale(0.2)  }}>

                                                <FlatList
                                                        data={challnData}
                                                        renderItem={renderChallananList}
                                                        keyExtractor={(item) => item.challan_id}
                                                        showsVerticalScrollIndicator={false}
                                                        refreshing={islodding}   
                                                />      
                                        </View> 
                                </Animated.View>   

                                


                   
                    </View> 
            </>    


        );
    }

    const PrdChallanDetails = async (InvID,InvoiceDetailsID,prdName) =>
    {
   
        setModalTitle(prdName);
        setModalCommonFor('Prd_Challan');
        
       
        const token =  await AsyncStorage.getItem('token');
        const userID =  await AsyncStorage.getItem('userID');
        if(token !== null) 
        {
            setIsModalForCommon(true);
            setIsModalDatalodding(true);
            setChallanDetailsData([]);
            try 
            {
              
              const {data} = await BaseApi.post('/DistriBution/InvAPI.php', {
                  token: token,
                  act:'PrdChallanDetails',
                  InvoiceDetailsID : InvoiceDetailsID,
                  InvID:InvID,
                  userID : userID
                });
  
                if(data.service_header.status_tag === 'success')
                { 
                    setChallanDetailsData(data.spw_data);
                    //console.log(data.spw_data);         
                }
                else
                {
                    await logout(navigation,data.service_header.massage);
                    setChallanDetailsData([]);
                }
              
            } 
            catch (error) 
            {
                setChallanDetailsData([]);
              //console.log(error);
            }
            setIsModalDatalodding(false);
              
        }
        else
        {
          setLastPriceData([]);
        }
        
    }

      
    const checkDetails = async (value,invdetailsID) =>{

        

        
        // var objectNo = invData.findIndex(x=>x.InvoiceDetailsID === invdetailsID)
        if(invBasicData.InvoiceType != 'PARTIAL')
        {
            const newIngredients =  invData.map((item) => {
                    if (item.InvoiceDetailsID != invdetailsID) 
                    {
                        return item;
                    }
                    else 
                    {
                        return { ...item, selected: value };
                    }
            });
            setInvData(newIngredients); 

        }
        else
        {
            if(forcheck == 0)
            {
                var chQty = value ? qty : 0;
                const newIngredients =  invData.map((item) => {
                        if (item.InvoiceDetailsID != invdetailsID) 
                        {
                            return item;
                        }
                        else 
                        {
                            return { ...item, selected: value,challan_qty:chQty };
                        }
                });
                setInvData(newIngredients);

            }
            else
            {
                
                const newIngredients =  invData.map((item) => {
                        if (item.InvoiceDetailsID != invdetailsID) 
                        {
                            return item;
                        }
                        else 
                        {
                            return { ...item, selected: value };
                        }
                });
                setInvData(newIngredients);

            }
            
            //console.log(invData);

        }
             
    }  

    const checkQty = async () =>{
        


        if(invBasicData.InvoiceType != 'PARTIAL')
        {
            if(parseFloat(qty) == parseFloat(modalprdQty))
            {
                checkDetails(true,modalprdDetailsID);
                setIsModal(false);
            }
            else
            {
                alert('Qty Invalid');
                setIsModal(false);
            }

        }
        else
        {
            if(parseFloat(qty) <= parseFloat(modalprdQty) && parseFloat(qty) > 0)
            {
                checkDetails(true,modalprdDetailsID);
                setIsModal(false);
            }
            else
            {
                alert('Qty Invalid');
                setIsModal(false);
            }

        }

        
        
            
    }

    const checkFor_AC = async (value,invdetailsID) =>{

        //alert(value);
       
        if(value == true )
        {
            
                const userID =  await AsyncStorage.getItem('userID');

                if(invBasicData.InvoiceType != 'PARTIAL')
                {
                    var [{prdName,qty,arrangeStatus,arangeByID}] =   invData.filter((x)=> x.InvoiceDetailsID == invdetailsID);
                    var checkQty = qty;
                }
                else 
                {
                    if(forcheck == 0)
                    {
                        var [{prdName,undeliverQty,arrangeStatus,arangeByID}] =   invData.filter((x)=> x.InvoiceDetailsID == invdetailsID);
                        var checkQty = undeliverQty;
                    }
                    else
                    {
                        var [{prdName,challan_qty,arrangeStatus,arangeByID}] =   invData.filter((x)=> x.InvoiceDetailsID == invdetailsID);
                        var checkQty = challan_qty;
                    }
                
                }
            
                
            
                if(arrangeStatus == 'Pending' && forcheck == 1)
                {
                    alert('Make sure Product is Arranged');
                    return false;
                }
                else if(arangeByID == userID && forcheck == 1)
                {
                    alert("U Can't Check");
                    return false;
                }
                else
                {
                    if(invBasicData.isAdmin == 1)
                    {
                        checkDetails(value,invdetailsID);
                    }
                    else
                    {
                        setQty('');
                        setModalPrdName(prdName);
                        setModalprdDetailsID(invdetailsID);
                        setModalprdQty(checkQty+'');
                        setIsModal(true);

                    }
                   

                } 
            
        }
        else
        {
            checkDetails(value,invdetailsID);
        }
    
    }

    const renderLastPriceList = ( {item}) => {

    
            return(
            <View
            key={item.supplierID}
            style={{ 
                
                shadowOffset: { width: 1,height: 1,},
                shadowOpacity: 0.47,
                shadowRadius: 1.0,
                elevation: 2,
                borderRadius:scale(4),
                backgroundColor:'#F5F5F5',
                marginBottom:verticalScale(1),
                paddingHorizontal: moderateScale(5) ,
                paddingVertical:verticalScale(1) ,
                //marginHorizontal:2
            
                

                }}  
            
        >
                            <View style={{marginBottom:verticalScale(1),paddingVertical:verticalScale(1)}}>
                            
                                <Text style={{  fontSize:scale(11),color: '#7986CB',paddingTop:verticalScale(1),flex:7 }}>{item.supplierName }</Text>

                                <Text style={{  fontSize:scale(10),color: '#616161',paddingTop:verticalScale(1) }}>
                                Purchase Date  : <Text style={{  fontSize:scale(11),fontWeight:'600',color: '#8BC34A', }}> {item.p_date}</Text>
                                </Text>  
                                <Text style={{  fontSize:scale(10),color: '#616161',paddingTop:verticalScale(1) }}>
                                Purchase Price : <Text style={{  fontSize:scale(11),fontWeight:'600',color: '#EF5350' }}> {item.p_price}</Text>
                                </Text> 

                            </View>

                    
                    
            </View> 
            );

    }

   



    

    const renderInvList = ( {item}) => {

        // if()
        // {

        // }
       
        var checkBoxSection = "";
        if(item.selected == true)
        {
            
            if(invBasicData.DistributionType == 'Manage Inv')
            {
                checkBoxSection =  (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#00b300',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-checked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                    </TouchableOpacity>
                
                );

            }
            else
            {
                checkBoxSection =  (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#79d279',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-checked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                    </TouchableOpacity>
                
                );
                
                
            }
            
        }
        else if (item.selected == false)
        {
            if(invBasicData.DistributionType == 'Manage Inv')
            {
                checkBoxSection = (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#bf8789',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-unchecked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                        </TouchableOpacity>
                    
                    ) 

            }
            else
            {
                
                checkBoxSection = (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#bf8789',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                  <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-unchecked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                    </TouchableOpacity>
                    
                    );

                   
                
            }
            

        }
        else
        {
            var scolor = '#bf8789';
            if(item.prdDetails == 'STOCK_REQUEST (Pending)' || item.arrangeStatus == 'Stock Request')
            {
                var scolor = '#ff3399';
            }
            else if(item.prdDetails == 'PURCHASE_REQUEST (Pending)')
            {
                var scolor = '#ff8c66';
            }
            else if(invBasicData.DistributionType == 'Manage Inv')
            {
                var scolor = '#00b300';
            }
            else if(invBasicData.DistributionType == 'Ckeck Inv')
            {
                var scolor = '#009688';
               

            }
            
            checkBoxSection = (
                <TouchableOpacity
                        key = {item.InvoiceDetailsID}
                        style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                        backgroundColor:scolor,textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                        
                    >     
                            <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:1 }}>{item.sl }</Text>
                        
                        
                    </TouchableOpacity>
                
                )

        }
       
        var qtySection = "flex";
        if(item.arrangeStatus == 'Done')
        {
           // qtySection ='none';
        }

        

        
        
            
        return(

                <View style={{               
                            
                            paddingTop:1,
                            marginBottom:1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',  
                            
                }}> 
                        
                            {checkBoxSection}
                        

                            <TouchableOpacity
                                style={{ flex: 26,   paddingHorizontal: 0 , backgroundColor:'#bf80ff',marginRight:1 ,height:scale(30) }}
                                        onPress={() => {
                                            
                                            if(item.arrangeStatus == 'Stock Request')
                                            {
                                                setModalstatus(true); setQrValue('id='+item.requestID+'&STOCK_REQUEST~'+user_id); setQrtitle(item.prdName)
                                            }
                                            else if(item.prdDetails == 'Pending For Sourcing')
                                            {
                                                PrdManageStock(item.prdID,item.PrdNameLrg,item.qty);
                                            }
                                            else
                                            {
                                                lastPrice(item.PrdNameLrg,item.prdID);
                                            }
                                            
                                        } 
                                    }
                            >
                        
                                          

                                            <View style={{ paddingLeft:moderateScale(3),backgroundColor:'#9575CD',borderRadius:1,height:scale(15),justifyContent:'center' }}>
                                                <Text style={{ fontSize:scale(8),color: '#fff' }}>{item.prdName }</Text>
                                                
                                            </View>   
                                            <View style={{paddingLeft:moderateScale(3),backgroundColor:'#B39DDB',borderRadius:1,height:scale(15),justifyContent:'center' }}>
                                                    <Text style={{ fontSize:scale(8),color: '#000080', }}>{item.prdDetails.toUpperCase() }</Text>
                                            </View> 



                            </TouchableOpacity>    
                        
                        
                    <TouchableOpacity
                        style={{ flex: 5,justifyContent:'flex-end',backgroundColor:'#ff6699',height:scale(30) }}
                        onPress={() => {
                            setModalprdDetailsID(item.InvoiceDetailsID);
                            setDistributionNote(item.reference);
                            setModalPrdName(item.prdName)
                            setIsModalForNote(true);
                        }
                        }
                    >           
                                            <View style={{ paddingLeft:moderateScale(4),backgroundColor:'#ff538c',borderRadius:1,height:scale(15) }}>
                                                <Text style={{ fontSize:scale(8),paddingVertical:verticalScale(2),color: '#fff',textAlign:'right',paddingRight:moderateScale(2) }}>{ item.arrangeStatus == 'Done' ? '?' : item.qty }</Text>
                                            
                                            </View>   
                                            <View style={{paddingLeft:moderateScale(4),backgroundColor:'#ff8eb3',borderRadius:1,height:scale(15) }}>
                                                <Text style={{ fontSize:scale(8),paddingVertical:verticalScale(2),color: '#000080',textAlign:'right',paddingRight:moderateScale(2) }}>{item.unit }</Text>
                                            </View> 
                            
                               
                            
                    </TouchableOpacity> 
                    
                
                </View> 


        );
    }

    const renderPartialInvList = ( {item}) => {

        // if()
        // {

        // }
       
        var checkBoxSection = "";
        if(item.selected == true)
        {
            
            if(invBasicData.DistributionType == 'Manage Inv')
            {
                checkBoxSection =  (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#00b300',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-checked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                    </TouchableOpacity>
                
                );

            }
            else
            {
                checkBoxSection =  (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#79d279',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-checked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                    </TouchableOpacity>
                
                );
                
                
            }
            
        }
        else if (item.selected == false)
        {
            if(invBasicData.DistributionType == 'Manage Inv')
            {
                checkBoxSection = (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#bf8789',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-unchecked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                        </TouchableOpacity>
                    
                    ) 

            }
            else
            {
                
                checkBoxSection = (
                    <TouchableOpacity
                            key = {item.InvoiceDetailsID}
                            style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                            backgroundColor:'#bf8789',textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1  }}
                            onPress={() => checkFor_AC(!item.selected,item.InvoiceDetailsID)}
                        >     
                                <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                                <MaterialIcons name="radio-button-unchecked" size={scale(13)} color="white" style={{textAlign:'center'}} />
                            
                    </TouchableOpacity>
                    
                    );

                   
                
            }
            

        }
        else
        {
            var scolor = '#bf8789';
            if(item.prdDetails == 'STOCK_REQUEST (Pending)' || item.arrangeStatus == 'Stock Request')
            {
                var scolor = '#ff3399';
            }
            else if(item.prdDetails == 'PURCHASE_REQUEST (Pending)')
            {
                var scolor = '#ff8c66';
            }
            else if(invBasicData.DistributionType == 'Manage Inv')
            {
                var scolor = '#00b300';
            }
            else if(invBasicData.DistributionType == 'Ckeck Inv')
            {
                var scolor = '#009688';
               

            }
            
            checkBoxSection = (
                <TouchableOpacity
                        key = {item.InvoiceDetailsID}
                        style={{ flex: 3,flexDirection: 'row',alignItems:'center',justifyContent:'center',height:scale(30),
                        backgroundColor:scolor,textAlign:'center',marginRight:moderateScale(1),paddingHorizontal:moderateScale(1.5),borderRadius:1 }}
                        
                    >     
                            <Text style={{ fontSize:scale(10),color: '#fff',paddingRight:moderateScale(1) }}>{item.sl }</Text>
                        
                        
                    </TouchableOpacity>
                
                )

        }
       
      
            
        return(
              
                <View>


                <View style={{               
                            
                            paddingTop:1,
                            marginBottom:1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                             
                            
                }}> 
                        
                            {checkBoxSection}
                        

                    <TouchableOpacity
                        style={{ flex: 24,marginRight:1,height:scale(30)  }}
                                onPress={() => {
                                    
                                    if(item.arrangeStatus == 'Stock Request')
                                    {
                                        setModalstatus(true); setQrValue('id='+item.requestID+'&STOCK_REQUEST~'+user_id); setQrtitle(item.prdName)
                                    }
                                    else if(item.prdDetails == 'Pending For Sourcing')
                                    {
                                        PrdManageStock(item.prdID,item.PrdNameLrg,item.undeliverQty);
                                    }
                                    else
                                    {
                                        lastPrice(item.PrdNameLrg,item.prdID);
                                    }
                                    
                                }
                            }
                    >
                
                
                    

                        <View style={{ paddingLeft:moderateScale(3),backgroundColor:'#9575CD',borderRadius:1,height:scale(15),justifyContent:'center' }}>
                            <Text style={{ fontSize:scale(8),color: '#fff' }}>{item.prdName }</Text>
                            
                        </View>   
                        <View style={{paddingLeft:moderateScale(3),backgroundColor:'#B39DDB',borderRadius:1,height:scale(15),justifyContent:'center' }}>
                                <Text style={{ fontSize:scale(8),color: '#000080', }}>{item.prdDetails.toUpperCase() }</Text>
                        </View> 


                    </TouchableOpacity>    
                        
                        
                    <TouchableOpacity
                        style={{ flex: 6,alignContent:'center',justifyContent:'flex-end',height:scale(30) }}
                        onPress={() => {
                            if( forcheck == 0 || invBasicData.DistributionType == 'Invoice')
                            {
                                PrdChallanDetails(Invid,item.InvoiceDetailsID,item.prdName);
                            }
                             
                        }
                        }
                    >       
                            <View style={{ flexDirection:'row',paddingHorizontal:moderateScale(3), paddingVertical:verticalScale(2),backgroundColor:'#546E7A',justifyContent:'space-between',borderRadius:1,height:scale(15) }}>
                                  <FontAwesome5 name="quora" style={{fontSize:scale(8), color: '#fff' }} />
                                  <Text style={{ fontSize:scale(8),color: '#fff',textAlign:"right",  }}>{  item.qty } </Text>
                            </View>  
                            <View style={{ flexDirection:'row',paddingHorizontal:moderateScale(3),paddingVertical:verticalScale(2),backgroundColor:'#43A047',justifyContent:'space-between',borderRadius:1,height:scale(15) }}>
                                 
                                  <MaterialIcons name="done-outline" style={{ fontSize:scale(8),color: '#fff',textAlign:"right" }} />
                                  <Text style={{ fontSize:scale(8),color: '#fff',textAlign:"right", }}>{  item.delivery_qty } </Text>
                            </View>   
                            
                              
                            
                    </TouchableOpacity> 
                    <TouchableOpacity
                        style={{ flex: 5,justifyContent:'flex-end',alignContent:'center',justifyContent:'center',marginLeft:1,height:scale(30) }}
                        onPress={() => {
                            setModalprdDetailsID(item.InvoiceDetailsID);
                            setDistributionNote(item.reference);
                            setModalPrdName(item.prdName)
                            setIsModalForNote(true);
                        }
                        }
                    >           
                            
                                <View style={{ paddingLeft:moderateScale(3),backgroundColor:'#0288D1',borderRadius:1,height:scale(15),paddingVertical:verticalScale(1) }}>
                                    <Text style={{ fontSize:scale(8),color: '#fff',textAlign:"right",paddingRight:moderateScale(2), }}>TDQ</Text>
                                  
                                </View>   
                                <View style={{paddingLeft:moderateScale(3),backgroundColor:'#0277BD',borderRadius:1,height:scale(15),paddingVertical:verticalScale(1) }}>
                                
                                    <Text style={{ fontSize:scale(8),color: '#fff',textAlign:"right",paddingRight:moderateScale(2) }}>{ item.arrangeStatus == 'Done' ? '?' : item.challan_qty } </Text>
                                </View> 
                            
                    </TouchableOpacity> 
                    
                
                </View> 

                </View>


        );
    }
    

    

    function renderModalQty()
    {
        return(
            <Modal 
                        animationType={'fade'}
                        visible={isModal} 
                        transparent={isModal} 
                        
            >
                <View style={{ flex: 1,backgroundColor:'#000000aa', justifyContent:'center',alignItems:'center',
                    }}
                    
                    >

                    

                        <View 
                            style={{ 
                                
                                alignContent:'center',
                                backgroundColor:'#fff',
                                
                                alignItems:'center',
                                borderRadius:scale(3),
                                width:'95%',
                            }}
                        >
                                
                            <View 
                            style={{
                                width:'100%',
                            }}
                            >
                                    <View 
                                    style={{ 
                                        
                                        paddingHorizontal: moderateScale(4) ,
                                        
                                        alignItems: 'center',
                                        textAlign:'center',
                                        backgroundColor:'#fff'
                                        }}
                                    >
                                        
                                            
                                        <Text style={{ fontSize:scale(10),color: '#b380ff',paddingVertical:verticalScale(1) }}>{modalPrdName}</Text>

                                    </View>
                                

                                    <View 
                                    style={{ 
                                        backgroundColor: '#e6b3b3',
                                        alignItems: 'center',
                                        textAlign:'center',
                                        marginVertical:verticalScale(1),

                                        }}
                                    >
                                        
                                            
                                            <TextInput
                                                style={{
                                                    
                                                    color: COLORS.white,
                                                    fontSize:scale(33),
                                                    fontWeight:'500',  
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
                                        style={{ flexDirection: 'row',}}
                                    >

                                    <TouchableOpacity
                                                style={{
                                                    flex:1,
                                                    backgroundColor: COLORS.primary,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1,
                                                    marginRight:1,
                                                    
                                                
                                                }}
                                                onPress={() => checkQty()}
                                            >
                                                
                                                <MaterialIcons name="published-with-changes" size={scale(14)} color="white" style={{marginRight:moderateScale(5)}}  />
                                                <Text style={{ fontSize:scale(10),fontWeight:'600', color: COLORS.white }}>Checked</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                                style={{
                                                    flex:1,
                                                    backgroundColor: 'red',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1,
                                                }}
                                                onPress={() =>  setIsModal(false)}
                                            >
                                                
                                                
                                        
                                                <Ionicons name="close-circle"  size={scale(14)} color="white" style={{marginRight:moderateScale(5)}} />
                                                <Text style={{ fontSize:scale(10),fontWeight:'600', color: COLORS.white }}>Close</Text>
                                    </TouchableOpacity>

                                    </View>
                                        

                            </View>
                                    
                        </View>

                </View>         
            </Modal>


        )
    }

    function renderDistributionNoteModal()
    {
        
        return(
            <Modal 
                        animationType={'fade'}
                        visible={isModalForNote} 
                        transparent={isModalForNote} 
                        
            >
                <View style={{ flex: 1,backgroundColor:'#000000aa', justifyContent:'center',alignItems:'center',
                    }}
                    
                    >

                    

                        <View 
                            style={{ 
                                
                                alignContent:'center',
                                backgroundColor:'#fff',
                                width:'90%',
                                alignItems:'center',
                                borderRadius:scale(4),
                            }}
                        >
                                
                            <View 
                            style={{
                                width:'100%',
                            }}
                            >
                                    <View 
                                    style={{ 
                                        
                                        paddingHorizontal: SIZES.padding * 1 ,
                                        backgroundColor:'#fff'
                                        }}
                                    >
                                        
                                        <Text style={{ fontSize:scale(13),fontWeight:'600',color: '#E91E63',paddingRight:1,textAlign:'center', }}>DISTRIBUTION NOTE</Text>      
                                        <Text style={{ fontSize:scale(11),color: '#b380ff',paddingRight:1,textAlign:'center', }}>{modalPrdName}</Text>

                                    </View>
                                

                                    <View 
                                    style={{ 
                                        
                                        backgroundColor: '#8D6E63',
                                        paddingLeft:moderateScale(5),
                                        textAlign:'left', 
                                        height:scale(40),
                                        marginVertical:1,

                                        }}
                                    >
                                        
                                            
                                            <TextInput
                                                style={{
                                                    
                                                    color:'#F5F5F5',
                                                    fontSize:scale(12),
                                                    fontWeight:'500',  
                                                }}
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                placeholder='note'
                                                placeholderTextColor={COLORS.lightGray}
                                                selectionColor={COLORS.white}
                                                autoFocus={true}
                                                value={distributionNote}
                                                onChangeText={(text) => setDistributionNote(text)}
                                                multiline={true}
                                                maxLength={200}
                                            />

                                    
                                    </View>

                                    <View
                                        style={{ flexDirection: 'row',}}
                                    >
                                           
                                           <TouchableOpacity
                                                        style={{
                                                            flex:1,
                                                            height:scale(28),
                                                            backgroundColor: 'red',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: 1,
                                                            marginRight:moderateScale(1),
                                                        }}
                                                        onPress={() =>  setIsModalForNote(false)}
                                                    >
                                                        
                                                        
                                                
                                                      
                                                        <Text style={{ fontSize:scale(12), color: COLORS.white }}>Close</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                        style={{
                                                            flex:1,
                                                            height:scale(28),
                                                            backgroundColor: COLORS.primary,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: 1,
                                                            
                                                            
                                                        
                                                        }}
                                                        onPress={() => { AddNote() }  }
                                                    >
                                                        
                                                       
                                                        <Text style={{ fontSize:scale(12), color: COLORS.white }}>Done</Text>
                                            </TouchableOpacity>
                                         

                                    </View>
                                        

                            </View>
                                    
                        </View>

                </View>         
            </Modal>


        )
    }



    


    const renderOtherCenterStock =  ({item}) =>{
        
        var color = '#7F465A'
        if(item.center == 'BS')
        {
           color = '#3F51B5';
        }
        else if(item.center == 'SA')
        {
           color = '#388E3C';
        }
        else if(item.center == 'Elite')
        {
            color = '#F44336';
        }
        else if(item.center == 'L6G')
        {
            color = '#546E7A';
        }
       


         return (


            <View
              style={{marginBottom:verticalScale(2)}}

            > 
                <TouchableOpacity
                    style={{
                    
                    height: scale(28),
                    backgroundColor: color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: scale(3),
                    marginRight:moderateScale(2),
                    shadowOffset: { width: 0,height: 1,},
                    shadowOpacity: 0.47,
                    shadowRadius: 1.49,
                    elevation: 1,
                    
                
                }}
                onPress={() => {

                            var [{qty :salesQty}] =   invData.filter((x)=> x.InvoiceDetailsID == item.InvoiceDetailsID);

                            if(salesQty < modalprdQty || modalprdQty  <= 0)
                            {
                                alert('Invalid Qty');
                                return false;
                            }
                            else
                            {
                                
                                if(item.center != 'GODOWN (SRR)')
                                {
                                        confirmChk(item.InvoiceDetailsID,'STOCK_REQUEST_EX',item.center);
                                        setModalSR(false);
                                
                                }
                                else
                                {
                                        confirmChk(invBasicData.InvID,'STOCK_REQUEST');
                                
                                }

                            }

                   
                     }
                }
            >      
                    <View
                        style=
                        {{
                            flexDirection:'row',
                            justifyContent:'space-between'
                         }}
                    
                    >
                        <Text style={{ fontSize:scale(13), color: COLORS.white,fontWeight:'600',flex: 7,paddingHorizontal:moderateScale(5) }}>{item.center}</Text>
                        <Text style={{ fontSize:scale(13), color: COLORS.gray,fontWeight:'600',flex: 7,textAlign:'right',paddingHorizontal:moderateScale(5) }}>{item.centerQty}</Text>

                    </View>
                    
            
                </TouchableOpacity>
            

          </View>

         
       

         )
    }

    const renderDeliveyItem =  ({item}) =>{
        
        var color = '#FBE9E7'
      
       


         return (


            <View
              style={{marginBottom:verticalScale(2)}}

            > 
                <TouchableOpacity
                    style={{
                    
                    backgroundColor: color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    marginRight:moderateScale(2),
                    shadowOffset: { width: 0,height: 1,},
                    shadowOpacity: 0.47,
                    shadowRadius: 0.49,
                    elevation: 1,
                    
                
                }}
                onPress={() => { }}
            >      
                    <View
                        style=
                        {{
                            flexDirection:'row',
                            justifyContent:'space-between'
                         }}
                    
                    >
                       
                        <Text style={{ fontSize:scale(10), color: '#616161',paddingHorizontal:moderateScale(5),flex:5 }}>{item.prdName}</Text>
                        <Text style={{ fontSize:scale(10), color: '#616161',textAlign:'right',paddingHorizontal:moderateScale(5),flex:2 }}>{ invBasicData.InvoiceType == 'PARTIAL' ? item.challan_qty  : item.qty}</Text>
             

                    </View>
                    
            
                </TouchableOpacity>
            

          </View>

         
       

         )
    }

    

   
  
    function renderModalStock()
    {
       
        return(

            <Modal 
               //animationType={'fade'}
                visible={modalSR} 
                transparent={modalSR}       
            >
  
                <TouchableOpacity 
                    style={{ flex:1, backgroundColor:'#000000AA', justifyContent:'flex-end',alignItems:'center',
                    }}
                    onPress={() =>  setModalSR(false)}

                
                >
                    {/* <QRCode value="sujon" > */}
                        <View 
                            style={{ 
                                
                                height:'90%',
                                width:'90%',
                                
                                
                            }}
                        >
                                
                                    <View 
                                        style={{ 
                                            paddingHorizontal: moderateScale(2),
                                            paddingVertical: verticalScale(2) ,
                                            borderRadius:scale(4),
                                            alignItems: 'center',
                                            textAlign:'center',
                                            backgroundColor:'#fff',
                                           
                                        //marginBottom:20,
                                        }}
                                        >
                                              <Text style={{ 
                                                fontSize:scale(13), color: '#EF6C00',fontWeight:'700',textAlign:'left' }}
                                               >
                                                   STOCK REQUEST 
                                            </Text>
                                             <Text style={{ 
                                                fontSize:scale(10), color: COLORS.purple,fontWeight:'600',textAlign:'left' }}
                                               >
                                                    {modalPrdName} 
                                            </Text>
                                             <View
                                               style={{
                                                     flexDirection:'row',marginVertical:verticalScale(4),paddingHorizontal: moderateScale(4)
                                                 }}
                                             >         
                                                       
                                                        <View
                                                                    style={{
                                                                        flex: 3,
                                                                        marginRight:2
                                                                    }}
                                                        >
                                                       
                                                                <Text
                                                                    style={{
                                                                        color:'#757575',
                                                                        fontSize:scale(9),
                                                                        marginBottom:0,
                                                                        marginLeft:moderateScale(1),
                                                                    
                                                                }}>
                                                                    R. Qty
                                                                </Text>
                                                                <TextInput
                                                                style={{
                                                                    
                                                                    color: COLORS.white,
                                                                    fontSize:scale(16),
                                                                    fontWeight:'500', 
                                                                    backgroundColor:'#7986CB',
                                                                    textAlign:'center',
                                                                    borderRadius:scale(2)

                                                                }}
                                                                autoCapitalize='none'
                                                                autoCorrect={false}
                                                                placeholder='0'
                                                                placeholderTextColor={COLORS.lightGray}
                                                                selectionColor={COLORS.white}
                                                                autoFocus={true}
                                                                value={modalprdQty}
                                                                onChangeText={(text) => setModalprdQty(text)}
                                                                keyboardType="numeric"
                                                            />
                                                    </View>
                                                    <View
                                                                    style={{
                                                                        flex: 6,
                                                                        marginRight:moderateScale(1)
                                                                    }}
                                                        >

                                                                        

                                                                        <Text
                                                                                style={{
                                                                                    color:'#757575',
                                                                                    fontSize:scale(9),
                                                                                    marginBottom:0,
                                                                                    marginLeft:moderateScale(2),
                                                                                
                                                                            }}>
                                                                                Carrier
                                                                            </Text>
                                                                            

                                                                            <Dropdown
                                                                                style={{
                                                                                    marginTop: 2,
                                                                                    color: '#424242',
                                                                                    paddingLeft:10,
                                                                                    backgroundColor:'#B0BEC5',
                                                                                
                                                                                borderRadius:2,
                                                                                height:scale(30),
                                                                                flex:1
                                                                            }}
                                                                                //
                                                                                itemTextStyle={{fontSize:scale(13),}}
                                                                                itemContainerStyle={{marginVertical:verticalScale(-7),}}
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
                                                                                maxHeight={scale(600)}
                                                                                labelField="label"
                                                                                valueField="value"
                                                                                placeholder='Carrier'
                                                                                value={carrier}
                                                                                onChange={item => {
                                                                                    setCarrier(item.value);
                                                                                    // setIsFocus(false);
                                                                                }}
                                                                            
                                                                            
                                                                                
                                                                            />

                                                        </View>

                                             </View>
                                           
                                          

                                                

                                                <View
                                                    style={{width:'98%',marginBottom:verticalScale(2)}}

                                                 >  

                                               { ismodalLodding ? (<Loading/>) 
                                                                        : (
                                                            <FlatList
                                                                        data={otherCenterSR} 
                                                                        // extraData={otpData}
                                                                        renderItem={renderOtherCenterStock}
                                                                        keyExtractor={(item) => item.center}
                                                                        showsVerticalScrollIndicator={false}
                                                                        //refreshing={isModalDatalodding}
                                                                        // onRefresh={fetchInvData}   
                                                            /> 
                                                       )
                                                    }
                                               </View> 

                                                
                                           
                                    </View>
                                        

                            </View>
                                
                </TouchableOpacity>         
            </Modal>

        )
    }


    const PrintCR =  async () =>{

        // const token =  await AsyncStorage.getItem('token');
        // if(token !== null) 
        // {
        //     try 
        //     {
              
        //       const {data} = await BaseApi.post('/DistriBution/printUtilityApi.php', {
        //           token: token,
        //           act:'cartonMark',
        //           invID : Invid,
        //         });
  
        //         if(data.service_header.status_tag === 'success')
        //         { 
                    
        //             await Print.printAsync({
        //                 html: cartonmarkHtml(data.spw_data),
        //                 orientation:'landscape'
        //                //y printerUrl: selectedPrinter?.url, // iOS only
        //               });
        //         }
        //         else
        //         {
        //             alert('data fetch Unsussfully');
        //         }
              
        //     } 
        //     catch (error) 
        //     {
        //        console.log(error)
        //     }
          
              
        // }
        // else
        // {
        //    alert('token Missing');
        // }

    
        // const file = await printToFileAsync({
        //     html: html,
        //     base64: false
        //   });
      
        //await shareAsync(file.uri);
       // alert('sujon');

    }

    function cartonmarkHtml(items)
    {
        var html = `
        <!doctype html>
        <html lang="en">
        <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <style>
		@page {
		
		    size: A5 ; 
			margin: 0;
			
		}
		@media print{@page {size: landscape}}
		.main_table tr{font-size:14px;}
		.main_table tr td {
			padding: 2px;
			
		}

		.foter_table td {
		    padding-right: 0px !important;
			padding-top: 0px;
			font-size: px;
			padding-bottom: 0px;
		}
		.foter_table1 td {
				padding-right: 25px !important;
			padding-top: 0px;
			font-size: 12px;
			padding-bottom: 0px;
		}
		.tbody_border_foot
		{ border-bottom: 1px solid black;
		 }
	    </style>
        </head>
        <body style="text-align: center;">
            <div style='margin-top:40px'>
                <div style='padding:20px'>
                        <table width='100%' border='0' cellspacing='0'   >
                        <tbody >
                            <tr>
                                
                                <td width='60%'  style='text-align:left'>
                                    <strong  style='font-size:23px;vertical-align: middle;'>${items.salesCenter}</strong>
                                    <p  style='margin:0px;font-size: 17px;'>${items.centerTitle}</p>
                                    <p  style='margin:0px;font-size: 16px;'>${items.centeraddress}</p>
                                    <p  style='margin:0px;font-size: 16px;'>${items.centerPhone}</p>
                                    <p  style='margin:0px;font-size: 16px;'> e-mail : ${items.centerMail}</p>
                                    <strong  style='font-size:18px;vertical-align: middle;'>MOBILE : ${items.soldByNumber}</strong>
                                    
                                </td>
                                <td width='40%' style='text-align:right' >
                                    <img class='qCode' src='${baseUrl+items.invQr}' width='auto' hight='85%' />
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
                <br><br>
                `;

                if(items.isCondition == 1)
                {

                    html +=`<div style='padding:20px;margin-top:20px;'>
                                <table width="100%">  
                                    <tfoot>   
                                    <tr style="font-size:30px;" >
                                        <td style="font-weight: bold" > 
                                        Condition ${items.contag} Charge  =  &nbsp;<strong style="font-size:35px;">  Tk. ${items.conditionAmt}</strong>
                                        </td>
                                            
                                    </tr>
                                    </tfoot>   
                                </table>
                        </div>`;
               }

                html +=`<br><br>
                <div style='padding:20px'>
						
						<table width="70%"  border="0" cellspacing="0" cellpadding="0" >
								<tbody>
									<tr>
									   <td  style="font-size: 20px;text-align:left" width="22%"><strong>TO</strong></td>
                                       <td width="2%"><strong> : </strong></td>
                                       <td width="46%" style="text-align:left"><strong>&nbsp; ${items.to} </strong></td>
									</tr>
                                    <tr>
                                        <td  style="font-size: 20px;text-align:left" width="22%"><strong>ADDRESS</strong></td>
                                        <td width="2%"><strong> : </strong></td>
                                        <td width="46%" style="text-align:left"><strong>&nbsp; ${items.address} </strong></td>
                                       
                                   </tr>
                                   <tr>
                                        <td  style="font-size: 20px;text-align:left" width="22%"><strong>COURIER</strong></td>
                                        <td width="2%"><strong> : </strong></td>
                                        <td width="46%" style="text-align:left"><strong>&nbsp; ${items.courier} </strong></td>
								    
									</tr>
                                    <tr>
                                    <td  style="font-size: 20px;text-align:left" width="22%"><strong>CARTON</strong></td>
                                        <td width="2%"><strong> : </strong></td>
                                        <td width="46%" style="text-align:left"><strong>&nbsp; ${items.cartonNo} </strong></td>
								    
									</tr>
								</tbody>
						</table>
				</div>
               
            </div>
        </body>


      </html>
      `;
      return html;
    }

    function renderModalEx()
    {
        return (
                    <Modal 
                                //animationType={'fade'}
                                visible={modalstatusEx} 
                                transparent={modalstatusEx}       
                    >
                    
                        <TouchableOpacity 
                            style={{ flex: 1,backgroundColor:'#000000AA', justifyContent:'flex-end',alignItems:'center',
                            }}
                            onPress={() =>  setModalstatusEx(false)}

                        
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
                                                    paddingHorizontal:moderateScale(2) ,
                                                    paddingVertical: verticalScale(6) ,
                                            
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
                                                        fontSize:scale(12),
                                                        fontWeight:'600',
                                                        marginBottom:scale(3)
                                                    }}
                                                    >CARTON MARK</Text>
                                            
                                                <QRCode value={qrValueEx} size={scale(190)}  color={COLORS.purple} />

                                               <View
                                               style={{flexDirection:'row',marginTop:verticalScale(10),paddingHorizontal:moderateScale(6)}}
                                               >

                                                    <TouchableOpacity
                                                                style={{
                                                                    flex: 3,
                                                                    height: scale(35),
                                                                    backgroundColor: '#757575',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: scale(5),
                                                                    flexDirection: 'row',
                                                                    marginRight:moderateScale(2),
                                                                    shadowOffset: { width: 0,height: 1,},
                                                                    shadowOpacity: 0.47,
                                                                    shadowRadius: 1.49,
                                                                    elevation: 3,
                                                                }}
                                                                onPress={() => { PrintCR() }  }
                                                            >
                                                            
                                                       
                                                            <Entypo name="print" size={scale(24)} color="white" />
                                                        
                                                                
                                                                
                                                        </TouchableOpacity>
                                                        

                                               </View>



                                            </View>


                                                

                                </View>
                                            
                                

                        </TouchableOpacity>         
                    </Modal>
        )
    }

    function rederModalCommon()
    {
        var shipDetails = <></>;
        if( modalCommonFor == 'LastPurchasePrice')
        {
          
          var coomonFlatlist = <>
            <FlatList
                        data={lastPriceData}
                        renderItem={renderLastPriceList}
                        keyExtractor={(item) => item.supplierID}
                        showsVerticalScrollIndicator={false}
                        refreshing={isModalDatalodding}
                />
          </> 
             
        }
        else if(modalCommonFor == 'Challan' )
        {
            var coomonFlatlist = <>
                <FlatList
                        data={challanDetailsData}
                        renderItem={renderChallanData}
                        keyExtractor={(item) => item.sl}
                        showsVerticalScrollIndicator={false}
                        refreshing={isModalDatalodding}
                />
            </>

             shipDetails = <>
                             <View 
                                style={{ 
                                    //  flex:1,
                                        paddingHorizontal: moderateScale(0.2) ,
                                       marginTop:verticalScale(4)  
                                        
                                    }}
                                >
                                    <View 
                                    style={{ 
                                            flexDirection:"row",
                                            justifyContent:'space-between',
                                            width:'100%',
                                          
                                        }}
                                    >

                                        <View
                                            style={{borderColor:'#E0E0E0',borderWidth:1,flex:3,paddingVertical:verticalScale(2),paddingHorizontal:moderateScale(4),borderRightWidth:0}}
                                        >
                                            <Text style={{fontSize:scale(8), color:'#9E9E9E',fontWeight:'500' }}>Shipment</Text>
                                            <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1) }}>{speceficChallanDetail.shipaddress}</Text>

                                        </View>

                                        <View
                                            style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(2),paddingHorizontal:moderateScale(4),
                                            borderRightWidth:0,
                                            display:( invBasicData.isAdmin == 1) ? 'flex' : 'none'
                                            
                                        }}
                                             
                                        >
                                                    <TouchableOpacity
                                                        style={{
                                                            flex: 3,
                                                            height: scale(30),
                                                            backgroundColor: '#F44336',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: scale(2),
                                                            flexDirection: 'row',
                                                            shadowOffset: { width: 0,height: 1,},
                                                            shadowOpacity: 0.47,
                                                            shadowRadius: 1.49,
                                                            elevation: 3,
                                                        }}
                                                        onPress={() => confirmChk(invBasicData.InvID,'DeleteChallan',modalTitle)}
                                                    >
                                                        
                                                        <MaterialIcons name="delete" size={scale(14)} color="white" style={{marginRight:moderateScale(5)}}  />
                                                        <Text style={{ fontSize:scale(11),fontWeight:'600', color: COLORS.white }}>DELETE</Text>
                                                </TouchableOpacity>

                                        </View>
                                        

                                    </View>

                                    <View 
                                    style={{ 
                                            flexDirection:"row",
                                            justifyContent:'space-between',
                                            width:'100%', 
                                            display:speceficChallanDetail.shipaddress == 'ON HAND' ? 'none' : 'flex'  
                                        }}
                                    >

                                        <View
                                            style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(2),paddingHorizontal:moderateScale(4),borderRightWidth:0,borderTopWidth:0}}
                                        >
                                            <Text style={{fontSize:scale(8), color:'#9E9E9E',fontWeight:'500' }}>Contact Person</Text>
                                            <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1) }}>{speceficChallanDetail.cp_name}</Text>

                                        </View>
                                        <View
                                            style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(2),paddingHorizontal:moderateScale(4),borderTopWidth:0}}
                                        >
                                            <Text style={{fontSize:scale(8), color:'#9E9E9E',fontWeight:'500' }}>Contact Number</Text>
                                            <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1) }}>{speceficChallanDetail.cp_mobile}</Text>

                                        </View>

                                    </View>

                                    <View 
                                    style={{ 
                                            flexDirection:"row",
                                            justifyContent:'space-between',
                                            width:'100%',
                                            display:speceficChallanDetail.shipaddress == 'ON HAND' ? 'none' : 'flex'
                                            
                                        }}
                                    >

                                        <View
                                            style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(2),paddingHorizontal:moderateScale(4),borderRightWidth:0,borderTopWidth:0}}
                                        >
                                            <Text style={{fontSize:scale(8), color:'#9E9E9E',fontWeight:'500' }}>Courier</Text>
                                            <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1) }}>{speceficChallanDetail.courier} </Text>

                                        </View>
                                        

                                    </View>



                                </View>
            </>




        }
        else if( modalCommonFor == 'Prd_Challan')
        {
            var coomonFlatlist = <>
                <FlatList
                        data={challanDetailsData}
                        renderItem={renderChallanData}
                        keyExtractor={(item) => item.sl}
                        showsVerticalScrollIndicator={false}
                        refreshing={isModalDatalodding}
                />
            </>

        }
        else if(modalCommonFor == 'PrdManageStock' )
        {
            var coomonFlatlist = <>
                <FlatList
                        data={prdManageStockData}
                        renderItem={renderPrdManageStock}
                        keyExtractor={(item) => item.sl}
                        showsVerticalScrollIndicator={false}
                        refreshing={isModalDatalodding}
                />
            </>


        }
        
    
         


        return(

            <Modal 
                        animationType={'fade'}
                        visible={isModalForCommon} 
                        transparent={isModalForCommon} 
                        
            >
                
                    <View 
                        style={{ flex: 1,backgroundColor:'#000000AA', justifyContent:'flex-end',alignItems:'center',
                        }}
                        // onPress={() =>  setIsModalForCommon(false)}

                    
                    >
                        {/* <QRCode value="sujon" > */}
                            <View 
                                style={{ 
                                    
                                    width:'100%',
                                    maxHeight:scale(650),
                                    justifyContent:'flex-end',
                                    
                                }}
                            > 
                                   
                                       <TouchableOpacity 
                                                    style={{ 
                                                        flexDirection: 'row',
                                                        justifyContent:'flex-end',
                                                    
                                                    }}
                                                    onPress={() =>  setIsModalForCommon(false)}
                                                >
                                                    <View

                                                        style={{ 
                                                            flexDirection: 'row',
                                                            backgroundColor:'#EF5350',
                                                            width:'30%',
                                                            paddingHorizontal:moderateScale(2),
                                                            paddingVertical:verticalScale(1),
                                                            borderRadius:scale(2)
                                                          
                                                       
                                                          //alignItems:'right'
                                                        }}
                                                       
                                                    >
                                                    
                                                       <Text style={{flex:2,textAlign:'right',color:'white',fontSize:scale(14),fontWeight:'700'}}>CLOSE</Text>
                                                        <AntDesign name="closesquare" size={scale(18)} color="white" style={{flex:2,textAlign:'right',}} />

                                                    </View>
                                                        
                                                                    
                                                                    

                                        </TouchableOpacity>
                                        <View 
                                            style={{ 
                                            paddingHorizontal: moderateScale(4) ,
                                            alignItems: 'center',
                                            textAlign:'center',
                                            backgroundColor:'#fff',
                                          
                                            }}
                                        >
                                            
                                        </View>
                                        <View 
                                            style={{ 
                                            paddingHorizontal: moderateScale(4) ,
                                            alignItems: 'center',
                                            textAlign:'center',
                                            backgroundColor:'#fff',
                                          
                                            }}
                                        >

                                                        <Text style={{ fontSize:scale(11),color: '#b380ff',paddingRight:1,paddingVertical:3,textDecorationLine: 'underline' }}>{modalTitle}</Text>

                                                {shipDetails}
                                                <View 
                                                    style={{ 
                                                    flexDirection: 'row',
                                                    width:'100%',
                                                    marginVertical:1,
                                                    marginBottom:35,
                                                    marginTop:2

                                                    }}
                                                >
                                                     
                                                     {coomonFlatlist} 
                                                   
                                                
                                                </View>

                                                

                                        </View>
                                            

                                </View>
                                        
                            

                    </View>         
                </Modal>

        )
    }

    function renderBootomSheetCP()
    {
  
        if(isBootomOpen)
        {
  
          
          return (
            
                  <BottomSheet
                  ref={sheetRef}
                  snapPoints={snapPoint}
                  enablePanDownToClose={true}
                  onClose={() => {setIsBootomOpen(false);setShowChallantoggle(false);}}
                   backgroundStyle={{backgroundColor:'#757575'}}
                 
            
                  >
                    <BottomSheetView
                        style={{  flex: 1,paddingHorizontal: moderateScale(3), backgroundColor:'#F3E5F5' }}
                    >
                       
                        <View
                              style={{  flexDirection: 'row',  justifyContent: 'space-between',display: invBasicData.InvoiceType == 'PARTIAL' ? 'flex' : 'flex'  }}
                         >
                           {/* <Text style={{  marginVertical:15, textAlign:'center',color:'#4E342E',fontSize:16,fontWeight:'700',flex:3,  } }>MODIFY SHIPMENT </Text> */}
                           <TouchableOpacity
                                              style={{ 
                                                  height:scale(26),
                                                  backgroundColor: '#7E57C2',
                                                  justifyContent:'center',
                                                  borderRadius: scale(2),
                                                  flexDirection:'row',
                                                  alignItems: 'center',
                                                  shadowOffset: { width: 0,height: 1,},
                                                  shadowOpacity: 0.47,
                                                  shadowRadius: 0.49,
                                                  elevation: 2,
                                                  flex:2,
                                                  marginVertical:verticalScale(5)
                                                  
                                              }}
                                              
                                              onPress={() => { confirmChk(Invid,'ModifyShipment',invBasicData.running_challan_no);}}               
                            >
                                        
                                              <Text style={{ fontSize:scale(12), color: COLORS.white,paddingVertical:verticalScale(2) }}>MODIFY SHIPMENT</Text>
                                       
  
                            </TouchableOpacity>
  
                        </View>
                      
                             <View  style={{  flexDirection:'row', justifyContent:'space-between' }  }>  
        
                                    <View
                                        style={{
                                            flex: 1,
                                        }}
                                    >
                                            <Text
                                                    style={{
                                                        color:'#757575',
                                                        fontSize:scale(10),
                                                    
                                                }}>
                                                   Shipment Address
                                                    </Text>
                                                    <Dropdown
                                                        style={{
                                                        
                                                            color: '#424242',
                                                            fontSize:scale(10),
                                                            paddingLeft:moderateScale(6),
                                                            backgroundColor:'#D7CCC8',
                                                        
                                                        borderRadius:2,
                                                        height:scale(26),
                                                        shadowOffset: { width: 0,height: 1,},
                                                        shadowOpacity: 0.47,
                                                        shadowRadius: 0.49,
                                                        elevation: 2,
                                                    }}
                                                        //
                                                        itemTextStyle={{fontSize:scale(11),}}
                                                        itemContainerStyle={{marginVertical:verticalScale(-7),}}
                                                        //placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={{fontSize:scale(12)}}
                                                        inputSearchStyle={{height: scale(28)}}
                                                        //iconStyle={styles.iconStyle}
                                                        search
                                                        // searchPlaceholder="Search..."
                                                        // placeholder={!isFocus ? 'Select item' : '...'}
                                                            // onFocus={() => setIsFocus(true)}
                                                        // onBlur={() => setIsFocus(false)}
                                                        data={shipmentCombo}
                                                        maxHeight={scale(600)}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder='SELECT SHIPMENT ADDRESS'
                                                        value={selectAddress}
                                                        onChange={item => {
                                                            setSelectAddress(item.value);
                                                            setDivision(item.division);
                                                            setDistrict(item.district);
                                                            setCp_name(item.cp_name);
                                                            setCp_mobile(item.cp_mobile);
                                                           
                                                            if(item.label == 'ON HAND' || item.label == 'New Address')
                                                            {
                                                                setShipaddress('');
                                                            }
                                                            else
                                                            {
                                                                setShipaddress(item.label);
                                                            }
                                                            
                                                      
                                                        }}
                                                        
                                                    />
                                                    
                                                    

                                    </View>

                            

                            
                                            

                            </View>
                            <View  style={{  flexDirection:'row', justifyContent:'space-between' }  }> 

                                            <Dropdown
                                                style={{
                                                    marginTop: verticalScale(2),
                                                    color: '#424242',
                                                    fontSize:scale(10),
                                                    paddingLeft:moderateScale(6),
                                                    backgroundColor:'#EEEEEE',
                                                
                                                borderRadius:scale(1),
                                                height:scale(26),
                                                flex:1,
                                                marginRight:moderateScale(1)
                                            }}
                                                //
                                                itemTextStyle={{fontSize:scale(11),}}
                                                itemContainerStyle={{marginVertical:verticalScale(-7),}}
                                                //placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={{fontSize:scale(12)}}
                                                inputSearchStyle={{height: scale(28)}}
                                                //iconStyle={styles.iconStyle}
                                                search
                                                // searchPlaceholder="Search..."
                                                // placeholder={!isFocus ? 'Select item' : '...'}
                                                    // onFocus={() => setIsFocus(true)}
                                                // onBlur={() => setIsFocus(false)}
                                                data={divisioncombo}
                                                maxHeight={scale(600)}
                                                labelField="label"
                                                valueField="value"
                                                placeholder='SELECT DIVISON'
                                                value={division}
                                                onChange={item => {
                                                    setDivision(item.value);
                                                    // setIsFocus(false);
                                                }}
                                             
                                                
                                                
                                            /> 

                                             <Dropdown
                                                style={{
                                                    marginTop: verticalScale(2),
                                                    color: '#424242',
                                                   
                                                    paddingLeft:moderateScale(6),
                                                    backgroundColor:'#EEEEEE',
                                                
                                                borderRadius:2,
                                                height:scale(26),
                                                flex:1
                                            }}
                                                //
                                                itemTextStyle={{fontSize:scale(11),}}
                                                itemContainerStyle={{marginVertical:verticalScale(-7),}}
                                                //placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={{fontSize:scale(12)}}
                                                inputSearchStyle={{height: scale(28)}}
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
                                                data={districtcombo}
                                                maxHeight={scale(600)}
                                                labelField="label"
                                                valueField="value"
                                                placeholder='SELECT DISTRICT'
                                                value={district}
                                                onChange={item => {
                                                    setDistrict(item.value);
                                                    // setIsFocus(false);
                                                }}
                                               
                                               
                                                
                                            />
        
                                        

                                
                            </View>

                            <View  style={{  flexDirection:'row', justifyContent:'space-between' }  }>  
        
                                        <TextInput
                                            style={{
                                                marginTop: verticalScale(2),
                                                color: '#424242',
                                                fontSize:scale(12),
                                                paddingLeft:moderateScale(6),
                                                backgroundColor:'#FFFFFF',
                                                opacity:0.8,
                                                height:scale(26),
                                                paddingVertical:verticalScale(5),
                                                borderRadius:2,
                                                shadowOffset: { width: 0,height: 1,},
                                                shadowOpacity: 0.47,
                                                shadowRadius:0.49,
                                                elevation: 2,
                                                flex:1,
                                                marginRight:1
                                            
                                                
                                            }}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholder="Contact Person"
                                            placeholderTextColor='#9E9E9E'
                                            selectionColor={COLORS.black}
                                            value={cp_name}
                                            onChangeText={(text) => setCp_name(text)}
                                            // editable={false}
                                           
                                            
                                        />

                                        <TextInput
                                                    style={{
                                                        marginTop: verticalScale(2),
                                                        color: '#424242',
                                                        fontSize:scale(12),
                                                        backgroundColor:'#FFFFFF',
                                                        opacity:0.8,
                                                        height:scale(26),
                                                        paddingLeft:moderateScale(6),
                                                        paddingVertical:verticalScale(5),
                                                       borderRadius:2,
                                                       shadowOffset: { width: 0,height: 1,},
                                                       shadowOpacity: 0.47,
                                                       shadowRadius: 0.49,
                                                       elevation: 2,
                                                       flex:1
                                                    
                                                      
                                                    }}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    placeholder="Contact Number"
                                                    placeholderTextColor='#9E9E9E'
                                                    selectionColor={COLORS.black}
                                                    value={cp_mobile}
                                                    keyboardType="numeric"
                                                    onChangeText={(text) => setCp_mobile(text)}
                                                    //editable={false}
                                                    
                                         />

                                
                            </View>

                            <View  style={{  flexDirection:'row', justifyContent:'space-between' }  }>  

                                        <TextInput
                                                    style={{
                                                        marginTop: verticalScale(2),
                                                        color: '#424242',
                                                        fontSize:scale(12),
                                                        backgroundColor:'#FFFFFF',
                                                        opacity:0.8,
                                                        height:scale(26),
                                                        paddingLeft:moderateScale(6),
                                                        paddingVertical:verticalScale(5),
                                                       borderRadius:2,
                                                       shadowOffset: { width: 0,height: 1,},
                                                       shadowOpacity: 0.47,
                                                       shadowRadius: 0.49,
                                                       elevation: 2,
                                                       flex:1
                                                    
                                                      
                                                    }}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    placeholder="Address"
                                                    placeholderTextColor='#9E9E9E'
                                                    selectionColor={COLORS.black}
                                                    value={shipaddress}
                                                    onChangeText={(text) => setShipaddress(text)}
                                                    //editable={false}
                                                    
                                         />

                                
                            </View>

                          


                                                



                            <View  style={{  flexDirection:'row', justifyContent:'space-between' }  }>  
        
                                    <View
                                        style={{
                                            flex: 7,
                                        }}
                                    >
                                                    <Text
                                                        style={{
                                                            color:'#757575',
                                                            fontSize:scale(9),
                                                            marginTop:verticalScale(3),
                                                         
                                                        
                                                    }}>
                                                      Courier
                                                    </Text>
                                                    <Dropdown
                                                        style={{
                                                      
                                                            color: '#424242',
                                                            fontSize:scale(10),
                                                            paddingLeft:moderateScale(6),
                                                            backgroundColor:'#90A4AE',
                                                        
                                                        borderRadius:2,
                                                        height:scale(26),
                                                        shadowOffset: { width: 0,height: 1,},
                                                        shadowOpacity: 0.47,
                                                        shadowRadius: 0.49,
                                                        elevation: 2,
                                                        marginRight:1
                                                    }}
                                                        //
                                                        itemTextStyle={{fontSize:scale(11),}}
                                                        itemContainerStyle={{marginVertical:verticalScale(-7),}}
                                                        //placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={{fontSize:scale(12)}}
                                                        inputSearchStyle={{height: scale(28)}}
                                                        //iconStyle={styles.iconStyle}
                                                        search
                                                        // searchPlaceholder="Search..."
                                                        // placeholder={!isFocus ? 'Select item' : '...'}
                                                            // onFocus={() => setIsFocus(true)}
                                                        // onBlur={() => setIsFocus(false)}
                                                        data={courierCombo}
                                                        maxHeight={scale(600)}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder='SELECT COURIER'
                                                        value={selectCourier}
                                                        onChange={item => {
                                                            setSelectCourier(item.value);
                                                            // setIsFocus(false);
                                                        }}
                                                        
                                                    />
                                                    
                                                    
        
                                </View> 
                                <View
                                        style={{
                                            flex: 3,
                                            display: invBasicData.InvoiceType == 'PARTIAL' ? 'none' : 'flex' 
                                        }}
                                >
                                                   <Text
                                                        style={{
                                                            color:'#757575',
                                                            fontSize:scale(9),
                                                            marginTop:verticalScale(3),
                                                            marginLeft:moderateScale(2),
                                                        
                                                    }}>
                                                      Condition Amount
                                                    </Text>
                                                <TextInput
                                                    style={{
                                                       
                                                        color: '#424242',
                                                        fontSize:scale(13),
                                                        paddingLeft:moderateScale(6),
                                                        backgroundColor:'#FFFFFF',
                                                        opacity:0.8,
                                                        height:scale(26),
                                                       paddingVertical:verticalScale(4),
                                                       borderRadius:2,
                                                       shadowOffset: { width: 0,height: 1,},
                                                       shadowOpacity: 0.47,
                                                       shadowRadius: 0.49,
                                                       elevation: 2,
                                                       flex:1,
                                                      
                                                    
                                                      
                                                    }}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    placeholder="Amount"
                                                    placeholderTextColor='#9E9E9E'
                                                    selectionColor={COLORS.black}
                                                    value={cnd_amount}
                                                    keyboardType="numeric"
                                                    onChangeText={(text) => {
                                                            setCnd_amount(text);
                                                            // if(text == 0)
                                                            // {
                                                            //     setHdnConditionConf(0);
                                                            // }
                                                            // else
                                                            // {
                                                            //     setHdnConditionConf(1);
                                                            // }
                                                      }
                                                    }
                                                 
                                                    editable={false}
                                                    
                                         />  

                                </View>          

                                              
        
                            </View>

                            
                             <View  
                               style={{  
                                 flexDirection:'row',
                                 justifyContent:'space-between',
                                 display: invBasicData.InvoiceType == 'PARTIAL' ? 'none' : 'none' 
                               }}
                             > 

                                     <TextInput
                                             style={{
                                                 marginTop: verticalScale(2),
                                                 marginBottom:verticalScale(9),
                                                color: '#424242',
                                                 fontSize:scale(11),
                                                 paddingLeft:moderateScale(6),
                                                backgroundColor:'#FFFFFF',
                                                 opacity:0.8,
                                                 height:scale(34),
                                                 paddingVertical:verticalScale(5),
                                                 borderRadius:2,
                                                 shadowOffset: { width: 0,height: 1,},
                                                 shadowOpacity: 0.47,
                                                 shadowRadius: 0.49,
                                                elevation: 2,
                                                 flex:1
                                            
                                                
                                             }}
                                             autoCapitalize="none"
                                            autoCorrect={false}
                                             placeholder="Addtonal Amount Remarks"
                                            placeholderTextColor='#9E9E9E'
                                             selectionColor={COLORS.black}
                                            value={con_additional_rmks}
                                            onChangeText={(text) => { setCon_additional_rmks(text);}}
                                            multiline={true}
                                            
                                             //editable={false}
                                            
                                   />


                             </View>

                          
                            
                    </BottomSheetView>
                </BottomSheet>
          
           );
  
        }
        else
        {
          return null;
        }
      
    }

    function renderDeliverModal ()
    {
       return(

              <Modal 
              animationType={'fade'}
              visible={ismodalDeliver} 
              transparent={ismodalDeliver} 
              
              >
              <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : ''}
                  style={{ flex: 1 }}
              >
                  <View style={{ flex: 1,backgroundColor:'#000000aa', justifyContent:'center',alignItems:'center',
                  }}
                  
                  >
                          <View 
                              style={{ 
                                  
                                  alignContent:'center',
                                  backgroundColor:'#F5F5F5',
                                  alignItems:'center',
                                  borderRadius:scale(2),
                                  width:'94%',
                                  height:'88%' 
                              }}
                          >

                                      <View 
                                          style={{ 
                                                  //flexDirection:"row",
                                                  paddingHorizontal: moderateScale(4) ,
                                                  marginTop:verticalScale(2),
                                                  
                                              }}
                                          >

                                          <Text style={{fontSize:scale(12),fontWeight:'600', color: COLORS.purple, }}>{invBasicData.running_challan_no}</Text>

                                      </View>
                                      <View 
                                          style={{ 
                                                //  flex:1,
                                                  paddingHorizontal: 0 ,
                                                  marginTop:verticalScale(2),
                                                  
                                              }}
                                          >
                                                <View 
                                                style={{ 
                                                        flexDirection:"row",
                                                        justifyContent:'space-between',
                                                        width:'100%'
                                                        
                                                    }}
                                                >

                                                    <View
                                                      style={{borderColor:'#E0E0E0',borderWidth:1,flex:2,paddingVertical:verticalScale(1),paddingHorizontal:moderateScale(4),borderRightWidth:0}}
                                                    >
                                                        <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Shipment</Text>
                                                        <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1.5) }}>{ shipExist == 0 ? 'ON HAND' : shipaddress}</Text>

                                                    </View>
                                                    

                                                </View>

                                                <View 
                                                style={{ 
                                                        flexDirection:"row",
                                                        justifyContent:'space-between',
                                                        width:'100%',
                                                        display: (shipExist == 0 ) ? 'none' : 'flex'
                                                        
                                                    }} 
                                                >

                                                    <View
                                                      style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(1),paddingHorizontal:moderateScale(4),borderRightWidth:0,borderTopWidth:0}}
                                                    >
                                                        <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Contact Person</Text>
                                                        <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1.5) }}>{cp_name}</Text>

                                                    </View>
                                                    <View
                                                      style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(1),paddingHorizontal:moderateScale(4),borderTopWidth:0}}
                                                    >
                                                        <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Contact Number</Text>
                                                        <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1.5) }}>{cp_mobile}</Text>

                                                    </View>

                                                </View>

                                                <View 
                                                style={{ 
                                                        flexDirection:"row",
                                                        justifyContent:'space-between',
                                                        width:'100%',
                                                        display: (shipExist == 0) ? 'none' : 'flex'
                                                        
                                                    }}
                                                >

                                                    <View
                                                      style={{borderColor:'#E0E0E0',borderWidth:1,flex:1,paddingVertical:verticalScale(1),paddingHorizontal:moderateScale(4),borderRightWidth:0,borderTopWidth:0}}
                                                    >
                                                        <Text style={{fontSize:scale(7), color:'#9E9E9E',fontWeight:'500' }}>Courier</Text>
                                                        <Text style={{fontSize:scale(9), color: '#00796B',marginTop:verticalScale(-1.5) }}>{couriername}</Text> 

                                                    </View>
                                                   

                                                </View>

                                          

                                      </View>

                                      <View style={{ flex:1,width:'100%', marginTop:verticalScale(2),marginBottom:verticalScale(70),paddingHorizontal:1 }  }>
                                              
                                      <TouchableOpacity
                                                    style={{
                                                    
                                                    backgroundColor: '#FFCCBC',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1,
                                                    marginRight:moderateScale(2),
                                                    shadowOffset: { width: 0,height: 1,},
                                                    shadowOpacity: 0.47,
                                                    shadowRadius: 0.49,
                                                    elevation: 1,
                                                    marginBottom:verticalScale(2)
                                                    
                                                
                                                }}
                                                onPress={() => { }}
                                            >      
                                                    <View
                                                        style=
                                                        {{
                                                            flexDirection:'row',
                                                            justifyContent:'space-between'
                                                        }}
                                                    
                                                    >
                                                    
                                                        <Text style={{ fontSize:scale(10), color: '#616161',paddingHorizontal:moderateScale(5),flex:5 }}>Product</Text>
                                                        <Text style={{ fontSize:scale(10), color: '#616161',textAlign:'right',paddingHorizontal:moderateScale(5),flex:2 }}>Quantity</Text>

                                                    </View>
                                                    
                                            
                                                </TouchableOpacity>
 
                                              <FlatList
                                                      data={ invData.filter((x)=> x.arangeByID !='' )}
                                                      renderItem={renderDeliveyItem}
                                                      keyExtractor={(item) => item.InvoiceDetailsID}
                                                      showsVerticalScrollIndicator={true}
                                                      //refreshing={islodding}
                                                      //onRefresh={fetchInvData}
                                                      
                                                  
                                              />  


                                          </View> 
                                          
                                                 

                                         

                                      <View 

                                          style={{
                                              position: 'absolute',
                                              bottom: 0,
                                              left: 0,
                                              right: 0,
                                              // background color must be set
                                                  // invisible color
                                              backgroundColor:'#EEEEEE',
                                              marginBottom:0,
                                              //paddingVertical:SIZES.padding * 0 ,
                                              flexDirection:"row"
                                          }}
                                      >

                                                

                                                 
                                                     
                                                      <TouchableOpacity
                                                                  style={{ 
                                                                      height: scale(32),
                                                                      backgroundColor: '#EF5350',
                                                                      marginRight:moderateScale(1),
                                                                      flex:2,
                                                                      flexDirection:"row",
                                                                      alignItems:'center',
                                                                      justifyContent:'center'
                                                                      
                                                                  }}
                                                                  onPress={() =>  setIsmodalDeliver(false)}
                                                                  //confirmChk(Invid,'SAVE_PURCHASE')
                                                              >
                                                              
                                                          
                                                                  
                                                              {/* <ActivityIndicator animating={true} size={"small"} color={"#ffffff"}  style={{ flex: 1 }}  /> */}
                                                                  
                                                                  <MaterialIcons name="close" size={scale(15)} color="white" style={{marginRight:moderateScale(4)}} />
                                                                  <Text style={{ fontSize:scale(11),fontWeight:'600', color: COLORS.white,  }}> CLOSE </Text>
                                                      </TouchableOpacity>
                                                      <TouchableOpacity
                                                                  style={{ 
                                                                      height: scale(32),
                                                                      backgroundColor: '#7E57C2',
                                                                      flex:5,
                                                                      flexDirection:"row",
                                                                      alignItems:'center',
                                                                      justifyContent:'center'
                                                                      
                                                                  }}
                                                                  onPress={() =>  {confirmChk(Invid,'Deliver');}}
                                                                  //
                                                              >
                                                              
                                                          
                                                                  
                                                              {/* <ActivityIndicator animating={true} size={"small"} color={"#ffffff"}  style={{ flex: 1 }}  /> */}
                                                                  
                                                                  {/* <MaterialIcons name="lock-open" size={16} color="white" style={{marginRight:4}} /> */}
                                                                  <MaterialIcons name="published-with-changes" size={scale(15)} color="white" style={{marginRight:moderateScale(4)}}  />
                                                                  <Text style={{ fontSize:scale(11),fontWeight:'600', color: COLORS.white,  }}> Deliver </Text>
                                                      </TouchableOpacity>
                                                  




                                    </View>
                                  
                          
                                      
                                          

                           </View>
                                      
                          

                  </View>   
                  </KeyboardAvoidingView>      
              </Modal>

       );

    }
  


      function renderbody() {
        
          
          return (
            
              <View style={{ flex:1, marginTop:verticalScale(2), paddingHorizontal: moderateScale(3)}  }>
                         <FlatList
                                  data={invData}
                                 // extraData={otpData}
                                  renderItem={invBasicData.InvoiceType != 'PARTIAL' ? renderInvList : renderPartialInvList}
                                  keyExtractor={(item) => item.InvoiceDetailsID}
                                  showsVerticalScrollIndicator={false}
                                  refreshing={islodding}
                                  //onRefresh={fetchInvData}
                                 
                                
                          /> 
                           
                         
              </View>
          );
      }

      return ( 
        <>
             <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                style={{ flex: 1 }}
            >
      
                    <SafeAreaView style={{backgroundColor: COLORS.blue}}>
                        {renderHeader()}
                    </SafeAreaView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}  >
                        <View style={{ flex: 1, backgroundColor: COLORS.lightGray, }}>

                            {/* {
                                isloddingAction ? (null) 
                                : (rendertop())
                            } */}

                            {
                                isloddingAction ? (<Loading/>) 
                                : <>
                                  { rendertop()}{ renderbody()}
                                </>
                            }


                            {renderModalQty()}
                            {renderModalStock()}
                            {rederModalCommon()}
                            {renderModalEx()}
                            {renderDistributionNoteModal()}
                            {renderBootomSheetCP()}
                            {renderDeliverModal()}

                            { <QrCodeModal qrtitle={qrtitle} qrvalue={qrValue} color={COLORS.purple} size={scale(190)}  setModalstatus={setModalstatus} modalstatus={modalstatus}/>}


                        </View> 

                    </TouchableWithoutFeedback>    
             
            
                    
            </KeyboardAvoidingView>    
             
        
        </> 
                 
              
      );
}



export default InvForDeliver;