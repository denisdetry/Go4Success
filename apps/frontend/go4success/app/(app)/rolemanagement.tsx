import React, { useState ,useEffect} from 'react';
import { View, Text, FlatList, Picker, TouchableOpacity, ScrollView,  TextInput } from 'react-native';
import axios from 'axios';
import { useAuth } from "@/context/auth";
import styles from "@/styles/global";

export default function RoleManagement() {

  const [userRole, setUserRole] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  
  const [userInfo, setUserInfo] = useState([]);




    useEffect(() => {

    axios
    .get("http://localhost:8000/api/rolemanagement/")    
    .then((res) => {
        setUserInfo(res.data);
        
    })
    .catch((err) => {
        throw err;
    });



    axios
      .get("http://localhost:8000/api/editRole/")    
      .then((res) => {
          setUserRole(res.data);

      })
      .catch((err) => {
          throw err;
      });



    },[]); 


        console.log(userInfo);
        console.log(userRole);
    

    
    
    function editRolePost(id: any,is_tutor: any,is_professor: any){
      axios
        .post("http://localhost:8000/api/editRole/", {
            id:id,
            is_tutor:is_tutor,
            is_professor:is_professor

        })
        .then((res) => {
            console.log(res);
            
      })
    }

    
    function editRolepatch(id: any,is_tutor: any,is_professor: any){
      axios
        .patch("http://localhost:8000/api/editRole/${id}", {
            id:id,
            is_tutor:is_tutor,
            is_professor:is_professor

        })
        .then((res) => {
            console.log(res);
            
        })
    }

    
    function editRoledelete(id: any){
      axios
        .delete("http://localhost:8000/api/editRole/${id}", {
          


        })
        .then((res) => {
            console.log(res);
            
        })
    }



    function rolemanagementpatch(id: any,super_user:any){
      axios
        .patch("http://localhost:8000/api/rolemanagement/${id}", {
          super_user:super_user


        })
        .then((res) => {
            console.log(res);
            
        })
    }

 const usersInfoRole = [
  {'id':1, 'first_name':'Longfils', 'last_name':'Gerry', 'role':'student'},
  {'id':2, 'first_name':'Kozlowski', 'last_name':'Cyryl', 'role':'superuser'},
  {'id':3, 'first_name':'André', 'last_name':'Maxime', 'role':'professor'},
  {'id':4, 'first_name':'Devolder', 'last_name':'Martin', 'role':'tutor'},
];

const MyListComponent = () => {


  const handlePress = () => {

 



  };


  // Ajout d'un état pour suivre la valeur sélectionnée de chaque liste déroulante
  // Initialiser chaque élément avec son rôle actuel
  const [users, setUsers] = useState(
    usersInfoRole.map(user => ({ ...user, selectedRole: user.role }))
  );

  const handleValueChange = (itemValue, itemId) => {
    // Mettre à jour l'état avec la nouvelle valeur sélectionnée pour l'utilisateur spécifié
    const updatedUsers = users.map(user => {
      if (user.id === itemId) {
        return { ...user, selectedRole: itemValue };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>
            {item.id} {item.first_name} {item.last_name} {item.role}
          </Text>
          <Picker
            selectedValue={item.selectedRole}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => handleValueChange(itemValue, item.id)}>
            <Picker.Item label="student" value="student" />
            <Picker.Item label="super user" value="superuser" />
            <Picker.Item label="professor" value="professor" />
            <Picker.Item label="tutor" value="tutor" />
          </Picker>
          
          
          <TouchableOpacity onPress= {handlePress} style={{ backgroundColor: '#841584', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Save</Text>
          </TouchableOpacity>
          
        </View>
      )}
    />
  );
};




  return (
    <View>
      <MyListComponent />
    </View>
  );




};

/** 

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

  */




  