import React from "react";
import { SelectSearchProps } from "@/components/SelectSearch";
import { MultipleSelectList } from "@/lib/react-native-dropdown-select-list/index";

function MultipleSelectSearch(props: SelectSearchProps) {
    return (
        console.log("MultipleSelectSearch", props.items),
        (
            <MultipleSelectList
                setSelected={props.setSelected}
                data={props.items}
                save={props.toSave}
                search={props.search}
                placeholder={props.placeholder}
            />
        )
    );
}

export default MultipleSelectSearch;
