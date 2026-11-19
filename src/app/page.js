import React from 'react'
import Hero from './components/Hero'
import ServicesSection from './components/ServiceSection'
import HowItWorks from './components/HowItWorks'

const page = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <HowItWorks />
    </div>
  )
}

export default page