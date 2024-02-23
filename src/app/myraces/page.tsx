"use client";

import { useContext, useEffect, useState } from "react";
import { RaceInterface, UserContext, UtilsContext } from "../layout";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BackButton from "../../../components/BackButton/page";

export default function MyRaces() {

    const router = useRouter();

    const [getRacesByUser, setRacesByUser] = useState<RaceInterface>({
        id: NaN,
        city: "",
        createdAt: "",
        furtherDetails: "",
        nameStreet: "",
        numberStreet: NaN,
        numberUsers: NaN,
        onlyMale: "",
        onlyFemale: "",
        raceDate: "",
        raceDuration: "",
        raceTime: "",
        userId: NaN,
      });
    
    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);

    const fetchRacesByUser = async () => {
        const response = await fetch(`http://localhost:8080/api/race/getracesbyuser/${userContext.getUserData.email}/${userContext.getUserData.id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": userContext.jwt
            }
        });
        const responseData = await response.json();

        const newObj = Object.assign({}, responseData.racesUser);
        const newObjCount = Object.assign({}, responseData.fetchCountUsersParticipate);

        const objFiltered: any = {};

        Object.keys(newObjCount).forEach( elemCount => {

            Object.keys(newObj).forEach( (elemRace, ind) => {

                if (newObj[elemRace].id == newObjCount[elemCount].id) {

                newObj[elemRace]["number_users_registered"] = newObjCount[elemCount].number_users_registered;
                }
            });
        });

        setRacesByUser(newObj);
    };

    useEffect(() => {
        utilsContext.setBackButton(window.location.pathname);
        fetchRacesByUser();
    }, []);

    console.log((getRacesByUser));
    
    return (
        <main className="main">

            <BackButton pathname={utilsContext.backButton}/>

            <div className="main--div my--races">

                <p className="main--div--p">Mis carreras</p>

                <ul className="main--div--ul--last--races">

                    {getRacesByUser !== undefined ?

                    Object.keys(getRacesByUser).map( (elem, ind) =>

                        <Link key={ind} href={`/races/${(getRacesByUser as any)[elem].id}`} className={`main--div--ul--last--races--anchor ${(getRacesByUser as any)[elem].race_level == "bajo" ? "low--level" : (getRacesByUser as any)[elem].race_level == "medio" ? "mid--level" : (getRacesByUser as any)[elem].race_level == "alto" ? "high--level" : ""}`}>

                            <li className="main--div--ul--last--races--li">

                                <span className="main--div--ul--last--races--li--id--race">{(getRacesByUser as any)[elem].id}</span>

                                <span className="main--div--ul--last--races--span--city">{(getRacesByUser as any)[elem].city}</span>

                                <div className="main--div--ul--last--races--date--time--wrap">
                                    <span className="main--div--ul--last--races--span--race--date">{(getRacesByUser as any)[elem].race_date}</span>

                                    <span className="main--div--ul--last--races--span--race--time">{(getRacesByUser as any)[elem].race_time !== undefined ?(getRacesByUser as any)[elem].race_time.substring(0, (getRacesByUser as any)[elem].race_time.lastIndexOf(":")) : ""}</span>
                                </div>

                                <div className="wrap--users--sex">
                                    <span className="span--number--users--registered">
                                    {(getRacesByUser as any)[elem].number_users_registered}
                                        /
                                    {(getRacesByUser as any)[elem].number_users == -1 ? 
                                        <Image
                                        className="infinite--img"
                                        alt="infinite-icon"
                                        src="../assets/pictures/infinite-icon.svg"
                                        width={15}
                                        height={15}
                                        /> 
                                        
                                        : 
                                        
                                        (getRacesByUser as any)[elem].number_users
                                    }
                                    </span>
                        
                                    { (getRacesByUser as any)[elem].only_male == "yes" ?

                                        <Image
                                        className="male-icon"
                                        alt="male-icon"
                                        src="../assets/pictures/male-icon.svg"
                                        width={15}
                                        height={15}
                                        />

                                    : (getRacesByUser as any)[elem].only_female == "yes" ?

                                        <Image
                                        className="male-icon"
                                        alt="male-icon"
                                        src="../assets/pictures/female-icon.svg"
                                        width={15}
                                        height={15}
                                        />

                                    : 
                                    
                                        <div className="image--simulate">

                                        </div>
                                    }

                                </div>
                            </li>
                        </Link>)
                    :

                        <>
                        </>
                    }
                    
                </ul>
            </div>
        </main>
    );
}