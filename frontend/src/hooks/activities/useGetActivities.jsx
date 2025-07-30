import { useState } from "react";
import { getActivities } from "@services/activity.service.js";

export const useGetActivities = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error("Error consiguiendo actividades:", error);
    }
  }
  
  return { activities, setActivities, fetchActivities };
}

export default useGetActivities;