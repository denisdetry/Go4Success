import { ActivityIndicator, Button, ScrollView, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import styles from "@/styles/global";
import React from "react";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import InputAutocomplete from "@/components/InputAutocomplete";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import InputAutocompleteMultiple from "@/components/InputAutocompleteMultiple";

export default function Add() {
    const generateHourQuarterList = () => {
        const list = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let quarter = 0; quarter < 4; quarter++) {
                const key = `${hour.toString().padStart(2, "0")}:${(quarter * 15).toString().padStart(2, "0")}`;
                list.push({ key, value: key });
            }
        }
        return list;
    };

    const hourQuarterList = generateHourQuarterList();

    const { control, handleSubmit, watch } = useForm();

    const { sites, isPending: sitePending, error: siteError } = useSites();
    const watchSite = watch("site", undefined);

    const { rooms, error: roomError } = useRooms(watchSite?.key);

    const availableLanguages = [
        { key: "en", value: "English" },
        { key: "fr", value: "French" },
    ];

    if (siteError) {
        return <View> Error: {siteError.message} </View>;
    }

    if (roomError) {
        return <View> Error: {roomError.message} </View>;
    }

    if (sitePending) {
        return <ActivityIndicator />;
    }

    if (sites === undefined) {
        return <View> Issue loading Sites </View>;
    }

    if (rooms === undefined) {
        return <View> Issue loading Rooms </View>;
    }

    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={{ width: "90%" }}>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputField}>
                            <TextInput
                                style={styles.input}
                                placeholder={"Workshop name"}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name="name"
                    defaultValue=""
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputField}>
                            <TextInput
                                style={styles.input}
                                placeholder={"Workshop description"}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name="description"
                    defaultValue=""
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={sites}
                            placeholder={"Select a site"}
                            onChange={onChange}
                        />
                    )}
                    name={"site"}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocompleteMultiple
                            items={rooms}
                            placeholder={"Select one or multiple rooms"}
                            onChange={(data) => {
                                onChange(data);
                                console.log("data", data);
                            }}
                        />
                    )}
                    name={"room"}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={availableLanguages}
                            search={false}
                            placeholder={"Select a language"}
                            onChange={onChange}
                        />
                    )}
                    name={"language"}
                />

                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return (
                            <DateTimePicker
                                mode={"single"}
                                date={value}
                                onChange={(params) => onChange(params.date?.toString())}
                            />
                        );
                    }}
                    name={"WorkshopDate"}
                    defaultValue={dayjs()}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={hourQuarterList}
                            placeholder={"Test"}
                            onChange={(value) => {
                                onChange(value);
                            }}
                        />
                    )}
                    name={"startHour"}
                    defaultValue={""}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={hourQuarterList}
                            placeholder={"Test"}
                            onChange={(value) => {
                                onChange(value);
                            }}
                        />
                    )}
                    name={"endHour"}
                    defaultValue={""}
                />

                <Button
                    title="Submit"
                    onPress={handleSubmit((data) => {
                        const formattedStartHour = data.startHour.value.split(":");
                        const formattedEndHour = data.endHour.value.split(":");
                        const formattedData = {
                            name: data.name,
                            description: data.description,
                            site: data.site,
                            room: data.room,
                            language: data.language,
                            dateStart: dayjs(data.WorkshopDate)
                                .set("hour", formattedStartHour[0])
                                .set("minute", formattedStartHour[1])
                                .toJSON(),
                            dateEnd: dayjs(data.WorkshopDate)
                                .set("hour", formattedEndHour[0])
                                .set("minute", formattedEndHour[1])
                                .toJSON(),
                        };
                        console.log("data", formattedData);
                        console.log("now", dayjs().toJSON());
                    })}
                />
            </View>
        </ScrollView>
    );
}
