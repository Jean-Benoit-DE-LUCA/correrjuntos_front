"use client";

import { UserContext, UtilsContext } from "../../../app/layout";

import { Fragment, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import BackButton from "../../../../components/BackButton/page";
import Link from "next/link";
import Image from "next/image";

import filledStar from "../../../../public/assets/pictures/star-filled.svg";
import emptyStar from "../../../../public/assets/pictures/star-empty.svg";

export interface SpecificRaceInterface {
    id: number;
    city: string;
    created_at: string;
    first_name: string;
    further_details: string;
    name_street: string;
    number_street: number;
    number_users: number;
    race_level: string;
    only_male: string;
    only_female: string;
    race_date: string;
    race_duration: string;
    race_time: string;
    updated_at: string;
    user_id: number;
}

export default function RaceId( {params}: {params: {race_id: string}}) {

    const router = useRouter();

    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);

    const [getSpecificRace, setSpecificRace] = useState<SpecificRaceInterface>({
        id: NaN,
        city: "",
        created_at: "",
        first_name: "",
        further_details: "",
        name_street: "",
        number_street: NaN,
        number_users: NaN,
        race_level: "",
        only_male: "",
        only_female: "",
        race_date: "",
        race_duration: "",
        race_time: "",
        updated_at: "",
        user_id: NaN,
    });

    const [getUsersParticipate, setUsersParticipate] = useState({});

    const [countFlag, setCountFlag] = useState<number>(0);

    const filterUserParticipate = () => {

        const result =
        Object.keys(getUsersParticipate).filter( elem => (getUsersParticipate as any)[elem].first_name == userContext.getUserData.firstName);

        return result.length;

    }

    const fetchRaceId = async (race_id: number) => {

        const response = await fetch(`http://localhost:8080/api/race/findrace/${race_id}`);
        const responseData = await response.json();

        const newObjRaceInfo = Object.assign({}, responseData.race_info);
        const newObjUsersParticipate = Object.assign({}, responseData.users_participate);
        setSpecificRace(newObjRaceInfo);
        setUsersParticipate(newObjUsersParticipate);
    };

    const fetchMessage = async (race_id: number) => {

        const response = await fetch(`http://localhost:8080/api/message/get/race_id/${race_id}`);
        const responseData = await response.json();

        Object.keys(responseData.result).forEach( (elem, ind) => {
            
            const firstName = responseData.result[elem].first_name;
            const message = responseData.result[elem].message;
            const dateTime = responseData.result[elem].created_at.replace(
                "T", " "
            ).substring(0, responseData.result[elem].created_at.indexOf(".")).trim();

            createMessage(firstName, message, dateTime);

        });
    }

    const handleClickParticipateRace = async (e: React.MouseEvent<HTMLButtonElement>, race_id: number, race_date: string, race_time: string) => {

        const raceDateTime = race_date + " " + race_time;

        const dateTime = new Date();

        let month: number | string = (Number(dateTime.getMonth()) + 1);
        if (month < 10) {
            month = "0" + month;
        }

        let day: number | string = Number(dateTime.getUTCDate());
        if (day < 10) {
            day = "0" + day;
        }

        let second: number | string = Number(dateTime.getSeconds());
        if (second < 10) {
            second = "0" + second;
        }

        const currentDateTime = dateTime.getFullYear() + "-" + month.toString() + "-" + day.toString() + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + second.toString();

        console.log(currentDateTime);
        console.log(raceDateTime < currentDateTime);

        

        const divError = (document.getElementsByClassName("error--div error--div--race")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);


        // check if race takes place after current date time //

        if (raceDateTime < currentDateTime) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
            divErrorPelement.textContent = "No es posible participar en una carrera que ya ha pasado";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);
        }
        
        else if (userContext.getUserData.email == "") {

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

        else if (
            (userContext.getUserData.gender == "male" && getSpecificRace.only_female == "yes") ||
            (userContext.getUserData.gender == "female" && getSpecificRace.only_male == "yes")
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            document.documentElement.style.setProperty("--divErrorColor", "#ff0000");

            if (getSpecificRace.only_male == "yes") {

                divErrorPelement.textContent = "Solo los chicos están autorizados";
            }

            else if (getSpecificRace.only_female == "yes") {

                divErrorPelement.textContent = "Solo los chicas están autorizados";
            }
            
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

        if (buttonCancel.name.includes("cancel--race")) {

            if (!buttonCancel.classList.contains("active--cancel")) {
                buttonCancel.classList.add("active--cancel");
    
                buttonCancel.childNodes[0].textContent = "¿Cancelar la carrera?";
            }
        }

        else if (!buttonCancel.name.includes("cancel--race")) {

            if (!buttonCancel.classList.contains("active--cancel")) {
                buttonCancel.classList.add("active--cancel");
    
                buttonCancel.childNodes[0].textContent = "¿Confirmar la cancelación?";
            }
        }
    };

    const handleClickCancelParticipateRaceNo = (e: React.MouseEvent<HTMLSpanElement>) => {
        const buttonCancel = (document.getElementsByClassName("main--div--register--form--button--submit button--submit--participate cancel--button--participate")[0] as HTMLButtonElement);

        e.stopPropagation();

        if (buttonCancel.name.includes("cancel--race")) {

            if (buttonCancel.classList.contains("active--cancel")) {
                buttonCancel.classList.remove("active--cancel");
    
                buttonCancel.childNodes[0].textContent = "Cancelar la carrera";
            }
        }

        else if (!buttonCancel.name.includes("cancel--race")) {

            if (buttonCancel.classList.contains("active--cancel")) {
                buttonCancel.classList.remove("active--cancel");
    
                buttonCancel.childNodes[0].textContent = "Cancelar mi participación";
            }
        }
    };

    const handleClickCancelParticipateRace = async (e: React.MouseEvent<HTMLSpanElement>, raceId: number, email: string, userId: number) => {

        const divError = (document.getElementsByClassName("error--div error--div--race")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);

        if (e.currentTarget.className.includes("race--span--yes")) {
            
            const response = await fetch(`http://localhost:8080/api/race/delete/${raceId}/user/${email}`, {

            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": userContext.jwt
            }
            });

            const responseData = await response.json();

            if (responseData.hasOwnProperty("response")) {

                if (responseData.response.hasOwnProperty("success")) {

                    if (responseData.response.success.startsWith("Race deleted successfully")) {
    
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
    
                        document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                        divErrorPelement.textContent = "Carrera cancelada con éxito";
                        divError.classList.add("active");
    
                        setTimeout(() => {
                            divError.classList.remove("active");
                            router.push("/");
                        }, 2000);
                    }
                }
            }
        }


        else if (e.currentTarget.className.includes("participate--span--yes")) {

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
        }
    };

    const handleClickSendMessageRace = async (e: React.FormEvent<HTMLButtonElement>, raceId: number, email: string, userId: number, firstName: string) => {

        const inputMessage = (document.getElementsByClassName("chat--race--users--form--send--message--input")[0] as HTMLInputElement);

        e.preventDefault();

        if (inputMessage.value == "") {

            inputMessage.placeholder = "Escriba un texto."
        }

        if (inputMessage.value !== "") {

            const date = new Date();

            let month = Number(date.getMonth() + 1).toString();
            if (Number(month) < 10) {

                month = "0" + month;
            }

            const currentDateTime = date.getFullYear() + "-" + month + "-" + date.getDate() + " " + new Date().toLocaleTimeString([], {hour12: false});

            //createMessage(firstName, inputMessage.value, currentDateTime);

            const response = await fetch("http://localhost:8080/api/message/insert", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                },
                body: JSON.stringify({
                    inputMessage: inputMessage.value,
                    raceId: raceId,
                    userId: userId,
                    firstName: firstName,
                    email: email,
                    currentDateTime: currentDateTime
                })
            });

            const responseData = await response.json();
            console.log(responseData);




            socket.send(JSON.stringify({
                inputMessage: inputMessage.value,
                raceId: raceId,
                userId: userId,
                firstName: firstName,
                email: email,
                currentDateTime: currentDateTime
            }));

            inputMessage.value = "";
            inputMessage.focus();

            //setCountFlag(countFlag + 1);
        }
    };

    const createMessage = (firstName: string, message: string, dateTime: string) => {

        const divChat = (document.getElementsByClassName("chat--race--users--chat")[0] as HTMLDivElement);

        const divWrap = document.createElement("div");
        divWrap.setAttribute("class", "chat--race--users--chat--message--div");

        const spanUserElement = document.createElement("span");
        spanUserElement.setAttribute("class", "chat--race--users--chat--message--div--span--user");
        spanUserElement.textContent = firstName + ":";

        const spanMessageElement = document.createElement("span");
        spanMessageElement.setAttribute("class", "chat--race--users--chat--message--div--span--message");
        spanMessageElement.textContent = message;

        const spanDateTimeElement = document.createElement("span");
        spanDateTimeElement.setAttribute("class", "chat--race--users--chat--message--div--span--datetime");
        spanDateTimeElement.textContent = dateTime;

        divWrap.append(spanUserElement);
        divWrap.append(spanMessageElement);
        divWrap.append(spanDateTimeElement);

        divChat.append(divWrap);

        divChat.scrollTo({
            top: divChat.scrollHeight
        });
    };

    // CLICK USER VIEW PROFILE + REVIEWS //

    const [getUserProfile, setUserProfile] = useState(
        {
            id: null,
            age: null,
            city: "" ,
            average_rate: null,
            picture: null
        }
    );

    const [getCommentUser, setCommentUser] = useState(

        {
            ind: {
                id: null,
                comment: "",
                rate: null,
                userId: null,
                userReviewed: null,
                createdAt: "",
                updatedAt: ""
            } 
        }
        
    );

    const handleClickUserView = async (e: React.MouseEvent, user_id: string) => {

        if (e.target !== e.currentTarget) {

            return;
        }

        const divProfileElements = (document.getElementsByClassName("ul--list--registered--users--race--li--profile") as HTMLCollectionOf<HTMLDivElement>);

        Array.from(divProfileElements).forEach( elem => {
            
            if (elem !== e.currentTarget.getElementsByClassName("ul--list--registered--users--race--li--profile")[0]) {

                elem.classList.remove("active");
            }
        });

        const spanElementHover = e.currentTarget.getElementsByClassName("border--bottom--span--hover")[0] as HTMLSpanElement;

        if (!e.currentTarget.getElementsByClassName("ul--list--registered--users--race--li--profile")[0].classList.contains("active")) {

            e.currentTarget.getElementsByClassName("ul--list--registered--users--race--li--profile")[0].classList.add("active");
            spanElementHover.classList.add("active");
            e.currentTarget.classList.add("active");
        }

        else {

            e.currentTarget.getElementsByClassName("ul--list--registered--users--race--li--profile")[0].classList.remove("active");
            spanElementHover.classList.remove("active");
            e.currentTarget.classList.remove("active");
        }


        console.log(user_id);
        const response = await fetch(`http://localhost:8080/api/user/get/id/${user_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        });

        const responseData = await response.json();

        const objProfile: any = {};

        Object.keys(responseData).forEach( key => key == "age" || key == "city" || key == "id" || key == "picture" ? objProfile[key] = responseData[key] : key == "average_rate" ? objProfile[key] = Math.ceil(responseData[key]) : "");


        setUserProfile(objProfile);

        // get review //

        getReview(user_id);
    };

    // make function above get id user to update starts when adding review //
    const getUserProfileIdFunc = () => {

        
    };

    const getReview = async (user_id: string) => {

        const responseReview = await fetch(`http://localhost:8080/api/review/get/user_id/${user_id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });

        const responseDataReview = await responseReview.json();
        setCommentUser(responseDataReview);
    };

    // SUBMIT REVIEW //

    const handleSubmitReviewUser = async (e: React.FormEvent, user_id: number, user_reviewed: null) => {

        e.preventDefault();

        const selectRate = (e.currentTarget.getElementsByClassName("profile--user--comment--select--rate")[0] as HTMLSelectElement);
        const comment = (e.currentTarget.getElementsByClassName("profile--user--comment--textarea--comment")[0] as HTMLTextAreaElement);

        const divError = (document.getElementsByClassName("error--div error--div--race")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);


        const response = await fetch("http://localhost:8080/api/review/insert", {

            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": userContext.jwt
            },
            body: JSON.stringify({
                email: userContext.getUserData.email,
                comment: comment.value,
                rate: selectRate.value,
                user_id: user_id,
                user_reviewed: user_reviewed
            })
        });

        const responseData = await response.json();

        if (responseData.hasOwnProperty("checkUser")) {

            if (!responseData.checkUser) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                divErrorPelement.textContent = "No se puede votar por ti mismo";
                divError.classList.add("active");
    
                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);
            }
        }

        if (responseData.hasOwnProperty("checkReview")) {

            if (!responseData.checkReview) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                divErrorPelement.textContent = "Ya has votado por este usuario";
                divError.classList.add("active");
    
                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);
            }
        }

        if (responseData.hasOwnProperty("flag")) {

            if (!responseData.flag) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                divErrorPelement.textContent = "Debes estar registrado para votar";
                divError.classList.add("active");
    
                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);
            }

            else if (responseData.flag) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                divErrorPelement.textContent = "Voto registrado";
                divError.classList.add("active");
    
                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);

                // update stars when insert review //

                const response = await fetch(`http://localhost:8080/api/user/get/id/${user_reviewed}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                });

                const responseData = await response.json();

                const objProfile: any = {};

                Object.keys(responseData).forEach( key => key == "age" || key == "city" || key == "id" || key == "picture" ? objProfile[key] = responseData[key] : key == "average_rate" ? objProfile[key] = Math.ceil(responseData[key]) : "");

                setUserProfile(objProfile);

                getReview(user_reviewed as any);
            }
        }
    }


    useEffect(() => {
        fetchRaceId(parseInt(params.race_id));

        let timerDivDom = setInterval(() => {

            const divChat = (document.getElementsByClassName("chat--race--users--chat")[0] as HTMLDivElement);

            if (divChat !== undefined) {

                clearInterval(timerDivDom);
                fetchMessage(parseInt(params.race_id));
            }
        }, 10);
    }, [countFlag]);

    useEffect(() => {
        utilsContext.setBackButton(window.location.pathname);
    }, []);

    // WEBSOCKET //

    const [socket, setSocket] = useState<any>(new WebSocket("ws://localhost:8887"));

    useEffect(() => {

        setSocket(new WebSocket("ws://localhost:8887"));

          
        socket.onmessage = (event: {data: string}) => {

            try {
                const data = JSON.parse(event.data);

                if (Number(data.raceId) == Number(params.race_id)) {

                    createMessage(data.firstName, data.inputMessage, data.currentDateTime);
                }
            }

            catch (error) {

            }
        };




        return () => {
            
            if (socket.readyState == 1) {

                socket.close();
            }
            
        }
    }, []);

    //

    return (

        <main className="main">

            <BackButton pathname={utilsContext.backButton}/>

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

                {   getSpecificRace.only_male == "yes" ?

                    <span className="main--div--raceid--only--sex male">¡Solo chicos!</span>

                :   getSpecificRace.only_female == "yes" ?

                    <span className="main--div--raceid--only--sex female">¡Solo chicas!</span>

                :   <Fragment>
            
                    </Fragment>
                }
                

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
                            {getSpecificRace.race_time.substring(0, getSpecificRace.race_time.lastIndexOf(":"))}
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
                            {getSpecificRace.number_street.toString() == "-1" ?
                                getSpecificRace.name_street :
                                getSpecificRace.name_street + ", " + getSpecificRace.number_street.toString()
                            }
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
                                    
                                    <div className="ul--list--registered--users--race--li--wrap" key={(getUsersParticipate as any)[elem].user_id}>
                                        <li className="ul--list--registered--users--race--li" onClick={(e) => handleClickUserView(e, (getUsersParticipate as any)[elem].user_id)}>

                                            {(getUsersParticipate as any)[elem].first_name}

                                            <span className="border--bottom--span--hover"></span>

                                            <div className="ul--list--registered--users--race--li--profile">

                                                {getUserProfile !== undefined ?

                                                <div className="ul--list--registered--users--race--li--profile--wrap--details">

                                                    {getUserProfile.picture !== null &&

                                                        <div className="ul--list--registered--users--race--li--profile--div--img--user">
                                                            <Image
                                                                className="ul--list--registered--users--race--li--profile--img--user"
                                                                height={15}
                                                                width={15}
                                                                alt="user-picture"
                                                                src={`http://localhost:8080/uploads/${getUserProfile.picture}`}
                                                            />
                                                        </div>
                                                    }

                                                    <div className="ul--list--registered--users--race--li--profile--wrap--element">
                                                        <span className="ul--list--registered--users--race--li--profile--span--title">Edad: </span>
                                                        <span className="ul--list--registered--users--race--li--profile--age">{getUserProfile.age}</span>
                                                    </div>

                                                    <div className="ul--list--registered--users--race--li--profile--wrap--element">
                                                        <span className="ul--list--registered--users--race--li--profile--span--title">Ciudad: </span>
                                                        <span className="ul--list--registered--users--race--li--profile--city">{getUserProfile.city}</span>
                                                    </div>

                                                </div>

                                                :
                                                
                                                    <>
                                                    </>
                                                
                                                }

                                                    <div className="ul--list--registered--users--race--li--profile--confidence--wrap--element">
                                                        <span className="ul--list--registered--users--race--li--profile--span--title">Confianza: </span>


                                                        <div className="profile--star--wrap">

                                                            {getUserProfile.average_rate == null ?

                                                                Array.from(Array(5)).map( (elem, ind) => 
                                                                    
                                                                    <Fragment key={ind}>
                                                                        <Image
                                                                            key={ind}
                                                                            className="profile--star"
                                                                            alt="star"
                                                                            src={emptyStar}
                                                                            height={0}
                                                                            width={0}
                                                                        />
                                                                    </Fragment>
                                                                )

                                                            :   getUserProfile.average_rate !== null ?

                                                                Array.from(Array(getUserProfile.average_rate)).map( (elem, ind) => 

                                                                    <Fragment key={ind}>
                                                                        <Image
                                                                            key={ind}
                                                                            className="profile--star"
                                                                            alt="star"
                                                                            src={filledStar}
                                                                            height={0}
                                                                            width={0}
                                                                        />
                                                                    </Fragment>
                                                                )

                                                            :

                                                                <>
                                                                </>
                                                            
                                                            }

                                                            {getUserProfile.average_rate !== null ?

                                                                Array.from(Array(5 - Number(getUserProfile.average_rate))).map( (elem, ind) => 

                                                                    <Fragment key={ind}>
                                                                        <Image
                                                                            key={ind}
                                                                            className="profile--star"
                                                                            alt="star"
                                                                            src={emptyStar}
                                                                            height={0}
                                                                            width={0}
                                                                        />
                                                                    </Fragment>
                                                                )

                                                            :

                                                                <>
                                                                </>

                                                                }
                                                        </div>

                                                    </div>

                                                    {<div className="profile--user--comments">
                                                            
                                                            
                                                        {Object.keys(getCommentUser).map( (elem, ind) => 
                                                            
                                                            <div className="user--comment--div" key={ind}>

                                                                <span className="user--comment--span">
                                                                    {(getCommentUser as any)[elem].comment}
                                                                </span>
                                                                <span className="user--comment--span--date">
                                                                    {   
                                                                        (getCommentUser as any)[elem].created_at !== undefined ?

                                                                        (getCommentUser as any)[elem].created_at.substring(0, (getCommentUser as any)[elem].created_at.indexOf("T"))

                                                                        :

                                                                        <></>
                                                                    }
                                                                </span>
                                                                
                                                                <div className="profile--star--wrap">

                                                                    {Array.from(Array((getCommentUser as any)[elem].rate)).map( (elem, ind) => 
                                                                    
                                                                        <Fragment key={ind}>
                                                                            <Image
                                                                                key={ind}
                                                                                className="profile--star profile--star--comment"
                                                                                alt="star"
                                                                                src={filledStar}
                                                                                height={0}
                                                                                width={0}
                                                                            />
                                                                        </Fragment>
                                                                    
                                                                    )}

                                                                    {Array.from(Array(5 - Number((getCommentUser as any)[elem].rate))).map( (elem, ind) => 
                                                                    
                                                                        <Fragment key={ind}>
                                                                            <Image
                                                                                key={ind}
                                                                                className="profile--star profile--star--comment"
                                                                                alt="star"
                                                                                src={emptyStar}
                                                                                height={0}
                                                                                width={0}
                                                                            />
                                                                        </Fragment>
                                                                    
                                                                    )}

                                                                </div>
                                                            
                                                                <span className="user--comment--span--firstname">
                                                                    {(getCommentUser as any)[elem].first_name}
                                                                </span>

                                                            </div> 
                                                            
                                                        )}
                                                    </div>}
                                                                                    
                                                    <form name="profile--user--comment--form" className="profile--user--comment--form" method="POST" onSubmit={(e) => handleSubmitReviewUser(e, userContext.getUserData.id, getUserProfile.id)}>

                                                        <label htmlFor="profile--user--comment--select--rate" className="profile--user--comment--label">Evalúa este usuario: </label>

                                                        <select name="profile--user--comment--select--rate" className="profile--user--comment--select--rate" id="profile--user--comment--select--rate">
                                                            
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>

                                                        </select>

                                                        <label htmlFor="profile--user--comment--textarea--comment" className="profile--user--comment--label">Inscribe un comentario (opcional)</label>

                                                        <textarea name="profile--user--comment--textarea--comment" className="profile--user--comment--textarea--comment" id="profile--user--comment--textarea--comment">
                                                            
                                                        </textarea>

                                                        <button type="submit" name="profile--user--comment--form--button" className="profile--user--comment--form--button" id="profile--user--comment--form--button">Publicar</button>
                                                    </form>

                                            </div>
                                        </li>
                                    </div>
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
                            Nivel de la carrera:
                        </span>
                        <span className="raceid--details--detail--value">
                            {getSpecificRace.race_level}
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

                {userContext.getUserData.email.length == 0 && getSpecificRace.number_users - Object.keys(getUsersParticipate).length == 0 ?

                        <>
                        </>

                        : filterUserParticipate() > 0 ?
                        
                        <>
                        <div className="chat--race--users">
                            <span className="raceid--details--detail--name chat--race">Conversación:</span>
                            
                            <div className="chat--race--users--chat">

                                <div className="chat--race--users--chat--message--div fake--div">
                                    <span className="chat--race--users--chat--message--div--span--user">User:</span>
                                    <span className="chat--race--users--chat--message--div--span--message">Message message message message message message message message message message message message message</span>
                                    <span className="chat--race--users--chat--message--div--span--datetime">{new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}</span>
                                </div>

                                <div className="chat--race--users--chat--message--div fake--div">
                                    <span className="chat--race--users--chat--message--div--span--user">User:</span>
                                    <span className="chat--race--users--chat--message--div--span--message">Message message message message message message message message message message message message message</span>
                                    <span className="chat--race--users--chat--message--div--span--datetime">{new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}</span>
                                </div>
                                
                            </div>

                            <form className="chat--race--users--form--send--message" method="POST">

                                <input type="text" className="chat--race--users--form--send--message--input" name="chat--race--users--form--send--message--input" id="chat--race--users--form--send--message--input" />

                                <button type="submit" className="chat--race--users--button--send" name="chat--race--users--button--send" onClick={(e)=> handleClickSendMessageRace(e, parseInt(params.race_id), userContext.getUserData.email, userContext.getUserData.id, userContext.getUserData.firstName)}>Enviar</button>
                            </form>
                        </div>


                        {userContext.getUserData.id == getSpecificRace.user_id ? 
                            <>

                            <Link className="update--anchor--link" href={`/races/update/${params.race_id}`}>
                                <button className="main--div--register--form--button--submit button--submit--participate cancel--button--participate--update" type="button" name="main--div--register--form--button--submit--cancel--race">
                                Modificar los datos
                                </button>
                            </Link>

                            {<button className="main--div--register--form--button--submit button--submit--participate cancel--button--participate" type="button" name="main--div--register--form--button--submit--cancel--race" onClick={handleClickCancelParticipateRaceConfirmBox}>
                                Cancelar la carrera
                                <span className="cancel--button--race--span--yes" onClick={(e) => handleClickCancelParticipateRace(e, parseInt(params.race_id), userContext.getUserData.email ,userContext.getUserData.id)}>Sí</span>
                                <span className="cancel--button--race--span--no" onClick={handleClickCancelParticipateRaceNo}>No</span>
                            </button>}
                            
                            </>
                            :
                    
                            <button className="main--div--register--form--button--submit button--submit--participate cancel--button--participate" type="button" name="main--div--register--form--button--submit--cancel--user" onClick={handleClickCancelParticipateRaceConfirmBox}>
                                Cancelar mi participación
                                <span className="cancel--button--participate--span--yes" onClick={(e) => handleClickCancelParticipateRace(e, parseInt(params.race_id), userContext.getUserData.email ,userContext.getUserData.id)}>Sí</span>
                                <span className="cancel--button--participate--span--no" onClick={handleClickCancelParticipateRaceNo}>No</span>
                            </button>
                        }
                            {/*<button className="main--div--register--form--button--submit button--submit--participate cancel--button--participate" type="button" name="main--div--register--form--button--submit" onClick={handleClickCancelParticipateRaceConfirmBox}>
                                Cancelar mi participación
                                <span className="cancel--button--participate--span--yes" onClick={(e) => handleClickCancelParticipateRace(e, parseInt(params.race_id), userContext.getUserData.email ,userContext.getUserData.id)}>Sí</span>
                                <span className="cancel--button--participate--span--no" onClick={handleClickCancelParticipateRaceNo}>No</span>
                            </button>*/}


                        </>
                        
                        : filterUserParticipate() == 0 && getSpecificRace.number_users - Object.keys(getUsersParticipate).length == 0 ?

                        <>
                        </>

                        :

                        <button className="main--div--register--form--button--submit button--submit--participate" type="button" name="main--div--register--form--button--submit" onClick={(e) => handleClickParticipateRace(e, parseInt(params.race_id), getSpecificRace.race_date, getSpecificRace.race_time)}>Participar</button>

                        
                }

            </div>

        </main>
    );
}