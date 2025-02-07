import React from 'react'

const NotFound = () => {
  return (
      <div style={{height:"400px",display:"flex",alignItems:"center",justifyContent:"center"}} className='product-not-found'>
        <div style={{textAlign:"center"}}>
          <h2 style={{marginBottom:"10px"}}>Requested item not found</h2>
          <p style={{marginBottom:"10px"}}>We're sorry for your inconvinience!</p>
          <i style={{fontSize:"70px"}} className="ri-search-line"></i>
        </div>
      </div>
  )
}

export default NotFound
