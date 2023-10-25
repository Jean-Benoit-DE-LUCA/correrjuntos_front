"use client";

import { UserContext } from "../../../app/layout";

import { useContext, useEffect, useState } from "react";

export interface SpecificRaceInterface {
    id: number;
    city: string;
    created_at: string;
    first_name: string;
    further_details: string;
    name_street: string;
    number_street: number;
    number_users: number;
    race_date: string;
    race_duration: string;
    race_time: string;
    updated_at: string;
    user_id: number;
}

export default function RaceId( {params}: {params: {race_id: string}}) {

    const userContext = useContext(UserContext);

    const [getSpecificRace, setSpecificRace] = useState<SpecificRaceInterface>({
        id: NaN,
        city: "",
        created_at: "",
        first_name: "",
        further_details: "",
        name_street: "",
        number_street: NaN,
        number_users: NaN,
        race_date: "",
        race_duration: "",
        race_time: "",
        updated_at: "",
        user_id: NaN,
    })

    const [getUsersParticipate, setUsersParticipate] = useState({});

    const [countFlag, setCountFlag] = useState<number>(0);

    const filterUserParticipate = () => {

        const result =
        Object.keys(getUsersParticipate).filter( elem => (getUsersParticipate as any)[elem].first_name == userContext.getUserData.firstName);

        return result.length;

    }

    console.log(filterUserParticipate());

    const fetchRaceId = async (race_id: number) => {

        const response = await fetch(`http://localhost:8080/api/race/findrace/${race_id}`);
        const responseData = await response.json();

        const newObjRaceInfo = Object.assign({}, responseData.race_info);
        const newObjUsersParticipate = Object.assign({}, responseData.users_participate);
        setSpecificRace(newObjRaceInfo);
        setUsersParticipate(newObjUsersParticipate);

        console.log(responseData);
    };

    const handleClickParticipateRace = async (e: React.MouseEvent<HTMLButtonElement>, race_id: number) => {

        const divError = (document.getElementsByClassName("error--div error--div--race")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);
        
        if (userContext.getUserData.email == "") {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
            divErrorPelement.textContent = "Por favor, autentíquese para participar en una carrera";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);
        }

        else {

            const response = await fetch(`http://localhost:8080/api/race/participate/${race_id}`, {

                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                },
                body: JSON.stringify({
                    user_mail: userContext.getUserData.email,
                    user_id: userContext.getUserData.id
                })
            });

            const responseData = await response.json();

            if (responseData.hasOwnProperty("response")) {

                if (responseData.response.hasOwnProperty("success")) {

                    if (responseData.response.success.startsWith("User successfully registered")) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                        document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                        divErrorPelement.textContent = "Participación en la carrera tomada en cuenta!";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);

                        setCountFlag(countFlag + 1);
                    }
                }

                else if (responseData.response.hasOwnProperty("error")) {

                    if (responseData.response.error.startsWith("User limit reached")) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "Límite de plazas disponibles alcanzado.";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }
                }
            }
        }
    };

    const handleClickCancelParticipateRaceConfirmBox = () => {
        const buttonCancel = (document.getElementsByClassName("main--div--register--form--button--submit button--submit--participate cancel--button--participate")[0] as HTMLButtonElement);

        if (!buttonCancel.classList.contains("active--cancel")) {
            buttonCancel.classList.add("active--cancel");

            buttonCancel.childNodes[0].textContent = "¿Confirmar la cancelación?";
        }
    };

    const handleClickCancelParticipateRaceNo = (e: React.MouseEvent<HTMLSpanElement>) => {
        const buttonCancel = (document.getElementsByClassName("main--div--register--form--button--submit button--submit--participate cancel--button--participate")[0] as HTMLButtonElement);

        e.stopPropagation();

        if (buttonCancel.classList.contains("active--cancel")) {
            buttonCancel.classList.remove("active--cancel");

            buttonCancel.childNodes[0].textContent = "Cancelar mi participación";
        }


    };

    const handleClickCancelParticipateRace = async (e: React.MouseEvent<HTMLSpanElement>, raceId: number, email: string, userId: number) => {

        const divError = (document.getElementsByClassName("error--div error--div--race")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);
        
        const response = await fetch(`http://localhost:8080/api/race/participate/delete/user/${userId}/email/${email}/race/${raceId}`, {

        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "Authorization": userContext.jwt
        }
        });

        const responseData = await response.json();
        
        if (responseData.hasOwnProperty("response")) {

            if (responseData.response.hasOwnProperty("success")) {

                if (responseData.response.success.startsWith("Race participation canceled.")) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                    divErrorPelement.textContent = "Participación en la carrera cancelada.";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                    }, 3000);

                    setCountFlag(countFlag + 1);
                }
            }

            else if (responseData.response.hasOwnProperty("error")) {

                if (responseData.response.error.startsWith("Authentication error.")) {

                    const buttonCancel = (document.getElementsByClassName("main--div--register--form--button--submit button--submit--participate cancel--button--participate")[0] as HTMLButtonElement);

                    buttonCancel.classList.remove("active--cancel");

                    buttonCancel.childNodes[0].textContent = "Cancelar mi participación";

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                    divErrorPelement.textContent = "Por favor, autentíquese de nuevo.";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                    }, 3000);
                }
            }
        }
    };

    useEffect(() => {
        fetchRaceId(parseInt(params.race_id));
    }, [countFlag]);

    return(

        <main className="main">

            <div className="main--div main--div--register main--div--proposerace">

                <div className="error--div error--div--race">
                    <p className="error--div--p">

                    </p>
                </div>

                <span className={filterUserParticipate() > 0 ? `main--div--raceid--participate--span active` : `main--div--raceid--participate--span`}>Participo!</span>

                <h2 className="main--div--register--title">
                    Carrera propuesta por 
                    <br />
                    <span className="main--div--raceid--title--span">
                        {getSpecificRace.first_name}
                    </span>
                </h2>

                <ul className="main--div--raceid--details--race--ul">

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Fecha (año/mes/dia):
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.race_date}
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Hora de inicio:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.race_time}
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Duración:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.race_duration}
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Ciudad:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.city}
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Lugar de salida:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.name_street + ", " + getSpecificRace.number_street.toString()}
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Usuarios máximos:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.number_users.toString() == "-1" ?

                                "Sin límites" :

                                getSpecificRace.number_users.toString()
                            }
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Usuarios registrados:
                        </span> 
                        <ul className="ul--list--registered--users--race">
                            {getUsersParticipate !== undefined ?
                                Object.keys(getUsersParticipate).map( elem => 
                                    <li className="ul--list--registered--users--race--li" key={(getUsersParticipate as any)[elem].user_id}>{(getUsersParticipate as any)[elem].first_name}</li>
                                ) :
                                <>
                                </>
                            }
                        </ul>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Plazas libres:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.number_users.toString() == "-1" ?

                                "Sin límites" :

                                (getSpecificRace.number_users - Object.keys(getUsersParticipate).length).toString()
                            }
                        </span>
                    </li>

                    <li className="main--div--raceid--details--race--ul--li">
                        <span className="raceid--details--detail--name">
                            Detalles adicionales:
                        </span>
                        <span className="raceid--details--detail--value raceid--details--detail--value--further--details">
                            {getSpecificRace.further_details}
                        </span>
                    </li>
                </ul>

                {filterUserParticipate() == 0 ?

                    <button className="main--div--register--form--button--submit button--submit--participate" type="button" name="main--div--register--form--button--submit" onClick={(e) => handleClickParticipateRace(e, parseInt(params.race_id))}>Participar</button>
                    
                    : 

                    <button className="main--div--register--form--button--submit button--submit--participate cancel--button--participate" type="button" name="main--div--register--form--button--submit" onClick={handleClickCancelParticipateRaceConfirmBox}>
                        Cancelar mi participación
                        <span className="cancel--button--participate--span--yes" onClick={(e) => handleClickCancelParticipateRace(e, parseInt(params.race_id), userContext.getUserData.email ,userContext.getUserData.id)}>Sí</span>
                        <span className="cancel--button--participate--span--no" onClick={handleClickCancelParticipateRaceNo}>No</span>
                    </button>
                }
            </div>

        </main>
    );
}