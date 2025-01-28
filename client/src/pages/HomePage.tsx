import  { useRef } from 'react';
import Navbar from '../components/homePage/components/Navbar';

import Categories from '../components/homePage/components/Categories';
import Footer from '../components/homePage/components/Footer';
import { Steps } from '../components/homePage/components/Steps';

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar refs={{ hero: heroRef, categories: categoriesRef, steps: stepsRef }} />
      <div ref={stepsRef}>
        <Steps />
      </div>
      <div ref={categoriesRef}>
        <Categories />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
