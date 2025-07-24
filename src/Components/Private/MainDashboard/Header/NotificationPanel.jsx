import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";


import {
  setNotifications,
  markAsSeen,
  clearAllNotifications,
  removeNotification,
} from "../../../../redux/slices/notificationSlice";
import { getNotifications } from "../../../../hooks/useNotification";

const NotificationPanel = ({ closePopUp }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const [clickedNotifications, setClickedNotifications] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotifications();
        console.log(fetchedNotifications.notifications);
        dispatch(setNotifications(fetchedNotifications.notifications));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  const handleNotificationClick = (id) => {
    dispatch(markAsSeen(id));
    setClickedNotifications((prev) => ({ ...prev, [id]: true }));
  };

  const handleDeleteNotification = async (id) => {
    try {
      dispatch(removeNotification(id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getTimeAgo = (timestamp) => {
    console.log("Raw timestamp:", timestamp);
    const timeNow = Date.now();
    const time = new Date(timestamp).getTime();
    
    console.log("Parsed time:", time);
    if (isNaN(time)) {
        console.warn("Invalid timestamp:", timestamp);
        return "Just now";
        
    }
          
    const difference = timeNow - time;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    
};

console.log(notifications)
  return (
    <div
      className="modal fade show"
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        position: "fixed",
        width: "100%",
        right: 0,
        justifyContent: "center",
      }}
      tabIndex="-1"
      role="dialog"
      onClick={(e) => e.target.classList.contains("modal") && closePopUp()}
    >
      <div
        className="modal-dialog position-fixed end-0 top-50 translate-middle-y"
        style={{
          height: "86%",
          width: "30%",
          minWidth: "300px",
        }}
      >
        <div className="modal-content h-100 d-flex flex-column">

            
          {/* Modal Header */}


          <div className="modal-header">
            <h5 className="modal-title">Notifications</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closePopUp}
              aria-label="Close"
            ></button>
          </div>

                    <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(90vh - 56px)" }}>
                        {notifications&& notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification._id} 
                                    className="p-3 my-2 rounded d-flex justify-content-between align-items-center"
                                    style={{ 
                                        background:!notification.isSeen?"#52555c": "#92959b",
                                        backdropFilter: "blur(5px)", 
                                        borderRadius: "8px",
                                        cursor: "pointer"
                                    }}
                                
                                    // When clicking on the notification, mark it as seen
                                    onClick={() => handleNotificationClick(notification._id)}
                                >
                                    <div className="d-flex align-items-center">
                                        <img
                                            className="img-thumbnail rounded-circle me-3"
                                            style={{ width: "3rem" }}
                                            src={notification?.sender?.profilePic}
                                            alt="Sender-Profile"
                                        />
                                        <div>

                    <h6 className="mb-0">{notification?.sender?.name}</h6>
                    <p className={`mb-0 ${!notification.isSeen ? "fw-bold text-warning" : ""}`}>
                        {notification?.message}
                    </p>
                    <p className="mb-0">{getTimeAgo(notification?.createdAt)}</p>
                  </div>
            </div>

                  {/* Delete Button */}

                  <button
                    className="border-0 bg-transparent p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification._id);
                    }}
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    <RiDeleteBin6Line size={20} />
                    
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">No Notifications</p>
            )}
          </div>

        {/* ClearAll button using dispatch send action to the redux store */}

                    {notifications && notifications.length > 0 && (
                        <div className="modal-footer">
                            <button 
                              
                                className="btn btn-danger w-100 border-0" 
                                onClick={() =>dispatch(clearAllNotifications())} 
                                style={{ background: "black", color: "white", border: "red" }}
                            >
                                <i className="fa-solid fa-trash"></i> Clear All Notifications
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
