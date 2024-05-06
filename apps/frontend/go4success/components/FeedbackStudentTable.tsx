import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FeedbackStudent } from "@/types/Feedback";
import { customStyles } from "@/components/FeedbackTable";

interface FeedbackStudentTableProps {
    readonly feedbacks: FeedbackStudent[];
    readonly columns: TableColumn<FeedbackStudent>[];
}

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

export default FeedbackStudentTable;
