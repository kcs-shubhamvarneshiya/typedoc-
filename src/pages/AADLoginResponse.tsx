import { useEffect, useState } from "react";
import { handleAADLoginResponse } from "../utils/MsGraphApiCall";
import Toast from "../components/Toaster";
import { SessionDetails } from "../models/SessionDetails";
import { useNavigate } from "react-router-dom";
import { msalInstance } from "..";
import api from "../services/ApiService";
import { ApiResponse } from "../models/ApiResponse";
import SessionService from "../services/SessionService";
import { toast } from 'react-toastify';

export default function AADLoginResponse() {
  const [userName, setUserName] = useState<string | null>();
  const navigate = useNavigate();
  
  //const { instance } = useMsal();
  useEffect(() => {
    const checkLogin = async () => {
      console.log('checkLogin');
      try{
        const fragment = window.location.hash.substring(1); // Remove the '#' from the fragment
        const fragmentParams = new URLSearchParams(fragment);

        // Get individual parameters from the fragment
        const aad_token = fragmentParams.get('access_token');
        const tokenType = fragmentParams.get('token_type');
        const expiresIn = fragmentParams.get('expires_in');
        const scope = fragmentParams.get('scope');
        const sessionState = fragmentParams.get('session_state');

        if(aad_token){
          //exchange AD token for custom app token
          const loginReqData = new FormData();
          loginReqData.append("azureADToken", aad_token);
          return api.postForm<ApiResponse<SessionDetails>>('/user/login', loginReqData)
            .then((response) => {
              if(response.isSuccess) {
                SessionService.getInstance().setSession(response.data);
                navigate('/'); // this will take to Home page as session is set
              }     
              else {
                throw new Error(response.message);
              }   
            })
            .catch((error) => {
              console.log("Exception from login", error);
              toast.error(error.message);
            });
        }
        else {          
          toast.error('Azure Active Directory login failed. Please try again');
          //navigate('/');  // this will take to Login page as session is null
        }
      }catch(err: any) {
        console.log(err);
        toast.error(err.message);
      }
    };

    checkLogin();
  }, []);
  
  return (
    <>
      { userName && <p>Welcome {userName}</p> }      
    </>
  );
}
