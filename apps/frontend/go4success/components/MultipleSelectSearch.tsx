import React from "react";
import { SelectSearchProps } from "@/components/SelectSearch";
import { MultipleSelectList } from "@/lib/react-native-dropdown-select-list/index";

function MultipleSelectSearch(props: SelectSearchProps) {
    return (
        <MultipleSelectList
            setSelected={props.setSelected}
            data={props.items}
            search={props.search}
            placeholder={props.placeholder}
        />
    );
}

export default MultipleSelectSearch;
