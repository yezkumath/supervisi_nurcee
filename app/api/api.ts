'use server';

//import { console } from "inspector";

export async function POST_TOKEN() {
    const url = 'https://geni.rs-elisabeth.com/authentication/create_token';
    
    try {
        const response = await fetch(url, {
            
            method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
             "username": process.env.API_USERNAME, 
             "password": process.env.API_PASSWORD
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }
  
        const data = await response.json();
        return data["X-Token"];
      }
      catch (error) {
        console.error("Error:", error);
        console.log("username", process.env.API_USERNAME)
        console.log("password", process.env.API_PASSWORD)
        return null;
      }
  }

  
  export async function POST_LOGIN(username:string, password:string) {
    const url = 'https://geni.rs-elisabeth.com/authentication/login';
    const passwordhash = btoa(password);
   // console.log("hash password",passwordhash);
    const token = await POST_TOKEN();
    
  if (!token) {
    console.log('No token available for POST_EMPLOYEE_BY_NIP');
    return null; 
  }
    
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "x-token": token
          }, 
          body: JSON.stringify({
            "username": username,
            "password": passwordhash,
            "app_id":"6",
            "device_id":"",
          }),
        });
        
        const data = await response.json();
      //  console.log(data);
        return data;
      
  }

  export async function GET_EMPLOYEE_BY_NIP(nip:string) {
    const url = `https://geni.rs-elisabeth.com/hr/employee/detail?nip=${nip}`;
    const token = await POST_TOKEN();
    
  if (!token) {
    console.log('No token available for POST_EMPLOYEE_BY_NIP');
    return null;
  }
    try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "x-token": token
          },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); 
          }
        const data = await response.json();
        return data["Data"];
      }
      catch (error) {
        console.error("Error:", error);
        return null;
      }
  }