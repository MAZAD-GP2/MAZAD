import React from 'react'
import Navbar from './Navbar'
import Card from './Card'

const Home = () => {

  const auctionCount = 18; // simulate card loading
  const cards = Array.from({ length: auctionCount }, (_, index) => (
    <Card key={index} />
  ));

  return (
    <>
			<Navbar/>
      <div className='d-flex flex-row flex-wrap gap-5 p-lg-5'>
        {cards}
      </div>
    </>
  )
}

export default Home