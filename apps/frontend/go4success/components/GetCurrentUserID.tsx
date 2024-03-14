import { useEffect } from "react";
import axios from "axios";

export default function GetCurrentUserID(setCurrentUserID: any) {
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/current_user/")
            .then((res) => {
                setCurrentUserID(res.data.user.id);
                console.log("userID : ", res.data.user.id);
            })
            .catch((err) => {
                console.log(err);
                setCurrentUserID("");
            });
    }, []);
}
