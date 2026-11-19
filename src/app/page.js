import React from 'react'
import Hero from './components/Hero'
import ServicesSection from './components/ServiceSection'
import HowItWorks from './components/HowItWorks'
import WhyChooseUs from './components/WhyChose'
import CTASection from './components/CTASection'

const page = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <WhyChooseUs />
      <CTASection />
    </div>
  )
}

export default page