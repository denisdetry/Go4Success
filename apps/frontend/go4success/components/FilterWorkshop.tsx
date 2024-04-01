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
import Card from "./Card";
import ButtonComponent from "./Button";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import stylesGlobal from "../styles/global";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import SelectSearch, { SelectItem } from "./SelectSearch";
import dayjs from "dayjs";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import { ItemType } from "react-native-dropdown-picker";
import { Workshop, useWorkshops } from "@/hooks/useWorkshops";

interface Attend {
    activity: Workshop;
    student_id: string;
}

interface FilterWorkshopProps {
    readonly filterType: "workshop" | "attend";
}

type WorkshopOrAttend = Workshop | Attend;

const FilterWorkshop = ({ filterType }: FilterWorkshopProps) => {
    const [siteOpen, setSiteOpen] = React.useState(false);
    const [roomOpen, setRoomOpen] = React.useState(false);
    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<SelectItem>();
    const [selectedSite, setSelectedSite] = useState<SelectItem>();
    const [registeredActivities, setRegisteredActivities] = useState<Workshop[]>([]);
    const [allActivities, setAllActivities] = useState<Workshop[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    const { isPending: isPendingSite, sites, error: siteError } = useSites();
    const allSites = [{ label: "All", value: "" }, ...sites];

    const { rooms, error: roomError } = useRooms(selectedSite?.value, sites);

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

    const { data: registeredActivitiesData } = useWorkshops(
        "attends",
        searchName,
        selectedRoom?.value,
        selectedSite?.value,
        convertDateToISO(range.startDate),
        convertDateToISO(range.endDate),
    );

    const { data: allActivitiesData } = useWorkshops(
        "activity",
        searchName,
        selectedRoom?.value,
        selectedSite?.value,
        convertDateToISO(range.startDate),
        convertDateToISO(range.endDate),
    );

    const renderCards = ({ item }: { item: WorkshopOrAttend }) => {
        let workshop = "activity" in item ? item.activity : item;
        const siteName = sites.find((site) => site.value === workshop.room.site)?.label;

        return Platform.OS === "web" ? (
            <Card
                id={workshop.id}
                title={workshop.name}
                location={workshop.room.name + " - " + siteName}
                date={workshop.date_start}
                type={workshop.type}
                description={workshop.description}
            />
        ) : (
            <View style={stylesGlobal.containerCard}>
                <Card
                    id={workshop.id}
                    title={workshop.name}
                    location={workshop.room.name}
                    date={workshop.date_start}
                    type={workshop.type}
                    description={workshop.description}
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

    if (isPendingSite) {
        return <ActivityIndicator />;
    }

    const handleFilterClose = () => {
        if (registeredActivitiesData) {
            setRegisteredActivities(registeredActivitiesData);
        }
        if (allActivitiesData) {
            setAllActivities(allActivitiesData);
        }

        if (hasLoaded) {
            toggleModal();
        }
    };

    if (!hasLoaded) {
        handleFilterClose();
        setHasLoaded(true);
    }

    const handleClearFilter = () => {
        setSearchName("");
        setSelectedRoom(undefined);
        setSelectedSite(undefined);
        setRange({ startDate: null, endDate: null });
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
                            onChangeText={(text: string) => setSearchName(text)}
                            placeholder="Search title Workshop"
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
                            value={selectedSite?.value ?? null}
                        />

                        <View style={{ height: 10 }} />

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
                            value={selectedRoom?.value ?? null}
                        />

                        <View
                            style={{ flexDirection: "column", alignItems: "flex-end" }}
                        >
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
                            </View>
                            <ButtonComponent
                                text="Clear dates"
                                onPress={handleClearDates}
                                buttonType={"clear"}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <ButtonComponent
                                text="Clear Filter"
                                onPress={handleClearFilter}
                                buttonType={"close"}
                            />
                            <ButtonComponent
                                text="Save Filter"
                                onPress={handleFilterClose}
                                buttonType={"secondary"}
                            />
                        </View>
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
            {filterType === "workshop" &&
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

export default FilterWorkshop;
