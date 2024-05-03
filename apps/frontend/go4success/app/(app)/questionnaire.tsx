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
import { start } from "repl";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import Colors from "@/constants/Colors";
export default function App() {
    const { sites, error } = postQuestionnaire();
    const [startdate, setStartDate] = useState(dayjs());
    const [enddate, setEndDate] = useState(dayjs());
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDateDay: "",
        startDateMonth: "",
        startDateYear: "",
        endDateDay: "",
        endDateMonth: "",
        endDateYear: "",
        language: "",
    });

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

    return (
        <View>
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
                    mode="single"
                    locale="fr"
                    date={startdate}
                    onChange={(params) =>
                        setStartDate(params.date ? dayjs(params.date) : dayjs())
                    }
                    selectedItemColor={Colors.primaryColor}
                    headerContainerStyle={{
                        backgroundColor: "white",
                    }}
                    headerTextStyle={{ color: Colors.thirdColor }}
                />
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>end:</Text>
                <DateTimePicker
                    mode="single"
                    locale="fr"
                    date={enddate}
                    onChange={(params) =>
                        setEndDate(params.date ? dayjs(params.date) : dayjs())
                    }
                    selectedItemColor={Colors.primaryColor}
                    headerContainerStyle={{
                        backgroundColor: "white",
                    }}
                    headerTextStyle={{ color: Colors.thirdColor }}
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
        </View>
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
