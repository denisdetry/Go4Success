import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Feedback } from "@/types/Feedback";
import Colors from "@/constants/Colors";

interface FeedbackTableProps {
    readonly feedbacks: Feedback[];
    readonly columns: TableColumn<Feedback>[];
}

export const customStyles = {
    rows: {
        style: {
            minHeight: "72px",
            fontSize: 16,
            fontFamily: "Arial",
        },
    },
    headCells: {
        style: {
            paddingLeft: "8px",
            paddingRight: "8px",
            fontSize: 18,
            fontWeight: "bold",
            fontFamily: "Arial",
            backgroundColor: Colors.primaryColor,
            color: "white",
        },
    },
    cells: {
        style: {
            paddingLeft: "8px",
            paddingRight: "8px",
        },
    },
};

export const FeedbackTable: React.FC<FeedbackTableProps> = ({
    feedbacks,
    columns,
}) => {
    return (
        <DataTable
            columns={columns}
            data={feedbacks}
            pagination
            highlightOnHover
            customStyles={customStyles}
        />
    );
};
export default FeedbackTable;
