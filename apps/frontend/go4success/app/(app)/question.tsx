import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    Modal,
    TextInput,
    ScrollView,
    CheckBox,
} from "react-native";
import Toast from "react-native-toast-message";
import {
    useLastQuestionnaire,
    usePostOpenQuestion,
    usePostQuestion,
    useGetQuestions,
    usePostClosedQuestion,
} from "@/hooks/useQuestionnaire";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ButtonComponent from "@/components/ButtonComponent";
import stylesGlobal from "@/styles/global";
interface ClosedQuestion {
    questionnaire: number;
    type: string;
    points: number;
    question: string;
    options: [string, boolean][];
}

interface OpenQuestion {
    questionnaire: number;
    question: string;
    type: string;
    points: number;
}

interface refetchedQuestions {
    id: number;
    question: string;
}

interface closedQuestionToSend {
    question: number;
    options: string;
    checked: boolean;
}

const QuestionBox = ({ questionnaireId }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [openQuestions, setOpenQuestions] = useState([]);
    const [closedQuestions, setClosedQuestions] = useState<
        { type: string; points: number; question: string }[]
    >([]);
    const {
        data: questions,
        errors,
        isLoadings,
        refetch: refetchQuestions,
    } = useGetQuestions();
    const [closedQuestionsProcessed, setClosedQuestionsProcessed] =
        useState(false);
    const [refetchQuestionsData, setRefetchQuestionsData] = useState<
        refetchedQuestions[]
    >([]);

    const queryClient = useQueryClient();

    const { mutate, error } = usePostQuestion();
    const { mutateAsync: mutateOption, error: errorOption } =
        usePostClosedQuestion();
    const handleOpenQuestion = () => {
        setOpenQuestions((prevQuestions) => [...prevQuestions, {}]);
        setModalVisible(false);
    };

    const handleAddClosedQuestion = () => {
        setClosedQuestions((prevQuestions) => [...prevQuestions, {}]);
    };

    useEffect(() => {
        if (closedQuestionsProcessed) {
            const questionsData = questions?.map((question) => ({
                id: question.id,
                question: question.question,
            }));

            // Mettre les données refetchées dans la structure de données refetchQuestions
            const data: refetchQuestions[] =
                questionsData.data?.map((question) => ({
                    id: question.id,
                    question: question.question,
                })) || [];

            // Mettre à jour l'état avec les données refetchées
            setRefetchQuestionsData(questionsData);
            console.log("refetchedQuetion", refetchQuestionsData);
        }
    }, [closedQuestionsProcessed, questions]);

    const handleSaveOpenQuestions = async () => {
        openQuestions.forEach((question) => {
            // Ajouter questionnaireId à chaque question
            const questionWithId = { ...question, questionnaireId };

            mutate(questionWithId, {
                onSuccess: () => {
                    Toast.show({
                        type: "success",
                        text1: "Success",
                        text2: "Open question has been posted successfully",
                    });

                    refetchQuestions();
                },

                onError: (error) => {
                    Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: error.message,
                    });
                },
            });
        });
        const closedQuestionPromises = closedQuestions.map((question) => {
            const { type, points, question: questionText } = question;
            const questionWithId = {
                questionnaire: questionnaireId,
                question: questionText,
                type,
                points,
            };

            return new Promise((resolve, reject) => {
                mutate(questionWithId, {
                    onSuccess: () => {
                        resolve(null);
                    },
                    onError: (error) => {
                        Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: error.message,
                        });
                        reject(error);
                    },
                });
            });
        });

        try {
            await Promise.all(closedQuestionPromises);
            setClosedQuestionsProcessed(true);
        } catch (error) {
            console.error("Error posting closed questions:", error);
        }

        const closedQuestionsToSend: closedQuestionToSend[] =
            closedQuestions.flatMap((closedQuestion) => {
                // Trouver l'ID de la question correspondante dans refetchedQuestions
                const refetchedQuestion = refetchQuestionsData.find(
                    (refetchedQuestion) =>
                        refetchedQuestion.question == closedQuestion.question,
                );

                if (!refetchedQuestion) {
                    // Si aucune question correspondante n'est trouvée dans refetchedQuestions, retourner un tableau vide
                    return [];
                }

                console.log("refetchedQuestion", refetchedQuestion);

                // Transformer chaque option de ClosedQuestion en un objet closedQuestionToSend
                return closedQuestion.options.map(([option, checked]) => ({
                    question: refetchedQuestion.id,
                    options: option,
                    checked,
                }));
            });

        for (const closedQuestion of closedQuestionsToSend) {
            mutateOption(closedQuestion);
        }
    };
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={stylesGlobal.mainContainer}>
                {openQuestions.map((_, index) => (
                    <OpenQuestionBox
                        key={index}
                        id={index}
                        setOpenQuestions={setOpenQuestions}
                        questionnaireId={questionnaireId}
                    />
                ))}
                {closedQuestions.map((_, index) => (
                    <ClosedQuestionBox
                        key={index}
                        id={index}
                        style={styles.optionInput}
                        setClosedQuestions={setClosedQuestions}
                    />
                ))}
            </ScrollView>
            <View style={styles.addButtonContainer}>
                <ButtonComponent
                    text={"Ajouter une question"}
                    onPress={() => setModalVisible(true)}
                    buttonType={"primary"}
                />
            </View>
            <View style={styles.saveButtonContainer}>
                <ButtonComponent
                    text={"Sauvegarder le questionnaire"}
                    onPress={() => {
                        handleSaveOpenQuestions();
                    }}
                    buttonType={"primary"}
                />
                <ButtonComponent
                    text={"Envoyer le questionnaire"}
                    onPress={() => {
                        handleSaveOpenQuestions();
                        Toast.show({
                            type: "success",
                            text1: "Success",
                            text2: "Questionnaire has been sent successfully",
                        });
                    }}
                    buttonType={"secondary"}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                        Choisir le type de question :
                    </Text>
                    <ButtonComponent
                        text={"Question ouverte"}
                        onPress={handleOpenQuestion}
                        buttonType={"secondary"}
                    />
                    <ButtonComponent
                        text={"Question fermée"}
                        onPress={() => {
                            handleAddClosedQuestion();
                            setModalVisible(false);
                        }}
                        buttonType={"secondary"}
                    />
                    <ButtonComponent
                        text={"Annuler"}
                        onPress={() => setModalVisible(false)}
                        buttonType={"secondary"}
                    />
                </View>
            </Modal>
        </View>
    );
};

