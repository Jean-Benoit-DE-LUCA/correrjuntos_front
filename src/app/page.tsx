"use client";

import { SyntheticEvent, useContext, useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { RaceInterface, UserContext, UtilsContext } from "./container";
import BackButton from "../../components/BackButton/page";

import runnerIcon from "../../public/assets/pictures/runner-icon.svg";
import quoteImg from "../../public/assets/pictures/quote.svg";
import arrowLeftCarousel from "../../public/assets/pictures/arrow-left-carousel.svg";
import arrowRightCarousel from "../../public/assets/pictures/arrow-right-carousel.svg";


import testimonial_0 from "../../public/assets/pictures/testimonial_0.jpg";
import testimonial_1 from "../../public/assets/pictures/testimonial_1.jpg";
import testimonial_2 from "../../public/assets/pictures/testimonial_2.jpg";

export default function App() {


  // TESTIMONIAL DATA //

  const [dataTestimonial, setDataTestimonial] = useState({
    "0": {
      picture: testimonial_0,
      name: "Juan Martínez",
      title: "Estudiante",
      content: "¡Una experiencia increíble! Participé en una de las carreras organizadas por el sitio y quedé impresionado por el ambiente de camaradería y apoyo mutuo entre los corredores."
    },

    "1": {
      picture: testimonial_1,
      name: "Andrea López",
      title: "Secretaria",
      content: "Quiero agradecer al equipo detrás de este sitio por crear un espacio donde los corredores pueden unirse, compartir experiencias y motivarse mutuamente. Desde que me uní, he encontrado amigos que comparten mi amor por correr y juntos hemos alcanzado metas que nunca pensé posibles."
    },

    "2": {
      picture: testimonial_2,
      name: "Carlos Sánchez",
      title: "Profesor de Educación Física",
      content: "Como profesor de educación física, siempre estoy buscando formas de motivar a mis alumnos a mantenerse activos. Este sitio ha sido una herramienta para conectar con otros amantes del running y compartir experiencias inspiradoras."
    },
  });






  // CLICK ARROW CAROUSEL //

  const handleClickArrowCarousel = (e: SyntheticEvent, direction: string) => {

    const divUserElement = (document.getElementsByClassName("testimonials--div--carousel--user--div") as HTMLCollectionOf<HTMLDivElement>);

    if (direction == "right") {

      for (let i = 0; i < divUserElement.length; i++) {

        if (divUserElement[i].classList.contains("active")) {

          if (divUserElement[i+1] !== undefined) {

            divUserElement[i].classList.remove("active");
            divUserElement[i].classList.add("active_left");

            divUserElement[i+1].classList.add("active");

            break;
          }
        }
      }
    }


    if (direction == "left") {

      for (let i = 0; i < divUserElement.length; i++) {

        if (divUserElement[i].classList.contains("active")) {

          if (i !== 0) {

            divUserElement[i].classList.remove("active");
            divUserElement[i].classList.remove("active_left");

            divUserElement[i-1].classList.remove("active_left");
            divUserElement[i-1].classList.add("active");
            break;
          }
        }
      }
    }
  };







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

                if (entry.target.className == "welcome--text--span") {

                  entry.target.classList.add("active");
                }

                else if (entry.target.className.includes("main--div--ul--last--races--anchor")) {

                  entry.target.classList.add("active");
                }

                else {

                  entry.target.classList.add("scroll--animation--active");
                }
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
    observerFunction("welcome--text--span");
    
    //observerFunction("main--div--ul--last--races--anchor");

    userContext.message.length > 0 ? setMessageTrueFalse(true) : setMessageTrueFalse(false);

    if (userContext.message.length > 0) {

      document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
    }

    setTimeout(() => {
      userContext.setMessage("");
      setMessageTrueFalse(false);
    }, 3000);

    
  }, []);




  // set active to first testimonial //

  useEffect(() => {
    const divUserElement = (document.getElementsByClassName("testimonials--div--carousel--user--div") as HTMLCollectionOf<HTMLDivElement>);

    divUserElement[0].classList.add("active");
  }, []);



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
        <div className="main--div--video--title" onMouseOver={handleMouseOverDivVideo} onTouchEnd={handleMouseOverDivVideo}>
            <span className="main--div--video--title--span--one">¿Correr solo?</span>
            <span className="main--div--video--title--span--two">¡No!</span>
        </div>
      </div>

      <div className="main--div--video">
        
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

        <div className="legend--div">

          <span className="legend--title">Nivel</span>

          <div className="legend--div--section">
            <span className="legend--low--span--label">Bajo</span>
            <span className="legend--low--span--color low"></span>
          </div>

          <div className="legend--div--section">
            <span className="legend--low--span--label">Medio</span>
            <span className="legend--low--span--color mid"></span>
          </div>

          <div className="legend--div--section">
          <span className="legend--low--span--label">Alto</span>
            <span className="legend--low--span--color high"></span>
          </div>
        </div>


        <ul className="main--div--ul--last--races">

        {getLastRaces !== undefined ?

          Object.keys(getLastRaces).map( (elem, ind) =>

            <Link key={ind} href={`/races/${(getLastRaces as any)[elem].id}`} className={`main--div--ul--last--races--anchor active ${(getLastRaces as any)[elem].raceLevel == "bajo" ? "low--level" : (getLastRaces as any)[elem].raceLevel == "medio" ? "mid--level" : (getLastRaces as any)[elem].raceLevel == "alto" ? "high--level" : ""}`}>

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
                          className="male--icon"
                          alt="male-icon"
                          src="../assets/pictures/male-icon.svg"
                          width={15}
                          height={15}
                        />

                    : (getLastRaces as any)[elem].onlyFemale == "yes" ?

                        <Image
                          className="male--icon"
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

      <div className="main--div--welcome--text">

        <p className="welcome--text">
          <span className="welcome--text--span">
            <Image
              className="runner--icon--img right"
              src={runnerIcon}
              alt="runner-icon"
              height={25}
              width={25}
            />
            ¿Estás listo para sentir la adrenalina de correr en grupo? En nuestro sitio, nos encargamos de reunir a los amantes del running para que disfruten de su pasión juntos. Porque correr es más divertido cuando lo haces en compañía, ¿no crees?
          </span>

          <span className="welcome--text--span">
            <Image
              className="runner--icon--img left"
              src={runnerIcon}
              alt="runner-icon"
              height={25}
              width={25}
            />
            Así que despreocúpate y únete a nosotros para correr sin preocupaciones. Además, ¿qué mejor manera de mantenernos activos y en forma que compartir kilómetros con amigos?
          </span>

          <span className="welcome--text--span">
            <Image
              className="runner--icon--img right"
              src={runnerIcon}
              alt="runner-icon"
              height={25}
              width={25}
            />
            Así que, ¿a qué esperas? Únete a nuestra comunidad y prepárate para correr, sudar y reír juntos en cada paso del camino. ¡Nos vemos en la pista!
          </span>
        </p>


      </div>




      <div className="main--div--picture--wrap">
        <div className="main--div--picture scroll--animation--left">

            <span className="container--text six">Apoyo</span>

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

            <span className="container--text five">Entrenamiento</span>

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


      <section className="testimonials--section">

        <h2 className="testimonials--title">Testimonios</h2>

        <div className="testimonials--div--carousel--wrap">

          

            <div className="testimonials--div--carousel">

              <Image
                className="testimonials--img--quote"
                src={quoteImg}
                alt="quote-image"
                height={30}
                width={30}
              />
              <Image
                className="testimonials--img--arrow--left"
                src={arrowLeftCarousel}
                alt="img-arrow-left"
                height={0}
                width={0}
                onClick={(e) => handleClickArrowCarousel(e, "left")}
              />
              <Image
                className="testimonials--img--arrow--right"
                src={arrowRightCarousel}
                alt="img-arrow-right"
                height={0}
                width={0}
                onClick={(e) => handleClickArrowCarousel(e, "right")}
              />

              <div className="testimonials--div--carousel--user--div--wrap--wrap">

                <div className="testimonials--div--carousel--user--div--wrap">


                  {Object.keys(dataTestimonial).map( (elem, ind) =>
                    <div className="testimonials--div--carousel--user--div" key={ind}>

                        <div className="testimonials--div--carousel--user--div--img--div">
                          <Image
                            className="testimonials--img--user"
                            src={(dataTestimonial as any)[elem].picture}
                            alt="img-user-testimonial"
                            height={0}
                            width={0}
                          />
                        </div>

                        <div className="testimonials--div--wrap--details">
                          <span className="testimonials--span--name">{(dataTestimonial as any)[elem].name}</span>

                          <span className="testimonials--span--title">{(dataTestimonial as any)[elem].title}</span>

                          <div className="testimonials--div--content">

                            <p className="testimonials--div--content--p">
                              {(dataTestimonial as any)[elem].content}
                            </p>

                          </div>
                        </div>

                    </div>
                  )}
                </div>

              </div>
              
            </div>
          
        </div>

      </section>
    </main>
  );
}
