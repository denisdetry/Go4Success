import axios from "axios";

export default function axiosConfig() {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
}
