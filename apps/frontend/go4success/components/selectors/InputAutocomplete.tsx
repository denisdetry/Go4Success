import React, { useCallback, useEffect, useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import styles from "@/styles/global";
import { SelectItem } from "@/types/SelectItem";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly onChange?: (value: any) => void;
    readonly readOnly?: boolean;
    readonly toReturn?: "key" | "value" | "all";
    readonly icon?: any;
}

/**
 * Props for the Item component
 */
type ItemProps = {
    readonly item: SelectItem;
    readonly onPress: () => void;
};

/**
 * Item component
 * @param item SelectItem object to display
 * @param onPress Function to call when the item is pressed
 */
const Item = ({ item, onPress }: ItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <View
            style={[
                isHovered && { backgroundColor: "lightgray" },
                { padding: 5 },
            ]}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.text}>{item.value}</Text>
            </TouchableOpacity>
        </View>
    );
};

/**
 * InputAutocomplete component to display an input field with autocomplete dropdown
 * User can select an item from the dropdown and type in the input field to filter the items
 * will return the key, value or the whole object when an item is selected
 * @param items List of items to display in the autocomplete dropdown
 * @param placeholder Placeholder text for the input
 * @param onChange Function to call when the input value changes
 * @param readOnly Boolean to make the input read only
 * @param toReturn String to determine what to return when an item is selected
 * @param icon Icon to display in the input
 */
const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
    items,
    placeholder,
    onChange = () => {},
    readOnly = false,
    toReturn = "all",
    icon,
}) => {
    const [visible, setVisible] = React.useState(false);
    const [filteredData, setFilteredData] = React.useState<SelectItem[]>(items);

    const [selectedData, setSelectedData] = React.useState<any>([]);

    const filterData = (text: string) => {
        return items.filter((item) => {
            const itemValue = item.value.toLowerCase().replace(":", "");
            const searchText = text.toLowerCase();

            return itemValue.includes(searchText);
        });
    };

    const handleChange = useCallback(
        (item?: SelectItem) => {
            if (item) {
                onChange(
                    toReturn === "key"
                        ? item.key
                        : toReturn === "value"
                          ? item.value
                          : item,
                );
            } else {
                onChange(
                    toReturn === "key"
                        ? ""
                        : toReturn === "value"
                          ? ""
                          : { key: "", value: "" },
                );
            }
        },
        [onChange, toReturn],
    );

    useEffect(() => {
        setFilteredData(items);
        setSelectedData([]);
        handleChange();
    }, [handleChange, items]);

    const renderItem = ({ item }: { item: SelectItem }) => {
        if (visible) {
            if (item.key !== "empty" && item.key !== "error") {
                return (
                    <Item
                        key={item.key}
                        item={item}
                        onPress={() => {
                            handleChange(item);
                            setSelectedData(item);
                            setVisible(false);
                        }}
                    />
                );
            } else {
                return (
                    <View style={{ padding: 5 }} key={item.key}>
                        <Text style={styles.text}>{item.value}</Text>
                    </View>
                );
            }
        }
        return null;
    };

    return (
        <View>
            <View
                style={[
                    styles.inputField,
                    visible && {
                        borderBottomEndRadius: 0,
                        borderBottomStartRadius: 0,
                    },
                ]}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={24}
                        color={Colors.primaryColor}
                        style={{ marginLeft: 5 }}
                    />
                )}
                {readOnly ? (
                    <TouchableWithoutFeedback
                        style={styles.input}
                        onPressIn={() => setVisible(!visible)}
                    >
                        {!selectedData.value || selectedData.value === "" ? (
                            <Text style={styles.placeholder}>
                                {placeholder}
                            </Text>
                        ) : (
                            <Text style={styles.input}>
                                {selectedData.value}
                            </Text>
                        )}
                    </TouchableWithoutFeedback>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor={"grey"}
                        onChangeText={(text) => {
                            setFilteredData(filterData(text));
                            setSelectedData({ key: text, value: text });
                            handleChange({ key: text, value: text });
                        }}
                        value={selectedData.value ?? ""}
                        onFocus={() => setVisible(true)}
                        onPressIn={() => setVisible(true)}
                    />
                )}

                <Pressable
                    onPress={() => {
                        setVisible(!visible);
                    }}
                    style={{ margin: 5 }}
                >
                    <AntDesign
                        name={visible ? "up" : "down"}
                        size={24}
                        color={Colors.primaryColor}
                    />
                </Pressable>
            </View>

            <View
                style={
                    visible && {
                        borderWidth: 0.5,
                        borderTopWidth: 0,
                        borderBottomStartRadius: 10,
                        borderBottomEndRadius: 10,
                    }
                }
            >
                {filteredData.map((item) => renderItem({ item }))}
            </View>
        </View>
    );
};

export default InputAutocomplete;
