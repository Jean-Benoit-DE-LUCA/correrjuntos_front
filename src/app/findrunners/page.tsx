"use client";

import { Fragment } from "react";

export default function FindRunners() {

    const handleClickCheckBoxEvery = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.id.includes("first--checkbox")) {

            const inputDate = (document.getElementsByClassName("main--div--register--form--input--birthdate")[0] as HTMLInputElement);

            if (e.target.checked) {

                inputDate.classList.add("active");
            }

            else if (!e.target.checked) {

                inputDate.classList.remove("active");
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

    return (
        <main className="main">

            <h2 className="main--h2">Encuentra un compañero de carrera</h2>

            <div className="main--div main--div--findrunners">
                <p className="main--div--p">
                    Haz tu búsqueda y recorre kilómetros!
                </p>

                <form className="main--form--findrunners" method="POST">

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--city">
                            Ciudad:
                        </label>
                        <input className="main--div--register--form--input--city" type="text" name="main--div--register--form--input--city" id="main--div--register--form--input--city" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--birthdate">
                            Fecha:
                        </label>

                        <input className="main--div--register--form--input--birthdate" type="date" name="main--div--register--form--input--birthdate" id="main--div--register--form--input--birthdate" />

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
                                        <option value={ind + 'h' + '00'}>{ind + 'h' + '00'}</option>
                                        <option value={ind+ 'h' + '30'}>{ind + 'h' + '30'}</option>
                                    </Fragment>
                                )}

                            </select>

                            <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--hour--end">
                            y:
                            </label>
                            <select className="main--div--register--form--input--hour--end" name="main--div--register--form--input--hour--end" id="main--div--register--form--input--hour--end">
                                {Array.from(Array(24)).map( (elem, ind) => 
                                    <Fragment key={ind}>
                                        <option key={ind} value={ind + 'h' + '00'}>{ind + 'h' + '00'}</option>
                                        <option key={24+ind} value={ind+ 'h' + '30'}>{ind + 'h' + '30'}</option>
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
        </main>
    );
}