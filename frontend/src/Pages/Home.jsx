import { useState } from "react";
import Hero from "../Components/Hero";
import LatestJob from "../Components/LatestJob";

const Home = () => {
  const [jobs, setJobs] = useState([]);

  return (
    <>
      <Hero onSearchResults={setJobs} />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        {jobs.length > 0 ? "Search Results" : "Latest Job Openings"}
      </h2>
      <LatestJob jobs={jobs} />
    </>
  );
};

export default Home;
