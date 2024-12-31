import React from 'react'
import withAuth from '../../../backend/utils/authcomponent'

 function Homecomponent() {
  return (
    <div>
    <h2>this is home </h2>
    </div>
  )
}

export default withAuth(Homecomponent);