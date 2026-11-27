import Navbar from "../components/layout/Navbar";
import Hero from "../components/Hero";
import ItinerariosDestacados from "../features/descubrir/components/ItinerariosDestacados";
import Explorador from "./Explorador";

const HomePage = () => {
    return (
    <>
    <Navbar />
    <Hero />
    <ItinerariosDestacados />
    <Explorador />
    </>
    );
}
export default HomePage
