"use client";

import { useContext, useEffect, useState } from "react";

import Link from "next/link";

import { RaceInterface, UserContext } from "./layout";

export default function App() {

  const [messageTrueFalse, setMessageTrueFalse] = useState<boolean>(false);

  const [getLastRaces, setLastRaces] = useState<RaceInterface>({
    id: NaN,
    city: "",
    createdAt: "",
    furtherDetails: "",
    nameStreet: "",
    numberStreet: NaN,
    numberUsers: NaN,
    raceDate: "",
    raceDuration: "",
    raceTime: "",
    userId: NaN,
  });

  const userContext = useContext(UserContext);

  const fetchLastRaces = async () => {
    const response = await fetch("http://localhost:8080/api/race/getlastraces");
    const responseData = await response.json();
    console.log(responseData);

    const newObj = Object.assign({}, responseData.lastRaces);
    console.log(newObj);
    setLastRaces(newObj);
  };
  
  useEffect(() => {
    fetchLastRaces();

    userContext.message.length > 0 ? setMessageTrueFalse(true) : setMessageTrueFalse(false);

    if (userContext.message.length > 0) {

      document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
    }

    setTimeout(() => {
      userContext.setMessage("");
      setMessageTrueFalse(false);
    }, 3000);

    if (getLastRaces !== undefined) {
      console.log(getLastRaces);
    }
  }, []);
  

  return (
    <main className="main">

      {messageTrueFalse ?
        (

          <div className="error--div error--div--app active">
              <p className="error--div--p">
                {userContext.message}
              </p>
          </div>

        ) :

        <div className="error--div error--div--app">
            <p className="error--div--p">
              
            </p>
        </div>
      }

      <div className="main--div--video">
        <video className="main--div--video--video" autoPlay muted loop>
          <source src="http://localhost:8080/videos/runner_beach.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="main--div">

        <p className="main--div--p">
          ¿Te aburres de correr solo, necesitas un impulso de motivación? ¡Encuentra corredores cerca de ti y nunca más corras solo!
        </p>
      </div>

      <div className="main--div main--div--last--races">
        <h2 className="main--div--register--title title--last--race">Últimas carreras registradas</h2>
        <ul className="main--div--ul--last--races">

        {getLastRaces !== undefined ?

          Object.keys(getLastRaces).map( (elem, ind) => 
            
            <Link key={ind} href={`/races/${(getLastRaces as any)[elem].id}`} className="main--div--ul--last--races--anchor">
              <li className="main--div--ul--last--races--li">
                <span className="main--div--ul--last--races--span--city">{(getLastRaces as any)[elem].city}</span>
                <div className="main--div--ul--last--races--date--time--wrap">
                  <span className="main--div--ul--last--races--span--race--date">{(getLastRaces as any)[elem].raceDate}</span>
                  <span className="main--div--ul--last--races--span--race--time">{(getLastRaces as any)[elem].raceTime}</span>
                </div>
              </li>
            </Link>)
         :
        <>
        </>
        }
        </ul>
      </div>
    </main>
  );
}
