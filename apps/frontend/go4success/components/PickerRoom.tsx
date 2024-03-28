import { Text } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import stylesGlobal from "../styles/global";
import { API_BASE_URL } from "../constants/ConfigApp";
import { useQuery } from "@tanstack/react-query";

interface Site {
    id: string;
    name: string;
}

interface Room {
    id: string;
    name: string;
}

function PickerRoom({
    setSelectedRoom,
    selectedRoom,
    selectedSite,
}: {
    setSelectedRoom: React.Dispatch<React.SetStateAction<Room | null>>;
    selectedRoom: Room | null;
    selectedSite: Site | null;
} & Readonly<any>) {
    const { error, data: rooms } = useQuery<Room[]>({
        queryKey: ["room", selectedSite ? selectedSite.id : "all"],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/workshops/rooms/`, {
                params: {
                    site: selectedSite ? selectedSite.id : "",
                },
            });
            const data = response.data
                .map((Room: any) => ({ id: Room.id, name: Room.name }))
                .filter(
                    (value: any, index: number, self: any[]) =>
                        self.findIndex((v: any) => v.name === value.name) === index,
                );
            return data;
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    if (!rooms) {
        return <Text>Loading...</Text>;
    }

    return (
        <Picker
            style={stylesGlobal.picker}
            selectedValue={selectedRoom ? selectedRoom.name : ""}
            onValueChange={(value: string) => {
                const room = rooms.find((room: Room) => room.name === value);
                setSelectedRoom(room ? { id: room.id, name: room.name } : null);
            }}
        >
            <Picker.Item label="ALL" value="" />
            {rooms.map((room: Room) => (
                <Picker.Item key={room.id} label={room.name} value={room.name} />
            ))}
        </Picker>
    );
}

export default PickerRoom;
