import "../CSS/hero.css"

const Hero = () => {
  return (
    <header className="header">
    <h1>
      Find digital <span className="highlight">freelance</span>  <br />and 
      <span className="highlight"> fulltime</span> jobs <br />
       now!
    </h1>
    <p className="para">
      Glumos is your one-stop centre for thousands <br /> of digital freelance and
      fulltime jobs.
    </p>
    <div className="search-box">
      <input type="text" placeholder="Search a Job" className="job" />
      <input type="text" placeholder="Your Location"  className="location"/>
      <button className="search-btn">Search</button>
    </div>
  </header>
  )
}

export default Hero