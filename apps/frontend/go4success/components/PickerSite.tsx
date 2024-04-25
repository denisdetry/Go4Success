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

function PickerSite({
    setSelectedSite,
    selectedSite,
}: {
    readonly setSelectedSite: React.Dispatch<React.SetStateAction<Site | null>>;
    readonly selectedSite: Site | null;
} & Readonly<any>) {
    const { error, data: sites } = useQuery<Site[]>({
        queryKey: ["site"],
        queryFn: async () => {
            const response = await axios.get(
                `${API_BASE_URL}/workshops/sites/`,
            );
            return response.data
                .map((Site: any) => ({ id: Site.id, name: Site.name }))
                .filter(
                    (value: any, index: number, self: any[]) =>
                        self.findIndex((v: any) => v.name === value.name) ===
                        index,
                );
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    if (!sites) {
        return <Text>Loading...</Text>;
    }

    return (
        <Picker
            style={stylesGlobal.picker}
            selectedValue={selectedSite ? selectedSite.name : ""}
            onValueChange={(value: string) => {
                const site = sites.find((site: Site) => site.name === value);
                setSelectedSite(site ? { id: site.id, name: site.name } : null);
            }}
        >
            <Picker.Item label="ALL" value="" />
            {sites.map((site: Site) => (
                <Picker.Item
                    key={site.id}
                    label={site.name}
                    value={site.name}
                />
            ))}
        </Picker>
    );
}

export default PickerSite;
