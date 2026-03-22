import Clock from "./components/Clock";
import Cities from "./components/Cities";
import Search from "./components/Search";
import Links from "./components/Links";

// pictures
import bg1 from "./assets/img/dream-team-bg-01.jpg";
import bg2 from "./assets/img/dream-team-bg-02.jpg";
const backgrounds = [bg1, bg2];

// get random num image from array
import { getRandomItem } from "./utils/getRandomItem";
const randomBg = getRandomItem(backgrounds);

export default function App() {
  return (
    <div className="container">
      <div className="background" style={{backgroundImage: `url(${randomBg})`}}></div>

      <div className="content">
        <Cities />
        <Clock />
        <Search />
        <Links />
      </div>
    </div>
  );
}