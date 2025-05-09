import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../../../redux/slices/notificationSlice";
import { Trash2 } from "lucide-react";

const Notification = ({ notification }) => {
    const dispatch = useDispatch();
    const [timeAgoRefresh, setTimeAgoRefresh] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgoRefresh((prev) => prev + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            className="p-3 my-2 text-white rounded d-flex justify-content-between align-items-center"
            style={{
                background: "rgba(0, 0, 0, 0.6)", 
                backdropFilter: "blur(5px)", 
                borderRadius: "8px"
            }}
        >
            <div className="d-flex align-items-center">
                <img 
                    className="img-thumbnail rounded-circle me-3"
                    style={{ width: "3rem" }}
                    src={notification?.sender?.profilePic}
                    alt="Sender-Profile" 
                    loading="lazy"
                />
                <div>
                    <h6 className="mb-0">{notification?.sender?.name}</h6>
                    <p className={`mb-0 ${!notification.isSeen ? "fw-bold text-warning" : ""}`}>
                        {notification?.message}
                    </p>
                </div>
            </div>
            
            <button 
                onClick={() => dispatch(removeNotification(notification._id))} 
                className="border-0 bg-transparent p-2 d-flex align-items-center"
                style={{
                    cursor: "pointer",
                    color: "white",
                    transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "red"}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};

export default Notification;
