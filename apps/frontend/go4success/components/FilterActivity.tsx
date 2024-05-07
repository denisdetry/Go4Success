import React, { useCallback, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Card from "./Card";
import ButtonComponent from "./ButtonComponent";
import stylesGlobal from "../styles/global";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import { Activity, useActivities } from "@/hooks/useActivities";
import { useTranslation } from "react-i18next";
import RenderCarousel from "@/components/RenderCarousel";
import { useLanguages } from "@/hooks/useLanguages";
import modalStyle from "@/styles/modal";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import InputAutocomplete from "@/components/selectors/InputAutocomplete";

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
    const [searchName, setSearchName] = useState("");
    const [selectedRoomKey, setSelectedRoomKey] = useState<string>("");
    const [selectedSiteKey, setSelectedSiteKey] = useState<string>("");
    const [selectedLanguageKey, setSelectedLanguageKey] = useState<string>("");

    const [range, setRange] = useState<{
        startDate: DateType;
        endDate: DateType;
    }>({ startDate: undefined, endDate: undefined });

    const { sites, error: siteError } = useSites(undefined, true);

    const { rooms, error: roomError } = useRooms(
        selectedSiteKey ? selectedSiteKey : "",
        true,
    );

    const { languages, error: languageError } = useLanguages(undefined, true);

    const onChange = useCallback(
        (range: { startDate: DateType; endDate: DateType }) => {
            setRange(range);
        },
        [],
    );

    const siteCallback = useCallback(
        (siteKey: string) => {
            setSelectedSiteKey(siteKey);
        },
        [setSelectedSiteKey],
    );

    const roomCallback = useCallback(
        (roomKey: string) => {
            setSelectedRoomKey(roomKey);
        },
        [setSelectedRoomKey],
    );

    const languageCallback = useCallback(
        (languageKey: string) => {
            setSelectedLanguageKey(languageKey);
        },
        [setSelectedLanguageKey],
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
        selectedRoomKey,
        selectedSiteKey,
        selectedLanguageKey,
        convertDateToISO(range.startDate),
        convertDateToISO(range.endDate),
    );

    const { data: allActivities } = useActivities(
        "activity",
        searchName,
        selectedRoomKey,
        selectedSiteKey,
        selectedLanguageKey,
        convertDateToISO(range.startDate),
        convertDateToISO(range.endDate),
    );

    const renderCards = ({ item }: { item: ActivityOrAttend }) => {
        const activity = "activity" in item ? item.activity : item;

        const activityDate = activity.date_start.split(" - ")[0];
        const activityHour =
            activity.date_start.split(" - ")[1] +
            " - " +
            activity.date_end.split(" - ")[1];

        return (
            <Card
                id={activity.id}
                title={activity.name}
                location={activity.room.name + " - " + activity.room.site.name}
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
        setSelectedRoomKey("");
        setSelectedSiteKey("");
        setSelectedLanguageKey("");
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
                <ScrollView contentContainerStyle={modalStyle.centeredView}>
                    <View style={[modalStyle.modalView, { padding: 35 }]}>
                        <TouchableOpacity
                            style={modalStyle.closeButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Ionicons
                                name={"close"}
                                color={Colors.primaryColor}
                                size={24}
                            ></Ionicons>
                        </TouchableOpacity>
                        <TextInput
                            style={stylesGlobal.inputLittle}
                            value={searchName}
                            onChangeText={(text: string) => setSearchName(text)}
                            placeholder={t(
                                "translationButton.SearchTitleWorkshop",
                            )}
                        />

                        <View style={{ gap: 10 }}>
                            <InputAutocomplete
                                items={sites}
                                placeholder={t("translationButton.SelectSite")}
                                toReturn={"key"}
                                readOnly={true}
                                onChange={siteCallback}
                            />

                            <InputAutocomplete
                                items={rooms}
                                placeholder={t("translationButton.SelectRoom")}
                                toReturn={"key"}
                                onChange={roomCallback}
                            />

                            <InputAutocomplete
                                items={languages}
                                placeholder={t(
                                    "translationButton.SelectLanguage",
                                )}
                                toReturn={"key"}
                                readOnly={true}
                                onChange={languageCallback}
                            />
                        </View>

                        <View
                            style={{
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
                                    headerContainerStyle={{
                                        backgroundColor: "white",
                                    }}
                                    headerTextStyle={{
                                        color: Colors.thirdColor,
                                    }}
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
                </ScrollView>
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
                    <RenderCarousel
                        data={allActivities}
                        renderItem={renderCards}
                    />
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
        position: "relative",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
        margin: "auto",
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
