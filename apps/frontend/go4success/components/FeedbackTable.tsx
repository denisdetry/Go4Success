/**
 * @file FeedbackTable.tsx
 * @author Allemeersch Maxime <max.allemeersch@gmail.com>
 * @date  02/05/2024
 * @description Enables  to create a feedback table
 */

import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Feedback, FeedbackStudent } from "@/types/Feedback";
import Colors from "@/constants/Colors";

interface FeedbackTableProps {
    feedbacks: Feedback[];
    columns: TableColumn<Feedback>[];
}

interface FeedbackStudentTableProps {
    feedbacks: FeedbackStudent[];
    columns: TableColumn<FeedbackStudent>[];
}

const customStyles = {
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

export const FeedbackTable: React.FC<FeedbackTableProps> = ({ feedbacks, columns }) => {
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

export const FeedbackStudentTable: React.FC<FeedbackStudentTableProps> = ({
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
