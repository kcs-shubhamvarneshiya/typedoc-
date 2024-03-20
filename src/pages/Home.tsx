import React, { useCallback, useEffect, useState } from "react";
import Toast from "../components/Toaster";
import { SessionDetails } from "../models/SessionDetails";
import { useNavigate } from "react-router-dom";
import SessionService from "../services/SessionService";
import { User } from "../models/User";

export default function Home() {
  const [toast, setToast] = useState({ open: 1, message: "", type: "success" });
  const [userName, setUserName] = useState<string | null>();
  const navigate = useNavigate();
  const sessionService = SessionService.getInstance();

  //const { instance } = useMsal();
  useEffect(() => {
    const currentUser: User = sessionService.getCurrentUser();
    setUserName(currentUser.name);
  }, [sessionService]);

  return (
    <>
      <h1>Home Page</h1>
      {userName && (
        <>
          <p>Welcome {userName}</p>
          <Toast open={toast.open} message={toast.message} type={toast.type} />
        </>
      )}
    </>
  );
}
