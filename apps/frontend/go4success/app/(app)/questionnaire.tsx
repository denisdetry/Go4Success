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
import DatePicker from "react-native-datepicker"; // Importer DatePicker

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
        padding: 20,
    },
    bigText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
    textarea: {
        height: 90,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        textAlignVertical: "top",
    },
    select: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#0066cc",
        padding: 10,
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
                customStyles={{
                    dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                    },
                    dateInput: {
                        marginLeft: 36,
                    },
                }}
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
                customStyles={{
                    dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                    },
                    dateInput: {
                        marginLeft: 36,
                    },
                }}
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
