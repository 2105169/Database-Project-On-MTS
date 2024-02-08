import React from 'react';
import './Registration.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const Registration = () => {
  return (
    <div className='wrapper'>
        <form action="">
            <h1>Registration</h1>
            <div className="input-box">
                <input type="text" placeholder='First name' required/>
                <FaUser className='icon'/>
            </div>

            <div className="input-box">
                <input type="text" placeholder='Last name' required/>
                <FaUser className='icon'/>
            </div>

            <div className='accountType'>
            <label for="account">Account type: </label>
           
            <select name="account" id="account1">
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="institution">Institution</option>
            <option value="payment">Payment</option>
            <option value="paybill">Pay bill</option>
            <option value="remittance">Remittance</option>
            </select>
            </div>
            <div className="input-box">
                <input type="text" placeholder='NID' required/>
                
            </div>

            <div className="input-box">
                <input type="text" placeholder='Mobile number' required/>
                
            </div>

            <div className="input-box">
                <input type="text" placeholder='Email' required/>
                
            </div>

            <div className="input-box">
                <input type="text" placeholder='District' required/>
                
            </div>

            <div className="input-box">
                <input type="text" placeholder='Country' required/>
                
            </div>

            <div className="input-box">
                <input type="password" placeholder='Password' required/>
                <FaLock className='icon'/>
            </div>

            <div className="input-box">
                <input type="password" placeholder='Confirm password' required/>
                <FaLock className='icon'/>
            </div>

            <button type = 'submit'>Register</button>

        </form>
    </div>
  )
}

export default Registration