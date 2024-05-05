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

interface ClosedQuestion {
    questionnaire: string;
    type: string;
    points: number;
    question: string;
    options: string[];
}

interface OpenQuestion {
    questionnaire: string;
    type: string;
    points: number;
    question: string;
}

const QuestionBox = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [openQuestions, setOpenQuestions] = useState([]);
    const [closedQuestions, setClosedQuestions] = useState([]);

    const handleOpenQuestion = () => {
        setOpenQuestions((prevQuestions) => [...prevQuestions, {}]);
        setModalVisible(false);
    };

    const handleAddClosedQuestion = () => {
        setClosedQuestions((prevQuestions) => [...prevQuestions, {}]);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {openQuestions.map((_, index) => (
                    <OpenQuestionBox
                        key={index}
                        id={index}
                        setOpenQuestions={setOpenQuestions}
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
                    onPress={() => {
                        // Logique pour sauvegarder le questionnaire
                    }}
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

const OpenQuestionBox = ({ id, setOpenQuestions }) => {
    const [question, setQuestion] = useState("");
    const [points, setPoints] = useState(0);

    const handleSaveQuestion = () => {
        const newQuestion: OpenQuestion = {
            questionnaire: "Some Questionnaire",
            type: "open",
            points: 10,
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

const ClosedQuestionBox = ({ id, setClosedQuestions }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([""]);
    const [isChecked, setIsChecked] = useState(false);
    const [checked, setChecked] = useState([{ text: "", isChecked: false }]);
    const [points, setPoints] = useState(0);

    const handleCheck = (index) => {
        setChecked((prevChecked) =>
            prevChecked.map((check, checkIndex) =>
                checkIndex === index
                    ? { ...check, isChecked: !check.isChecked }
                    : check,
            ),
        );
    };
    const handleAddOption = () => {
        setOptions((prevOptions) => [...prevOptions, ""]);
        setChecked((prevChecked) => [...prevChecked, { text: "", isChecked: false }]);
    };

    const handleOptionChange = (text, index) => {
        const newOptions = [...options];
        newOptions[index] = text;
        setOptions(newOptions);
    };
    const handleSaveQuestion = () => {
        const newQuestion: ClosedQuestion = {
            questionnaire: "Some Questionnaire",
            type: "closed",
            points: 10,
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
            <Text style={styles.optionText}>question : </Text>

            <TextInput style={styles.optionInput} />

            {options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                    <Text style={styles.optionText}>Option #{index + 1}</Text>
                    <TextInput
                        style={styles.optionInput}
                        onChangeText={(text) => handleOptionChange(text, index)}
                        value={option}
                    />
                    <CheckBox
                        value={checked[index].isChecked}
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

    const handleAddQuestion = () => {
        setQuestionCount(questionCount + 1);
        setClosedQuestionVisible(true);
    };

    return (
        <View style={styles.container}>
            <QuestionBox />
            {closedQuestionVisible && <ClosedQuestionBox id={questionCount} />}
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
