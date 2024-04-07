import React, { useEffect, useState } from "react";
import { FlatList, Picker, Text, TouchableOpacity, View,StyleSheet } from "react-native";
import axios from "axios";
import axiosConfig from "@/constants/axiosConfig";
import { API_BASE_URL } from "@/constants/ConfigApp";

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function RoleManagement() {
    axiosConfig();
    const [userRole, setUserRole] = useState<UserRole[]>([]);
    const [selectedValue, setSelectedValue] = useState("");

    const [userInfo, setUserInfo] = useState([]);

    interface User {
        selectedRole: string;
        id: number;
        first_name: string;
        last_name: string;
        role: string;
    }


    interface UserRole {
    user: number;
    is_professor: boolean;
    is_tutor: boolean;
    }



    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/rolemanagement/rolemanagement/`)
            .then((res) => {
                setUserInfo(res.data);
            })
            .catch((err) => {
                throw err;
            });

        axios
            .get(`${API_BASE_URL}/rolemanagement/editRole/`)
            .then((res) => {
                setUserRole(res.data);
            })
            .catch((err) => {
                throw err;
            });
    }, []);


    function editRolePost(id: any, is_tutor: any, is_professor: any) {
        axios
            .post(`${API_BASE_URL}/rolemanagement/editRole/`, {
                user: id,
                is_tutor: is_tutor,
                is_professor: is_professor,
            })
            .then((res) => {
                console.log(res);
            });
    }

    function editRolepatch(id, is_tutor, is_professor) {
        axios
            .patch(`${API_BASE_URL}/rolemanagement/editRole/${id}/`, {
                user:id,
                is_tutor: is_tutor,
                is_professor: is_professor,
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.error(err));
    }

    function editRoledelete(id) {
        axios
            .delete(`${API_BASE_URL}/rolemanagement/editRole/${id}/`) // Correction ici
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.error(err));
    }

    function rolemanagementpatch(id: any, super_user: any) {
        axios
            .patch(`${API_BASE_URL}/rolemanagement/rolemanagement/${id}/`, {

                is_superuser: super_user,
            })
            .then((res) => {
                console.log(res);
            });
    }




    console.log(userRole);
    const usersInfoRole = generateUsersInfoRole(userInfo, userRole);
    console.log(usersInfoRole);

    const MyListComponent = () => {
        const handlePress = (userId: any) => {
            const user = users.find((u) => u.id === userId);
            if (!user) {
                console.error("Utilisateur non trouvé");
                return;
            }

            if (user.selectedRole === "student") {
                rolemanagementpatch(userId,false);
                editRoledelete(user.id);
            } else if (user.selectedRole === "professor") {
                if(!userRole.some(element => element.user === userId)){
                    editRolePost(userId,false,true);
                    rolemanagementpatch(userId,false)

                }
                else{
                    rolemanagementpatch(userId,false);
                    editRolepatch(user.id, false, true);
                }

            } else if (user.selectedRole === "tutor") {

                if(!userRole.some(element => element.user === userId)){
                    editRolePost(userId,false,true);
                    rolemanagementpatch(userId,false)
                }
                else{
                    rolemanagementpatch(userId,false);                    
                    editRolepatch(user.id, true, false);
                }




            } else {
                console.log("ok je passe ici");
                rolemanagementpatch(user.id, true);
            }
        };

        // Ajout d'un état pour suivre la valeur sélectionnée de chaque liste déroulante
        // Initialiser chaque élément avec son rôle actuel
        const [users, setUsers] = useState(
            usersInfoRole.map((user) => ({ ...user, selectedRole: user.role })),
        );

        const handleValueChange = (itemValue, itemId) => {
            // Mettre à jour l'état avec la nouvelle valeur sélectionnée pour l'utilisateur spécifié
            const updatedUsers = users.map((user) => {
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.listItem} >
                <View style={styles.userInfo}>
                    <Text>
                    ID : {item.id} Prénom : {item.first_name}  Nom : {item.last_name}
                    </Text>
                </View>
                <Picker
                    selectedValue={item.selectedRole}
                    style={styles.rolePicker}
                    onValueChange={(itemValue) =>
                    handleValueChange(itemValue, item.id)
                    }
                >
                    <Picker.Item label="student" value="student" />
                    <Picker.Item label="super user" value="superuser" />
                    <Picker.Item label="professor" value="professor" />
                    <Picker.Item label="tutor" value="tutor" />
                </Picker>
                <TouchableOpacity
                    onPress={() => handlePress(item.id)}
                    style={styles.saveButton}
                >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                    Save
                    </Text>
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
}

const generateUsersInfoRole = (userInfo, userRole) => {

    const roleMap = userRole.reduce((acc, curr) => {
        const role = curr.is_professor
            ? "professor"
            : curr.is_tutor     
              ? "tutor"
            :curr.is_superuser
              ? "superuser"
              : "student"
        acc[curr.user] = role;
        return acc;
    }, {});

    // Générer le tableau final en parcourant `userInfo`
    return userInfo.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        // Attribuer le rôle depuis `roleMap` ou 'student' par défaut si non trouvé
        role: roleMap[user.id] || "student",
    }));
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    padding: 20,
    maxWidth: 400,
    alignSelf: "center",
  },

  listItem: {
    flexDirection: "row", // align children in a row
    justifyContent: "space-between", // space between name and button
    alignItems: "center", // center items vertically
    paddingVertical: 10, // space above and below each item
    backgroundColor: "#FFFFFF", // assuming a white background
    borderRadius: 5, // rounded corners for each item
    marginBottom: 5, // space between each list item
    // other properties like shadow can be added here if needed
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDot: {
    height: 10,
    width: 10,
    backgroundColor: "#000",
    borderRadius: 5,
    marginRight: 10,
  },
  userName: {
    // Add any specific styles for user name text if necessary
  },
  rolePicker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginTop: 10, // or other depending on layout
  },
  saveButton: {
    backgroundColor: "#387ce6",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  errorIcon: {
    color: "#ff0000",
    marginLeft: 5,
  },
  successIcon: {
    color: "#00ff00",
    marginLeft: 5,
  },
});
