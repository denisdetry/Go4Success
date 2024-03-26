import React, { useCallback, useEffect, useState } from "react";
import {
    Text,
    ScrollView,
    TextInput,
    StyleSheet,
    Modal,
    View,
    Platform,
} from "react-native";
import axios from "axios";
import Card from "../components/Card";
import ButtonComponent from "../components/Button";
import Colors from "../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import stylesGlobal from "../styles/global";
import { API_BASE_URL } from "../constants/ConfigApp";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { ActivityOrAttend } from "@/types/ActivityOrAttend";
import { useAttendsAndActivities } from "@/context/AttendsAndActivities";
import RenderCarousel from "./RenderCarousel";

// Set the default values for axios
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

interface Site {
    id: string;
    name: string;
}

interface FilterActivityProps {
    readonly filterType: "activity" | "attend";
    readonly onFilterChange: any;
}

const FilterActivity = ({ filterType, onFilterChange }: FilterActivityProps) => {
    const { allActivities, registeredActivities } = useAttendsAndActivities();
    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [rooms, setRooms] = useState<string[]>([]);
    const [selectedSite, setSelectedSite] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [sites, setSites] = useState<Site[]>([]);
    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    const convertDateToISO = (date: DateType): string => {
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        } else if (typeof date === "string" && date !== "") {
            return date;
        } else if (typeof date === "number") {
            return new Date(date).toISOString().split("T")[0];
        } else if (date instanceof dayjs) {
            return date.format("YYYY-MM-DD");
        } else {
            return "";
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

    let siteId = selectedSite ? selectedSite.id : "";
    let siteName = selectedSite ? selectedSite.name : "";

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/workshops/rooms/?site=${siteId}`)
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
            .get(`${API_BASE_URL}/workshops/sites/`)
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
    }, [filterType, selectedRoom, selectedSite]);

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity = "activity" in item ? item.activity : item;

        return Platform.OS === "web" ? (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room}
                date={activity.date_start}
                type={activity.type}
                description={activity.description}
            />
        ) : (
            <View style={stylesGlobal.containerCard}>
                <Card
                    id={activity.id}
                    title={activity.name}
                    location={activity.room}
                    date={activity.date_start}
                    type={activity.type}
                    description={activity.description}
                />
            </View>
        );
    };

    const handleClearDates = () => {
        setRange({ startDate: null, endDate: null });
    };

    const handleSearchNameChange = (newSearchName: React.SetStateAction<string>) => {
        setSearchName(newSearchName);
        onFilterChange(filterType, "name", newSearchName);
    };

    useEffect(() => {
        onFilterChange(filterType, "name", searchName);
        onFilterChange(filterType, "room", `${selectedRoom} ${siteName}`);
        onFilterChange(filterType, "date_start", startDateISO);
        onFilterChange(filterType, "date_end", endDateISO);
    }, [searchName, selectedSite, selectedRoom, startDateISO, endDateISO]);

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    return (
        <ScrollView>
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
                            onChangeText={handleSearchNameChange}
                            placeholder="Search title activity"
                        />
                        <Picker
                            style={stylesGlobal.picker}
                            selectedValue={selectedSite ? selectedSite.name : ""}
                            onValueChange={(value: string) => {
                                const site = sites.find(
                                    (site: Site) => site.name === value,
                                );
                                setSelectedSite(
                                    site ? { id: site.id, name: site.name } : null,
                                );
                            }}
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
                                buttonType={"primary"}
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

            {filterType === "attend" &&
                (registeredActivities.length > 0 ? (
                    <RenderCarousel
                        data={registeredActivities}
                        renderItem={renderCards}
                    />
                ) : (
                    <Text style={stylesGlobal.text}>
                        Vous n'êtes inscrit à aucun atelier
                    </Text>
                ))}
            {filterType === "activity" &&
                (allActivities.length > 0 ? (
                    <RenderCarousel data={allActivities} renderItem={renderCards} />
                ) : (
                    <Text style={styles.noDataText}>Aucun atelier disponible.</Text>
                ))}
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
