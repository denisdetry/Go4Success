import React, { useEffect, useState } from "react";
import { useCourses, usePostQuestionnaire } from "@/hooks/useQuestionnaire";
import { useRoute, RouteProp } from "@react-navigation/native";

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

type RouteParams = {
    courseCode: number;
    courseName: string;
};
type RootStackParamList = {
    Questionnaire: RouteParams;
};
type QuestionnaireRouteProp = RouteProp<RootStackParamList, "Questionnaire">;

export default function App() {
    const { mutate, error } = usePostQuestionnaire();
    const route = useRoute<QuestionnaireRouteProp>();
    const [startdate, setStartDate] = useState(dayjs());
    const [enddate, setEndDate] = useState(dayjs());
    const { courseCode, courseName } = route.params;
    console.log(courseCode);
    const [formData, setFormData] = useState({
        course: courseCode,
        title: "",
        description: "",
        points_total: 0,
        date_start: startdate.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        date_end: enddate.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        language: 0,
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            date_start: startdate.format("YYYY-MM-DDTHH:mm:ss[Z]"),
            date_end: enddate.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        }));
    }, [startdate, enddate]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log(startdate);
        console.log(enddate);
        mutate(formData);
    };
    if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

    return (
        <ScrollView>
            <Text style={styles.title}>Create Questionnaire for {courseName}</Text>
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
            <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange("points_total", text)}
                value={formData.points_total}
                placeholder="Total points"
                multiline
            />
            <View style={{ flexDirection: "row" }}>
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
                <View style={[styles.labelContainer, { marginLeft: 80 }]}>
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
            </View>
            <Picker
                style={styles.picker}
                selectedValue={formData.language}
                onValueChange={(itemValue, itemIndex) =>
                    handleChange("language", itemValue)
                }
            >
                <Picker.Item label="Select Language" value="" />
                <Picker.Item label="English" value="1" />
                <Picker.Item label="French" value="2" />
            </Picker>
            <Button title="Next" onPress={handleSubmit} color="#0066cc" />
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
