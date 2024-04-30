import React, { useEffect, useState } from "react";
import { useCourses, postQuestionnaire } from "@/hooks/useQuestionnaire";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Picker,
    Button,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
    const { isPending, sites, error } = useCourses();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        language: "",
    });

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.startDate;
        handleChange("startDate", currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.endDate;
        handleChange("endDate", currentDate);
    };

    if (isPending) return <ActivityIndicator size="large" style={styles.container} />;
    if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                {sites.length > 0 ? sites[0].name : "Loading Courses..."}
            </Text>
            <Text style={styles.title}>Create Questionnaire</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange("title", text)}
                value={formData.title}
                placeholder="Title of the questionnaire"
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange("description", text)}
                value={formData.description}
                placeholder="Description"
                multiline
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Start:</Text>
                <DateTimePicker
                    value={formData.startDate}
                    mode="date"
                    onChange={handleStartDateChange}
                />
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>End:</Text>
                <DateTimePicker
                    value={formData.endDate}
                    mode="date"
                    onChange={handleEndDateChange}
                />
            </View>
            <Picker
                style={styles.picker}
                selectedValue={formData.language}
                onValueChange={(itemValue, itemIndex) =>
                    handleChange("language", itemValue)
                }
            >
                <Picker.Item label="Select Language" value="" />
                <Picker.Item label="English" value="English" />
                <Picker.Item label="French" value="French" />
            </Picker>
            <Button
                title="Next"
                onPress={() => console.log("Submit", formData)}
                color="#0066cc"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#0066cc",
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        padding: 10,
        textAlign: "center",
        borderRadius: 5,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
    },
});
