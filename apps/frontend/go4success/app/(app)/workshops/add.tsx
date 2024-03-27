import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import styles from "@/styles/global";
import SelectSearch, { SelectItem } from "@/components/SelectSearch";
import React from "react";
import SelectMultipleSearch from "@/components/SelectMultipleSearch";

type Site = {
    id: string;
    name: string;
};

type Room = {
    id: string;
    name: string;
    site: string;
};

function useSites() {
    const {
        isPending,
        data: sites,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["allSites"],
        queryFn: async () => {
            const response = await axios.get<Site[]>(
                "http://localhost:8000/workshops/sites/",
            );
            return response.data.map((site) => ({
                label: site.name,
                value: site.id,
            }));
        },
    });

    return { isPending, sites, error };
}

function useRooms(siteId: string | undefined, sites: SelectItem[]) {
    const {
        isPending,
        data: rooms,
        error,
    } = useQuery<SelectItem[]>({
        queryKey: ["rooms", siteId],
        queryFn: async () => {
            const response = await axios.get(
                "http://localhost:8000/workshops/rooms/" +
                    (siteId ? `site/${siteId}/` : ""),
            );
            return response.data.map((room: Room) => ({
                label:
                    room.name +
                    " - " +
                    sites.find((site) => site.value === room.site)?.label,
                value: room.id,
            }));
        },
    });

    return { isPending, rooms, error };
}

export default function Add() {
    const { control, watch } = useForm();

    const { sites, isPending: sitePending, error: siteError } = useSites();

    const watchSite = watch("site", undefined);

    const {
        rooms,
        isPending: roomPending,
        error: roomError,
    } = useRooms(watchSite?.value, sites ?? []);

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
                        open={true}
                        setOpen={onChange}
                    />
                )}
                name={"site"}
                defaultValue={""}
            />

            {
                <Controller
                    control={control}
                    render={({ field: { onChange } }) => (
                        <SelectMultipleSearch
                            zIndex={99}
                            items={rooms}
                            placeholder={"Select a room"}
                            searchable={true}
                            onSelectItem={onChange}
                            open={true}
                            setOpen={onChange}
                        />
                    )}
                    name={"room"}
                    defaultValue={""}
                />
            }
        </View>
    );
}
