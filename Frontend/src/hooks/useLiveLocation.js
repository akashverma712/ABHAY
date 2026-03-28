import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function useLiveLocation(user) {
  const [position, setPosition] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    if (!user) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setPosition([latitude, longitude]);
        setTimestamp(new Date());

        await supabase.from("user_locations").insert({
          user_id: user.id,
          latitude,
          longitude,
        });
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  return { position, timestamp };
}