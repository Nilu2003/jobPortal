import Hero from"../Components/Hero"
import LatestJob from "../Components/LatestJob"

const Home = () => {
  return (
    <>
    <Hero />
    <h2 style={{ textAlign: "center", marginTop: "20px" }}>Latest Job Openings</h2>
    <LatestJob />
    </>
  )
}

export default Home