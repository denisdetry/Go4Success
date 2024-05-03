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
                <Picker
                    style={styles.picker}
                    selectedValue={formData.language}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange("startDay", itemValue)
                    }
                >
                    <Picker.Item label="Select the day" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="11" value="11" />
                    <Picker.Item label="12" value="12" />
                    <Picker.Item label="13" value="13" />
                    <Picker.Item label="14" value="14" />
                    <Picker.Item label="15" value="15" />
                    <Picker.Item label="16" value="16" />
                    <Picker.Item label="17" value="17" />
                    <Picker.Item label="18" value="18" />
                    <Picker.Item label="19" value="19" />
                    <Picker.Item label="20" value="20" />
                    <Picker.Item label="21" value="21" />
                    <Picker.Item label="22" value="22" />
                    <Picker.Item label="23" value="23" />
                    <Picker.Item label="24" value="24" />
                    <Picker.Item label="25" value="25" />
                    <Picker.Item label="26" value="26" />
                    <Picker.Item label="27" value="27" />
                    <Picker.Item label="28" value="28" />
                    <Picker.Item label="29" value="29" />
                    <Picker.Item label="30" value="30" />
                    <Picker.Item label="31" value="31" />
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={formData.language}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange("StartMonth", itemValue)
                    }
                >
                    <Picker.Item label="Select the month" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="11" value="11" />
                    <Picker.Item label="12" value="12" />
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={formData.language}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange("StartYear", itemValue)
                    }
                >
                    <Picker.Item label="Select the year" value="" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                    <Picker.Item label="2026" value="2026" />
                    <Picker.Item label="2027" value="2027" />
                    <Picker.Item label="2028" value="2028" />
                    <Picker.Item label="2029" value="2029" />
                    <Picker.Item label="2030" value="2030" />
                </Picker>
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>End:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={formData.language}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange("EndDay", itemValue)
                    }
                >
                    <Picker.Item label="Select the day" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="11" value="11" />
                    <Picker.Item label="12" value="12" />
                    <Picker.Item label="13" value="13" />
                    <Picker.Item label="14" value="14" />
                    <Picker.Item label="15" value="15" />
                    <Picker.Item label="16" value="16" />
                    <Picker.Item label="17" value="17" />
                    <Picker.Item label="18" value="18" />
                    <Picker.Item label="19" value="19" />
                    <Picker.Item label="20" value="20" />
                    <Picker.Item label="21" value="21" />
                    <Picker.Item label="22" value="22" />
                    <Picker.Item label="23" value="23" />
                    <Picker.Item label="24" value="24" />
                    <Picker.Item label="25" value="25" />
                    <Picker.Item label="26" value="26" />
                    <Picker.Item label="27" value="27" />
                    <Picker.Item label="28" value="28" />
                    <Picker.Item label="29" value="29" />
                    <Picker.Item label="30" value="30" />
                    <Picker.Item label="31" value="31" />
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={formData.language}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange("EndMonth", itemValue)
                    }
                >
                    <Picker.Item label="Select the month" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="10" value="10" />
                    <Picker.Item label="11" value="11" />
                    <Picker.Item label="12" value="12" />
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={formData.language}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange("EndYear", itemValue)
                    }
                >
                    <Picker.Item label="Select the year" value="" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                    <Picker.Item label="2026" value="2026" />
                    <Picker.Item label="2027" value="2027" />
                    <Picker.Item label="2028" value="2028" />
                    <Picker.Item label="2029" value="2029" />
                    <Picker.Item label="2030" value="2030" />
                </Picker>
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
        width: 200,
    },
    label: {
        marginRight: 10,
        fontSize: 16,
    },
});