const OpenQuestionBox = ({ id, setOpenQuestions, questionnaireId }) => {
    const [question, setQuestion] = useState("");
    const [points, setPoints] = useState(0);

    const handleSaveQuestion = () => {
        const newQuestion: OpenQuestion = {
            questionnaire: questionnaireId,
            type: "open",
            points: points,
            question: question,
        };

        setOpenQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[id] = newQuestion; // replace the question at the correct index
            return updatedQuestions;
        });

        Toast.show({
            type: "success", // Utilisez 'success', 'error', etc., selon le thème
            text1: "Succès",
            text2: "question enregistrée",
        });
    };

    return (
        <View style={styles.openQuestionContainer}>
            <Text style={styles.questionText}>Question ouverte #{id + 1}</Text>
            <Text style={styles.optionText}>Question : </Text>
            <View style={[stylesGlobal.inputField]}>
                <TextInput
                    style={stylesGlobal.input}
                    onChangeText={setQuestion}
                    value={question}
                    placeholder="Ecrivez votre question ici..."
                />
            </View>

            <Text style={styles.optionText}>Points : </Text>
            <View style={[stylesGlobal.inputField]}>
                <TextInput
                    style={stylesGlobal.input}
                    onChangeText={(value) => setPoints(Number(value))}
                    value={String(points)}
                    placeholder="Entrez les points ici"
                    keyboardType="numeric"
                />
            </View>

            <ButtonComponent
                text={"Sauvegarder question"}
                onPress={handleSaveQuestion}
                buttonType={"secondary"}
            />
        </View>
    );
};

