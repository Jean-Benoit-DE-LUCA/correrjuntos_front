"use client";

import { useRouter } from "next/navigation";

import { UserContext, UtilsContext } from "../container";

import { useContext, useEffect } from "react";
import BackButton from "../../../components/BackButton/page";

export default function SignIn() {

    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);

    const router = useRouter();

    const handleSubmitSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const email = (document.getElementsByClassName("main--div--register--form--input--email")[0] as HTMLInputElement);
        const password = (document.getElementsByClassName("main--div--register--form--input--password")[0] as HTMLInputElement);

        const divError = (document.getElementsByClassName("error--div")[0] as HTMLDivElement);
        const divErrorPelement = (document.getElementsByClassName("error--div--p")[0]);

        if (email.value == "" || password.value == "") {

            document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
            divErrorPelement.textContent = "Gracias por completar todos los campos vacíos."
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);
        }

        else {

            const response = await fetch("http://localhost:8080/api/user/signin", {

                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            });

            const responseData = await response.json();

            if (responseData.flag) {

                userContext.setJwtFunction(responseData.token);

                userContext.setUserDataFunction(userContext.getUserData, responseData.result);

                

                const stringUserData = JSON.stringify(responseData.result);
                
                document.cookie = `user=${stringUserData};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
                document.cookie = `token=${responseData.token};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;


                userContext.setCount(1);

                document.documentElement.style.setProperty('--divErrorColor', '#0eab2a');
                divErrorPelement.textContent = "Usuario autenticado con éxito.";
                divError.classList.add("active");
                
                setTimeout(() => {
                    divError.classList.remove("active");
                    router.push("/");
                }, 3000);
            }

            else if (!responseData.flag) {

                if (responseData.error.startsWith("User not")) {

                    document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
                    divErrorPelement.textContent = "Usuario no encontrado.";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                    }, 3000);
                }

                else if (responseData.error.startsWith("Empty")) {

                    document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
                    divErrorPelement.textContent = "No se permiten campos libres."
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                    }, 3000);
                }

                else if(responseData.error.startsWith("The passwords")) {

                    document.documentElement.style.setProperty('--divErrorColor', '#ff0000');
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
        }
    };

    useEffect(() => {
        utilsContext.setBackButton(window.location.pathname);
    }, []);

    return (
        <main className="main">

                <BackButton pathname={utilsContext.backButton}/>

                <div className="error--div error--div--signin">
                    <p className="error--div--p">

                    </p>
                </div>

            <div className="main--div main--div--register main--div--signin">

                <h2 className="main--div--register--title">
                    Iniciar sesión
                </h2>

                <form className="main--div--register--form main--div--signin--form" method="POST" onSubmit={handleSubmitSignIn}>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--email">
                            Correo electrónico:
                        </label>
                        <input className="main--div--register--form--input--email" type="email" name="main--div--register--form--input--email" id="main--div--register--form--input--email" />
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--password">
                            Contraseña:
                        </label>
                        <input className="main--div--register--form--input--password" type="password" name="main--div--register--form--input--password" id="main--div--register--form--input--password" autoComplete="off"/>
                    </div>

                    <button className="main--div--signin--form--button--submit" name="main--div--signin--form--button--submit">Validar</button>

                </form>
            </div>
        </main>
    );
}