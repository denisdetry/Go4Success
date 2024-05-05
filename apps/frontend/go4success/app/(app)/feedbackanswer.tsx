/**
 * @file feedbackanswer.tsx
 * @author Allemeersch Maxime <max.allemeersch@gmail.com>
 * @date 02/05/2024
 * @description This page allows a user to fill in feedback for an activity
 */

import React, { useState } from "react";
import { ScrollView, Text, TextInput, View, StyleSheet, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import stylesGlobal from "@/styles/global";
import { fetchBackend } from "@/utils/fetchBackend";
import { useAuth } from "@/context/Auth";
import SelectSearch from "@/components/SelectSearch";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";
import ButtonComponent from "@/components/ButtonComponent";
import { useActivities } from "@/hooks/useActivities";
import { useFeedback, useFeedbackAdditionalQuestions } from "@/hooks/useFeedback";
import { useNavigation } from "expo-router";

type RootStackParamList = {
    feedbackanswer: { activityId: string };
};

type FeedbackAnswerScreenProps = StackScreenProps<RootStackParamList, "feedbackanswer">;

export default function FeedbackAnswer(props: Readonly<FeedbackAnswerScreenProps>) {
    const route = useRoute<RouteProp<RootStackParamList, "feedbackanswer">>();
    const navigation = useNavigation();
    const activityId = route?.params?.activityId ?? "not id present";
    const [viewHeight, setViewHeight] = useState(10);
    const { t } = useTranslation();
    const [evaluation, setEvaluation] = useState("");
    const [positivePoint, setPositivePoint] = useState("");
    const [negativePoint, setNegativePoint] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const { user } = useAuth();

    const { data: activityInformations } = useActivities(
        "attends",
        activityId,
        "",
        "",
        "",
        "",
        null,
        null,
    );

    const satisfactionLevels = [
        { value: "5", label: t("satisfactionLevels.verySatisfied") },
        { value: "4", label: t("satisfactionLevels.satisfied") },
        { value: "3", label: t("satisfactionLevels.neutral") },
        { value: "2", label: t("satisfactionLevels.unsatisfied") },
        { value: "1", label: t("satisfactionLevels.veryUnsatisfied") },
    ];
    const [evaluationOpen, setEvaluationOpen] = React.useState(false);
    const { feedbacks } = useFeedback("", activityId, "");
    const firstFeedbackId = feedbacks.length > 0 ? feedbacks[0].id : "";
    const { feedbackAdditionalQuestions } =
        useFeedbackAdditionalQuestions(firstFeedbackId);
    const [responses, setResponses] = useState<{ [key: string]: string }>({});

    const validateResponses = () => {
        for (let question of feedbackAdditionalQuestions) {
            if (!responses[question.id]) {
                return false;
            }
        }
        return true;
    };

    const handleResponseChange = (questionId: string, newResponse: string) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [questionId]: newResponse,
        }));
    };

    const handleSendFeedback = async () => {
        if (!evaluation) {
            Toast.show({
                type: "error",
                text1: t("translateToast.ErrorText1"),
                text2: t("translateToast.SelectSatisfaction"),
            });
            return;
        }
        if (!validateResponses()) {
            Toast.show({
                type: "error",
                text1: t("translateToast.ErrorText1"),
                text2: t("translateToast.AnswerAllQuestions"),
            });
            return;
        }
        let feedbackDataDefault: any = {
            student_id: user.id,
            feedback: firstFeedbackId,
            evaluation: evaluation,
            date_submitted: new Date().toISOString(),
        };

        if (feedbacks[0].positive_point) {
            feedbackDataDefault.positive_point = positivePoint;
        }
        if (feedbacks[0].negative_point) {
            feedbackDataDefault.negative_point = negativePoint;
        }
        if (feedbacks[0].additional_comment) {
            feedbackDataDefault.additional_comment = additionalComment;
        }
        if (feedbacks[0].suggestion) {
            feedbackDataDefault.suggestion = suggestion;
        }

        try {
            const response = await fetchBackend({
                type: "POST",
                url: "feedback/feedbackstudent/",
                data: feedbackDataDefault,
            });

            console.log("TEST 1");

            if (firstFeedbackId !== "") {
                const customQuestions = feedbackAdditionalQuestions;

                for (const question of customQuestions) {
                    const feedbackDataSuppQuestion = {
                        student_id: user.id,
                        feedback: firstFeedbackId,
                        question_id: question.id,
                        answer: responses[question.id],
                    };

                    await fetchBackend({
                        type: "POST",
                        url: "feedback/feedbackstudentadditionnalquestions/",
                        data: feedbackDataSuppQuestion,
                    });
                }
            }

            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: response.data.message,
            });
            navigation.goBack();
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

    if (feedbacks.length === 0) {
        return (
            <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
                <View style={stylesGlobal.container}>
                    <Text
                        style={[
                            stylesGlobal.title,
                            { fontSize: 30, textAlign: "center" },
                        ]}
                    >
                        {t("translateFeedback.nofeedback")}
                    </Text>
                </View>
            </ScrollView>
        );
    }

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
                    {t("translateFeedback.for")}
                    {activityInformations
                        .map((item) =>
                            "activity" in item
                                ? (item.activity as any).name
                                : item.name,
                        )
                        .join(", ")}
                </Text>
                {/* Evaluation */}
                <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackFields}>
                        <Text style={stylesGlobal.label}>
                            {t("translateFeedback.evaluation")} :
                            <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <View style={[stylesGlobal.inputLargeFieldWithoutBorder]}>
                            <SelectSearch
                                zIndex={100}
                                items={satisfactionLevels}
                                placeholder={"Select a satisfaction level"}
                                searchable={false}
                                onSelectItem={(item) => {
                                    setEvaluation(item.value ?? "");
                                }}
                                value={evaluation ?? null}
                                open={evaluationOpen}
                                setOpen={(isOpen) => {
                                    setEvaluationOpen(isOpen);
                                    setViewHeight(isOpen ? 180 : 10);
                                }}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ height: viewHeight }} />

                {/* Positive Point */}
                {feedbacks.length > 0 && feedbacks[0].positive_point && (
                    <View style={styles.feedbackContainer}>
                        <View style={styles.feedbackFields}>
                            <Text style={stylesGlobal.label}>
                                {t("translateFeedback.positivePoint")} :
                            </Text>

                            <View style={[stylesGlobal.inputLargeField]}>
                                <TextInput
                                    style={stylesGlobal.input}
                                    value={positivePoint}
                                    onChangeText={setPositivePoint}
                                    placeholder={t("translateFeedback.positivePoint")}
                                    multiline={true}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Negative Point */}
                {feedbacks.length > 0 && feedbacks[0].negative_point && (
                    <View style={styles.feedbackContainer}>
                        <View style={styles.feedbackFields}>
                            <Text style={stylesGlobal.label}>
                                {t("translateFeedback.negativePoint")} :
                            </Text>

                            <View style={[stylesGlobal.inputLargeField]}>
                                <TextInput
                                    style={stylesGlobal.input}
                                    value={negativePoint}
                                    onChangeText={setNegativePoint}
                                    placeholder={t("translateFeedback.negativePoint")}
                                    multiline={true}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Suggestion */}
                {feedbacks.length > 0 && feedbacks[0].suggestion && (
                    <View style={styles.feedbackContainer}>
                        <View style={styles.feedbackFields}>
                            <Text style={stylesGlobal.label}>
                                {t("translateFeedback.suggestion")} :
                            </Text>

                            <View style={[stylesGlobal.inputLargeField]}>
                                <TextInput
                                    style={stylesGlobal.input}
                                    value={suggestion}
                                    onChangeText={setSuggestion}
                                    placeholder={t("translateFeedback.suggestion")}
                                    multiline={true}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Additional comment */}
                {feedbacks.length > 0 && feedbacks[0].additional_comment && (
                    <View style={styles.feedbackContainer}>
                        <View style={styles.feedbackFields}>
                            <Text style={stylesGlobal.label}>
                                {t("translateFeedback.additionalComment")} :
                            </Text>

                            <View style={[stylesGlobal.inputLargeField]}>
                                <TextInput
                                    style={stylesGlobal.input}
                                    value={additionalComment}
                                    onChangeText={setAdditionalComment}
                                    placeholder={t(
                                        "translateFeedback.additionalComment",
                                    )}
                                    multiline={true}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Additional questions */}
                {Boolean(firstFeedbackId) &&
                    feedbackAdditionalQuestions.map((question, index) => (
                        <View style={styles.feedbackContainer} key={question.id}>
                            <View style={styles.feedbackFields}>
                                <Text style={stylesGlobal.label}>
                                    Question {index + 1}: {question.question} :
                                    <Text style={{ color: "red" }}>*</Text>
                                </Text>

                                <View style={[stylesGlobal.inputLargeField]}>
                                    <TextInput
                                        style={stylesGlobal.input}
                                        placeholder={
                                            t("translateFeedback.answerTo") +
                                            `${index + 1}`
                                        }
                                        multiline={true}
                                        onChangeText={(text) =>
                                            handleResponseChange(question.id, text)
                                        }
                                        value={responses[question.id] || ""}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}

                {/* Send feedback button */}
                <View style={styles.feedbackContainer}>
                    <ButtonComponent
                        buttonType={"primary"}
                        text={t("translateFeedback.send")}
                        onPress={handleSendFeedback}
                    />
                </View>
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
        paddingTop: 40,
        gap: 40,
        flexWrap: "wrap",
    },
    feedbackFields: {
        alignSelf: Platform.OS === "web" ? "auto" : "center",
        gap: 10,
    },
});
