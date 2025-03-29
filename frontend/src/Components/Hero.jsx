import { useState } from "react";
import axios from "axios";
import "../CSS/hero.css";

const Hero = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/job/search", {
        params: { query: query.trim(), location: location.trim() },
      });
      onSearchResults(response.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to fetch jobs. Please try again!");
    }
  };
  
  

  return (
    <header className="header">
      <h1>
        Find digital <span className="highlight">freelance</span> <br />
        and <span className="highlight">full-time</span> jobs <br />
        now!
      </h1>
      <p className="para">
        Glumos is your one-stop center for thousands <br /> of digital freelance and full-time jobs.
      </p>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search a Job"
          className="job"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Location"
          className="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </header>
  );
};

export default Hero;
