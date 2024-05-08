import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTeachers } from "@/hooks/useTeachers";
import { useUsers } from "@/hooks/useUsers";
import { Picker } from "@react-native-picker/picker";
import { fetchBackend } from "@/utils/fetchBackend";
import { queryClient } from "@/app/_layout";
import { useAuth } from "@/context/Auth";
import { useTranslation } from "react-i18next";

const roles = [
    { key: "professor", value: {t("translationRole.Professor")} },
    { key: "tutor", value: {t("translationRole.Tutor")} },
    { key: "student", value: {t("translationRole.Student")} },
    { key: "superuser", value: {t("translationRole.Superuser")} },
];

export default function RoleManagement() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { users } = useUsers();
    const { teachers } = useTeachers();

    const isProfessor = new Set(
        teachers
            .filter((teacher) => teacher.isProfessor)
            .map((teacher) => teacher.user.id),
    );
    const isTutor = new Set(
        teachers
            .filter((teacher) => teacher.isTutor)
            .map((teacher) => teacher.user.id),
    );

    const allUsers = users
        .map((user) => ({
            ...user,
            isProfessor: isProfessor.has(user.id),
            isTutor: isTutor.has(user.id),
        }))
        .toSorted((a, b) => a.id - b.id);

    const handleRoleChange = async (userId: number, role: string) => {
        const { error } = await fetchBackend({
            type: "PATCH",
            url: "/rolemanagement/editRole/",
            data: {
                id: userId,
                role: role,
            },
        });
        if (error) {
            console.error(error);
        }
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        await queryClient.invalidateQueries({ queryKey: ["teachers"] });
    };

    return (
        <FlatList
            data={allUsers}
            renderItem={({ item }) => (
                <View style={customStyles.listItem}>
                    <View style={customStyles.userInfo}>
                        <Text>
                            ID : {item.id} {t("translationRole.surname")} :{" "}
                            {item.firstName} {t("translationRole.name")} :{" "}
                            {item.lastName}
                        </Text>
                    </View>

                    {user.id === item.id ? (
                        <View style={customStyles.userNot}>
                            <Text>
                                {t("translationRole.canNotChangeOwnRole")}
                            </Text>
                        </View>
                    ) : (
                        <Picker
                            selectedValue={
                                item.isSuperuser
                                    ? "superuser"
                                    : item.isProfessor
                                      ? "professor"
                                      : item.isTutor
                                        ? "tutor"
                                        : "student"
                            }
                            style={customStyles.rolePicker}
                            onValueChange={(itemValue: any) =>
                                handleRoleChange(item.id, itemValue)
                            }
                        >
                            {roles.map((role) => (
                                <Picker.Item
                                    key={role.key}
                                    label={role.value}
                                    value={role.key}
                                />
                            ))}
                        </Picker>
                    )}
                </View>
            )}
        />
    );
}

const customStyles = StyleSheet.create({
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
        padding: 20, // space on the left and right of each item
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
    userNot: {
        margin: 10,
    },
    rolePicker: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 5,
        margin: 5,
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
