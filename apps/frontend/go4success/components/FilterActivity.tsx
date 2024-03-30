import React, { useCallback, useState } from "react";
import {
    Text,
    ScrollView,
    TextInput,
    StyleSheet,
    Modal,
    View,
    Platform,
    ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import ButtonComponent from "../components/Button";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import stylesGlobal from "../styles/global";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import SelectSearch, { SelectItem } from "../components/SelectSearch";
import dayjs from "dayjs";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import { ItemType } from "react-native-dropdown-picker";
import { Workshop, useWorkshops } from "@/hooks/useWorkshops";

interface Attend {
    activity: Workshop;
    student_id: string;
}

interface FilterActivityProps {
    readonly filterType: "activity" | "attend";
}

type ActivityOrAttend = Workshop | Attend;

const FilterActivity = ({ filterType }: FilterActivityProps) => {
    const [siteOpen, setSiteOpen] = React.useState(false);
    const [roomOpen, setRoomOpen] = React.useState(false);
    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<SelectItem>();
    const [selectedSite, setSelectedSite] = useState<SelectItem>();

    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    const { isPending: isPendingSite, sites, error: siteError } = useSites();
    const allSites = [{ label: "All", value: "" }, ...sites];

    const {
        isPending: isPendingRoom,
        rooms,
        error: roomError,
    } = useRooms(selectedSite?.value, sites);

    const allRooms = [{ label: "All", value: "" }, ...rooms];

    const onChange = useCallback(
        (range: { startDate: DateType; endDate: DateType }) => {
            setRange(range);
        },
        [],
    );

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

    const {
        isPending: isPendingAttend,
        data: registeredActivities,
        error: attendError,
    } = useWorkshops(
        "attends",
        searchName,
        selectedRoom?.value,
        selectedSite?.value,
        startDateISO,
        endDateISO,
    );

    const {
        isPending: isPendingActivity,
        data: allActivities,
        error: activityError,
    } = useWorkshops(
        "activity",
        searchName,
        selectedRoom?.value,
        selectedSite?.value,
        startDateISO,
        endDateISO,
    );

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        let activity = "activity" in item ? item.activity : item;

        return Platform.OS === "web" ? (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room.name}
                date={activity.date_start}
                type={activity.type}
                description={activity.description}
            />
        ) : (
            <View style={stylesGlobal.containerCard}>
                <Card
                    id={activity.id}
                    title={activity.name}
                    location={activity.room.name}
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

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    if (siteError) {
        return <View> Error: {siteError.message} </View>;
    }

    if (roomError) {
        return <View> Error: {roomError.message} </View>;
    }

    if (isPendingSite || isPendingRoom) {
        return <ActivityIndicator />;
    }

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
                            onChangeText={(text: string) => setSearchName(text)}
                            placeholder="Search title activity"
                        />

                        <SelectSearch
                            zIndex={100}
                            items={allSites}
                            placeholder={"Select a site"}
                            searchable={true}
                            onSelectItem={(item) => {
                                setSelectedSite(item as Required<ItemType<string>>);
                            }}
                            open={siteOpen}
                            setOpen={setSiteOpen}
                        />

                        <SelectSearch
                            zIndex={99}
                            items={allRooms}
                            placeholder={"Select one room"}
                            searchable={true}
                            onSelectItem={(item) => {
                                setSelectedRoom(item as Required<ItemType<string>>);
                            }}
                            open={roomOpen}
                            setOpen={setRoomOpen}
                        />

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

            {filterType === "attend" &&
                (registeredActivities !== undefined &&
                registeredActivities.length > 0 ? (
                    <FlatList
                        contentContainerStyle={stylesGlobal.containerCard}
                        data={registeredActivities}
                        renderItem={renderCards}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <Text style={styles.noDataText}>
                        Vous n'êtes inscrit à aucun atelier.
                    </Text>
                ))}
            {filterType === "activity" &&
                (allActivities !== undefined && allActivities.length > 0 ? (
                    <FlatList
                        contentContainerStyle={stylesGlobal.containerCard}
                        data={allActivities}
                        renderItem={renderCards}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    />
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
