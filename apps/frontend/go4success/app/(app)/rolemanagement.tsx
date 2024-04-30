import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { useUserInfo, useUserRole, usePostSite } from "@/hooks/useRoleManagement";
import { useMutation } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RoleManagement() {
    const [selectedValue, setSelectedValue] = useState("");
    const backendURL = process.env.EXPO_PUBLIC_API_URL;

    const { mutatePostSite, isError, error, data } = usePostSite();

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

    function editRolePatch(id: any, isTutor: any, isProfessor: any) {}

    function editRoleDelete(id: any) {}

    function rolemanagementPatch(id: any, isSuperUser: any) {}

    const usersInfoRole = generateUsersInfoRole(userInfo, userRole);

    const MyListComponent = () => {
        const handlePress = (userId: any) => {
            const user = users.find((u: any) => u.id === userId);
            if (!user) {
                console.error("Utilisateur non trouvé");
                return;
            }

            if (user.selectedRole === "student") {
                rolemanagementPatch(userId, false);
                editRoleDelete(user.id);
            } else if (user.selectedRole === "professor") {
                if (!userRole.some((element) => element.user === userId)) {
                    editRolePost(userId, false, true);
                    rolemanagementPatch(userId, false);
                } else {
                    rolemanagementPatch(userId, false);
                    editRolePatch(user.id, false, true);
                }
            } else if (user.selectedRole === "tutor") {
                if (!userRole.some((element) => element.user === userId)) {
                    editRolePost(userId, false, true);
                    rolemanagementPatch(userId, false);
                } else {
                    rolemanagementPatch(userId, false);
                    editRolePatch(user.id, true, false);
                }
            } else {
                rolemanagementPatch(user.id, true);
            }
        };

        // Ajout d'un état pour suivre la valeur sélectionnée de chaque liste déroulante
        // Initialiser chaque élément avec son rôle actuel
        const [users, setUsers] = useState(
            usersInfoRole.map((user: User) => ({ ...user, selectedRole: user.role })),
        );

        const handleValueChange = (itemValue: any, itemId: any) => {
            // Mettre à jour l'état avec la nouvelle valeur sélectionnée pour l'utilisateur spécifié
            const updatedUsers = users.map((user: User) => {
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
                    <View style={styles.listItem}>
                        <View style={styles.userInfo}>
                            <Text>
                                ID : {item.id} Prénom : {item.first_name} Nom :{" "}
                                {item.last_name}
                            </Text>
                        </View>
                        <Picker
                            selectedValue={item.selectedRole}
                            style={styles.rolePicker}
                            onValueChange={(itemValue: any) =>
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
                            id="saveChange"
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

const generateUsersInfoRole = (userInfo: any, userRole: any) => {
    const roleMap = userRole.reduce((acc: any, curr: any) => {
        const role = curr.is_professor
            ? "professor"
            : curr.is_tutor
            ? "tutor"
            : curr.is_superuser
            ? "superuser"
            : "student";
        acc[curr.user] = role;
        return acc;
    }, {});

    return userInfo.map((user: any) => ({
        id: user.id,
        // eslint-disable-next-line camelcase
        first_name: user.first_name,
        // eslint-disable-next-line camelcase
        last_name: user.last_name,

        role: roleMap[user.id] || (user.is_superuser ? "superuser" : "student"),
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
