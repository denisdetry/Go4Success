import React, { useEffect, useState } from "react";
import { useCourses } from "@/hooks/useQuestionnaire";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import Questionnaire from "./questionnaire";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

type StackNavigatorParams = {
    Courses: undefined; // Ajoutez cette ligne
    Questionnaire: { courseCode: string; courseName: string };
};

const Stack = createStackNavigator<StackNavigatorParams>();

const CoursesComponent = ({ createQuestionnaire } = {}) => {
    const { isPending, sites, error } = useCourses();
    const navigation =
        useNavigation<StackNavigationProp<StackNavigatorParams, "Questionnaire">>();

    if (isPending) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Erreur : {error.message}</Text>;
    }

    return (
        <FlatList
            data={sites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <View>
                        <Text style={styles.listItemText}>{item.name}</Text>
                        <Text style={styles.listItemCode}>{item.code}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            navigation.navigate("Questionnaire", {
                                courseCode: item.code,
                                courseName: item.name,
                            })
                        }
                    >
                        <Text> Créer un questionnaire </Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const ViewCourse = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Courses" component={CoursesComponent} />
            <Stack.Screen name="Questionnaire" component={Questionnaire} />
        </Stack.Navigator>
    );
};

export default ViewCourse;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        marginBottom: 10,
        padding: 15,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    listItemText: {
        fontSize: 18,
    },
    listItemCode: {
        fontSize: 14,
        color: "#666",
    },
    button: {
        backgroundColor: "#0066cc",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
    },
});
