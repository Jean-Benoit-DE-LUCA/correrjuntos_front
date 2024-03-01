"use client";

import { useContext, useEffect } from "react";

import BackButton from "../../../components/BackButton/page";

import { UserContext, UtilsContext } from "../container";



export default function Contact() {

    const utilsContext = useContext(UtilsContext);
    const userContext = useContext(UserContext);

    const handleSubmitContact = async (e: React.FormEvent) => {

        e.preventDefault();

        const firstName = (document.getElementsByClassName("main--div--register--form--input--firstname")[0] as HTMLInputElement);
        const lastName = (document.getElementsByClassName("main--div--register--form--input--lastname")[0] as HTMLInputElement);
        const email = (document.getElementsByClassName("main--div--register--form--input--email")[0] as HTMLInputElement);
        const message = (document.getElementsByClassName("main--div--register--form--textarea--message")[0] as HTMLTextAreaElement);

        const divError = (document.getElementsByClassName("error--div")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);


        if (firstName.value == "" || lastName.value == "" || email.value == "" || message.value == "") {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
            divErrorPelement.textContent = "Gracias por completar todos los campos vacíos."
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);
        }

        else {

            const response = await fetch(`http://localhost:8080/api/contact/send`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": userContext.jwt
                },
                body: JSON.stringify({
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    message: message.value
                })
            });

            const responseData = await response.json();

            if (responseData.hasOwnProperty("success")) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                divErrorPelement.textContent = "Mensaje enviado con éxito.";
                divError.classList.add("active");

                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);
            }

            else if (responseData.hasOwnProperty("error")) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
                divErrorPelement.textContent = "Se ha producido un error. Por favor, inténtalo de nuevo.";
                divError.classList.add("active");

                setTimeout(() => {
                    divError.classList.remove("active");
                }, 3000);
            }
        }
    };

    useEffect(() => {
        utilsContext.setBackButton(window.location.pathname);
    }, []);

    return (

        <main className="main">

        <BackButton pathname={utilsContext.backButton}/>

            <h2 className=" contact">Si tienes alguna pregunta, no dudes en contactarnos</h2>
            
            <div className="main--div main--div--register">

                <div className="error--div contact">
                    <p className="error--div--p">

                    </p>
                </div>

                <h2 className="main--div--register--title">
                    Contacto
                </h2>

                <form className="main--div--register--form" onSubmit={handleSubmitContact}>
                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--firstname">
                            Nombre*:
                        </label>
                        <input className="main--div--register--form--input--firstname" type="text" name="main--div--register--form--input--firstname" id="main--div--register--form--input--firstname" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--lastname">
                            Apellido*:
                        </label>
                        <input className="main--div--register--form--input--lastname" type="text" name="main--div--register--form--input--lastname" id="main--div--register--form--input--lastname" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--email">
                            Correo electrónico*:
                        </label>
                        <input className="main--div--register--form--input--email" type="email" name="main--div--register--form--input--email" id="main--div--register--form--input--email" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--textarea--message">
                            Mensaje*:
                        </label>
                        <textarea className="main--div--register--form--textarea--message" name="main--div--register--form--textarea--message" id="main--div--register--form--textarea--message"></textarea>
                    </div>

                    

                    <button className="main--div--register--form--button--submit" type="submit" name="main--div--register--form--button--submit">Validar
                    <span className="hover--button--span"></span>
                    </button>

                </form>
            </div>
        </main>
    );
}