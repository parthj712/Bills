import { toast, cssTransition } from "react-toastify";

const SmoothSlide = cssTransition({
  enter: "toast-enter",
  exit: "toast-exit",
  duration: [280, 200],
});


const baseOptions = {
  position: "top-right",
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  transition: SmoothSlide,
};


export const showToast = ({ type = "info", message }) => {
    if (!message) return;

    const options = {
        ...baseOptions,
        toastId: message, // prevent duplicates
        autoClose: type === "error" ? 5000 : 2800,
        className: `app-toast app-toast--${type}`,
        bodyClassName: "app-toast__body",
    };

    switch (type) {
        case "success":
            toast.success(message, options);
            break;

        case "error":
            toast.error(message, options);
            break;

        case "warning":
            toast.warn(message, options);
            break;

        case "info":
            toast.info(message, options);
            break;

        default:
            toast(message, options);
    }
};
