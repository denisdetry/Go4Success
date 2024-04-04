import React, { useState ,useEffect} from 'react';
import { View, Text, FlatList, Picker, TouchableOpacity, ScrollView,  TextInput} from 'react-native';
import axios from 'axios';
import { useAuth } from "@/context/auth";
import styles from "@/styles/global";

export default function RoleManagement() {

  const {getUserInfo,getUserRole} = useAuth();
  const [userInfo, setUserInfo] = useState();
  const [userRole, setUserRole] = useState();


    useEffect(() => {
    const fetchUserData = async () => {
      const userInfoData = await getUserInfo();
      const userRoleData = await getUserRole();
      setUserInfo(userInfoData);
      setUserRole(userRoleData);
    };

    fetchUserData();
    }, []); 


  
  console.log(userInfo);
  //let info = makeRole(userInfo, userRole);



};




function makeRole(userInfo,userRole){

      let listOfRole = [];
      let jsonToPush = {};
      

      for(let i=0;i < userInfo.length; i++){

        for(let j=0; j < userRole.length;j++){
   
          if(userInfo[i].id == userRole[j].id){

            if(userRole[j].is_tutor == false){

                jsonToPush = {

                  id:userInfo[i].id,
                  lastname:userInfo[i].last_name,
                  firstname:userInfo[i].first_name,
                  role:"professor"

                }
            
            }

            else {

                jsonToPush = {

                  id:userInfo[i].id,
                  lastname:userInfo[i].last_name,
                  firstname:userInfo[i].first_name,
                  role:"tutor"

                }


            }
                   

        }
        else{
          jsonToPush = {

            id:userInfo[i].id,
            lastname:userInfo[i].last_name,
            firstname:userInfo[i].first_name,
            role:"student"

          }
        }

        

      }

      listOfRole.push(jsonToPush);
    
    
    }
  
  
    return listOfRole;
  
  }
