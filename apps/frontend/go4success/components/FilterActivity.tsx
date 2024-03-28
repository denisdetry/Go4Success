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
import Card from "../components/Card";
import ButtonComponent from "../components/Button";
import Colors from "../constants/Colors";
import stylesGlobal from "../styles/global";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { ActivityOrAttend } from "@/types/ActivityOrAttend";
import { useAttendsAndActivities } from "@/context/AttendsAndActivities";
import RenderCarousel from "./RenderCarousel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PickerSite from "../components/PickerSite";
import PickerRoom from "../components/PickerRoom";

const queryClient = new QueryClient();

interface Site {
    id: string;
    name: string;
}

interface Room {
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
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
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

    useEffect(() => {}, [filterType, selectedRoom, selectedSite]);

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

    let siteName = selectedSite ? selectedSite.name : "";

    useEffect(() => {
        onFilterChange(filterType, "name", searchName);
        onFilterChange(
            filterType,
            "room",
            selectedRoom ? `${selectedRoom.name} ${siteName}` : siteName,
        );
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
                        <QueryClientProvider client={queryClient}>
                            <PickerSite
                                setSelectedSite={setSelectedSite}
                                selectedSite={selectedSite}
                            />
                            <PickerRoom
                                setSelectedRoom={setSelectedRoom}
                                selectedRoom={selectedRoom}
                                selectedSite={selectedSite}
                            />
                        </QueryClientProvider>
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
