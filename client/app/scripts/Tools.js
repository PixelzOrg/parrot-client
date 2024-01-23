import AsyncStorage from "@react-native-async-storage/async-storage";

export function calculateTotalMinutes(timeStart, timeEnd) {
  // Parse the time strings to get hours and minutes
  const [startHours, startMinutes] = timeStart.split(":").map(Number);
  const [endHours, endMinutes] = timeEnd.split(":").map(Number);

  // Calculate the total minutes
  const totalMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

  return totalMinutes;
}

// Set visibility status for a key
export const setVisibility = async (key, isVisible) => {
  try {
    await AsyncStorage.setItem(key, isVisible ? "visible" : "hidden");
  } catch (error) {
    console.error("Error setting visibility:", error);
    // Handle error as needed
  }
};

// Get visibility status for a key
export const getVisibility = async (key) => {
  try {
    const visibility = await AsyncStorage.getItem(key);
    return visibility === "visible";
  } catch (error) {
    console.error("Error getting visibility:", error);
    // Handle error as needed
    return false; // Default to false if there's an error
  }
};
