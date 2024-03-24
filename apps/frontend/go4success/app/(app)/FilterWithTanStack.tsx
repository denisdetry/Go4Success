import axios from "axios";
import {
    ActivityIndicator,
    Button,
    Modal,
    ScrollView,
    Text,
    TextInput,
    View,
    StyleSheet,
} from "react-native";
import styles from "../../styles/global";
import Card from "../../components/Card";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

type Workshop = {
    id: string;
    type: string;
    name: string;
    description: string;
    date_start: string;
    date_end: string;
    room: string;
    course: Course;
};

type Course = {
    id: number;
    code: string;
    name: string;
};

function ListWorkshops() {
    const [searchName2, setSearchName2] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const { isPending, error, data } = useQuery<Workshop[]>({
        queryKey: ["allWorkshops2", searchName2],
        queryFn: async () => {
            const response = await axios.get(
                `http://localhost:8000/workshops/activity/`,
                {
                    params: {
                        name: searchName2,
                    },
                },
            );
            return response.data;
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });

    if (isPending) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.containerCard}>
            <Button title="Open Search" onPress={() => setModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles2.centeredView}>
                    <View style={styles2.modalView}>
                        <TextInput
                            style={styles.inputLittle}
                            value={searchName2}
                            onChangeText={(text: string) => setSearchName2(text)}
                            placeholder="Search title activity"
                        />
                        <Button
                            title="Close Search"
                            onPress={() => setModalVisible(!modalVisible)}
                        />
                    </View>
                </View>
            </Modal>
            {data?.map((workshop: Workshop) => (
                <Card
                    key={workshop.id}
                    id={workshop.id}
                    title={workshop.name}
                    location={workshop.room}
                    date={workshop.date_start}
                    type={workshop.type}
                    description={workshop.description}
                />
            ))}
        </ScrollView>
    );
}

const styles2 = StyleSheet.create({
    noDataText: {
        fontSize: 16,
        color: "gray",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
});

export default function Workshops() {
    return (
        <QueryClientProvider client={queryClient}>
            <ListWorkshops />
        </QueryClientProvider>
    );
}
