import React from 'react'

const Card = ({item}) => {
  return (
    <div className="card shadow" style={{width: '15rem'}}>
        <img className="card-img-top" src="https://images.unsplash.com/photo-1700295278848-d4a5d11b2133?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Card image cap"/>
        <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <p className="card-text">{item.description}</p>
            <a href="#" className="btn btn-secondary ">Go somewhere</a>
        </div>
    </div>
  )
}

export default Card