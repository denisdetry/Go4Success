import React, { useCallback, useEffect, useState } from "react";
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
import DateTimePicker, { DateType, ModeType } from "react-native-ui-datepicker";
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

    const [locale, setLocale] = useState("fr");
    const [mode, setMode] = useState<ModeType>("range");
    const [date, setDate] = useState<DateType | undefined>();
    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    type ParamsType = { date: DateType } | { startDate: DateType; endDate: DateType };

    const onChange = useCallback(
        (params: ParamsType) => {
            if (mode === "single") {
                setDate((params as { date: DateType }).date);
            } else if (mode === "range") {
                setRange(params as { startDate: DateType; endDate: DateType });
            }
        },
        [mode],
    );

    const onSearchChange = (text: string) => {
        setSearchName(text);
    };

    const onRoomChange = (type: string) => {
        setSelectedRoom(type);
    };

    const onSiteChange = (type: string) => {
        setSelectedSite(type);
    };

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === "single" ? "range" : "single"));
    };

    let startDateISO: string | null;
    let endDateISO: string | null;

    if (range.startDate instanceof Date) {
        startDateISO = range.startDate.toISOString().split("T")[0];
    } else if (typeof range.startDate === "string" && range.startDate !== "") {
        startDateISO = range.startDate;
    } else if (typeof range.startDate === "number") {
        startDateISO = new Date(range.startDate).toISOString().split("T")[0];
    } else if (range.startDate instanceof dayjs) {
        startDateISO = range.startDate.format("YYYY-MM-DD");
    } else {
        startDateISO = null;
    }

    if (range.endDate instanceof Date) {
        endDateISO = range.endDate.toISOString().split("T")[0];
    } else if (typeof range.endDate === "string" && range.endDate !== "") {
        endDateISO = range.endDate;
    } else if (typeof range.endDate === "number") {
        endDateISO = new Date(range.endDate).toISOString().split("T")[0];
    } else if (range.endDate instanceof dayjs) {
        endDateISO = range.endDate.format("YYYY-MM-DD");
    } else {
        endDateISO = null;
    }

    if (mode === "single") {
        if (date instanceof Date) {
            startDateISO = date.toISOString().split("T")[0];
        } else if (typeof date === "string" || typeof date === "number") {
            startDateISO = new Date(date).toISOString().split("T")[0];
        } else if (date instanceof dayjs) {
            startDateISO = date.format("YYYY-MM-DD");
        } else {
            startDateISO = null;
        }
    }

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
                    `${API_BASE_URL}/api/activity/?name=${searchName}&room=${selectedRoom}&date_start=${startDateISO}&date_end=${endDateISO}`,
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
                if (selectedSite != "" && selectedRoom === "") {
                    setSelectedRoom("");
                }
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
                if (selectedSite === "" && selectedRoom != "") {
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
    }, [filterType, searchName, selectedRoom, selectedSite, range, date]);

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
                        <View style={styles.container}>
                            <Button
                                title={`Switch to ${mode === "single" ? "range" : "single"} mode`}
                                onPress={toggleMode}
                            />
                            <DateTimePicker
                                mode={mode as "single" | "range"}
                                date={date}
                                startDate={range.startDate}
                                endDate={range.endDate}
                                onChange={onChange}
                            />
                            <Button
                                title="Clear dates"
                                onPress={() => {
                                    setDate(null);
                                    setRange({ startDate: null, endDate: null });
                                }}
                            />
                            <View style={{ gap: 3 }}>
                                {mode === "single" && date && (
                                    <Text>
                                        <Text
                                            style={{
                                                marginRight: 5,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Date:
                                        </Text>
                                        {dayjs(date)
                                            .locale(locale)
                                            .format("MMMM, DD, YYYY")}
                                    </Text>
                                )}
                                {mode === "range" && (
                                    <>
                                        <Text>
                                            <Text
                                                style={{
                                                    marginRight: 5,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Start Date:
                                            </Text>
                                            {range.startDate
                                                ? dayjs(range.startDate)
                                                      .locale(locale)
                                                      .format("MMMM, DD, YYYY")
                                                : "..."}
                                        </Text>
                                        <Text>
                                            <Text
                                                style={{
                                                    marginRight: 5,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                End Date:
                                            </Text>
                                            {range.endDate
                                                ? dayjs(range.endDate)
                                                      .locale(locale)
                                                      .format("MMMM, DD, YYYY")
                                                : "..."}
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
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
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF",
    },
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
