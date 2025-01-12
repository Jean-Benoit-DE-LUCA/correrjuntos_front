"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, Fragment, useState } from "react";
import { UserContext, UtilsContext } from "../container";

import Loader from "../../../components/Loader/page";
import BackButton from "../../../components/BackButton/page";

export default function ProposeRace() {

    const router = useRouter();

    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);

    const handleSubmitProposeRace = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const inputStreetNumber = (document.getElementsByClassName("main--div--register--form--input--street--number")[0] as HTMLInputElement);
        const inputStreetName = (document.getElementsByClassName("main--div--register--form--input--street--name")[0] as HTMLInputElement);
        const inputCity = (document.getElementsByClassName("main--div--register--form--input--city")[0] as HTMLInputElement);
        const textAreaFurtherDetails = (document.getElementsByClassName("main--div--proposerace--form--textarea--furthersdetails")[0] as HTMLTextAreaElement);
        
        const inputDate = (document.getElementsByClassName("main--div--register--form--input--date")[0] as HTMLInputElement);
        const selectHour = (document.getElementsByClassName("main--div--register--form--input--hour--start")[0] as HTMLSelectElement);

        const inputRaceTime = (document.getElementsByClassName("main--div--register--form--input--racetime")[0] as HTMLInputElement);

        const selectLevel = (document.getElementsByClassName("main--div--register--form--input--race--level")[0] as HTMLSelectElement);

        const inputCheckBoxNoLimit = (document.getElementsByClassName("main--form--findrunners--undefined--checkbox")[0] as HTMLInputElement);
        const inputMaxUsers = (document.getElementsByClassName("main--div--register--form--input--hour--start maximum--users")[0] as HTMLInputElement);

        const inputOnlyMale = (document.getElementsByClassName("main--div--register--form--input--male")[0] as HTMLInputElement);
        const inputOnlyFemale = (document.getElementsByClassName("main--div--register--form--input--female")[0] as HTMLInputElement);

        const divError = (document.getElementsByClassName("error--div")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);

        if (
            inputStreetName.value == "" ||
            inputCity.value == "" ||
            inputDate.value == "" ||
            
            (inputCheckBoxNoLimit.checked == false && inputMaxUsers.value == "")
        )

        {
            document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
            divErrorPelement.textContent = "Por favor, complete todos los campos";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        else if (inputOnlyMale.checked && inputOnlyFemale.checked) {

            document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
            divErrorPelement.textContent = "No se puede seleccionar \"Solo chichos\" o \"Solo chicas\" a la vez";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        else if (userContext.getUserData.gender == "male" && inputOnlyFemale.checked) {

            document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
            divErrorPelement.textContent = "No se puede seleccionar \"Solo chicas\" siendo un chico";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        else if (userContext.getUserData.gender == "female" && inputOnlyMale.checked) {

            document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
            divErrorPelement.textContent = "No se puede seleccionar \"Solo chicos\" siendo una chica";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        else {

            const response = await fetch("http://localhost:8080/api/race/insert", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                },
                body: JSON.stringify({
                    inputStreetNumber: inputStreetNumber.value,
                    inputStreetName: inputStreetName.value,
                    inputCity: inputCity.value,
                    textAreaFurtherDetails: textAreaFurtherDetails.value,
                    inputDate: inputDate.value,
                    selectHour: selectHour.value,
                    inputRaceTime: inputRaceTime.value,
                    selectLevel: selectLevel.value,
                    inputCheckBoxNoLimit: inputCheckBoxNoLimit.checked,
                    inputMaxUsers: inputMaxUsers.value,
                    inputOnlyMale: inputOnlyMale.checked,
                    inputOnlyFemale: inputOnlyFemale.checked,
                    userMail: userContext.getUserData.email,
                    userId: userContext.getUserData.id
                })
            });

            const responseData = await response.json();
            
            
            if (responseData.hasOwnProperty("bodyResponse")) {

                if (responseData.bodyResponse) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                    divErrorPelement.textContent = "Carrera registrada con éxito";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                        router.push("/");
                    }, 2000);
                }

                else if (!responseData.bodyResponse) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                    divErrorPelement.textContent = "Por favor, vuelva a autenticarse.";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                        router.push("/signin");
                    }, 2000);
                }
            }
        }

        

    };

    const handleCheckedNoLimitInput = (e: React.FormEvent<HTMLInputElement>) => {

        const inputMaxUsers = (document.getElementsByClassName("main--div--register--form--input--hour--start maximum--users")[0] as HTMLInputElement);

        e.currentTarget.checked ? (inputMaxUsers.classList.add("active"), inputMaxUsers.value = "") : inputMaxUsers.classList.remove("active");
    };

    useEffect(() => {

        utilsContext.setBackButton(window.location.pathname);

        setTimeout(() => {

            if (userContext.getUserData.email.length == 0) {
                userContext.setMessage("Debes autenticarte para proponer una carrera.");
                router.push("/");
            }

            else {
                setIsLoading(false);
            }
        }, 1500);
        
    }, []);




    const [isLoading, setIsLoading] = useState<boolean>(true);

    if (isLoading) {

        return <Loader />
    }

    if (!isLoading) {

        return (
            <main className="main">

                <BackButton pathname={utilsContext.backButton}/>

                <div className="error--div error--div--proposerace">
                    <p className="error--div--p">

                    </p>
                </div>

                <div className="main--div main--div--register main--div--proposerace">

                    <h2 className="main--div--register--title main--div--proposerace--title">
                        Proponer una carrera
                    </h2>

                    <form className="main--div--form--proposerace" name="main--div--form--proposerace" method="POST" onSubmit={handleSubmitProposeRace}>
                        
                        <fieldset className="main--div--form--fieldset">
                            <legend className="main--div--form--proposerace--where">Dónde</legend>

                            <div className="main--div--register--form--wrap--label--input">
                                <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--number">
                                    Número de calle:
                                </label>
                                <input className="main--div--register--form--input--street--number" type="number" name="main--div--register--form--input--street--number" id="main--div--register--form--input--street--number" /* not required *//>
                            </div>

                            <div className="main--div--register--form--wrap--label--input">
                                <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--name">
                                    Nombre de calle *:
                                </label>
                                <input className="main--div--register--form--input--street--name" type="text" name="main--div--register--form--input--street--name" id="main--div--register--form--input--street--name" />
                            </div>

                            <div className="main--div--register--form--wrap--label--input">
                                <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--city">
                                    Ciudad *:
                                </label>
                                <input className="main--div--register--form--input--city" type="text" name="main--div--register--form--input--city" id="main--div--register--form--input--city" />
                            </div>

                            <div className="main--div--register--form--wrap--label--input">
                                <label className="main--div--register--form--label" htmlFor="main--div--proposerace--form--textarea--furthersdetails">
                                    Información adicional:
                                </label>
                                <textarea className="main--div--proposerace--form--textarea--furthersdetails" name="main--div--proposerace--form--textarea--furthersdetails" id="main--div--proposerace--form--textarea--furthersdetails" placeholder="Añade información que consideres relevante"></textarea>
                            </div>
                        </fieldset>

                        <fieldset className="main--div--form--fieldset fieldset--when">
                            <legend className="main--div--form--proposerace--where">Cuando</legend>

                            <div className="main--div--register--form--wrap--label--input">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--date">
                                Fecha *:
                            </label>
                            <input className="main--div--register--form--input--date" type="date" name="main--div--register--form--input--date" id="main--div--register--form--input--date" min={new Date().toISOString().slice(0, 10)}/>
                            </div>

                            <div className="main--div--register--form--wrap--label--input">
                                <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--hour--start">
                                    Hora *:
                                </label>

                                <div className="main--form--findrunners--hour--box">

                                    <select className="main--div--register--form--input--hour--start" name="main--div--register--form--input--hour--start" id="main--div--register--form--input--hour--start">
                                        {Array.from(Array(24)).map( (elem, ind) => 
                                            <Fragment key={ind}>
                                                <option value={ind < 10 ? '0' + ind + ':' + '00' : ind + ':' + '00'}>{ind < 10 ? '0' + ind + ':' + '00' : ind + ':' + '00'}</option>
                                                <option value={ind < 10 ? '0' + ind + ':' + '15' : ind + ':' + '15'}>{ind < 10 ? '0' + ind + ':' + '15' : ind + ':' + '15'}</option>
                                                <option value={ind < 10 ? '0' + ind + ':' + '30' : ind +  ':' + '30'}>{ind < 10 ? '0' + ind + ':' + '30' : ind +  ':' + '30'}</option>
                                                <option value={ind < 10 ? '0' + ind + ':' + '45' : ind +  ':' + '45'}>{ind < 10 ? '0' + ind + ':' + '45' : ind +  ':' + '45'}</option>
                                            </Fragment>
                                        )}

                                    </select>

                                </div>
                            </div>

                        </fieldset>

                        <fieldset className="main--div--form--fieldset fieldset--howmany--time">
                            <legend className="main--div--form--proposerace--where">Cuánto</legend>

                            <div className="main--div--register--form--wrap--label--input">
                                <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--racetime">
                                    Tiempo de carrera *:
                                </label>

                                <div className="main--form--findrunners--hour--box">

                                    <select className="main--div--register--form--input--racetime" name="main--div--register--form--input--racetime" id="main--div--register--form--input--racetime">
                                        {Array("indefinido", "0h15", "0h30", "0h45", "1h00", "1h15", "1h30", "1h45", "2h00", ">2h00").map( (elem, ind) => 

                                            <option key={elem} value={elem}>{elem}</option>

                                        )}

                                    </select>

                                </div>
                            </div>

                        </fieldset>

                        <fieldset className="main--div--form--fieldset fieldset--race--level">
                            <legend className="main--div--form--proposerace--where">Nivel carrera</legend>

                            <div className="main--form--findrunners--hour--box">
                                
                                <div className="main--div--register--form--wrap--label--input">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--race--level">
                                        Nivel de la carrera *:
                                    </label>
                                    

                                    <select className="main--div--register--form--input--race--level" name="main--div--register--form--input--race--level" id="main--div--register--form--input--race--level">
                                        <option value="bajo">Bajo</option>
                                        <option value="medio">Medio</option>
                                        <option value="alto">Alto</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="main--div--form--fieldset fieldset--howmany--users">
                            <legend className="main--div--form--proposerace--where">Participantes</legend>
                            
                            <label className="main--div--register--form--label wrap--label" htmlFor="main--div--register--form--input--hour--start">
                                    Participantes 
                                    <span>máximo *:</span>
                            </label>

                            <div className="main--form--findrunners--hour--box maximum--users">
                                
                                <div className="main--form--findrunners--undefined--checkbox--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--form--findrunners--undefined--checkbox">Sin límites</label>
                                    <input className="main--form--findrunners--undefined--checkbox" type="checkbox" name="main--form--findrunners--undefined--checkbox" id="main--form--findrunners--undefined--checkbox" onChange={handleCheckedNoLimitInput}/>
                                </div>
                                
                                <input className="main--div--register--form--input--hour--start maximum--users" type="number" name="main--div--register--form--input--hour--start maximum--users" id="main--div--register--form--input--hour--start maximum--users" />

                            </div>
                            
                            <div className="main--div--register--form--wrap--label--input">
                                
                                <div className="main--form--findrunners--checkbox--male--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--male">
                                            ¿Solo chicos?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--male" name="main--div--register--form--input--male" id="main--div--register--form--input--male" />
                                </div>

                                <div className="main--form--findrunners--checkbox--female--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--female">
                                            ¿Solo chicas?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--female" name="main--div--register--form--input--female" id="main--div--register--form--input--female" />
                                </div>

                            </div>

                        </fieldset>

                        <button type="submit" name="main--form--findrunners--button--submit" className="main--form--findrunners--button--submit" id="main--form--findrunners--button--submit">Enviar</button>

                    </form>
                </div>
            </main>
        );
    }
}