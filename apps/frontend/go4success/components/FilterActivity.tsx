import React from "react";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface FilterActivityProps {
    types: string[];
    locations: string[];
    selectedType: string;
    selectedLocation: string;
    onTypeChange: (itemValue: string) => void;
    onLocationChange: (itemValue: string) => void;
}

const FilterActivity: React.FC<FilterActivityProps> = ({
    types,
    locations,
    selectedType,
    selectedLocation,
    onTypeChange,
    onLocationChange,
}) => {
    return (
        <>
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
