import React, { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    View,
    StyleSheet,
    Platform,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useNavigation } from "expo-router";

import { useAuth } from "@/context/Auth";
import { fetchBackend } from "@/utils/fetchBackend";
import { convertDateToISO } from "@/utils/dateUtils";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";
import ButtonComponent from "@/components/ButtonComponent";
import InputAutocomplete from "@/components/selectors/InputAutocomplete";

import stylesGlobal from "@/styles/global";
import Colors from "@/constants/Colors";
import { useActivitiesSelect } from "@/hooks/useActivities";
import { useFeedback } from "@/hooks/useFeedback";
import { useGives } from "@/hooks/useGives";
import { SelectItem } from "@/types/SelectItem";

export default function FeedbackCreate() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { user } = useAuth();
    const [isCheckedPositivePoint, setIsCheckedPositivePoint] = useState(true);
    const [isCheckedNegativePoint, setIsCheckedNegativePoint] = useState(true);
    const [isCheckedSuggestion, setIsCheckedSuggestion] = useState(true);
    const [isCheckedAdditionalComment, setIsCheckedAdditionalComment] =
        useState(true);
    const [customQuestions, setCustomQuestions] = useState<string[]>([]);
    const [date, setDate] = useState(dayjs());
    const [selectedActivity, setSelectedActivity] = useState<string>("");
    const { feedbacks: allFeedbacks, error: feedbackError } = useFeedback(
        "",
        "",
        "",
    );
    const [filteredActivities, setFilteredActivities] = useState<SelectItem[]>(
        [],
    );
    const { gives: allGives, error: givesError } = useGives("", user?.id);
    const { data: allActivitiesData, error: activityError } =
        useActivitiesSelect("activity", "", "", "", "", "", null, null, false);

    const activityCallback = useCallback(
        (activityKey: string) => {
            setSelectedActivity(activityKey);
        },
        [setSelectedActivity],
    );

    useEffect(() => {
        if (allFeedbacks && allActivitiesData) {
            const feedbackActivityIds = allFeedbacks.map(
                (feedback) => feedback.activity.id,
            );

            const givesActivityIds = user?.is_superuser
                ? allActivitiesData.map((activity) => activity.key)
                : allGives
                      .filter((give) => give.teacher === user?.id)
                      .map((give) => give.activity);

            const newFilteredActivities = allActivitiesData.filter(
                (activity) =>
                    !feedbackActivityIds.includes(activity.key) && // @ts-ignore
                    givesActivityIds.includes(activity.key),
            );
            setFilteredActivities(newFilteredActivities);
        } else {
            setSelectedActivity("");
        }
    }, [allFeedbacks, allActivitiesData, allGives, user?.is_superuser]);

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
            activity_id: selectedActivity,
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

            if (customQuestions.length > 0) {
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

    if (activityError) {
        return (
            <View>
                <Text> Error: {activityError.message} </Text>
            </View>
        );
    }

    if (feedbackError) {
        return (
            <View>
                <Text> Error: {feedbackError.message} </Text>
            </View>
        );
    }

    if (givesError) {
        return (
            <View>
                <Text> Error: {givesError.message} </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
            <View style={stylesGlobal.container}>
                <Text
                    style={[
                        stylesGlobal.title,
                        { fontSize: 30, textAlign: "center" },
                    ]}
                >
                    {t("translateFeedback.create")}
                </Text>

                {/* Activites select */}
                <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackFields}>
                        <Text style={stylesGlobal.label}>
                            {t("translateFeedback.activity")} :
                            <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <View
                            style={[stylesGlobal.inputLargeFieldWithoutBorder]}
                        >
                            <InputAutocomplete
                                items={filteredActivities}
                                placeholder={"Activites"}
                                toReturn={"key"}
                                onChange={activityCallback}
                            />
                        </View>
                    </View>
                </View>
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
                            <View style={[stylesGlobal.inputField]}>
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
