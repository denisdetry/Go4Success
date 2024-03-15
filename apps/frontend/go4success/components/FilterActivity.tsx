import React, { useEffect, useState } from "react";
import {
    Text,
    ScrollView,
    TextInput,
    StyleSheet,
    Modal,
    Button,
    View,
} from "react-native";
import axios from "axios";
import Card from "../components/Card";
import { FlatList } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import stylesGlobal from "../styles/global";
import { API_BASE_URL } from "../constants/ConfigApp";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface Activity {
    id: string;
    name: string;
    room: string;
    date_start: string;
    type: string;
    description: string;
}

interface Attend {
    activity: Activity;
    student_id: string;
}

interface Site {
    id: string;
    name: string;
}

interface FilterActivityProps {
    filterType: "activity" | "attend";
}

type ActivityOrAttend = Activity | Attend;

const FilterActivity = ({ filterType }: FilterActivityProps) => {
    const [allActivities, setAllActivities] = useState([]);
    const [registeredActivities, setRegisteredActivities] = useState([]);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [rooms, setRooms] = useState<string[]>([]);
    const [selectedSite, setSelectedSite] = useState("");
    const [sites, setSites] = useState<Site[]>([]);

    const onSearchChange = (text: string) => {
        setSearchName(text);
    };

    const onRoomChange = (type: string) => {
        setSelectedRoom(type);
    };

    const onSiteChange = (type: string) => {
        setSelectedSite(type);
    };

    useEffect(() => {
        if (filterType === "attend") {
            axios
                .get(`${API_BASE_URL}/api/attends/?name=${searchName}`)
                .then((res) => {
                    setRegisteredActivities(res.data);
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else {
            axios
                .get(
                    `${API_BASE_URL}/api/activity/?name=${searchName}&room=${selectedRoom}`,
                )
                .then((res) => {
                    setAllActivities(res.data);
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
        axios
            .get(`${API_BASE_URL}/api/room/?site=${selectedSite}`)
            .then((res) => {
                setRooms(
                    res.data
                        .map((Room: any) => Room.name)
                        .filter(
                            (value: string, index: number, self: string[]) =>
                                self.indexOf(value) === index,
                        ),
                );
            })
            .catch((err: Error) => {
                console.error(err.message);
            });
        axios
            .get(`${API_BASE_URL}/api/site/`)
            .then((res) => {
                if (selectedSite === "" && selectedRoom === "") {
                    setSelectedRoom("");
                }
                setSites(
                    res.data
                        .map((Site: any) => ({ id: Site.id, name: Site.name }))
                        .filter(
                            (value: any, index: number, self: any[]) =>
                                self.findIndex((v: any) => v.name === value.name) ===
                                index,
                        ),
                );
            })
            .catch((err: Error) => {
                console.error(err.message);
            });
    }, [filterType, searchName, selectedRoom, selectedSite]);

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity: Activity;

        if ("activity" in item) {
            activity = item.activity;
        } else {
            activity = item;
        }

        return (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room}
                date={activity.date_start}
                type={activity.type}
                description={activity.description}
            />
        );
    };

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    return (
        <ScrollView contentContainerStyle={stylesGlobal.containerCard}>
            <Button title="Open Filter" onPress={toggleModal} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onSearchChange}
                            value={searchName}
                            placeholder="Search title activity"
                        />
                        <Picker
                            style={styles.picker}
                            onValueChange={onSiteChange}
                            selectedValue={selectedSite}
                        >
                            <Picker.Item label="ALL" value="" />
                            {sites.map((site: Site) => (
                                <Picker.Item
                                    key={site.id}
                                    label={site.name}
                                    value={site.id}
                                />
                            ))}
                        </Picker>
                        <Picker
                            style={styles.picker}
                            onValueChange={onRoomChange}
                            selectedValue={selectedRoom}
                        >
                            <Picker.Item label="ALL" value="" />
                            {rooms.map((room) => (
                                <Picker.Item key={room} label={room} value={room} />
                            ))}
                        </Picker>
                        <Button title="Close Filter" onPress={toggleModal} />
                    </View>
                </View>
            </Modal>

            {filterType === "attend" && (
                <>
                    <Text style={stylesGlobal.heading2}>Registered Workshops</Text>
                    {registeredActivities.length > 0 ? (
                        <FlatList
                            data={registeredActivities}
                            renderItem={renderCards}
                        />
                    ) : (
                        <Text style={styles.noDataText}>
                            No registered workshops available with this filter.
                        </Text>
                    )}
                </>
            )}
            <Text style={stylesGlobal.heading2}>Available Workshops</Text>
            {allActivities.length > 0 ? (
                <FlatList data={allActivities} renderItem={renderCards} />
            ) : (
                <Text style={styles.noDataText}>
                    No available workshops with this filter.
                </Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: "100%",
        backgroundColor: "#fafafa",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
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

export default FilterActivity;
