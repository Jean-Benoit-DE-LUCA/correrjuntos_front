"use client";

import "../../public/assets/css/style.css";
import Header from "../../components/Header/page";
import Footer from "../../components/Footer/page";
import DynamicHomeText from "../../components/HomeText/page";

import { createContext, useEffect, useState } from "react";

export interface RaceInterface {
    id: number;
    city: string;
    createdAt: string;
    furtherDetails: string;
    nameStreet: string;
    numberStreet: number;
    numberUsers: number;
    onlyMale: string;
    onlyFemale: string;
    raceDate: string;
    raceDuration: string;
    raceTime: string;
    userId: number;
}

export interface GetUserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  streetNumber: number;
  streetName: string;
  zipCode: number;
  city: string;
  gender: string;
  picture: string;
}

export interface UserInterface {
  getCount: number;
  setCount(num: number): void;
  getUserData: GetUserInterface;
  setUserDataFunction(objInit: object, objAdd: object): void;
  message: string;
  setMessage(mess: string): void;
  jwt: string;
  setJwtFunction(token: string): void;
  setCookieFunction(): void;
}

export const UserContext = createContext<UserInterface>({
  getCount: 0,
  setCount: () => {},
  getUserData: {
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
  },
  setUserDataFunction: () => {},
  message: "",
  setMessage: () => {},
  jwt: "",
  setJwtFunction: () => {},
  setCookieFunction: () => {}
});

export interface UtilsInterface {
  backButton: string,
  setBackButton(path: string): void
}

export const UtilsContext = createContext<UtilsInterface>({
  backButton: "",
  setBackButton: (path: string) => {}
});






export default function Container({children,}: {children: React.ReactNode}) {

    const [getUserData, setUserData] = useState<GetUserInterface>({
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
      });
    
      const setUserDataFunction = (objInit: GetUserInterface, objAdd: GetUserInterface) => {
        setUserData(Object.assign(objInit, objAdd));
      };
    
    
    
    
      const [getCount, setCount] = useState<number>(0);
    
      const setCountFunction = (num: number) => {
        setCount(getCount + num);
      };
    
    
    
    
    
      const [getMessage, setMessage] = useState<string>("");
    
      const setMessageFunction = (mess: string) => {
        setMessage(mess);
      };
    
    
    
    
    
      const [getJwt, setJwt] = useState<string>("");
    
      const setJwtFunction = (token: string) => {
        setJwt(token);
      };
    
    
    
    
    
    
      // GET COOKIE USER + JWT //
    
      const setCookieFunction = () => {
    
        if (document.cookie.length > 0) {
    
          const splitCookie = document.cookie.split(";");
    
    
          for (let i = 0; i < splitCookie.length; i++) {
    
            if (splitCookie[i].trim().startsWith("user=")) {
    
              const userObjCookie = JSON.parse(splitCookie[i].replace("user=", ""));
    
              setUserData(Object.assign(getUserData, userObjCookie));
            }
    
            if (splitCookie[i].trim().startsWith("token=")) {
    
              const tokenCookie = splitCookie[i].replace(" token=", "");
    
              setJwt(tokenCookie);
            }
          }
        }
      };
    
    
    
      useEffect(() => {
    
        setCookieFunction();
      }, []);
    
    
    
    
    
    
    
    
      const userContextObject = {
        getCount: getCount,
        setCount: setCountFunction,
        getUserData: getUserData,
        setUserDataFunction: setUserDataFunction,
        message: getMessage,
        setMessage: setMessageFunction,
        jwt: getJwt,
        setJwtFunction: setJwtFunction,
        setCookieFunction: setCookieFunction
      };
    
    
    
    
        
    
    
    
    
    
    
      const [getBackButton, setBackButton] = useState<string>("");
    
      const setBackButtonFunc = (path: string) => {
    
        setBackButton(path);
      };
    
    
    
    
      const utilsContextObject: UtilsInterface = {
        backButton: getBackButton,
        setBackButton: setBackButtonFunc
      };
    
    
    
    
      const handleLogOut = () => {
    
        sessionStorage.removeItem("lastActivity");

        document.cookie = `user=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    
        setJwt("");
    
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
    
        document.removeEventListener("mousemove", timerSet);
        setUserDataFunction(getUserData, getUserDataEmptyObject);
        setCount(getCount + 1);
      };
    
    
    
    
      const handleTimerLogout = () => {
    
        sessionStorage.setItem("lastActivity", new Date().toString());
    
      };
    
    
    
    
      const timerSet: any = handleTimerLogout;
    
      useEffect(() => {
    
        let intervalTimer: NodeJS.Timeout;
    
        if (getUserData.email.length > 0) {
    
            sessionStorage.setItem("lastActivity", new Date().toString());
    
            document.addEventListener("mousemove", timerSet);
            document.addEventListener("touchend", timerSet);
    
            intervalTimer = setInterval(() => {
    
              const lastActivityDateInitial = new Date(sessionStorage.getItem("lastActivity") || "");
    
              const expireDate = new Date(lastActivityDateInitial.setMilliseconds(7200000));
    
              if (expireDate < new Date()) {
    
                handleLogOut();
              }
            }, 10000);
        }
    
        return () => {
    
          if (getUserData.email.length == 0) {
    
            document.removeEventListener("mousemove", timerSet);
            document.removeEventListener("touchend", timerSet);
            clearInterval(intervalTimer);
          }
        }
    
      }, [getCount]);




    
    
    
    
      useEffect(() => {
    
        setBackButton(window.location.pathname);
      }, []);


      

    return (

        <div className="container">
            <UserContext.Provider value={userContextObject}>
            <UtilsContext.Provider value={utilsContextObject}>

            <DynamicHomeText />

            <Header />
                {children}
            <Footer />

            </UtilsContext.Provider>
            </UserContext.Provider>
        </div>
    );
}