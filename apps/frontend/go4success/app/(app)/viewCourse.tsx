import React, { useEffect, useState } from "react";
import { useCourses } from "@/hooks/useQuestionnaire";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
    },
    listItem: {
        flexDirection: "row", // Changement ici pour afficher les éléments en ligne
        justifyContent: "space-between", // Espacer les éléments
        alignItems: "center", // Aligner les éléments verticalement
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

const CoursesComponent = ({ createQuestionnaire }) => {
    const { isPending, sites, error } = useCourses();

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
                        onPress={() => createQuestionnaire(item.id)}
                    >
                        <Text style={styles.buttonText}>Créer questionnaire</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const ViewCourse = () => {
    const createQuestionnaire = (courseId) => {
        // Logique pour créer un questionnaire pour un cours spécifique
        console.log("Créer questionnaire pour le cours:", courseId);
    };

    return (
        <View style={styles.container}>
            <CoursesComponent createQuestionnaire={createQuestionnaire} />
        </View>
    );
};

export default ViewCourse;
