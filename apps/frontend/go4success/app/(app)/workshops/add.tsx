import { ActivityIndicator, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import styles from "@/styles/global";
import SelectSearch from "@/components/SelectSearch";
import React from "react";
import SelectMultipleSearch from "@/components/SelectMultipleSearch";
import { useSites } from "@/hooks/useSites";
import { useRooms } from "@/hooks/useRooms";
import InputAutocomplete from "@/components/InputAutocomplete";

export default function Add() {
    const [siteOpen, setSiteOpen] = React.useState(false);
    const [roomOpen, setRoomOpen] = React.useState(false);

    const { control, watch } = useForm();

    const { sites, isPending: sitePending, error: siteError } = useSites();

    const watchSite = watch("site", undefined);

    const {
        rooms,
        isPending: roomPending,
        error: roomError,
    } = useRooms(watchSite?.value, sites);

    if (siteError) {
        return <View> Error: {siteError.message} </View>;
    }

    if (roomError) {
        return <View> Error: {roomError.message} </View>;
    }

    if (sitePending || roomPending) {
        return <ActivityIndicator />;
    }

    if (sites === undefined) {
        return <View> Issue loading Sites </View>;
    }

    if (rooms === undefined) {
        return <View> Issue loading Rooms </View>;
    }

    return (
        <View style={[{ backgroundColor: "" }]}>
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
                        zIndex={100}
                        items={sites}
                        placeholder={"Select a site"}
                        searchable={true}
                        onSelectItem={onChange}
                        open={siteOpen}
                        setOpen={setSiteOpen}
                    />
                )}
                name={"site"}
                defaultValue={""}
            />

            <Controller
                control={control}
                render={({ field: { onChange } }) => (
                    <SelectMultipleSearch
                        zIndex={99}
                        items={rooms}
                        placeholder={"Select a room"}
                        searchable={true}
                        onSelectItem={onChange}
                        open={roomOpen}
                        setOpen={setRoomOpen}
                    />
                )}
                name={"room"}
                defaultValue={""}
            />

            <Controller
                control={control}
                render={({ field: { onChange } }) => (
                    <InputAutocomplete placeholder={"Select a time"} />
                )}
                name={"time"}
                defaultValue={""}
            />
        </View>
    );
}
