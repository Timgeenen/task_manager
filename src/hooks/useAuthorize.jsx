import { useEffect, useState } from "react";
import { authorizeUser } from "../api/Event"

function useAuthorize() {

  const [authorized, setAuthorized] = useState(false);

  const validateUser = async () => {
    const res = await authorizeUser();
    if (res.message === "Succesfully authorized user") {
      setAuthorized(true)
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  return [authorized];
}

export default useAuthorize
