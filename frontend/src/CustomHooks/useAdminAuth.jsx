import {useEffect} from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const useAdminAuth = () => {

  const navigate = useNavigate();

  useEffect(()=>{
      const token = localStorage.getItem("token");
      if(!token){
        navigate("/")
        window.failure("Please login first");
        return;
      }
      try{
        const decodedData = jwtDecode(token);
        if(decodedData.role !== "hotel_admin"){
          window.failure("Your are not authorized!")
          navigate("/")
          return;
        }
      }
      catch(err){
        console.log(err);
        window.failure("Session expired!")
        navigate("/login")
        return;
      }
  },[navigate])
};

export default useAdminAuth;
