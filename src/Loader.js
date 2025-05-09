import React from "react";
import { HashLoader } from "react-spinners";
import "./App.css";

const Loader = ({ loading, data }) => {
    return (
        <div className="loader-container">
            {loading ? (
                <HashLoader color="#36d7b7" loading={loading} size={50} />
            ) : (
                <div>{data.message}</div>
            )}
        </div>
    );
};

export default Loader;
