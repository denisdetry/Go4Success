import DropDownPicker from "react-native-dropdown-picker";
import React from "react";

interface SelectItem {
    label: string;
    value: string;
}

type SelectSearchProps = {
    readonly items: SelectItem[];
    readonly onSelect: (item: string) => void;
    readonly placeholder: string;
    readonly searchable: boolean;
    readonly open: boolean;
    readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly value: string;
    readonly setValue: React.Dispatch<React.SetStateAction<string>>;
};

const SelectSearch = (props: SelectSearchProps) => {
    return (
        <DropDownPicker
            open={props.open}
            value={props.value}
            items={props.items.map((item) => ({
                label: item.value,
                value: item.label,
            }))}
            placeholder={props.placeholder}
            searchable={props.searchable}
            setOpen={props.setOpen}
            setValue={props.setValue}
        />
    );
};

export default SelectSearch;
