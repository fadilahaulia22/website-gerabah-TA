// src/utils/auth.utils.js
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getRole = () => {
  const user = getUser();
  return user?.role?.toLowerCase();
};

export const isPokdarwis = () => getRole() === "pokdarwis";


export const isPemilik = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role?.toLowerCase() === "pemilik";
  } catch {
    return false;
  }
};
