import React, { useCallback, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import ButtonComponent from "./ButtonComponent";
import Colors from "../constants/Colors";
import stylesGlobal from "../styles/global";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import SelectSearch, { SelectItem } from "./SelectSearch";
import dayjs from "dayjs";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import { ItemType } from "react-native-dropdown-picker";
import { Activity, useActivities } from "@/hooks/useActivities";
import { useTranslation } from "react-i18next";
import RenderCarousel from "@/components/RenderCarousel";
import { useLanguages } from "@/hooks/useLanguages";
import { Ionicons } from "@expo/vector-icons";

interface Attend {
    activity: Activity;
    studentId: string;
}

interface FilterActivityProps {
    readonly filterType: "activity" | "attend";
}

type ActivityOrAttend = Activity | Attend;

const FilterActivity = ({ filterType }: FilterActivityProps) => {
    const { t } = useTranslation();
    const [siteOpen, setSiteOpen] = React.useState(false);
    const [roomOpen, setRoomOpen] = React.useState(false);
    const [languageOpen, setLanguageOpen] = React.useState(false);
    const [searchName, setSearchName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<SelectItem>();
    const [selectedSite, setSelectedSite] = useState<SelectItem>();
    const [selectedLanguage, setSelectedLanguage] = useState<SelectItem>();

    const [range, setRange] = React.useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    const { sites, error: siteError } = useSites();
    const allSites = [{ label: "All", value: "" }, ...sites];

    const { rooms, error: roomError } = useRooms(selectedSite?.value, sites);
    const allRooms = [{ label: "All", value: "" }, ...rooms];

    const { languages, error: languageError } = useLanguages();
    const allLanguages = [{ label: "All", value: "" }, ...languages];

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

    const { data: registeredActivities } = useActivities(
        "attends",
        searchName,
        selectedRoom?.value,
        selectedSite?.value,
        selectedLanguage?.value,
        convertDateToISO(range.startDate),
        convertDateToISO(range.endDate),
    );

    const { data: allActivities } = useActivities(
        "activity",
        searchName,
        selectedRoom?.value,
        selectedSite?.value,
        selectedLanguage?.value,
        convertDateToISO(range.startDate),
        convertDateToISO(range.endDate),
    );

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        const activity = "activity" in item ? item.activity : item;
        const siteName = sites.find((site) => site.value === activity.room.site)?.label;

        const activityDate = activity.date_start.split(" - ")[0];
        const activityHour =
            activity.date_start.split(" - ")[1] +
            " - " +
            activity.date_end.split(" - ")[1];

        return (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room.name + " - " + siteName}
                date={activityDate}
                hour={activityHour}
                type={activity.type}
                description={activity.description}
                language={activity.language.name}
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

    if (siteError) {
        return (
            <View>
                <Text> Error: {siteError.message} </Text>
            </View>
        );
    }

    if (roomError) {
        return (
            <View>
                <Text> Error: {roomError.message} </Text>
            </View>
        );
    }

    if (languageError) {
        return (
            <View>
                <Text> Error: {languageError.message} </Text>
            </View>
        );
    }

    const handleClearFilter = () => {
        setSearchName("");
        setSelectedRoom(undefined);
        setSelectedSite(undefined);
        setSelectedLanguage(undefined);
        setRange({ startDate: null, endDate: null });
    };


    return (
        <>
            <View style={styles.filterView}>
                <ButtonComponent
                    text={t("translationButton.OpenFilter")}
                    onPress={toggleModal}
                    buttonType={"filter"}
                />
                
            </View>


            {/* Modal view */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => {
                            setModalVisible(!modalVisible);
                        }}>
                            <Ionicons name={"close"} color={Colors.primaryColor} size={24}></Ionicons>
                        </TouchableOpacity>

                        <TextInput
                            style={[stylesGlobal.inputLittle]}
                            value={searchName}
                            onChangeText={(text: string) => setSearchName(text)}
                            placeholder={t("translationButton.SearchTitleWorkshop")}
                        />

                        <SelectSearch
                            zIndex={100}
                            items={allSites}
                            placeholder={t("translationButton.SelectSite")}
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
                            placeholder={t("translationButton.SelectRoom")}
                            searchable={true}
                            onSelectItem={(item) => {
                                setSelectedRoom(item as Required<ItemType<string>>);
                            }}
                            open={roomOpen}
                            setOpen={setRoomOpen}
                            value={selectedRoom?.value ?? null}
                        />

                        <View style={{ height: 10 }} />

                        <SelectSearch
                            zIndex={98}
                            items={allLanguages}
                            placeholder={t("translationButton.SelectLanguage")}
                            searchable={true}
                            onSelectItem={(item) => {
                                setSelectedLanguage(item as Required<ItemType<string>>);
                            }}
                            open={languageOpen}
                            setOpen={setLanguageOpen}
                            value={selectedLanguage?.value ?? null}
                        />

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                alignItems: "flex-end",
                                marginTop: 10,
                            }}
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
                                text={t("translationButton.ClearDates")}
                                onPress={handleClearDates}
                                buttonType={"clear"}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <ButtonComponent
                                text={t("translationButton.ClearFilter")}
                                onPress={handleClearFilter}
                                buttonType={"close"}
                            />
                            <ButtonComponent
                                text={t("translationButton.SaveFilter")}
                                onPress={toggleModal}
                                buttonType={"secondary"}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Cards views for registered activity or filtered */}
            {filterType === "attend" &&
                (registeredActivities !== undefined &&
                registeredActivities.length > 0 ? (
                    <RenderCarousel
                        data={registeredActivities}
                        renderItem={renderCards}
                    />
                ) : (
                    <Text style={stylesGlobal.text}>
                        {t("translation.noWorkshopAttend")}
                    </Text>
                ))}

            {/* Cards views for all activity or filtered */}
            {filterType === "activity" &&
                (allActivities !== undefined && allActivities.length > 0 ? (
                    <RenderCarousel data={allActivities} renderItem={renderCards} />
                ) : (
                    <Text style={stylesGlobal.text}>
                        {t("translation.noWorkshopAll")}
                    </Text>
                ))}
        </>
    );
};

const styles = StyleSheet.create({
    filterView: {
        flexWrap: "wrap",
        flexDirection: "row",
        gap: 10,
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
    },
    noDataText: {
        fontSize: 16,
        color: "gray",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
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
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});

export default FilterActivity;
