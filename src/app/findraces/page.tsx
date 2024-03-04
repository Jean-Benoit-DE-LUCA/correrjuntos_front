"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import BackButton from "../../../components/BackButton/page";
import { RaceInterface, UserContext, UtilsContext } from "../container";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export default function FindRaces() {

    const router = useRouter();

    const utilsContext = useContext(UtilsContext);
    const userContext = useContext(UserContext);



    const [fetchRaces, setFetchRaces] = useState<any>([]);

    const handleClickCheckBoxEvery = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.id.includes("first--checkbox")) {

            const inputDateStart = (document.getElementsByClassName("main--div--register--form--input--birthdate--start")[0] as HTMLInputElement);
            const inputDateEnd = (document.getElementsByClassName("main--div--register--form--input--birthdate--end")[0] as HTMLInputElement);
            const andElement = (document.getElementsByClassName("main--div--register--form--label birthdate")[0] as HTMLLabelElement);

            if (e.target.checked) {

                inputDateStart.classList.add("active");
                inputDateEnd.classList.add("active");
                andElement.classList.add("active");
            }

            else if (!e.target.checked) {

                inputDateStart.classList.remove("active");
                inputDateEnd.classList.remove("active");
                andElement.classList.remove("active");
            }
        }

        else if (e.target.id.includes("second--checkbox")) {

            const divHourBox = (document.getElementsByClassName("main--form--findrunners--hour--box")[0] as HTMLDivElement);

            if (e.target.checked) {

                divHourBox.classList.add("active");
            }

            else if (!e.target.checked) {

                divHourBox.classList.remove("active");
            }
        }


    };

    const handleSearchRaces = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const idRace = (document.getElementsByClassName("main--div--register--form--input--id--race")[0] as HTMLInputElement);
        
        const city = (document.getElementsByClassName("main--div--register--form--input--city")[0] as HTMLInputElement);
        const user = (document.getElementsByClassName("main--div--register--form--input--user")[0] as HTMLInputElement);

        const dateStart = (document.getElementsByClassName("main--div--register--form--input--birthdate--start")[0] as HTMLInputElement);
        const dateEnd = (document.getElementsByClassName("main--div--register--form--input--birthdate--end")[0] as HTMLInputElement);
        const allDatesCheckBox = (document.getElementById("main--div--register--form--input--every--date--first--checkbox") as HTMLInputElement);

        const hourStart = (document.getElementsByClassName("main--div--register--form--input--hour--start")[0] as HTMLSelectElement);
        const hourEnd = (document.getElementsByClassName("main--div--register--form--input--hour--end")[0] as HTMLSelectElement);
        const allHoursCheckBox = (document.getElementById("main--div--register--form--input--every--date--second--checkbox") as HTMLInputElement);


        const divError = (document.getElementsByClassName("error--div")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);



        const divResultRaces = (document.getElementsByClassName("main--div my--races")[0] as HTMLDivElement);



        // reset list races //

        setFetchRaces([]);





        // if race number typed //


        if (idRace.value.length > 0) {

            const response = await fetch(`http://localhost:8080/api/race/search`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                },
                body: JSON.stringify({
                    race_id: idRace.value
                })
            });

            const responseData = await response.json();

            

            if (responseData.hasOwnProperty("error")) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
    
                document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                divErrorPelement.textContent = `Carrera #${idRace.value} no encontrada.`;
                divError.classList.add("active");
    
                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);
            }

            else {

                const arrayFetchRaces = [];
    
                for (let i = 0; i < Object.keys(responseData).length; i++) {

                    arrayFetchRaces.push(responseData[i]);
                }

                setFetchRaces(arrayFetchRaces);
                
                window.scrollTo({
                    top: divResultRaces.offsetTop,
                    behavior: "smooth"
                });
            }
        }



        // get list races //

        else if (idRace.value.length == 0) {

            const response = await fetch(`http://localhost:8080/api/race/search`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                },
                body: JSON.stringify({
                    cityToSearch: city.value,
                    userToSearch: user.value,
                    dateStart: dateStart.value,
                    dateEnd: dateEnd.value,
                    allDatesCheck: allDatesCheckBox.checked,
                    hourStart: hourStart.value,
                    hourEnd: hourEnd.value,
                    allHoursCheck: allHoursCheckBox.checked
                })
            });

            const responseData = await response.json();

            

            if (Object.keys(responseData).length > 0) {

                const arrayFetchRaces = [];

                for (let i = 0; i < Object.keys(responseData).length; i++) {

                    arrayFetchRaces.push(responseData[i]);
                }

                setFetchRaces(arrayFetchRaces);

                window.scrollTo({
                    top: divResultRaces.offsetTop,
                    behavior: "smooth"
                });
            }
        }
    };

    useEffect(() => {
        utilsContext.setBackButton(window.location.pathname);
    }, [])

    

    return (
        <main className="main">

            <BackButton pathname={utilsContext.backButton}/>

            <h2 className="main--h2">Encuentra una carrera</h2>

            <div className="main--div main--div--findrunners">

                <div className="error--div find">
                    <p className="error--div--p">

                    </p>
                </div>

                <p className="main--div--p">
                    Haz tu búsqueda y recorre kilómetros!
                </p>

                <form className="main--form--findrunners" method="POST" onSubmit={handleSearchRaces}>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--id--race">
                            Por número de carrera:
                        </label>
                        <input className="main--div--register--form--input--id--race" type="number" name="main--div--register--form--input--id--race" id="main--div--register--form--input--id--race" />
                    </div>

                    <span className="span--between">or</span>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--city">
                            Ciudad:
                        </label>
                        <input className="main--div--register--form--input--city" type="text" name="main--div--register--form--input--city" id="main--div--register--form--input--city" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--user">
                            Usuario:
                        </label>
                        <input className="main--div--register--form--input--user" type="text" name="main--div--register--form--input--user" id="main--div--register--form--input--user" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--birthdate--start">
                            Fecha entre:
                        </label>

                        <input className="main--div--register--form--input--birthdate--start" type="date" name="main--div--register--form--input--birthdate--start" id="main--div--register--form--input--birthdate--start" />

                        <label className="main--div--register--form--label birthdate" htmlFor="main--div--register--form--input--birthdate--end">
                            y:
                        </label>

                        <input className="main--div--register--form--input--birthdate--end" type="date" name="main--div--register--form--input--birthdate--end" id="main--div--register--form--input--birthdate--end" />

                        <div className="main--div--register--form--input--every--date--wrap">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--every--date">
                                ¿Todas?
                            </label>
                            <input className="main--div--register--form--input--every--date" type="checkbox" name="main--div--register--form--input--every--date" id="main--div--register--form--input--every--date--first--checkbox" onChange={handleClickCheckBoxEvery}/>
                        </div>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--hour--start">
                            Hora entre:
                        </label>

                        <div className="main--form--findrunners--hour--box">
                            <select className="main--div--register--form--input--hour--start" name="main--div--register--form--input--hour--start" id="main--div--register--form--input--hour--start">
                                {Array.from(Array(24)).map( (elem, ind) => 
                                    <Fragment key={ind}>
                                        <option value={ind < 10 ? '0' + ind + ':' + '00' : ind + ':' + '00'}>
                                                {ind < 10 ? '0' + ind + ':' + '00' : ind + ':' + '00'}
                                        </option>
                                        <option value={ind < 10 ? '0' + ind + ':' + '30' : ind + ':' + '30'}>
                                            {ind < 10 ? '0' + ind + ':' + '30' : ind + ':' + '30'}
                                        </option>
                                    </Fragment>
                                )}

                            </select>

                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--hour--end">
                            y:
                            </label>
                            <select className="main--div--register--form--input--hour--end" name="main--div--register--form--input--hour--end" id="main--div--register--form--input--hour--end">
                                {Array.from(Array(24)).map( (elem, ind) => 
                                    <Fragment key={ind}>
                                        <option key={ind} value={ind < 10 ? '0' + ind + ':' + '00' : ind + ':' + '00'}>
                                            {ind < 10 ? '0' + ind + ':' + '00' : ind + ':' + '00'}
                                        </option>
                                        <option key={24+ind} value={ind < 10 ? '0' + ind + ':' + '30' : ind + ':' + '30'}>
                                            {ind < 10 ? '0' + ind + ':' + '30' : ind + ':' + '30'}
                                        </option>
                                    </Fragment>
                                )}
                            </select>
                        </div>

                        <div className="main--div--register--form--input--every--date--wrap">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--every--date">
                                ¿Todas?
                            </label>
                            <input className="main--div--register--form--input--every--date" type="checkbox" name="main--div--register--form--input--every--date" id="main--div--register--form--input--every--date--second--checkbox" onChange={handleClickCheckBoxEvery}/>
                        </div>
                    </div>

                    <button className="main--div--register--form--button--submit" type="submit" name="main--div--register--form--button--submit">Validar</button>

                </form>
            </div>



            <div className="main--div my--races">

                <p className="main--div--p">Resultado de la búsqueda</p>

                <ul className="main--div--ul--last--races">

                    {fetchRaces !== undefined ?

                    fetchRaces.map( (elem: any, ind: number) =>

                        <Link key={ind} href={`/races/${elem.races_id}`} className={`main--div--ul--last--races--anchor active ${elem.races_race_level == "bajo" ? "low--level" : elem.races_race_level == "medio" ? "mid--level" : elem.races_race_level == "alto" ? "high--level" : ""}`}>

                            <li className="main--div--ul--last--races--li">

                                <span className="main--div--ul--last--races--li--id--race">{elem.races_id}</span>

                                <span className="main--div--ul--last--races--span--city">{elem.races_city}</span>

                                <div className="main--div--ul--last--races--date--time--wrap">
                                    <span className="main--div--ul--last--races--span--race--date">{elem.races_race_date}</span>

                                    <span className="main--div--ul--last--races--span--race--time">{elem.races_race_time !== undefined ? elem.races_race_time.substring(0, elem.races_race_time.lastIndexOf(":")) : ""}</span>
                                </div>

                                <div className="wrap--users--sex">
                                    <span className="span--number--users--registered">
                                    {elem.number_users_registered}
                                        /
                                    {elem.races_number_users == -1 ? 
                                        <Image
                                        className="infinite--img"
                                        alt="infinite-icon"
                                        src="../assets/pictures/infinite-icon.svg"
                                        width={15}
                                        height={15}
                                        /> 
                                        
                                        : 
                                        
                                        elem.races_number_users
                                    }
                                    </span>
                        
                                    { elem.races_only_male == "yes" ?

                                        <Image
                                        className="male--icon"
                                        alt="male-icon"
                                        src="../assets/pictures/male-icon.svg"
                                        width={15}
                                        height={15}
                                        />

                                    : elem.races_only_female == "yes" ?

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