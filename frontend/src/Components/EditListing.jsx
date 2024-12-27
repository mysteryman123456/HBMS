import React , {useEffect, useState} from 'react';
import { useSession } from '../Context/SessionContext';

const EditListing = () => {
  const[editDetails , setEditDetails] = useState(null);
  const {sessionData} = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3008/fetch-hotel-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seller_email: sessionData?.email }), 
        });
        const data = await response.json();
        if (response.ok) {
          setEditDetails(data.rows);
        } else {
          window.failure(data.message);
        }
      } catch (err) {
        window.failure("Please try again later!");
      }
    };
    
    if (sessionData?.email) fetchData();

  }, [sessionData?.email]);

  return (
    <div>
      
    </div>
  )
}

export default EditListing
