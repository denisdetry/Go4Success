import React, { useCallback, useEffect, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import { SelectItem } from "@/components/select";
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

type ItemProps = {
    readonly item: SelectItem;
    readonly onPress: () => void;
};

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
            return (
                <>
                    <Item
                        item={item}
                        onPress={() => {
                            handleChange(item);
                            setSelectedData(item);
                            setVisible(false);
                        }}
                    />
                </>
            );
        }
        return null;
    };

    return (
        <ScrollView horizontal={true} scrollEnabled={false}>
            <SafeAreaView>
                <SafeAreaView
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
                            {!selectedData.value ||
                            selectedData.value === "" ? (
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
                        <>
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
                        </>
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
                </SafeAreaView>

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
                    <FlatList
                        style={{ maxHeight: 200 }}
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.value}
                    />
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default InputAutocomplete;
