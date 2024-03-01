"use client";

import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { RaceInterface, UserContext, UtilsContext } from "../container";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BackButton from "../../../components/BackButton/page";
import Loader from "../../../components/Loader/page";

export default function MyRaces() {

    const router = useRouter();

    const [getRacesByUser, setRacesByUser] = useState<RaceInterface>({
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

    const [copyGetRacesByUser, setCopyRacesByUser] = useState<RaceInterface>({
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
    
    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);


    const [countError, setCountError] = useState<number>(0);

    useEffect(() => {

        const divError = (document.getElementsByClassName("error--div")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);

        if ((sessionStorage.getItem("error") !== null && (sessionStorage.getItem("error") as string).length > 0)) {

            setTimeout(() => {

                sessionStorage.removeItem("error");
            }, 500);
            

            if (divError !== undefined) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                divErrorPelement.textContent = "Error de autenticación, conéctate de nuevo.";
                divError.classList.add("active");
            }
        }
    }, [countError]);

    const fetchRacesByUser = async () => {


        if (userContext.getUserData.email.length !== 0) {



            const response = await fetch(`http://localhost:8080/api/race/getracesbyuser/${userContext.getUserData.email}/${userContext.getUserData.id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                }
            });
            const responseData = await response.json();

            if (responseData.hasOwnProperty("response")) {

                if (responseData.response.hasOwnProperty("response")) {

                    if (responseData.response.response.hasOwnProperty("error")) {

                        setTimeout(() => {

                            setIsLoading(false);

                            sessionStorage.setItem("error", "Error de autenticación, conéctate de nuevo.");

                            setCountError(countError + 1);
                        }, 1500);
                    }
                }
            }

            const newObj = Object.assign({}, responseData.racesUser);
            const newObjCount = Object.assign({}, responseData.fetchCountUsersParticipate);

            const objFiltered: any = {};

            Object.keys(newObjCount).forEach( elemCount => {

                Object.keys(newObj).forEach( (elemRace, ind) => {

                    if (newObj[elemRace].id == newObjCount[elemCount].id) {

                    newObj[elemRace]["number_users_registered"] = newObjCount[elemCount].number_users_registered;
                    }
                });
            });

            setRacesByUser(newObj);
            setCopyRacesByUser(newObj);
        }
    };







    // START WITH ALL RACES ON FIRST RENDER //

    const [countButtonAll, setCountButtonAll] = useState<number>(0);

    useEffect(() => {

        const filterButtonAll = (document.getElementsByClassName("filter--button all")[0] as HTMLButtonElement);
        
        if (filterButtonAll !== undefined) {

            filterButtonAll.click();
        }
        
    }, [countButtonAll]);



    // CLICK BUTTON FILTER //


    const handleClickButtonFilterMyRaces = (e: SyntheticEvent) => {

            
        // on click -> remove all active anchor //

        const anchorRaceElements = (document.getElementsByClassName("main--div--ul--last--races--anchor") as HTMLCollectionOf<HTMLAnchorElement>);

        for (let i = 0; i < anchorRaceElements.length; i++) {

            anchorRaceElements[i].classList.remove("active");
        }






        const dataButton = (e.currentTarget as HTMLButtonElement).getAttribute("data-button");

        const filterButtons = (document.getElementsByClassName("filter--button") as HTMLCollectionOf<HTMLButtonElement>);

        // on click -> remove all active buttons //

        for (let i = 0; i < filterButtons.length; i++) {

            filterButtons[i].classList.remove("active");
        }



        // add active on click button //

        (e.currentTarget as HTMLButtonElement).classList.add("active");




        // filter races //

        const currentDate = new Date();

        const year = currentDate.getFullYear();
        let month: number | string = currentDate.getMonth();
        if (Number(month) < 10) {

            month = "0" + month;
        }

        let day: number | string = currentDate.getUTCDate();
        if (Number(day) < 10) {

            day = "0" + day
        }

        const currentDateFormat = year + "-" + month + "-" + day;
        




        if (dataButton == "all") {

            setRacesByUser(copyGetRacesByUser);
        }

        else if (dataButton == "past") {

            const pastObj: any = {};

            Object.keys(copyGetRacesByUser).forEach(elem => {

                if ((copyGetRacesByUser as any)[elem].race_date <= currentDateFormat) {

                    pastObj[elem] = ((copyGetRacesByUser as any)[elem]);
                }
            });

            setRacesByUser(pastObj);
        }

        else if (dataButton == "future") {

            const pastObj: any = {};

            Object.keys(copyGetRacesByUser).forEach(elem => {

                if ((copyGetRacesByUser as any)[elem].race_date > currentDateFormat) {

                    pastObj[elem] = ((copyGetRacesByUser as any)[elem]);
                }
            });

            setRacesByUser(pastObj);
        }




        // set active to new race list anchor //

        setTimeout(() => {

            let countTimeout = 50;

            for (let i = 0; i < anchorRaceElements.length; i++) {

                setTimeout(() => {

                    anchorRaceElements[i].classList.add("active");
                }, countTimeout);

                countTimeout += 20;
                
            }
        }, 50);
    };


    const [countFetchRacesByUser, setCountFetchRacesByUser] = useState<number>(0);

    useEffect(() => {

        // re render component if user comes from external url -> set cookie user root layout //

        setCountFetchRacesByUser(countFetchRacesByUser + 1);
    }, []);



    useEffect(() => {

        utilsContext.setBackButton(window.location.pathname);

        fetchRacesByUser();

        setTimeout(() => {

            if (userContext.getUserData.email.length == 0) {
                userContext.setMessage("Debes autenticarte para acceder a esta zona.");
                router.push("/");
            }

            else {
                setIsLoading(false);

                setCountButtonAll(countButtonAll + 1);
            }
        }, 1500);

    }, [countFetchRacesByUser]);



    const [isLoading, setIsLoading] = useState<boolean>(true);

    if (isLoading) {

        return <Loader />
    }

    if (!isLoading) {
    
        return (
            <main className="main">

                <BackButton pathname={utilsContext.backButton}/>

                <div className="main--div my--races">

                    <div className="error--div myraces">
                        <p className="error--div--p">

                        </p>
                    </div>

                    <p className="main--div--p">Mis carreras</p>

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

                    <span className="total--my--races">Total: {Object.keys(getRacesByUser).length}</span>

                    <div className="my--races--div--filter">

                        <button className="filter--button past" type="button" data-button="past" onClick={handleClickButtonFilterMyRaces}>Pasadas</button>
                        <button className="filter--button all active" type="button" data-button="all" onClick={handleClickButtonFilterMyRaces}>Todas</button>
                        <button className="filter--button future" type="button" data-button="future" onClick={handleClickButtonFilterMyRaces}>Próximas</button>

                    </div>

                    <ul className="main--div--ul--last--races">

                        {getRacesByUser !== undefined ?

                        Object.keys(getRacesByUser).map( (elem, ind) =>

                            <Link key={ind} href={`/races/${(getRacesByUser as any)[elem].id}`} className={`main--div--ul--last--races--anchor ${(getRacesByUser as any)[elem].race_level == "bajo" ? "low--level" : (getRacesByUser as any)[elem].race_level == "medio" ? "mid--level" : (getRacesByUser as any)[elem].race_level == "alto" ? "high--level" : ""}`}>

                                <li className="main--div--ul--last--races--li">

                                    <span className="main--div--ul--last--races--li--id--race">{(getRacesByUser as any)[elem].id}</span>

                                    <span className="main--div--ul--last--races--span--city">{(getRacesByUser as any)[elem].city}</span>

                                    <div className="main--div--ul--last--races--date--time--wrap">
                                        <span className="main--div--ul--last--races--span--race--date">{(getRacesByUser as any)[elem].race_date}</span>

                                        <span className="main--div--ul--last--races--span--race--time">{(getRacesByUser as any)[elem].race_time !== undefined ?(getRacesByUser as any)[elem].race_time.substring(0, (getRacesByUser as any)[elem].race_time.lastIndexOf(":")) : ""}</span>
                                    </div>

                                    <div className="wrap--users--sex">
                                        <span className="span--number--users--registered">
                                        {(getRacesByUser as any)[elem].number_users_registered}
                                            /
                                        {(getRacesByUser as any)[elem].number_users == -1 ? 
                                            <Image
                                            className="infinite--img"
                                            alt="infinite-icon"
                                            src="../assets/pictures/infinite-icon.svg"
                                            width={15}
                                            height={15}
                                            /> 
                                            
                                            : 
                                            
                                            (getRacesByUser as any)[elem].number_users
                                        }
                                        </span>
                            
                                        { (getRacesByUser as any)[elem].only_male == "yes" ?

                                            <Image
                                            className="male--icon"
                                            alt="male-icon"
                                            src="../assets/pictures/male-icon.svg"
                                            width={15}
                                            height={15}
                                            />

                                        : (getRacesByUser as any)[elem].only_female == "yes" ?

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
            </main>
        );
    }
}