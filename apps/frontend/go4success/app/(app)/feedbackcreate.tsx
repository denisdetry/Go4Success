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
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useAuth } from "@/context/Auth";
import { fetchBackend } from "@/utils/fetchBackend";
import { useNavigation } from "expo-router";

export default function FeedbackCreate() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { user } = useAuth();
    const [selection, setSelection] = useState<string | null>(null);
    const [isCheckedPositivePoint, setIsCheckedPositivePoint] = useState(true);
    const [isCheckedNegativePoint, setIsCheckedNegativePoint] = useState(true);
    const [isCheckedSuggestion, setIsCheckedSuggestion] = useState(true);
    const [isCheckedAdditionalComment, setIsCheckedAdditionalComment] = useState(true);
    const [customQuestions, setCustomQuestions] = useState([""]);
    const [viewHeight, setViewHeight] = useState(10);
    const [date, setDate] = useState(dayjs());

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

    const convertDateToISO = (date: DateType): string | null => {
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        } else if (typeof date === "string" && date !== "") {
            return date;
        } else if (typeof date === "number") {
            return new Date(date).toISOString().split("T")[0];
        } else if (date instanceof dayjs) {
            return date.format("YYYY-MM-DD");
        } else {
            return null;
        }
    };

    const handleSendFeedback = async () => {
        if (!selectedActivity) {
            Toast.show({
                type: "error",
                text1: t("translateToast.ErrorText1"),
                text2: t("translateToast.SelectActivity"),
            });
            return;
        }

        const feedbackDataDefault = {
            user_id: user.id,
            activity_id: selectedActivity.value,
            positive_point: isCheckedPositivePoint,
            negative_point: isCheckedNegativePoint,
            suggestion: isCheckedSuggestion,
            additional_comment: isCheckedAdditionalComment,
            date_end: convertDateToISO(date),
        };

        try {
            const responseDefault = await fetchBackend({
                type: "POST",
                url: "feedback/newfeedback/",
                data: feedbackDataDefault,
            });
            const feedbackId = responseDefault.data.id;

            for (const question of customQuestions) {
                const feedbackDataSuppQuestion = {
                    feedback: feedbackId,
                    question: question,
                };

                await fetchBackend({
                    type: "POST",
                    url: "feedback/feedbackadditionnalquestions/",
                    data: feedbackDataSuppQuestion,
                });
            }

            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: responseDefault.data.message,
            });
        } catch (error) {
            if (error instanceof Error) {
                Toast.show({
                    type: "error",
                    text1: t("translateToast.ErrorText1"),
                    text2: error.message,
                });
            }
        }
    };

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
                <View style={{ alignSelf: "flex-start" }}>
                    <ButtonComponent
                        icon="arrow-back-circle-outline"
                        text="Back"
                        onPress={() => navigation.goBack()}
                        buttonType={"primary"}
                    />
                </View>
                <Text
                    style={[stylesGlobal.title, { fontSize: 30, textAlign: "center" }]}
                >
                    {t("translateFeedback.create")}
                </Text>

                <View style={stylesGlobal.buttonContainer}>
                    <ButtonComponent
                        text={t("translateFeedback.course")}
                        onPress={() => setSelection("course")}
                        buttonType={selection === "course" ? "primary" : "secondary"}
                    />

                    <ButtonComponent
                        text={t("translateFeedback.activity")}
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
                        <Text style={stylesGlobal.titleH2NoPadding}>
                            {t("translateFeedback.activity")}
                        </Text>

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
                            {t("translateFeedback.defaultSelect")}
                        </Text>

                        <View style={styles.feedbackContainer}>
                            <View style={styles.feedbackFields}>
                                <View style={{ alignItems: "flex-start" }}>
                                    {/* Positive Point */}
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor={Colors.primaryColor}
                                        unFillColor="#FFFFFF"
                                        text={t("translateFeedback.positivePoint")}
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
                                        text={t("translateFeedback.negativePoint")}
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
                                        text={t("translateFeedback.suggestion")}
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
                                        text={t("translateFeedback.additionalComment")}
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

                        <Text style={styles.lineStyle}> ────────────────────────</Text>

                        <Text style={stylesGlobal.titleH2NoPadding}>
                            {t("translateFeedback.dateEnd")}
                        </Text>

                        {/* Date de fin */}
                        <View style={stylesGlobal.containerDatePicker}>
                            <DateTimePicker
                                mode="single"
                                locale="fr"
                                date={date}
                                onChange={(params) =>
                                    setDate(params.date ? dayjs(params.date) : dayjs())
                                }
                                selectedItemColor={Colors.primaryColor}
                                headerContainerStyle={{
                                    backgroundColor: "white",
                                }}
                                headerTextStyle={{ color: Colors.thirdColor }}
                            />
                        </View>
                        {/* More question */}
                        <Text style={styles.lineStyle}> ────────────────────────</Text>
                        <Text style={stylesGlobal.titleH2NoPadding}>
                            {t("translateFeedback.moreQuestions")}
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
                                            placeholder={t(
                                                "translateFeedback.enterQuestion",
                                            )}
                                            multiline={true}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                        <ButtonComponent
                            text={t("translateFeedback.addQuestion")}
                            onPress={addQuestion}
                            buttonType={"primary"}
                        />
                        <View style={{ height: 10 }} />
                        <ButtonComponent
                            text={t("translateFeedback.send")}
                            onPress={handleSendFeedback}
                            buttonType={"secondary"}
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
