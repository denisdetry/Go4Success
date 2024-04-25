import React, { useState } from "react";
import SelectSearch, { SelectItem } from "@/components/SelectSearch";
import { ScrollView, Text, TextInput, View, StyleSheet, Platform } from "react-native";
import stylesGlobal from "@/styles/global";
import { useTranslation } from "react-i18next";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";
import ButtonComponent from "@/components/ButtonComponent";
import Toast from "react-native-toast-message";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Colors from "@/constants/Colors";
import { ItemType } from "react-native-dropdown-picker";
import { useActivities } from "@/hooks/useActivities";

export default function FeedbackCreate() {
    const { t } = useTranslation();
    const [selection, setSelection] = useState<string | null>(null);
    const [isCheckedPositivePoint, setIsCheckedPositivePoint] = useState(true);
    const [isCheckedNegativePoint, setIsCheckedNegativePoint] = useState(true);
    const [isCheckedSuggestion, setIsCheckedSuggestion] = useState(true);
    const [isCheckedAdditionalComment, setIsCheckedAdditionalComment] = useState(true);
    const [customQuestions, setCustomQuestions] = useState([""]);
    const [viewHeight, setViewHeight] = useState(10);

    const [activityOpen, setActivityOpen] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = useState<SelectItem>();
    const { data: allActivities, error: activityError } = useActivities(
        "activity",
        "",
        "",
        "",
        "",
        "",
        null,
        null,
    );

    const addQuestion = () => {
        setCustomQuestions([...customQuestions, ""]);
    };

    const updateQuestion = (text: string, index: number) => {
        const newQuestions = [...customQuestions];
        newQuestions[index] = text;
        setCustomQuestions(newQuestions);
    };

    return (
        <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
            <View style={stylesGlobal.container}>
                <Text
                    style={[stylesGlobal.title, { fontSize: 30, textAlign: "center" }]}
                >
                    Create Feedback
                </Text>

                <View style={stylesGlobal.buttonContainer}>
                    <ButtonComponent
                        text="Course"
                        onPress={() => setSelection("course")}
                        buttonType={selection === "course" ? "primary" : "secondary"}
                    />

                    <ButtonComponent
                        text="Activity"
                        onPress={() => setSelection("activity")}
                        buttonType={selection === "activity" ? "primary" : "secondary"}
                    />
                </View>

                {/* Course */}
                {selection === "course" && (
                    <>
                        <Text>TEST</Text>
                        <TextInput placeholder="Course feedback" />
                    </>
                )}

                {/* Activity */}
                {selection === "activity" && (
                    <>
                        {/* Activites select */}
                        <View style={styles.feedbackContainer}>
                            <View style={styles.feedbackFields}>
                                <View
                                    style={[stylesGlobal.inputLargeFieldWithoutBorder]}
                                >
                                    <SelectSearch
                                        zIndex={100}
                                        items={allActivities.map((activity) => ({
                                            label: activity.name,
                                            value: activity.id,
                                        }))}
                                        placeholder={"Activites"}
                                        searchable={true}
                                        onSelectItem={(item) => {
                                            setSelectedActivity(
                                                item as Required<ItemType<string>>,
                                            );
                                        }}
                                        open={activityOpen}
                                        setOpen={(isOpen) => {
                                            setActivityOpen(isOpen);
                                            setViewHeight(isOpen ? 150 : 10);
                                        }}
                                        value={selectedActivity?.value ?? null}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ height: viewHeight }} />
                        <Text style={styles.lineStyle}> ────────────────────────</Text>

                        <Text style={stylesGlobal.titleH2NoPadding}>
                            Default select
                        </Text>

                        <View style={styles.feedbackContainer}>
                            <View style={styles.feedbackFields}>
                                <View style={{ alignItems: "flex-start" }}>
                                    {/* Positive Point */}
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor={Colors.primaryColor}
                                        unFillColor="#FFFFFF"
                                        text={"Positive Point"}
                                        iconStyle={{ borderColor: Colors.primaryColor }}
                                        style={{ marginBottom: 10 }}
                                        innerIconStyle={{ borderWidth: 2 }}
                                        textStyle={{
                                            fontSize: 18,
                                            textDecorationLine: "none",
                                        }}
                                        isChecked={isCheckedPositivePoint}
                                        onPress={(nextState: boolean) => {
                                            setIsCheckedPositivePoint(nextState);
                                        }}
                                    />
                                    {/* Negative Point */}
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor={Colors.primaryColor}
                                        unFillColor="#FFFFFF"
                                        text={"Negative Point"}
                                        iconStyle={{ borderColor: Colors.primaryColor }}
                                        style={{ marginBottom: 10 }}
                                        innerIconStyle={{ borderWidth: 2 }}
                                        textStyle={{
                                            fontSize: 18,
                                            textDecorationLine: "none",
                                        }}
                                        isChecked={isCheckedNegativePoint}
                                        onPress={(nextState: boolean) => {
                                            setIsCheckedNegativePoint(nextState);
                                        }}
                                    />
                                    {/* Suggestion */}
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor={Colors.primaryColor}
                                        unFillColor="#FFFFFF"
                                        text={"Suggestion"}
                                        iconStyle={{ borderColor: Colors.primaryColor }}
                                        style={{ marginBottom: 10 }}
                                        innerIconStyle={{ borderWidth: 2 }}
                                        textStyle={{
                                            fontSize: 18,
                                            textDecorationLine: "none",
                                        }}
                                        isChecked={isCheckedSuggestion}
                                        onPress={(nextState: boolean) => {
                                            setIsCheckedSuggestion(nextState);
                                        }}
                                    />
                                    {/* Additional comment */}
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor={Colors.primaryColor}
                                        unFillColor="#FFFFFF"
                                        text={"Additional comment"}
                                        iconStyle={{ borderColor: Colors.primaryColor }}
                                        style={{ marginBottom: 10 }}
                                        innerIconStyle={{ borderWidth: 2 }}
                                        textStyle={{
                                            fontSize: 18,
                                            textDecorationLine: "none",
                                        }}
                                        isChecked={isCheckedAdditionalComment}
                                        onPress={(nextState: boolean) => {
                                            setIsCheckedAdditionalComment(nextState);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        {/* More question */}
                        <Text style={styles.lineStyle}> ────────────────────────</Text>
                        <Text style={stylesGlobal.titleH2NoPadding}>
                            Questions supplémentaires
                        </Text>
                        {customQuestions.map((question, index) => (
                            <View style={styles.feedbackContainer}>
                                <View style={styles.feedbackFields}>
                                    <View style={[stylesGlobal.inputLargeField]}>
                                        <TextInput
                                            key={index}
                                            style={stylesGlobal.input}
                                            value={question}
                                            onChangeText={(text) =>
                                                updateQuestion(text, index)
                                            }
                                            placeholder={"Enter your question"}
                                            multiline={true}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                        <ButtonComponent
                            text="Add more questions"
                            onPress={addQuestion}
                            buttonType={"primary"}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    feedbackContainer: {
        flexDirection:
            Platform.OS !== "web" || isMobile || isTablet || isTabletMini
                ? "column"
                : "row",
        alignItems: "flex-start",
        alignContent: "center",
        justifyContent: "space-evenly",
        width: "100%",
        paddingTop: 30,
        gap: 40,
        flexWrap: "wrap",
    },
    feedbackFields: {
        alignSelf: Platform.OS === "web" ? "auto" : "center",
        gap: 10,
    },
    lineStyle: {
        margin: 5,
        fontSize: 30,
        color: Colors.secondaryColor,
    },
});
