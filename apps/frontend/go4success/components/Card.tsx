import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface CardProps {
    id: string;
    title: string;
    location: string;
    date: string;
    type: string;
    description: string;
}

const Card: React.FC<CardProps> = ({
    id,
    title,
    location,
    date,
    type,
    description,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUserID, setCurrentUserID] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/current_user/")
            .then((res) => {
                setCurrentUserID(res.data.user.id);
                alert(res.data.user.id);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleRegister = async () => {
        axios
            .post("http://localhost:8000/api/register_activity/", {
                activity: id,
                student: currentUserID,
            })
            .then((res) => {
                alert("Registered");
                console.log(res);
            })
            .catch((err) => {
                alert("Error :" + err);
                console.log(err);
            });
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredViewModal}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{title}</Text>{" "}
                        <Text style={styles.modalText}>{date}</Text>
                        <Text style={styles.modalText}>{location}</Text>
                        <Text style={styles.modalText}>{type}</Text>
                        <Text style={styles.modalText}>{description}</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleRegister}
                        >
                            <Text style={styles.textStyle}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={styles.card}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.text}>{location}</Text>
                <Text style={styles.text}>{date}</Text>
                <Text style={styles.text}>{type}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        marginTop: 22,
    },
    centeredViewModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        width: "60%",
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        backgroundColor: "#F194FF",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    card: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        padding: 80,
        paddingHorizontal: 200,
        backgroundColor: "#F194FF",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    text: {
        fontSize: 16,
    },
});

export default Card;
