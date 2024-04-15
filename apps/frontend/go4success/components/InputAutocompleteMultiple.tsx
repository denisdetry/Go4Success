import React, { useEffect } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SelectItem } from "@/components/select";
import styles from "@/styles/global";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly onChange?: (value: SelectItem) => void;
}

type ItemProps = {
    readonly item: SelectItem;
    readonly onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => {
    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            onFocus={() => console.log("Focus")}
        >
            <Text>{item.value}</Text>
        </TouchableWithoutFeedback>
    );
};
const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
    items,
    placeholder,
    onChange = () => {},
}) => {
    const [focus, setFocus] = React.useState(false);
    const [searchFocus, setSearchFocus] = React.useState(false);

    const [filteredData, setFilteredData] = React.useState<SelectItem[]>(items);
    const [selectedData, setselectedData] = React.useState<SelectItem[]>([]);

    useEffect(() => {
        setFilteredData(items);
        setselectedData([]);
    }, [items]);

    const filterData = (text: string) => {
        return items.filter((item) =>
            text
                .split("")
                .every((letter) =>
                    item.value.toLowerCase().includes(letter.toLowerCase()),
                ),
        );
    };

    function textInput() {
        if (focus) {
            return (
                <TextInput
                    style={styles.input}
                    placeholder={"Search a room"}
                    onFocus={() => setSearchFocus(true)}
                    autoFocus={true}
                    onBlur={() => {
                        setSearchFocus(false);
                    }}
                    onChangeText={(text) => {
                        setFilteredData(filterData(text));
                        onChange({ key: text, value: text });
                    }}
                />
            );
        }
    }

    const renderItem = ({ item }: { item: SelectItem }) => {
        return (
            <Item
                item={item}
                onPress={() => {
                    if (!selectedData.includes(item)) {
                        setselectedData([...selectedData, item]);
                    } else {
                        setselectedData(selectedData.filter((i) => i !== item));
                    }
                }}
            />
        );
    };

    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => {
                    if (!searchFocus) {
                        setFocus(!focus);
                        setFilteredData(items);
                    }
                }}
            >
                <View>
                    <Text style={stylesin.button}>
                        {selectedData.length > 0
                            ? selectedData.map((item) => item.value).join(", ")
                            : placeholder}
                    </Text>

                    {focus && (
                        <FlatList
                            style={{
                                maxHeight: 200,
                            }}
                            data={filteredData}
                            ListHeaderComponent={textInput()}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.value}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const stylesin = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
    },
    bitton: {
        alignItems: "center",
        backgroundColor: "#0000FF",
        padding: 10,
    },
    countContainer: {
        alignItems: "center",
    },
});

export default InputAutocomplete;
