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

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface Activity {
    activity_id: string;
    activity_name: string;
    activity_room: string;
    activity_date_start: string;
    activity_type: string;
    activity_description: string;
}

interface Attend {
    activity: Activity;
    student_id: string;
}

type ActivityOrAttend = Activity | Attend;

const FilterActivity = ({}) => {
    const [allActivities, setAllActivities] = useState([]);
    const [registeredActivities, setRegisteredActivities] = useState([]);
    const [error, setError] = useState("");

    const [selectedLocation, setSelectedLocation] = useState("");
    const [locations, setLocations] = useState([]);

    const [selectedType, setSelectedType] = useState("");
    const [types, setTypes] = useState<string[]>([]);

    const [search, setSearch] = useState("");

    const onSearchChange = (text: string) => {
        setSearch(text);
    };

    const onTypeChange = (type: string) => {
        setSelectedType(type);
    };

    const onLocationChange = (location: string) => {
        setSelectedLocation(location);
    };

    useEffect(() => {
        // LOCATION
        axios
            .get("http://localhost:8000/api/locations/")
            .then((res) => {
                setLocations(
                    res.data
                        .map((location: any) => location.site_name)
                        .filter(
                            (value: string, index: number, self: string[]) =>
                                self.indexOf(value) === index,
                        ),
                );
            })
            .catch((err: Error) => {
                console.error(err.message);
            });

        // ATTENDS
        axios
            .get("http://localhost:8000/api/attends/")
            .then((res) => {
                setRegisteredActivities(res.data);
                res.data.map(
                    (attend: { activity: { activity_name: string } }) =>
                        console.log(
                            "Activity Name: " + attend.activity.activity_name,
                        ),
                );
            })
            .catch((err) => {
                setError(err.message);
            });

        // ACTIVITY
        axios
            .get("http://localhost:8000/api/activity/")
            .then((res) => {
                setAllActivities(res.data);
                setTypes(
                    res.data
                        .map((activity: any) => activity.activity_type)
                        .filter(
                            (value: string, index: number, self: string[]) =>
                                self.indexOf(value) === index,
                        ),
                );
                console.log("All Activity" + res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity: Activity;

        if ("activity" in item) {
            activity = item.activity;
        } else {
            activity = item;
        }

        return (
            <Card
                id={activity.activity_id}
                title={activity.activity_name}
                location={activity.activity_room}
                date={activity.activity_date_start}
                type={activity.activity_type}
                description={activity.activity_description}
            />
        );
    };
    const filteredRegisteredActivities = registeredActivities.filter(
        (item: ActivityOrAttend) => {
            if ("activity" in item) {
                const city = item.activity.activity_room.split(" - ")[0];
                return (
                    (selectedLocation === "" || city === selectedLocation) &&
                    (selectedType === "" ||
                        item.activity.activity_type === selectedType) &&
                    item.activity.activity_name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                );
            }
            return false;
        },
    );

    const filteredAllActivities = allActivities.filter((activity: Activity) => {
        const city = activity.activity_room.split(" - ")[0];
        return (
            (selectedLocation === "" || city === selectedLocation) &&
            (selectedType === "" || activity.activity_type === selectedType) &&
            activity.activity_name.toLowerCase().includes(search.toLowerCase())
        );
    });
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
                            value={search}
                            placeholder="Search title activity"
                        />
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedType}
                            onValueChange={onTypeChange}
                        >
                            <Picker.Item label="ALL" value="" />
                            {types.map((type) => (
                                <Picker.Item
                                    key={type}
                                    label={type}
                                    value={type}
                                />
                            ))}
                        </Picker>
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedLocation}
                            onValueChange={onLocationChange}
                        >
                            <Picker.Item label="ALL" value="" />
                            {locations.map((location) => (
                                <Picker.Item
                                    key={location}
                                    label={location}
                                    value={location}
                                />
                            ))}
                        </Picker>
                        <Button title="Close Filter" onPress={toggleModal} />
                    </View>
                </View>
            </Modal>

            <Text style={stylesGlobal.heading2}>Registered Workshops</Text>
            {filteredRegisteredActivities.length > 0 ? (
                <FlatList
                    data={filteredRegisteredActivities}
                    renderItem={renderCards}
                />
            ) : (
                <Text style={styles.noDataText}>
                    No registered workshops available with this filter.
                </Text>
            )}
            <Text style={stylesGlobal.heading2}>Available Workshops</Text>
            {filteredAllActivities.length > 0 ? (
                <FlatList
                    data={filteredAllActivities}
                    renderItem={renderCards}
                />
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
