"use client";

import "../../public/assets/css/style.css";
import Header from "../../components/Header/page";

import { createContext, useEffect, useState } from "react";

export interface RaceInterface {
    id: number;
    city: string;
    createdAt: string;
    furtherDetails: string;
    nameStreet: string;
    numberStreet: number;
    numberUsers: number;
    raceDate: string;
    raceDuration: string;
    raceTime: string;
    userId: number;
}

/*export const RaceContext = createContext<RaceInterface>({
  id: NaN,
  city: "",
  further_details: "",
  streetName: "",
  streetNumber: NaN,
  number_users: NaN,
  race_date: "",
  race_duration: "",
  race_time: "",
  user_id: NaN,
})*/

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
  },
  setUserDataFunction: () => {},
  message: "",
  setMessage: () => {},
  jwt: "",
  setJwtFunction: () => {}
});

export default function RootLayout({ children, }: {children: React.ReactNode}) {

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
    city: ""
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

  const userContextObject = {
    getCount: getCount,
    setCount: setCountFunction,
    getUserData: getUserData,
    setUserDataFunction: setUserDataFunction,
    message: getMessage,
    setMessage: setMessageFunction,
    jwt: getJwt,
    setJwtFunction: setJwtFunction
  };

  /*const raceContextObject = {

  }*/

  useEffect(() => {
    console.log(getUserData);
  }, [getCount])

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Caption&display=swap" rel="stylesheet"/>
      </head>
      
      <UserContext.Provider value={userContextObject}>
        <body>
          <div className="container">
            <Header />
            {children}
          </div>
        </body>
      </UserContext.Provider>
    </html>
  );
}
