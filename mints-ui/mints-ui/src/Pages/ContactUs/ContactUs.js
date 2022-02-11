import React from 'react'
import { Typography } from '@material-ui/core';

export default function ContactUs() {
  return (
    <div className="content">
      <div style={{paddingLeft: 50}}>
        <Typography variant="h5">Contact Us</Typography>
        <div style={{padding: 10, paddingLeft: 30}}>
          <Typography variant="h6">Phone</Typography>
          <div style={{padding: 10, paddingLeft: 30}}>
            <Typography variant="body1"><span>Main: +1-248-233-1100</span></Typography>
          </div>

          <Typography variant="h6">Email</Typography>
          <div style={{padding: 10, paddingLeft: 30}}>
            <Typography variant="body1">
                <span>Support: </span>
                <a href="mailto:supportmints@miraclesoft.com">supportmints@miraclesoft.com</a>
            </Typography>
            <Typography variant="body1">
                <span>General: </span>
                <a href="mailto:info@miraclesoft.com">info@miraclesoft.com</a>
            </Typography>
          </div>
          
          <Typography variant="h6">Address</Typography>
          <div style={{padding: 10, paddingLeft: 30}}>
            <Typography variant="body1">
                <span><b>Arkansas Branch</b></span>
            </Typography>
            <Typography variant="body1">
                <span>
                  Miracle Software Systems, Inc.
                  <br />
                  2601 North Walton
                  <br />
                  Blvd Bentonville, AR 72712
                </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}