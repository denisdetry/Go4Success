import React, { useCallback, useEffect, useState } from "react";
import { Text, ScrollView, TextInput, StyleSheet, Modal, View } from "react-native";
import axios from "axios";
import Card from "../components/Card";
import ButtonComponent from "../components/Button";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import stylesGlobal from "../styles/global";
import { API_BASE_URL } from "../constants/ConfigApp";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

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
    readonly filterType: "activity" | "attend";
}

type ActivityOrAttend = Activity | Attend;

const FilterActivity = ({ filterType }: FilterActivityProps) => {
    const [allActivities, setAllActivities] = useState([]);
    const [registeredActivities, setRegisteredActivities] = useState([]);
    const [, setError] = useState("");
    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [rooms, setRooms] = useState<string[]>([]);
    const [selectedSite, setSelectedSite] = useState("");
    const [sites, setSites] = useState<Site[]>([]);
    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    const convertDateToISO = (date: DateType): string | null => {
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        } else if (typeof date === "string" && date !== "") {
            return date;
        } else if (typeof date === "number") {
            return new Date(date).toISOString().split("T")[0];
        } else if (date instanceof dayjs) {
            return date.format("YYYY-MM-DD");
        } else {
            return null;
        }
    };

    const startDateISO = convertDateToISO(range.startDate);
    const endDateISO = convertDateToISO(range.endDate);

    const onChange = useCallback(
        (range: { startDate: DateType; endDate: DateType }) => {
            setRange(range);
        },
        [],
    );

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
                    `${API_BASE_URL}/api/activity/?name=${searchName}&room=${selectedRoom} ${selectedSite}&date_start=${startDateISO}&date_end=${endDateISO}`,
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
    }, [filterType, searchName, selectedRoom, selectedSite, range]);

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

    const handleClearDates = () => {
        setRange({ startDate: null, endDate: null });
    };

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    return (
        <ScrollView contentContainerStyle={stylesGlobal.containerCard}>
            <ButtonComponent
                text="Open Filter"
                onPress={toggleModal}
                buttonType={"filter"}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={stylesGlobal.inputLittle}
                            value={searchName}
                            onChangeText={(text: string) => setSearchName(text)}
                            placeholder="Search title activity"
                        />
                        <Picker
                            style={stylesGlobal.picker}
                            selectedValue={selectedSite}
                            onValueChange={(type: string) => setSelectedSite(type)}
                        >
                            <Picker.Item label="ALL" value="" />
                            {sites.map((site: Site) => (
                                <Picker.Item
                                    key={site.id}
                                    label={site.name}
                                    value={site.name}
                                />
                            ))}
                        </Picker>
                        <Picker
                            style={stylesGlobal.picker}
                            selectedValue={selectedRoom}
                            onValueChange={(type: string) => setSelectedRoom(type)}
                        >
                            <Picker.Item label="ALL" value="" />
                            {rooms.map((room) => (
                                <Picker.Item key={room} label={room} value={room} />
                            ))}
                        </Picker>
                        <View style={stylesGlobal.containerDatePicker}>
                            <DateTimePicker
                                mode="range"
                                locale="fr"
                                startDate={range.startDate}
                                endDate={range.endDate}
                                onChange={onChange}
                                selectedItemColor={Colors.primaryColor}
                                headerContainerStyle={{ backgroundColor: "white" }}
                                headerTextStyle={{ color: Colors.thirdColor }}
                            />
                            <ButtonComponent
                                text="Clear dates"
                                onPress={handleClearDates}
                                buttonType={"secondary"}
                            />
                        </View>
                        <ButtonComponent
                            text="Close Filter"
                            onPress={toggleModal}
                            buttonType={"close"}
                        />
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
