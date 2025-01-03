import { use, useEffect, useState } from "react";
import React from "react";

const Home = () => {
  const [l_n, setL_N] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [filteredHotelName, setFilteredHotelName] = useState([]);
  const[hotelName , setHotelName] = useState("");
  const[guest_count , setGuestCount] = useState(1);
  
  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          "http://localhost:3008/get-hotel-location-name",
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setL_N(data.message);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchLocationName();
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredResults([]);
      return;
    }
    const matchedLocation = l_n.filter((location) =>
      (location.hotel_location.toLowerCase().trim().includes(text.toLowerCase()))
    );
    setFilteredResults(matchedLocation);
  };

  const handleNameSearch = (e) =>{
    const text = e.target.value;
    setHotelName(text)
    if (text.trim() === "") {
      setFilteredHotelName([]);
      return;
    }
    const matchedNames = l_n.filter((name)=>
    (name.hotel_name.toLowerCase().trim().includes(text.toLowerCase())));
    setFilteredHotelName(matchedNames);
  }

  const sendData=()=>{
    if(guest_count <= 0){
      window.failure("Provide valid data") 
      return;
    }
    const dataToSend = {
      hotel_name : hotelName,
      hotel_location : searchText,
      guest_count : guest_count
    }
    console.log(dataToSend);
  }

  return (
    <>
      <div className="searchbar_container">
        <div className="searchbar-wrapper">
          <svg className='one' width="212" height="93" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -31)" fill="none" opacity=".6"><rect fill="#C11F3D" x="14.311" y="32.451" width="19.209" height="6.616" rx="3.308"></rect><rect fill="#C11F3D" x="165.943" y="48.731" width="11.338" height="6.616" rx="3.308"></rect><path d="M62.465 95.555H115.3v27.822H62.465V95.555zm149.313 28.424H.482l.14-.6h211.156v.6zM63.78 35.212h50.956v4.694H63.78v-4.694z" fill="#A81433" ></path><path fill="#880F2F" d="M114.736 35.212h26.043v4.694h-26.043z"></path><path fill="#880F2F" d="M114.736 39.905h22.808v83.474h-22.808z"></path><path fill="#B21737" d="M66.874 39.905h47.862v54.33H66.874z"></path><path fill="#880F2F" d="M57.587 90.017h57.15v6.292h-57.15z"></path><path d="M120.978 107.52h10.324v15.857h-10.324V107.52zm-3.426-58.042h17.176v3.471h-17.177v-3.471zm0 10.321h17.176v3.472h-17.177v-3.472zm0 10.325h17.176v3.47h-17.177v-3.47zm0 10.324h17.176v3.47h-17.177v-3.47z" fill="#A81433" ></path><path d="M73.353 49.478h34.722v3.471H73.353v-3.471zm0 10.321h34.722v3.472H73.353v-3.472zm0 10.324h34.722v3.472H73.353v-3.472zm0 10.325h34.722v3.47H73.353v-3.47z" fill="#880F2F" ></path><path fill="#A81433" d="M72.623 25.29h33.267v7.375H72.623z"></path><path d="M78.398 32.349h1.126v2.864h-1.126v-2.864zm20.595 0h1.126v2.864h-1.126v-2.864z" fill="#A81433" ></path><g transform="translate(5.912 63.749)"><circle fill="#B31941" cx="8.86" cy="8.829" r="8.801"></circle><path fill="#931435" d="M8.362 17.63h.565v14.283h-.565z"></path></g><g transform="translate(30.125 59.243)"><path fill="#931435" d="M10.172 12.205h.845v24.213h-.845z"></path><circle fill="#B31941" cx="10.454" cy="10.516" r="10.417"></circle></g><g transform="translate(151.187 70.224)"><path fill="#931435" d="M6.667.901h.845v24.213h-.845z"></path><circle fill="#B31941" cx="7.089" cy="6.926" r="6.827"></circle></g><g transform="translate(184.69 59.807)"><path fill="#931435" d="M10.037 11.642h.845v24.213h-.845z"></path><circle fill="#B31941" cx="10.459" cy="10.516" r="10.417"></circle></g></g></svg>
          <svg className='two' width="212" height="93" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -31)" fill="none" opacity=".6"><rect fill="#C11F3D" x="14.311" y="32.451" width="19.209" height="6.616" rx="3.308"></rect><rect fill="#C11F3D" x="165.943" y="48.731" width="11.338" height="6.616" rx="3.308"></rect><path d="M62.465 95.555H115.3v27.822H62.465V95.555zm149.313 28.424H.482l.14-.6h211.156v.6zM63.78 35.212h50.956v4.694H63.78v-4.694z" fill="#A81433" ></path><path fill="#880F2F" d="M114.736 35.212h26.043v4.694h-26.043z"></path><path fill="#880F2F" d="M114.736 39.905h22.808v83.474h-22.808z"></path><path fill="#B21737" d="M66.874 39.905h47.862v54.33H66.874z"></path><path fill="#880F2F" d="M57.587 90.017h57.15v6.292h-57.15z"></path><path d="M120.978 107.52h10.324v15.857h-10.324V107.52zm-3.426-58.042h17.176v3.471h-17.177v-3.471zm0 10.321h17.176v3.472h-17.177v-3.472zm0 10.325h17.176v3.47h-17.177v-3.47zm0 10.324h17.176v3.47h-17.177v-3.47z" fill="#A81433" ></path><path d="M73.353 49.478h34.722v3.471H73.353v-3.471zm0 10.321h34.722v3.472H73.353v-3.472zm0 10.324h34.722v3.472H73.353v-3.472zm0 10.325h34.722v3.47H73.353v-3.47z" fill="#880F2F" ></path><path fill="#A81433" d="M72.623 25.29h33.267v7.375H72.623z"></path><path d="M78.398 32.349h1.126v2.864h-1.126v-2.864zm20.595 0h1.126v2.864h-1.126v-2.864z" fill="#A81433" ></path><g transform="translate(5.912 63.749)"><circle fill="#B31941" cx="8.86" cy="8.829" r="8.801"></circle><path fill="#931435" d="M8.362 17.63h.565v14.283h-.565z"></path></g><g transform="translate(30.125 59.243)"><path fill="#931435" d="M10.172 12.205h.845v24.213h-.845z"></path><circle fill="#B31941" cx="10.454" cy="10.516" r="10.417"></circle></g><g transform="translate(151.187 70.224)"><path fill="#931435" d="M6.667.901h.845v24.213h-.845z"></path><circle fill="#B31941" cx="7.089" cy="6.926" r="6.827"></circle></g><g transform="translate(184.69 59.807)"><path fill="#931435" d="M10.037 11.642h.845v24.213h-.845z"></path><circle fill="#B31941" cx="10.459" cy="10.516" r="10.417"></circle></g></g></svg>
          <h1>Hotel's made Simple, Stays made memorable</h1>
          <div className="searchbar">
            <div className="name_search">
              <i className="ri-search-line"></i>
              <input 
                value={hotelName}
                onChange={handleNameSearch} 
                placeholder="Search hotels...."
                type="text"
              />
              {
                filteredHotelName.length > 0 && (
                  <div className="search_results_box">
                    {
                      filteredHotelName.map((name , index)=>( 
                        <div
                          onClick={()=>{setHotelName(name.hotel_name);setFilteredHotelName([])}}
                         key={index} className="searched_results">
                          {name.hotel_name}
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
            <div className="location_search">
              <i className="ri-map-pin-line"></i>
              <input
                placeholder="Search location..."
                type="text"
                value={searchText}
                onChange={handleSearch}
              />
              {filteredResults.length > 0 && (
                <div className="search_results_box">
                  {filteredResults.map((location, index) => (
                    <div className="searched_results" key={index} onClick={() => {setSearchText(location.hotel_location); setFilteredResults([])}}>
                      {location.hotel_location}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="guest_selection">
              <i className="ri-user-3-line"></i>
              <input onChange={(e) => setGuestCount(e.currentTarget.value)} value={guest_count} maxLength={2} min={1} placeholder="Guest Count" type="number" />
            </div>
            <button onClick={sendData} className="search_btn">
              <i className="ri-search-line"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="essentials">
        <div className="nuby_text_essentials">
          <h3>Nuby Essentials</h3>
          <p style={{ marginTop: "5px", color: "dimgrey" }}>Features in NUBY</p>
        </div>
        <div className="features">
          <div className="tv">
            <i className="ri-tv-2-line"></i>
            <p>TV</p>
          </div>
          <div className="reception">
            <i className="ri-group-line"></i>
            <p>24/7 Reception</p>
          </div>
          <div className="wifi">
            <i className="ri-wifi-line"></i>
            <p>Free Wifi</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
