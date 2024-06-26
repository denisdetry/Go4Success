import React, { useEffect, useState } from "react";
import { useCourses, usePostQuestionnaire } from "@/hooks/useQuestionnaire";
import {
    useRoute,
    RouteProp,
    useNavigation,
    NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";

import Question from "./question";
import ButtonComponent from "@/components/ButtonComponent";
import stylesGlobal from "@/styles/global";
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

type QuestionnaireComponentProps = {
    onNext: () => void;
};

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({
    onNext,
    ...props
}) => {
    const { mutate, error } = usePostQuestionnaire();
    const route = useRoute<QuestionnaireRouteProp>();
    const [startdate, setStartDate] = useState(dayjs());
    const [enddate, setEndDate] = useState(dayjs());
    const { courseCode, courseName } = route.params;
    const navigation = useNavigation();
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
        mutate(formData);
        Toast.show({
            type: "success",
            text1: "Success",
            text2: "Questionnaire created successfully!",
        });
        onNext();
    };
    if (error)
        return <Text style={styles.errorText}>Error: {error.message}</Text>;

    return (
        <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
            <View style={stylesGlobal.container}>
                <Text style={stylesGlobal.title}>
                    Create Questionnaire for {courseName}
                </Text>
                <View style={[stylesGlobal.inputField]}>
                    <TextInput
                        style={stylesGlobal.input}
                        onChangeText={(text) => handleChange("title", text)}
                        value={formData.title}
                        placeholder="Title of the questionnaire"
                    />
                </View>
                <View style={[stylesGlobal.inputField]}>
                    <TextInput
                        style={stylesGlobal.input}
                        onChangeText={(text) =>
                            handleChange("description", text)
                        }
                        value={formData.description}
                        placeholder="Description"
                        multiline
                    />
                </View>
                <View style={[stylesGlobal.inputField]}>
                    <TextInput
                        style={stylesGlobal.input}
                        onChangeText={(text) =>
                            handleChange("points_total", text)
                        }
                        value={formData.points_total}
                        placeholder="Total points"
                        multiline
                    />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Start:</Text>
                        <DateTimePicker
                            mode="single"
                            locale="fr"
                            date={startdate}
                            onChange={(params) =>
                                setStartDate(
                                    params.date ? dayjs(params.date) : dayjs(),
                                )
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
                                setEndDate(
                                    params.date ? dayjs(params.date) : dayjs(),
                                )
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
                <ButtonComponent
                    text={"Next"}
                    onPress={handleSubmit}
                    buttonType={"secondary"}
                />
            </View>
        </ScrollView>
    );
};
const Stack = createStackNavigator();

export default function App() {
    const [showQuestion, setShowQuestion] = useState(false);

    return (
        <>
            {!showQuestion && (
                <QuestionnaireComponent onNext={() => setShowQuestion(true)} />
            )}
            {showQuestion && <Question />}
        </>
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
