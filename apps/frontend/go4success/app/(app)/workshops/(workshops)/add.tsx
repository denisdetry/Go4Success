import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import styles from "@/styles/global";
import { useState } from "react";
import SelectSearch from "@/components/SelectSearch";

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
    return useQuery<Site[]>({
        queryKey: ["allSites"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8000/workshops/sites/");
            return response.data;
        },
    });
}

function useRoomsFilteredBySite(siteId: string) {
    const {
        isPending,
        error,
        data: roomList,
    } = useQuery<Room[]>({
        queryKey: ["rooms", siteId],
        queryFn: async () => {
            const response = await axios.get(
                `http://localhost:8000/rooms/?site=${siteId}`,
            );
            return response.data;
        },
    });

    if (isPending) {
        return <Text>Loading…</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return roomList;
}

export default function Add() {
    const { control } = useForm();
    const [selectedSite, setSelectedSite] = useState("");
    const sites = useSites();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const sitesList =
        sites.data?.map((site: { id: any; name: any }) => ({
            label: site.id,
            value: site.name,
        })) ?? [];

    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomOpen, setRoomOpen] = useState(false);
    const [roomValue, setRoomValue] = useState("");

    return (
        <View style={[{ shadowRadius: 0, backgroundColor: "" }]}>
            {sites.isPending && <ActivityIndicator />}
            {/*<Controller control={control} render={({}) => (
                <Picker
                    selectedValue={selectedSite}
                    onValueChange={(itemValue) =>
                        setSelectedSite(itemValue)
                }>
                    <Picker.Item label={"Select a site"} value={""} />
                    {sitesList}
                </Picker>
            )}
            name={"site"}
            defaultValue={""}
            />*/}

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <View /*style={styles.inputField}*/>
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
                    <View /*style={styles.inputField}*/>
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
                render={({}) => (
                    <SelectSearch
                        items={sitesList}
                        onSelect={(item) => setSelectedSite(item)}
                        placeholder={"Select a site"}
                        searchable={true}
                        open={open}
                        setOpen={setOpen}
                        value={value}
                        setValue={setValue}
                    />
                )}
                name={"site"}
                defaultValue={""}
            />

            <Controller
                control={control}
                render={({}) => (
                    <SelectSearch
                        items={sitesList}
                        onSelect={(item) => setSelectedSite(item)}
                        placeholder={"Select a room"}
                        searchable={true}
                        open={roomOpen}
                        setOpen={setRoomOpen}
                        value={roomValue}
                        setValue={setRoomValue}
                    />
                )}
                name={"room"}
                defaultValue={""}
            />
        </View>
    );
}
