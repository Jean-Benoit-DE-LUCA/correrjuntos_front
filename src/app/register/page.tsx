"use client";

import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import { FormEvent, useContext, useEffect } from "react";

import { useState } from "react";
import { UserContext, UtilsContext } from "../layout";
import BackButton from "../../../components/BackButton/page";

export default function Register() {

    const router = useRouter();

    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);

    const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        
        const firstName = (document.getElementsByClassName("main--div--register--form--input--firstname")[0] as HTMLInputElement);
        const lastName = (document.getElementsByClassName("main--div--register--form--input--lastname")[0] as HTMLInputElement);
        const email = (document.getElementsByClassName("main--div--register--form--input--email")[0] as HTMLInputElement);
        const birthDate = (document.getElementsByClassName("main--div--register--form--input--birthdate")[0] as HTMLInputElement);
        const gender = (document.getElementsByClassName("main--div--register--form--select--gender")[0] as HTMLSelectElement);
        const streetNumber = (document.getElementsByClassName("main--div--register--form--input--street--number")[0] as HTMLInputElement);
        const streetName = (document.getElementsByClassName("main--div--register--form--input--street--name")[0] as HTMLInputElement);
        const zipCode = (document.getElementsByClassName("main--div--register--form--input--zip--code")[0] as HTMLInputElement);
        const city = (document.getElementsByClassName("main--div--register--form--input--city")[0] as HTMLInputElement);
        const password = (document.getElementsByClassName("main--div--register--form--input--password")[0] as HTMLInputElement);
        const passwordConfirm = (document.getElementsByClassName("main--div--register--form--input--password--confirm")[0] as HTMLInputElement);

        const divError = (document.getElementsByClassName("error--div")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);

        if (firstName.value == "" || lastName.value == "" || email.value == "" || birthDate.value == "" || streetName.value == "" || zipCode.value == "" || city.value == "" || password.value == "" || passwordConfirm.value == "") {

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

            if (password.value == passwordConfirm.value) {

                const response = await fetch("http://localhost:8080/api/user/register", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName: firstName.value,
                        lastName: lastName.value,
                        email: email.value,
                        birthDate: birthDate.value,
                        gender: gender.value,
                        streetNumber: streetNumber.value,
                        streetName: streetName.value,
                        zipCode: zipCode.value,
                        city: city.value,
                        password: password.value,
                        passwordConfirm: passwordConfirm.value
                    })
                });

                const responseData = await response.json();

                if (responseData.hasOwnProperty("error")) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    if (responseData.error.startsWith("Email")) {

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "Correo electrónico ya registrado.";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }

                    else if (responseData.error.startsWith("Missing")) {

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "Propiedades faltantes.";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }

                    else if (responseData.error.startsWith("The passwords")) {

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "Las contraseñas no coinciden.";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }

                    else if (responseData.error.startsWith("Invalid character")) {

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "Algunos caracteres no están permitidos.";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }
                }

                else {

                    userContext.setJwtFunction(responseData.token);

                    userContext.setUserDataFunction(userContext.getUserData, responseData.user);
                    userContext.setCount(1);

                    document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                    divErrorPelement.textContent = "Usuario registrado con éxito.";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                    }, 3000);

                    setTimeout(() => {
                        router.push("/");
                    }, 3500);
                }

            }

            else {

                document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                divErrorPelement.textContent = "Las contraseñas no coinciden."
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

    console.log(userContext.getUserData);


    return (
        <main className="main">

            <BackButton pathname={utilsContext.backButton}/>
            
            <div className="main--div main--div--register">

                <div className="error--div">
                    <p className="error--div--p">

                    </p>
                </div>

                <h2 className="main--div--register--title">
                    Crear cuenta
                </h2>

                <form className="main--div--register--form" onSubmit={handleSubmitRegister}>
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
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--birthdate">
                            Fecha de nacimiento*:
                        </label>
                        <input className="main--div--register--form--input--birthdate" type="date" name="main--div--register--form--input--birthdate" id="main--div--register--form--input--birthdate" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--select--gender">
                            Género*:
                        </label>

                        <select className="main--div--register--form--select--gender" name="main--div--register--form--select--gender" id="main--div--register--form--select--gender">
                            
                            <option value="male">Hombre</option>
                            <option value="female">Mujer</option>

                        </select>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--email">
                            Correo electrónico*:
                        </label>
                        <input className="main--div--register--form--input--email" type="email" name="main--div--register--form--input--email" id="main--div--register--form--input--email" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--number">
                            Número de calle:
                        </label>
                        <input className="main--div--register--form--input--street--number" type="number" name="main--div--register--form--input--street--number" id="main--div--register--form--input--street--number" /* not required *//>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--name">
                            Nombre de calle*:
                        </label>
                        <input className="main--div--register--form--input--street--name" type="text" name="main--div--register--form--input--street--name" id="main--div--register--form--input--street--name" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--zip--code">
                            Código postal*:
                        </label>
                        <input className="main--div--register--form--input--zip--code" type="number" name="main--div--register--form--input--zip--code" id="main--div--register--form--input--zip--code" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--city">
                            Ciudad*:
                        </label>
                        <input className="main--div--register--form--input--city" type="text" name="main--div--register--form--input--city" id="main--div--register--form--input--city" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--password">
                            Contraseña*:
                        </label>
                        <input className="main--div--register--form--input--password" type="password" name="main--div--register--form--input--password" id="main--div--register--form--input--password" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--password--confirm">
                            Confirmar contraseña*:
                        </label>
                        <input className="main--div--register--form--input--password--confirm" type="password" name="main--div--register--form--input--password--confirm" id="main--div--register--form--input--password--confirm" />
                    </div>

                    <button className="main--div--register--form--button--submit" type="submit" name="main--div--register--form--button--submit">Validar
                    <span className="hover--button--span"></span>
                    </button>

                </form>
            </div>
        </main>
    );
}