"use client";

import { GetUserInterface, UserContext, UtilsContext } from "../../src/app/layout";

import shoe from "../../public/assets/pictures/shoe.png";
import runningShoe from "../../public/assets/pictures/running-shoe.png";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

import { useContext, useEffect } from "react";

export default function Header(props: any) {

    const router = useRouter();

    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);

    const handleClickMenu = (e: React.MouseEvent<HTMLDivElement>) => {

        const main = (document.getElementsByClassName("main")[0] as HTMLElement);
        const anchorNav = (document.getElementsByClassName("nav--ul--anchor") as HTMLCollectionOf<HTMLAnchorElement>);

        if (e.currentTarget.className == "header--h1--img--wrap--div--menu") {

            const divWrapMenu = (document.getElementsByClassName("header--h1--img--wrap")[0] as HTMLDivElement);

            divWrapMenu.classList.toggle("active");

            if (divWrapMenu.classList.contains("active")) {

                divWrapMenu.classList.remove("active");
            }

            else if (!divWrapMenu.classList.contains("active")) {

                divWrapMenu.classList.add("active");
            }
        }

        else {

            e.currentTarget.classList.toggle("active");

            /*const main = (document.getElementsByClassName("main")[0] as HTMLElement);
            const anchorNav = (document.getElementsByClassName("nav--ul--anchor") as HTMLCollectionOf<HTMLAnchorElement>);*/

            e.currentTarget.classList.contains("active") ? main.classList.add("active") : setTimeout(() => main.classList.remove("active"), 200);
            
            if (e.currentTarget.classList.contains("active")) {

                Array.from(anchorNav).forEach( elem => elem.classList.add("active"));
            }

            else if (!e.currentTarget.classList.contains("active")) {

                Array.from(anchorNav).forEach( elem => elem.classList.remove("active"));
            }
        }
        /*e.currentTarget.classList.toggle("active");

        const main = (document.getElementsByClassName("main")[0] as HTMLElement);
        const anchorNav = (document.getElementsByClassName("nav--ul--anchor") as HTMLCollectionOf<HTMLAnchorElement>);

        e.currentTarget.classList.contains("active") ? main.classList.add("active") : main.classList.remove("active");
        
        if (e.currentTarget.classList.contains("active")) {

            Array.from(anchorNav).forEach( elem => elem.classList.add("active"));
        }

        else if (!e.currentTarget.classList.contains("active")) {

            Array.from(anchorNav).forEach( elem => elem.classList.remove("active"));
        }*/
    };

    const handleCloseMenu = () => {
        const divMenu = (document.getElementsByClassName("header--h1--img--wrap")[0] as HTMLDivElement);

        const anchorLinks = (document.getElementsByClassName("nav--ul--anchor") as HTMLCollectionOf<HTMLAnchorElement>);

        const mainElement = (document.getElementsByClassName("main")[0] as HTMLElement);

        if (divMenu.classList.contains("active")) {
            divMenu.classList.remove("active");

            Array.from(anchorLinks).forEach( elem => elem.classList.remove("active"));

            mainElement.classList.remove("active");
            
        }
    }

    const handleLogOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        sessionStorage.removeItem("lastActivity");

        userContext.setJwtFunction("");

        const getUserDataEmptyObject: GetUserInterface = {
            id: NaN,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            birthDate: "",
            streetNumber: NaN,
            streetName: "",
            zipCode: NaN,
            city: "",
            gender: "",
            picture: ""
        }
        userContext.setUserDataFunction(userContext.getUserData, getUserDataEmptyObject);
        userContext.setCount(1);
        router.push("/");
    };

    useEffect(() => {
        console.log(userContext.getUserData);
    }, [userContext.getCount]);

    return (

        <header className="header">
            <div className="header--h1--wrap">

                <div className="header--h1--wrap--anchor--menu">
                    <Link className="header--h1--anchor" href={"/"} onClick={handleCloseMenu}>
                        <h1 className="header--h1">Correr <span className="header--h1--span">Juntos</span></h1>
                    </Link>
                    
                    <div className="header--h1--img--wrap" onClick={handleClickMenu}>

                        <Image
                            className="header--h1--img"
                            src={runningShoe}
                            alt="shoe"
                            unoptimized
                        />
                        <div className="header--h1--img--wrap--div--menu" onClick={handleClickMenu}>
                            <span className="header--h1--img--wrap--div--menu--span"></span>
                            <span className="header--h1--img--wrap--div--menu--span"></span>
                            <span className="header--h1--img--wrap--div--menu--span"></span>
                        </div>

                        <nav className="nav">
                                <ul className="nav--ul">

                                    <Link className="nav--ul--anchor" href={"/"}>
                                        <span className="nav--ul--anchor--span">Inicio</span>
                                        <li className="nav--ul--li">
                                            Inicio
                                        </li>
                                    </Link>     

                                    <Link className="nav--ul--anchor" href={"/register"}>
                                        <span className="nav--ul--anchor--span">Crear cuenta</span>
                                        <li className="nav--ul--li">
                                            Crear cuenta
                                        </li>
                                    </Link>

                                    {userContext.getUserData.email !== undefined && userContext.getUserData.email.length > 0 ?

                                        (

                                        <>
                                        <Link className="nav--ul--anchor" href={"/profile"}>
                                            <span className="nav--ul--anchor--span">Perfil</span>
                                            <li className="nav--ul--li">
                                                Perfil
                                            </li>
                                        </Link>

                                        <Link className="nav--ul--anchor" href={"/logout"} onClick={handleLogOut}>
                                            <span className="nav--ul--anchor--span">Cerrar sesión</span>
                                            <li className="nav--ul--li">
                                                Cerrar sesión
                                            </li>
                                        </Link>

                                        <Link className="nav--ul--anchor" href={"/myraces"}>
                                            <span className="nav--ul--anchor--span">Mis carreras</span>
                                            <li className="nav--ul--li">
                                                Mis carreras
                                            </li>
                                        </Link>
                                        </>

                                        ) :

                                        <Link className="nav--ul--anchor" href={"/signin"}>
                                            <span className="nav--ul--anchor--span">Iniciar sesión</span>
                                            <li className="nav--ul--li">
                                                Iniciar sesión
                                            </li>
                                        </Link>

                                    }

                                    <Link className="nav--ul--anchor" href={"/findraces"}>
                                        <span className="nav--ul--anchor--span">Búsqueda de carreras</span>
                                        <li className="nav--ul--li">
                                            Búsqueda de carreras
                                        </li>
                                    </Link>

                                    <Link className="nav--ul--anchor" href={"/proposerace"}>
                                        <span className="nav--ul--anchor--span">Proponer una carrera</span>
                                        <li className="nav--ul--li">
                                            Proponer una carrera
                                        </li>
                                    </Link>


                                </ul>
                        </nav>

                    </div>
                </div>
            </div>
            
            {/*userContext.getUserData.firstName !== "" ?

                <span className="span--user">Bienvenido {userContext.getUserData.firstName}</span>

            :   <>
                </>

            */}
        </header>
        
    );
}