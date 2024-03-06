import React, { useState } from 'react';


function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Username: ${username}, Password: ${password}`);
  }

  return (
    <div className="row d-flex justify-content-center">
      <h2>Sign Up</h2>
      <form className='form-group' method='post'>
        <div className='d-flex flex-column justify-content-start align-elements-center'>
          <label className='form-label '>Username: </label>
          <input className='form-control' type='text'></input>
          <label className='form-label'>Password: </label>
          <input className='form-control' type='password'></input>
          <label className='form-label'>Email: </label>
          <input className='form-control' type='text'></input>
          <label className='form-label'>Phone number: </label>
          <input className='form-control' type='text'></input>
        </div>
      </form>
    </div>
  );
}

export default Register;