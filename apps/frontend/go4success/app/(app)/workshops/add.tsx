import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import styles from "@/styles/global";
import SelectSearch from "@/components/SelectSearch";
import React from "react";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import InputAutocomplete from "@/components/InputAutocomplete";
import MultipleSelectSearch from "@/components/MultipleSelectSearch";

export default function Add() {
    const generateHourQuarterList = () => {
        const list = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let quarter = 0; quarter < 4; quarter++) {
                const label = `${hour.toString().padStart(2, "0")}:${(quarter * 15).toString().padStart(2, "0")}`;
                list.push({ label, value: label });
            }
        }
        return list;
    };

    const hourQuarterList = generateHourQuarterList();

    const { control, watch } = useForm();

    const { sites, isPending: sitePending, error: siteError } = useSites();

    const watchSite = watch("site", undefined);

    const {
        rooms,
        isPending: roomPending,
        error: roomError,
    } = useRooms(watchSite, sites);

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
                        <SelectSearch
                            items={sites}
                            placeholder={"Select a site"}
                            search={false}
                            setSelected={onChange}
                        />
                    )}
                    name={"site"}
                    defaultValue={""}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <MultipleSelectSearch
                            items={rooms}
                            toSave={"key"}
                            placeholder={"Select a room"}
                            setSelected={onChange}
                        />
                    )}
                    name={"room"}
                    defaultValue={""}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <InputAutocomplete
                            items={hourQuarterList}
                            placeholder={"Test"}
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
                        />
                    )}
                    name={"endHour"}
                    defaultValue={""}
                />
            </View>
        </ScrollView>
    );
}
