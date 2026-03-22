import Clock from "./components/Clock";
import Cities from "./components/Cities";
import Sites from "./components/Sites";
import Translate from "./components/Translate";
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

      <div className="dream-team df-sp-fs w-100p">
        <div className="dream-team__left">
          <Cities />
          <Clock />
          <Sites />
        </div>
        <div className="dream-team__right">
          <Translate />
          <Links />
        </div>
        <Search />
        {/* <Links /> */}
      </div>
    </div>
  );
}