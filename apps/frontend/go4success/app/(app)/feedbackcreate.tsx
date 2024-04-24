import React, { useState } from "react";
import { ScrollView, Text, TextInput, View, StyleSheet, Platform } from "react-native";
import stylesGlobal from "@/styles/global";
import { fetchBackend } from "@/utils/fetchBackend";
import { useAuth } from "@/context/Auth";
import SelectSearch from "@/components/SelectSearch";
import { useTranslation } from "react-i18next";
import { isMobile, isTablet, isTabletMini } from "@/constants/screensWidth";
import ButtonComponent from "@/components/ButtonComponent";
import Toast from "react-native-toast-message";
import { StackScreenProps } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useActivities } from "@/hooks/useActivities";

type RootStackParamList = {
    feedbackcreate: { activityId: string };
};

type FeedbackCreateScreenProps = StackScreenProps<RootStackParamList, "feedbackcreate">;

export default function FeedbackCreate({}: Readonly<FeedbackCreateScreenProps>) {
    const route = useRoute<RouteProp<RootStackParamList, "feedbackcreate">>();
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

    const handleSendFeedback = async () => {
        if (!evaluation) {
            Toast.show({
                type: "error",
                text1: t("translateToast.ErrorText1"),
                text2: t("translateToast.SelectSatisfaction"),
            });
            return;
        }
        const feedbackData = {
            student_id: user.id,
            activity_id: activityId,
            evaluation: evaluation,
            positive_point: positivePoint,
            negative_point: negativePoint,
            suggestion: suggestion,
            additional_comment: additionalComment,
            date_submitted: new Date().toISOString(),
        };

        try {
            const response = await fetchBackend({
                type: "POST",
                url: "feedback/newfeedback/",
                data: feedbackData,
            });
            Toast.show({
                type: "success",
                text1: t("translateToast.SuccessText1"),
                text2: response.data.message,
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

    return (
        <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
            <View style={stylesGlobal.container}>
                <Text
                    style={[stylesGlobal.title, { fontSize: 30, textAlign: "center" }]}
                >
                    {t("translateFeedback.for")}{" "}
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
                            {t("translateFeedback.evaluation")} :{" "}
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
                                    setViewHeight(isOpen ? 160 : 10);
                                }}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ height: viewHeight }} />

                {/* Positive Point */}
                <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackFields}>
                        <Text style={stylesGlobal.label}>
                            {t("translateFeedback.positivePoint")} :{" "}
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

                {/* Negative Pöint */}
                <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackFields}>
                        <Text style={stylesGlobal.label}>
                            {t("translateFeedback.negativePoint")} :{" "}
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

                {/* Suggestion */}
                <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackFields}>
                        <Text style={stylesGlobal.label}>
                            {t("translateFeedback.suggestion")} :{" "}
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

                {/* Additional comment */}
                <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackFields}>
                        <Text style={stylesGlobal.label}>
                            {t("translateFeedback.additionalComment")} :{" "}
                        </Text>

                        <View style={[stylesGlobal.inputLargeField]}>
                            <TextInput
                                style={stylesGlobal.input}
                                value={additionalComment}
                                onChangeText={setAdditionalComment}
                                placeholder={t("translateFeedback.additionalComment")}
                                multiline={true}
                            />
                        </View>
                    </View>
                </View>

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
