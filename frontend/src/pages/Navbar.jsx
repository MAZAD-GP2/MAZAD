import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar d-flex bg-primary bg-gradient pb-4 shadow navbar-expand-lg navbar-light bg-light mb-5 p-1">
    <h4 className='p-lg-3'>
      <i className="text-white user-select-none ">_MAZAD_</i>
    </h4>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

    <div className="collapse navbar-collapse d-flex flex-row justify-content-center p-lg-1 gap-2" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto"></ul>

      <form className="form-inline my-2 my-lg-0 w-50">
        <input className="form-control rounded-4 w-200 p-20" type="search" placeholder="Search Items, tags or categories" aria-label="Search" />
      </form>
      <button className="btn btn-secondary my-2 my-sm-0 rounded-4" type="submit">Search</button>
    </div>

    <div id='signup-container' className="d-flex">
      <a href='/login' style={{ color: '#F7CCAC', opacity: '90%' }} className='mx-2'>Log In</a>
      <a href='/register' style={{ color: '#F7CCAC', opacity: '90%' }} className='mx-2'>Sign Up</a>
    </div>

  </nav>
  )
}

export default Navbar