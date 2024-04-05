import React, { useState ,useEffect} from 'react';
import { View, Text, FlatList, Picker, TouchableOpacity, ScrollView,  TextInput } from 'react-native';
import axios from 'axios';
import { useAuth } from "@/context/auth";
import styles from "@/styles/global";
import axiosConfig from "@/constants/axiosConfig";




axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


export default function RoleManagement() {
  axiosConfig();
  const [userRole, setUserRole] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  
  const [userInfo, setUserInfo] = useState([]);

    interface User {
      selectedRole: string;
      id: number;
      first_name: string;
      last_name: string;
      role: string;
    }


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

    
      function editRolepatch(id, is_tutor, is_professor){
        axios
          .patch(`http://localhost:8000/api/editRole/${id}`, { // Correction ici
              is_tutor: is_tutor,
              is_professor: is_professor
          })
          .then((res) => {
              console.log(res);
          })
          .catch((err) => console.error(err));
      }

      function editRoledelete(id){
        axios
          .delete(`http://localhost:8000/api/editRole/${id}`) // Correction ici
          .then((res) => {
              console.log(res);
          })
          .catch((err) => console.error(err));
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

    function removeSuperUser(id,role:string){
      if(role == 'superuser'){
        rolemanagementpatch(id,false)
      }
    }
  const usersInfoRole = generateUsersInfoRole(userInfo, userRole);
  console.log(usersInfoRole);



const MyListComponent = () => {

      const handlePress = (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) {
          console.error('Utilisateur non trouvé');
          return;
        }

        if(user.selectedRole == 'student'){
           removeSuperUser(user.id,user.role);
           editRoledelete(user.id)
        }
        else if(user.selectedRole == 'professor'){
            removeSuperUser(user.id,user.role);
            editRolepatch(user.id,false,true)


        }
        else if(user.selectedRole == 'tutor'){
          removeSuperUser(user.id,user.role);
          editRolepatch(user.id,true,false)
        }
        else {
          rolemanagementpatch(user.id,true)
        }

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
          
          
        <TouchableOpacity onPress={() => handlePress(item.id)} style={{ backgroundColor: '#841584', padding: 10, borderRadius: 5 }}>
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


const generateUsersInfoRole = (userInfo, userRole) => {
  // Cartographie des ID d'utilisateur à leurs rôles en utilisant les informations de `userRole`
  const roleMap = userRole.reduce((acc, curr) => {
    // Déterminer le rôle de l'utilisateur basé sur `is_professor` et `is_tutor`
    const role = curr.is_professor ? 'professor' : curr.is_tutor ? 'tutor' : 'student';
    acc[curr.user] = role;
    return acc;
  }, {});

  // Générer le tableau final en parcourant `userInfo`
  const usersInfoRole = userInfo.map(user => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    // Attribuer le rôle depuis `roleMap` ou 'student' par défaut si non trouvé
    role: roleMap[user.id] || 'student',
  }));

  return usersInfoRole;
};
  