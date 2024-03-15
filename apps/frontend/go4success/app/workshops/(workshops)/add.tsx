import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Text } from "react-native";

const queryClient = new QueryClient();

type Site = {
    id: string;
    name: string;
};

function getSites() {
    const {
        isPending,
        error,
        data: siteList,
    } = useQuery<Site[]>({
        queryKey: ["allSites"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8000/sites/");
            return response.data;
        },
    });

    if (isPending) {
        return <Text>Loading…</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }
}

export default function Add() {
    return <h1>Not implemented</h1>;
}