const ClosedQuestionBox = ({ id, setClosedQuestions, questionnaireId }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<(string | boolean)[][]>([]);
    const [isChecked, setIsChecked] = useState(false);
    const [checked, setChecked] = useState([{ text: "", isChecked: false }]);
    const [points, setPoints] = useState(0);

    const handleCheck = (index) => {
        setOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[index] = [
                newOptions[index][0],
                !newOptions[index][1],
            ] as [string, boolean];
            return newOptions;
        });
    };

    const handleAddOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            ["", false] as [string, boolean],
        ]);
    };

    const handleOptionChange = (text, index) => {
        setOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[index] = [text, newOptions[index][1]] as [
                string,
                boolean,
            ];
            return newOptions;
        });
    };
    const handleSaveQuestion = () => {
        const newQuestion: ClosedQuestion = {
            questionnaire: questionnaireId,
            type: "multiple_choice",
            points: points,
            question: question,
            options: options,
        };

        setClosedQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[id] = newQuestion; // replace the question at the correct index
            return updatedQuestions;
        });

        Toast.show({
            type: "success", // Utilisez 'success', 'error', etc., selon le thème
            text1: "Succès",
            text2: "question enregistrée",
        });
    };
    return (
        <View style={styles.closedQuestionContainer}>
            <Text style={styles.questionText}>Choix multiple #{id + 1}</Text>
            <Text style={styles.optionText}>Question : </Text>
            <View style={[stylesGlobal.inputField]}>
                <TextInput
                    style={stylesGlobal.input}
                    onChangeText={(text) => setQuestion(text)}
                    value={question}
                />
            </View>

            {options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                    <Text style={styles.optionText}>Option #{index + 1}</Text>
                    <TextInput
                        style={styles.optionInput}
                        onChangeText={(text) => handleOptionChange(text, index)}
                        value={option[0]}
                    />
                    <CheckBox
                        value={option[1]}
                        onValueChange={() => handleCheck(index)}
                    />
                </View>
            ))}
            <View style={styles.addButton}>
                <ButtonComponent
                    text={"Ajouter une option"}
                    onPress={handleAddOption}
                    buttonType={"secondary"}
                />
            </View>

            <Text style={styles.optionText}>Points : </Text>
            <View style={[stylesGlobal.inputField]}>
                <TextInput
                    style={stylesGlobal.input}
                    onChangeText={(value) => setPoints(Number(value))}
                    value={String(points)}
                    placeholder="Entrez les points ici"
                    keyboardType="numeric"
                />
            </View>
            <ButtonComponent
                text={"Sauvegarder question"}
                onPress={handleSaveQuestion}
                buttonType={"secondary"}
            />
        </View>
    );
};

const Question = () => {
    const [closedQuestionVisible, setClosedQuestionVisible] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const { data: questionnaire, error, isLoading } = useLastQuestionnaire();

    const handleAddQuestion = () => {
        setQuestionCount(questionCount + 1);
        setClosedQuestionVisible(true);
    };

    return (
        <View style={styles.container}>
            <QuestionBox questionnaireId={questionnaire?.id} />
            {closedQuestionVisible && (
                <ClosedQuestionBox
                    id={questionCount}
                    questionnaireId={questionnaire?.id}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    closedQuestionContainer: {
        backgroundColor: "#f8f8f8",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    addButtonContainer: {
        position: "absolute",
        right: 40,
        top: 10,
        padding: 10,
    },
    openQuestionContainer: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 10,
    },

    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },

    optionInput: {
        width: "30%",
        height: 40,
        borderColor: "blue",
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: "#f0f8ff",
        fontSize: 18,
    },
    optionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    optionText: {
        marginRight: 10,
        fontSize: 18,
    },
    addButton: {
        width: "100%", // adjust this value as needed
        // ... rest of your styles ...
    },

    pointsInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default Question;
