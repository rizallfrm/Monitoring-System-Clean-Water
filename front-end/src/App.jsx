import './App.css'
import { Navigation } from './components/Navigation'
import {Hero} from './components/Hero'
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";


function App() {

  return (
    <div className='overflow-hidder w-full'>
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default App
