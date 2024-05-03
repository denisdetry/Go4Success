import { React, useState } from "react";
import { View, Text, StyleSheet, Button, Modal, TextInput } from "react-native";

const QuestionBox = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [openQuestions, setOpenQuestions] = useState([]);

    const handleOpenQuestion = () => {
        setOpenQuestions((prevQuestions) => [...prevQuestions, {}]);
        setModalVisible(false);
    };
    return (
        <View style={styles.container}>
            {openQuestions.map((_, index) => (
                <OpenQuestionBox id={index} />
            ))}
            <View style={styles.addButtonContainer}>
                <Button title="+" onPress={() => setModalVisible(true)} />
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
                            // Logique pour question fermée
                            console.log("Question fermée sélectionnée");
                            setModalVisible(false);
                        }}
                    />
                    <Button title="Annuler" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const OpenQuestionBox = () => {
    const [question, setQuestion] = useState("");

    return (
        <View style={styles.openQuestionContainer}>
            <Text style={styles.questionText}>Create Open Question:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setQuestion}
                value={question}
                placeholder="Type your question here"
            />
        </View>
    );
};

const Question = () => {
    return (
        <>
            <View style={styles.container}>
                <QuestionBox />{" "}
            </View>
            <View>
                <OpenQuestionBox />
            </View>
        </>
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
});

export default Question;
