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
import DatePicker from "react-datepicker"; // Importer DatePicker

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
        padding: 20,
        backgroundColor: "#f0f0f0", // Light gray background for softer look
    },
    bigText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333", // Darker font for better readability
    },
    input: {
        height: 50,
        borderColor: "#ccc", // Softer border color
        borderWidth: 1,
        marginTop: 12,
        padding: 10,
        borderRadius: 5, // Rounded corners
        backgroundColor: "#fff", // White background for inputs
    },
    textarea: {
        height: 100,
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 12,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        textAlignVertical: "top",
    },
    select: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 12,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#0044cc", // Slightly darker blue for the button
        padding: 12,
        borderRadius: 5, // Rounded corners for buttons
    },
    datePickerStyle: {
        width: "100%",
        marginTop: 12,
    },
    datePickerCustomStyles: {
        dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0,
        },
        dateInput: {
            marginLeft: 36,
            borderRadius: 5,
            height: 50,
            borderColor: "#ccc",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 1.5,
            elevation: 3, // Only for Android
        },
        placeholderText: {
            color: "gray", // Light gray color for placeholder text
        },
        dateText: {
            color: "#333", // Darker text for better readability
        },
    },
});

function App() {
    const { isPending, sites, error } = useCourses();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        language: "",
    });

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (isPending) return <ActivityIndicator size="large" />;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.bigText}>
                {sites.length > 0 ? sites[0].name : "Loading Courses..."}
            </Text>
            <Text>Create Questionnaire</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange("title", text)}
                value={formData.title}
                placeholder="Title of the questionnaire"
            />
            <TextInput
                style={styles.textarea}
                onChangeText={(text) => handleChange("description", text)}
                value={formData.description}
                placeholder="Description"
                multiline
            />
            <DatePicker
                style={{ width: "100%" }}
                date={formData.startDate}
                mode="date"
                placeholder="Select start date"
                format="YYYY-MM-DD"
                minDate="2020-01-01"
                maxDate="2030-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={styles.datePickerCustomStyles}
                onDateChange={(date) => handleChange("startDate", date)}
            />
            <DatePicker
                style={{ width: "100%" }}
                date={formData.endDate}
                mode="date"
                placeholder="Select end date"
                format="YYYY-MM-DD"
                minDate="2020-01-01"
                maxDate="2030-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={styles.datePickerCustomStyles}
                onDateChange={(date) => handleChange("endDate", date)}
            />
            <Picker
                selectedValue={formData.language}
                onValueChange={(itemValue, itemIndex) =>
                    handleChange("language", itemValue)
                }
                style={styles.select}
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

export default App;
