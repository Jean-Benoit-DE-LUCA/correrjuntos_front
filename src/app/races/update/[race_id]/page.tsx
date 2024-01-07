"use client";

import { UserContext, UtilsContext } from "@/app/layout";
import BackButton from "../../../../../components/BackButton/page";
import { useContext, Fragment, useState, useEffect } from "react";
import { SpecificRaceInterface } from "../../[race_id]/page";
import { useRouter } from "next/navigation";

export default function UpdateRace({params}: {params: {race_id: string}}) {

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

    const setSpecificRaceFunc = (e: React.ChangeEvent, property: any, data: any) => {

        const prop = property;

        const cloneGetSpecificRace = Object.assign({}, getSpecificRace);
        
        (cloneGetSpecificRace as any)[prop] = data;

        setSpecificRace(cloneGetSpecificRace);
    };

    const [getUsersParticipate, setUsersParticipate] = useState({});

    const fetchRaceId = async (race_id: number) => {

        const response = await fetch(`http://localhost:8080/api/race/findrace/${race_id}`);
        const responseData = await response.json();

        const newObjRaceInfo = Object.assign({}, responseData.race_info);
        const newObjUsersParticipate = Object.assign({}, responseData.users_participate);
        setSpecificRace(newObjRaceInfo);
        setUsersParticipate(newObjUsersParticipate);
    };

    const handleSubmitUpdateRace = async (e: React.FormEvent) => {

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

        else if (

            (inputCheckBoxNoLimit.checked == false && Number(inputMaxUsers.value) < Object.keys(getUsersParticipate).length)
        )

        {
            document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
            divErrorPelement.textContent = "El número máximo de usuarios no puede ser inferior a los ya registrados";
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

            const response = await fetch(`http://localhost:8080/api/race/update/${params.race_id}`, {
                method: "PUT",
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
                    divErrorPelement.textContent = "Carrera modificada con éxito";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                        router.push("/");
                    }, 3000);
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
                    }, 3000);
                }
            }
        }
    };

    const handleCheckedNoLimitInput = (e: React.FormEvent<HTMLInputElement>) => {

        const inputMaxUsers = (document.getElementsByClassName("main--div--register--form--input--hour--start maximum--users")[0] as HTMLInputElement);

        e.currentTarget.checked ? (inputMaxUsers.classList.add("active"), inputMaxUsers.value = "") : inputMaxUsers.classList.remove("active");
    };

    const checkInput = () => {

        const inputCheckBoxNoLimit = (document.getElementsByClassName("main--form--findrunners--undefined--checkbox")[0] as HTMLInputElement);

        const inputMaxUsers = (document.getElementsByClassName("main--div--register--form--input--hour--start maximum--users")[0] as HTMLInputElement);

        if (getSpecificRace.number_users == -1) {

            inputCheckBoxNoLimit.checked = true;
            inputMaxUsers.classList.add("active");
        }

        else {

            inputCheckBoxNoLimit.checked = false;
            inputMaxUsers.classList.remove("active");
            inputMaxUsers.value = getSpecificRace.number_users.toString();
        }
    };

    const [isCheckedMale, setIsCheckedMale] = useState<boolean>(false);
    const [isCheckedFemale, setIsCheckedFemale] = useState<boolean>(false);

    const setIsCheckedFunc = () => {

        if (getSpecificRace.only_male == "yes") {

            setIsCheckedMale(true);
        }

        else if (getSpecificRace.only_female == "yes") {

            setIsCheckedFemale(true);
        }

        else {

            setIsCheckedMale(false);
            setIsCheckedFemale(false);
        }

        checkInput();
    };


    const handleCheckedMaleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        setIsCheckedMale(isCheckedMale => !isCheckedMale);
    };

    const handleCheckedFemaleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        setIsCheckedFemale(isCheckedFemale => !isCheckedFemale);
    };

    

    useEffect(() => {
        fetchRaceId(parseInt(params.race_id));
        
    }, []);

    useEffect(() => {

        let timer = setInterval(() => {

            if (getSpecificRace.id.toString() == params.race_id.toString()) {

                setIsCheckedFunc();
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [getSpecificRace]);

    console.log(getSpecificRace);

    return (
        <main className="main">

            <BackButton pathname={utilsContext.backButton}/>

            <div className="error--div error--div--proposerace">
                <p className="error--div--p">

                </p>
            </div>

            <div className="main--div main--div--register main--div--proposerace">

                <h2 className="main--div--register--title main--div--proposerace--title">
                    Modificar una carrera
                </h2>

                <form className="main--div--form--proposerace" name="main--div--form--proposerace" method="POST" onSubmit={handleSubmitUpdateRace}>
                    
                    <fieldset className="main--div--form--fieldset">
                        <legend className="main--div--form--proposerace--where">Dónde</legend>

                        <div className="main--div--register--form--wrap--label--input">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--number">
                                Número de calle:
                            </label>
                            <input className="main--div--register--form--input--street--number" type="number" name="main--div--register--form--input--street--number" id="main--div--register--form--input--street--number" value={getSpecificRace.number_street == -1 || isNaN(getSpecificRace.number_street) ? "" : getSpecificRace.number_street} onChange={(e) => setSpecificRaceFunc(e, "number_street", e.target.value)}/* not required *//>
                        </div>

                        <div className="main--div--register--form--wrap--label--input">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--name">
                                Nombre de calle *:
                            </label>
                            <input className="main--div--register--form--input--street--name" type="text" name="main--div--register--form--input--street--name" id="main--div--register--form--input--street--name"  value={getSpecificRace.name_street} onChange={(e) => setSpecificRaceFunc(e, "name_street", e.target.value)}/>
                        </div>

                        <div className="main--div--register--form--wrap--label--input">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--city">
                                Ciudad *:
                            </label>
                            <input className="main--div--register--form--input--city" type="text" name="main--div--register--form--input--city" id="main--div--register--form--input--city" value={getSpecificRace.city} onChange={(e) => setSpecificRaceFunc(e, "city", e.target.value)}/>
                        </div>

                        <div className="main--div--register--form--wrap--label--input">
                            <label className="main--div--register--form--label" htmlFor="main--div--proposerace--form--textarea--furthersdetails">
                                Información adicional:
                            </label>
                            <textarea className="main--div--proposerace--form--textarea--furthersdetails" name="main--div--proposerace--form--textarea--furthersdetails" id="main--div--proposerace--form--textarea--furthersdetails" placeholder="Añade información que consideres relevante" value={getSpecificRace.further_details} onChange={(e) => setSpecificRaceFunc(e, "further_details", e.target.value)}></textarea>
                        </div>
                    </fieldset>

                    <fieldset className="main--div--form--fieldset fieldset--when">
                        <legend className="main--div--form--proposerace--where">Cuando</legend>

                        <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--date">
                            Fecha *:
                        </label>
                        <input className="main--div--register--form--input--date" type="date" name="main--div--register--form--input--date" id="main--div--register--form--input--date" min={new Date().toISOString().slice(0, 10)} value={getSpecificRace.race_date} onChange={(e) => setSpecificRaceFunc(e, "race_date", e.target.value)}/>
                        </div>

                        <div className="main--div--register--form--wrap--label--input">
                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--hour--start">
                                Hora *:
                            </label>

                            <div className="main--form--findrunners--hour--box">

                                <select className="main--div--register--form--input--hour--start" name="main--div--register--form--input--hour--start" id="main--div--register--form--input--hour--start">
                                    {Array.from(Array(24)).map( (elem, ind) => 
                                        <Fragment key={ind}>
                                            
                                            {ind < 10 && getSpecificRace.race_time == '0' + ind + ':' + '00:00' ?

                                                <option value={'0' + ind + ':' + '00'} selected>{'0' + ind + ':' + '00'}</option>

                                            : ind < 10 && getSpecificRace.race_time !== '0' + ind + ':' + '00:00' ?

                                                <option value={'0' + ind + ':' + '00'}>{'0' + ind + ':' + '00'}</option>



                                            : ind >= 10 && getSpecificRace.race_time == ind + ':' + '00:00' ?

                                                <option value={ind + ':' + '00'} selected>{ind + ':' + '00'}</option>

                                            : ind >= 10 && getSpecificRace.race_time !== ind + ':' + '00:00' ? 
                                            
                                                <option value={ind + ':' + '00'}>{ind + ':' + '00'}</option>

                                            :
                                                <>
                                                </>
                                            }


                                            {/**/}


                                            {ind < 10 && getSpecificRace.race_time == '0' + ind + ':' + '15:00' ?

                                                <option value={'0' + ind + ':' + '15'} selected>{'0' + ind + ':' + '15'}</option>

                                            : ind < 10 && getSpecificRace.race_time !== '0' + ind + ':' + '15:00' ?

                                                <option value={'0' + ind + ':' + '15'}>{'0' + ind + ':' + '15'}</option>



                                            : ind >= 10 && getSpecificRace.race_time == ind + ':' + '15:00' ?

                                                <option value={ind + ':' + '15'} selected>{ind + ':' + '15'}</option>

                                            : ind >= 10 && getSpecificRace.race_time !== ind + ':' + '15:00' ? 
                                            
                                                <option value={ind + ':' + '15'}>{ind + ':' + '15'}</option>

                                            :
                                                <>
                                                </>
                                            }


                                            {/**/}


                                            {ind < 10 && getSpecificRace.race_time == '0' + ind + ':' + '30:00' ?

                                                <option value={'0' + ind + ':' + '30'} selected>{'0' + ind + ':' + '30'}</option>

                                            : ind < 10 && getSpecificRace.race_time !== '0' + ind + ':' + '30:00' ?

                                                <option value={'0' + ind + ':' + '30'}>{'0' + ind + ':' + '30'}</option>



                                            : ind >= 10 && getSpecificRace.race_time == ind + ':' + '30:00' ?

                                                <option value={ind + ':' + '30'} selected>{ind + ':' + '30'}</option>

                                            : ind >= 10 && getSpecificRace.race_time !== ind + ':' + '30:00' ? 
                                            
                                                <option value={ind + ':' + '30'}>{ind + ':' + '30'}</option>

                                            :
                                                <>
                                                </>
                                            }


                                            {/**/}


                                            {ind < 10 && getSpecificRace.race_time == '0' + ind + ':' + '45:00' ?

                                                <option value={'0' + ind + ':' + '45'} selected>{'0' + ind + ':' + '45'}</option>

                                            : ind < 10 && getSpecificRace.race_time !== '0' + ind + ':' + '45:00' ?

                                                <option value={'0' + ind + ':' + '45'}>{'0' + ind + ':' + '45'}</option>



                                            : ind >= 10 && getSpecificRace.race_time == ind + ':' + '45:00' ?

                                                <option value={ind + ':' + '45'} selected>{ind + ':' + '45'}</option>

                                            : ind >= 10 && getSpecificRace.race_time !== ind + ':' + '45:00' ? 
                                            
                                                <option value={ind + ':' + '45'}>{ind + ':' + '45'}</option>

                                            :
                                                <>
                                                </>
                                            }

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

                                        getSpecificRace.race_duration == elem ?

                                            <option key={elem} value={elem} selected>{elem}</option>

                                            :
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
                                

                                <select className="main--div--register--form--input--race--level" name="main--div--register--form--input--race--level">

                                        <option value="bajo" selected={getSpecificRace.race_level == "bajo"}>Bajo</option>



                                        <option value="medio" selected={getSpecificRace.race_level == "medio"}>Medio</option>



                                        <option value="alto" selected={getSpecificRace.race_level == "alto"}>Alto</option>

                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="main--div--form--fieldset fieldset--howmany--users update--race">
                        <legend className="main--div--form--proposerace--where">Participantes</legend>

                        <span className="max--users--update--span">
                        Usuarios máximos: {getSpecificRace.number_users == -1 || isNaN(getSpecificRace.number_users) ? "Sin límites" : getSpecificRace.number_users}
                            <span className="max--users--update--span">
                                Participantes ya registrados: {Object.keys(getUsersParticipate).length}
                            </span>
                            <span className="max--users--update--span">
                                (Solo se puede elegir una cifra superior o igual a los participantes ya registrados)
                            </span>
                        </span>
                        
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

                            {   getSpecificRace.only_male == "yes" ?

                                <>
                                <div className="main--form--findrunners--checkbox--male--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--male">
                                            ¿Solo chicos?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--male" name="main--div--register--form--input--male" id="main--div--register--form--input--male" checked={isCheckedMale} onChange={handleCheckedMaleInput}/>
                                </div>

                                <div className="main--form--findrunners--checkbox--female--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--female">
                                            ¿Solo chicas?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--female" name="main--div--register--form--input--female" id="main--div--register--form--input--female" checked={isCheckedFemale} onChange={handleCheckedFemaleInput}/>
                                </div>
                                </>

                            :   getSpecificRace.only_female == "yes" ?
                                
                                <>
                                <div className="main--form--findrunners--checkbox--male--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--male">
                                            ¿Solo chicos?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--male" name="main--div--register--form--input--male" id="main--div--register--form--input--male" checked={isCheckedMale} onChange={handleCheckedMaleInput}/>
                                </div>

                                <div className="main--form--findrunners--checkbox--female--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--female">
                                            ¿Solo chicas?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--female" name="main--div--register--form--input--female" id="main--div--register--form--input--female" checked={isCheckedFemale} onChange={handleCheckedFemaleInput}/>
                                </div>
                                </>

                            :   

                                <>
                                <div className="main--form--findrunners--checkbox--male--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--male">
                                            ¿Solo chicos?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--male" name="main--div--register--form--input--male" id="main--div--register--form--input--male" checked={isCheckedMale} onChange={handleCheckedMaleInput}/>
                                </div>

                                <div className="main--form--findrunners--checkbox--female--wrap--div">
                                    <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--female">
                                            ¿Solo chicas?: 
                                    </label>
                                    <input type="checkbox" className="main--div--register--form--input--female" name="main--div--register--form--input--female" id="main--div--register--form--input--female" checked={isCheckedFemale} onChange={handleCheckedFemaleInput}/>
                                </div>
                                </>
                            }
                            
                        </div>

                    </fieldset>

                    <button type="submit" name="main--form--findrunners--button--submit" className="main--form--findrunners--button--submit" id="main--form--findrunners--button--submit">Modificar</button>

                </form>
            </div>
        </main>
    );
}