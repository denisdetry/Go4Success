import React from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styles from "@/styles/global";
import { SelectItem } from "@/components/select";
import { AntDesign } from "@expo/vector-icons";

export interface InputAutocompleteProps {
    readonly items: SelectItem[];
    readonly placeholder: string;
    readonly onChange?: (value: SelectItem) => void;
    readonly readOnly?: boolean;
}

type ItemProps = {
    readonly item: SelectItem;
    readonly onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={styles.text}>{item.value}</Text>
        </TouchableOpacity>
    );
};
const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
    items,
    placeholder,
    onChange = () => {},
    readOnly = false,
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

    const renderItem = ({ item }: { item: SelectItem }) => {
        if (visible) {
            return (
                <Item
                    item={item}
                    onPress={() => {
                        onChange(item);
                        setSelectedData(item);
                        setVisible(false);
                    }}
                />
            );
        }
        return null;
    };

    return (
        <ScrollView
            horizontal={true}
            scrollEnabled={false}
            style={{ width: "100%" }}
        >
            <SafeAreaView style={{ width: "100%" }}>
                <SafeAreaView style={styles.inputField}>
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        onChangeText={(text) => {
                            setFilteredData(filterData(text));
                            setSelectedData({ key: text, value: text });
                            onChange(selectedData);
                        }}
                        value={selectedData.value ?? ""}
                        onFocus={() => setVisible(true)}
                        onPressIn={() => setVisible(true)}
                    />

                    <Pressable onPress={() => setVisible(!visible)}>
                        <AntDesign
                            name={visible ? "up" : "down"}
                            size={26}
                            color={"#000000"}
                        />
                    </Pressable>
                </SafeAreaView>

                <FlatList
                    style={{ maxHeight: 200 }}
                    data={filteredData}
                    //ListHeaderComponent={textInput}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.value}
                />
            </SafeAreaView>
        </ScrollView>
    );
};

export default InputAutocomplete;