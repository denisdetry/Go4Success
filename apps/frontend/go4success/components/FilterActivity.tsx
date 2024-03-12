import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface FilterActivityProps {
    types: string[];
    locations: string[];
    search: string;
    selectedType: string;
    selectedLocation: string;
    onTypeChange: (itemValue: string) => void;
    onLocationChange: (itemValue: string) => void;
    onSearchChange: (text: string) => void;
}

const FilterActivity: React.FC<FilterActivityProps> = ({
    types,
    locations,
    search,
    selectedType,
    selectedLocation,
    onTypeChange,
    onLocationChange,
    onSearchChange,
}) => {
    return (
        <>
            <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={onSearchChange}
                value={search}
                placeholder="Rechercher par titre"
            />
            <Picker
                style={styles.picker}
                selectedValue={selectedType}
                onValueChange={onTypeChange}
            >
                <Picker.Item label="ALL" value="" />
                {types.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                ))}
            </Picker>
            <Picker
                style={styles.picker}
                selectedValue={selectedLocation}
                onValueChange={onLocationChange}
            >
                <Picker.Item label="ALL" value="" />
                {locations.map((location) => (
                    <Picker.Item
                        key={location}
                        label={location}
                        value={location}
                    />
                ))}
            </Picker>
        </>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: 150,
        backgroundColor: "#fafafa",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 4,
    },
});

export default FilterActivity;
