let toastHandler = null;

export const setToastHandler = (handler) => {
  toastHandler = handler;
};

export const showToast = (message, type = "success", duration = 3500) => {
  if (toastHandler) {
    toastHandler({ message, type, duration, id: Date.now() });
  }
};
