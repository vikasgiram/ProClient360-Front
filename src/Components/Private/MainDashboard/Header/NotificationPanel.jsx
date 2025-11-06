import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import {
  setNotifications,
  markAsSeen,
  clearAllNotifications,
  removeNotification,
} from "../../../../redux/slices/notificationSlice";
import { getNotifications, deleteNotification } from "../../../../hooks/useNotification";

const NotificationPanel = ({ closePopUp }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const fetchedNotifications = await getNotifications();
        console.log("Fetched notifications:", fetchedNotifications);
        
        if (fetchedNotifications.success && fetchedNotifications.notifications) {
          dispatch(setNotifications(fetchedNotifications.notifications));
        } else {
          console.error("Failed to fetch notifications:", fetchedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [dispatch]);

  const handleNotificationClick = (id) => {
    dispatch(markAsSeen(id));
  };

  const handleDeleteNotification = async (id) => {
    try {
      const result = await deleteNotification(id);
      if (result && result.success) {
        dispatch(removeNotification(id));
        toast.success("Notification deleted successfully");
      } else {
        toast.error(result?.error || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const timeNow = Date.now();
    const time = new Date(timestamp).getTime();
    
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

  // Count unseen notifications
  const unseenCount = notifications.filter(notification => !notification.isSeen).length;

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
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title mb-0">
              Notifications
              {unseenCount > 0 && (
                <span className="badge bg-danger ms-2">{unseenCount}</span>
              )}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closePopUp}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(90vh - 56px)" }}>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading notifications...</p>
              </div>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-3 my-2 rounded d-flex justify-content-between align-items-center ${!notification.isSeen ? 'bg-light' : 'bg-white'}`}
                  style={{ 
                    borderLeft: !notification.isSeen ? '4px solid #0d6efd' : 'none',
                    cursor: "pointer"
                  }}
                  // When clicking on the notification, mark it as seen
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      className="img-thumbnail rounded-circle me-3"
                      style={{ width: "3rem" }}
                      src={notification?.sender?.profilePic || '/default-avatar.png'}
                      alt="Sender-Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div>
                      <h6 className="mb-0">{notification?.sender?.name}</h6>
                      <p className={`mb-0 ${!notification.isSeen ? "fw-bold" : ""}`}>
                        {notification?.message}
                      </p>
                      <p className="mb-0 text-muted small">{getTimeAgo(notification?.createdAt)}</p>
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
              <div className="text-center py-4">
                <p className="text-muted">No Notifications</p>
              </div>
            )}
          </div>

          {/* ClearAll button using dispatch send action to the redux store */}
          {notifications && notifications.length > 0 && (
            <div className="modal-footer">
              <button 
                className="btn btn-outline-danger w-100" 
                onClick={() =>dispatch(clearAllNotifications())} 
              >
                <i className="fa-solid fa-trash me-2"></i> Clear All Notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;