"use client";

import { useContext, useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { RaceInterface, UserContext, UtilsContext } from "./layout";
import BackButton from "../../components/BackButton/page";

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
    onlyMale: "",
    onlyFemale: "",
    raceDate: "",
    raceDuration: "",
    raceTime: "",
    userId: NaN,
  });

  const [getCountUsersParticipate, setCountUsersParticipate] = useState({});

  const userContext = useContext(UserContext);
  const utilsContext = useContext(UtilsContext);

  const fetchLastRaces = async () => {
    const response = await fetch("http://localhost:8080/api/race/getlastraces");
    const responseData = await response.json();
    console.log(responseData);

    const newObj = Object.assign({}, responseData.fetchLastRaces.lastRaces);
    const newObjCount = Object.assign({}, responseData.fetchCountUsersParticipate);

    const objFiltered: any = {};

    Object.keys(newObjCount).forEach( elemCount => {

      Object.keys(newObj).forEach( (elemRace, ind) => {

        if (newObj[elemRace].id == newObjCount[elemCount].id) {

          newObj[elemRace]["numberUsersRegistered"] = newObjCount[elemCount].number_users_registered;
        }
      });
    });

    setLastRaces(newObj);
    setCountUsersParticipate(objFiltered);
  };

  const handleMouseOverDivVideo = (e: any) => {
      
      const video = (document.getElementsByClassName("main--div--video--video")[0] as HTMLVideoElement);
      const videoSource = (document.getElementsByClassName("main--div--video--video--source")[0] as HTMLSourceElement);
      const spanOne = (document.getElementsByClassName("main--div--video--title--span--one")[0] as HTMLSpanElement);
      const spanTwo = (document.getElementsByClassName("main--div--video--title--span--two")[0] as HTMLSpanElement);

      if (videoSource.src.substring(videoSource.src.lastIndexOf("/") + 1, videoSource.src.lastIndexOf(".")) == "runner_beach") {
          
          spanOne.textContent = "¿Correr juntos?";
          spanTwo.textContent = "¡Sí!"
          videoSource.src = "http://localhost:8080/videos/runner_both.mp4";
          video.load();
      }

      else if (videoSource.src.substring(videoSource.src.lastIndexOf("/") + 1, videoSource.src.lastIndexOf(".")) == "runner_both") {
          
          spanOne.textContent = "¿Correr solo?";
          spanTwo.textContent = "¡No!"
          videoSource.src = "http://localhost:8080/videos/runner_beach.mp4";
          video.load();
      }

  };

  const observerFunction = ( elem: string ) => {

    const elementsToAnimate = document.getElementsByClassName(elem);

    const observer = new IntersectionObserver( entries => {

        entries.forEach( entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("scroll--animation--active");
            }

            else {

                entry.target.classList.remove("scroll--animation--active");
            }
        });


    }, {
        rootMargin: "-15%"
    });

    Array.from(elementsToAnimate).forEach( element => observer.observe(element));
  }

  useEffect(() => {
    utilsContext.setBackButton(window.location.pathname);
    fetchLastRaces();
    observerFunction("scroll--animation--left");
    observerFunction("scroll--animation--right");

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

console.log(getLastRaces);

  return (
    <main className="main">

      <BackButton pathname={utilsContext.backButton}/>

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
      <div className="main--div--video--title--wrap">
        <div className="main--div--video--title">
            <span className="main--div--video--title--span--one">¿Correr solo?</span>
            <span className="main--div--video--title--span--two">¡No!</span>
        </div>
      </div>

      <div className="main--div--video" onMouseOver={handleMouseOverDivVideo} onTouchEnd={handleMouseOverDivVideo}>
        
        <video className="main--div--video--video" autoPlay muted loop>
          <source className="main--div--video--video--source" src="http://localhost:8080/videos/runner_beach.mp4" type="video/mp4" />
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

            <Link key={ind} href={`/races/${(getLastRaces as any)[elem].id}`} className={`main--div--ul--last--races--anchor ${(getLastRaces as any)[elem].raceLevel == "bajo" ? "low--level" : (getLastRaces as any)[elem].raceLevel == "medio" ? "mid--level" : (getLastRaces as any)[elem].raceLevel == "alto" ? "high--level" : ""}`}>

              <li className="main--div--ul--last--races--li">

                <span className="main--div--ul--last--races--li--id--race">{(getLastRaces as any)[elem].id}</span>

                <span className="main--div--ul--last--races--span--city">{(getLastRaces as any)[elem].city}</span>

                <div className="main--div--ul--last--races--date--time--wrap">
                  <span className="main--div--ul--last--races--span--race--date">{(getLastRaces as any)[elem].raceDate}</span>
                  
                  <span className="main--div--ul--last--races--span--race--time">{
                  (getLastRaces as any)[elem].raceTime !== undefined ?
                  (getLastRaces as any)[elem].raceTime.substring(0, (getLastRaces as any)[elem].raceTime.lastIndexOf(":"))
                  : <>
                  </>
                  }
                  </span>
                </div>
                  

                  <div className="wrap--users--sex">
                    <span className="span--number--users--registered">
                      {(getLastRaces as any)[elem].numberUsersRegistered}
                        /
                      {(getLastRaces as any)[elem].numberUsers == -1 ? 
                        <Image
                        className="infinite--img"
                        alt="infinite-icon"
                        src="../assets/pictures/infinite-icon.svg"
                        width={15}
                        height={15}
                        /> 
                        
                        : 
                        
                        (getLastRaces as any)[elem].numberUsers
                      }
                    </span>
                    
                    { (getLastRaces as any)[elem].onlyMale == "yes" ?

                        <Image
                          className="male-icon"
                          alt="male-icon"
                          src="../assets/pictures/male-icon.svg"
                          width={15}
                          height={15}
                        />

                    : (getLastRaces as any)[elem].onlyFemale == "yes" ?

                        <Image
                          className="male-icon"
                          alt="male-icon"
                          src="../assets/pictures/female-icon.svg"
                          width={15}
                          height={15}
                        />

                    : 
                      
                        <div className="image--simulate">

                        </div>
                    }

                  </div>
              </li>
            </Link>)
         :
        <>
        </>
        }
        </ul>
      </div>
      <div className="main--div--picture--wrap">
        <div className="main--div--picture scroll--animation--left">

            <div className="main--div--picture--wrap--img">
                <Image
                    className="main--div--picture--img"
                    width={0}
                    height={0}
                    src="http://localhost:8080/pictures/runner_search.jpg"
                    alt="runner_search"
                    unoptimized={true}
                />
            </div>

            <div className="main--div--picture--text">

                <p className="main--div--picture--text--p">
                ¡Busca carreras cerca de ti, regístrate y sal a correr!
                Y si no encuentras nada, regístra una nueva carrera, seguro
                que alguien correrá contigo.
                </p>
            </div>

        </div>

        <div className="main--div--picture scroll--animation--right">

            <div className="main--div--picture--wrap--img">
                <Image
                    className="main--div--picture--img"
                    width={0}
                    height={0}
                    src="http://localhost:8080/pictures/runner_talk.jpg"
                    alt="runner_search"
                    unoptimized={true}
                />
            </div>

            <div className="main--div--picture--text">

                <p className="main--div--picture--text--p">
                Participa en carreras, comunica con otros participantes a través de la mensajeria para afinar los últimos detalles.
                </p>
            </div>

        </div>
      </div>
    </main>
  );
}
