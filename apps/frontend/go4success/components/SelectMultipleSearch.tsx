import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import React, { useEffect } from "react";
import { SelectSearchProps } from "@/components/SelectSearch";

export interface SelectItem {
    label: string;
    value: string;
}

type SelectMultipleSearchProps = SelectSearchProps & {
    readonly onSelectItem: (items: ItemType<string>[]) => void;
};

function SelectMultipleSearch(props: SelectMultipleSearchProps) {
    const [value, setValue] = React.useState([]);

    useEffect(() => {
        setValue([]);
    }, [props.items]);

    return (
        <DropDownPicker
            zIndex={props.zIndex}
            multiple={true}
            open={props.open}
            value={value}
            items={props.items}
            placeholder={props.placeholder}
            searchable={props.searchable}
            setOpen={props.setOpen}
            setValue={setValue}
            onSelectItem={props.onSelectItem}
            mode={"BADGE"}
        />
    );
}

export default SelectMultipleSearch;