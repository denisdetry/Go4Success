import { React, useState } from "react";
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
} from "@/hooks/useQuestionnaire";

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

const QuestionBox = ({ questionnaireId }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [openQuestions, setOpenQuestions] = useState([]);
    const [closedQuestions, setClosedQuestions] = useState<
        { questionnaire: string; type: string; points: number; question: string }[]
    >([]);
    const { mutate, error } = usePostQuestion();

    const handleOpenQuestion = () => {
        setOpenQuestions((prevQuestions) => [...prevQuestions, {}]);
        setModalVisible(false);
    };

    const handleAddClosedQuestion = () => {
        setClosedQuestions((prevQuestions) => [...prevQuestions, {}]);
    };

    const handleSaveOpenQuestions = () => {
        // Parcourir chaque question ouverte et l'envoyer au backend
        openQuestions.forEach((question) => {
            // Ajouter questionnaireId à chaque question
            const questionWithId = { ...question, questionnaireId };

            closedQuestions.forEach((question) => {
                mutate({
                    questionnaire: question.questionnaire,
                    type: question.type,
                    points: question.points,
                    question: question.question,
                });
            });

            mutate(questionWithId, {
                onSuccess: () => {
                    Toast.show({
                        type: "success",
                        text1: "Success",
                        text2: "Open question has been posted successfully",
                    });
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
    };
    return (
        <View style={styles.container}>
            <ScrollView>
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
                <Button title="+" onPress={() => setModalVisible(true)} />
            </View>
            <View style={styles.saveButtonContainer}>
                <Button
                    title="Sauvegarder le questionnaire"
                    onPress={handleSaveOpenQuestions}
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
                    <Text style={styles.modalText}>Choisir le type de question :</Text>
                    <Button title="Question ouverte" onPress={handleOpenQuestion} />
                    <Button
                        title="Question fermée"
                        onPress={() => {
                            handleAddClosedQuestion();
                            setModalVisible(false);
                        }}
                    />
                    <Button title="Annuler" onPress={() => setModalVisible(false)} />
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
            <TextInput
                style={styles.input}
                onChangeText={setQuestion}
                value={question}
                placeholder="Ecrivez votre question ici..."
            />

            <TextInput
                style={styles.pointsInput}
                onChangeText={(value) => setPoints(Number(value))}
                value={String(points)}
                placeholder="Entrez les points ici"
                keyboardType="numeric"
            />

            <Button title="Sauvegarder question" onPress={handleSaveQuestion} />
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
            newOptions[index] = [newOptions[index][0], !newOptions[index][1]] as [
                string,
                boolean,
            ];
            return newOptions;
        });
    };

    const handleAddOption = () => {
        setOptions((prevOptions) => [...prevOptions, ["", false] as [string, boolean]]);
    };

    const handleOptionChange = (text, index) => {
        setOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[index] = [text, newOptions[index][1]] as [string, boolean];
            return newOptions;
        });
    };
    const handleSaveQuestion = () => {
        const newQuestion: ClosedQuestion = {
            questionnaire: questionnaireId,
            type: "closed",
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
    console.log(options);
    return (
        <View style={styles.closedQuestionContainer}>
            <Text style={styles.questionText}>Choix multiple #{id + 1}</Text>
            <Text style={styles.optionText}>question : </Text>

            <TextInput
                style={styles.optionInput}
                onChangeText={(text) => setQuestion(text)}
                value={question}
            />

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
                <Button title="Ajouter une option" onPress={handleAddOption} />
            </View>

            <TextInput
                style={styles.pointsInput}
                onChangeText={(value) => setPoints(Number(value))}
                value={String(points)}
                placeholder="Entrez les points ici"
                keyboardType="numeric"
            />

            <Button title="Sauvegarder question" onPress={handleSaveQuestion} />
        </View>
    );
};

const Question = () => {
    const [closedQuestionVisible, setClosedQuestionVisible] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const { data: questionnaire, error, isLoading } = useLastQuestionnaire();
    console.log(questionnaire);
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
        width: "40%", // adjust this value as needed
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
