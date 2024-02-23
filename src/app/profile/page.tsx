"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { GetUserInterface, UserContext, UtilsContext } from "../layout";
import BackButton from "../../../components/BackButton/page";

import filledStar from "../../../public/assets/pictures/star-filled.svg";
import emptyStar from "../../../public/assets/pictures/star-empty.svg";
import arrowRightLeft from "../../../public/assets/pictures/arrow-right-left.svg";

export default function Profile() {

    const userContext = useContext(UserContext);
    const utilsContext = useContext(UtilsContext);


    const [getUser, setUser] = useState<GetUserInterface>({
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





    const [fetchReviews, setFetchReviews] = useState<Array<any>>([]);
    // FETCH REVIEWS BY USER //

    const fetchReviewsByUserId = async (user_id: number) => {

        const response = await fetch(`http://localhost:8080/api/review/fetch/user_id/${userContext.getUserData.id}`);

        const responseData = await response.json();
        console.log(responseData);
        setFetchReviews(responseData);
    };




    // SET NEW PROPERTY VALUE TO GETUSER ONCHANGE //

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, property: string) => {

        let propUser = property;

        const cloneGetUser = Object.assign({}, getUser);
        (cloneGetUser as any)[propUser]= e.target.value;
        setUser(cloneGetUser);
    };




    // CHANGE FILE INPUT //

    const handleChangeFilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) {

            return;
        }

        const imgPicture = (document.getElementsByClassName("main--div--register--form--input--picture--img")[0] as HTMLInputElement);

        const reader = new FileReader();

        reader.onload = (event) => {

            imgPicture.src = event.target?.result as string;
        }

        reader.readAsDataURL(e?.target.files[0]);
    };

    // SUBMIT FORM PROFILE //

    const handleSubmitProfile = async (e: React.FormEvent) => {

        e.preventDefault();
        
        const picture = (document.getElementsByClassName("main--div--register--form--input--picture")[0] as HTMLInputElement);
        const pictureImg = (document.getElementsByClassName("main--div--register--form--input--picture--img")[0] as HTMLImageElement);

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

        // get current datetime to update name picture //

        const dateTime = new Date();

        const currentDateTime = "__" + dateTime.getFullYear() + "_" + (Number(dateTime.getMonth()) + 1).toString() + "_" + dateTime.getUTCDate() + "__" + dateTime.getHours() + "_" + dateTime.getMinutes() + "_" + dateTime.getSeconds();

        let fullNamePicture = "";

        try {

            const namePicture = (picture.files as any)[0].name.substring(0, (picture.files as any)[0].name.lastIndexOf("."));
            const extensionPicture = (picture.files as any)[0].name.substring((picture.files as any)[0].name.lastIndexOf("."));

            fullNamePicture = namePicture + currentDateTime + extensionPicture;
        }
        catch (error) {

            fullNamePicture = "";
        }

        // conditions before submit FormData //

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

        else if (password.value !== passwordConfirm.value) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
            divErrorPelement.textContent = "Las contraseñas no coinciden.";
            divError.classList.add("active");

            setTimeout(() => {
                divError.classList.remove("active");
            }, 3000);
        }

        else if (password.value == passwordConfirm.value) {

            const formData = new FormData();

            try {
                formData.append("file", (picture.files as any)[0], fullNamePicture);
            }
            catch (error) {
                
                // if user has clicked on delete picture button or user has no picture yet //

                if (pictureImg.src.endsWith("no_image.png")) {

                    formData.append("noImage", "noImage");
                }
            }
            formData.append("firstName", firstName.value);
            formData.append("lastName", lastName.value);
            formData.append("email", email.value);
            formData.append("birthDate", birthDate.value);
            formData.append("gender", gender.value);
            formData.append("streetNumber", streetNumber.value);
            formData.append("streetName", streetName.value);
            formData.append("zipCode", zipCode.value);
            formData.append("city", city.value);
            formData.append("password", password.value);
    
    
            const response = await fetch(`http://localhost:8080/api/user/profile/${userContext.getUserData.id}`, {
                method: "POST",
                body: formData
            });
    
            const responseData = await response.json();
            
            if (responseData.hasOwnProperty("flag")) {

                if (responseData.flag) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    document.documentElement.style.setProperty("--divErrorColor", "#0eab2a");
                    divErrorPelement.textContent = "Perfil modificado con éxito.";
                    divError.classList.add("active");

                    setTimeout(() => {
                        divError.classList.remove("active");
                    }, 3000);

                    if (responseData.hasOwnProperty("userObj")) {

                        const newUserObj: GetUserInterface = {
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
                        };
                        
                        for (const key of Object.keys(responseData.userObj)) {

                            key == "id" ? newUserObj[key] = responseData.userObj[key] :
                            key == "first_name" ? newUserObj["firstName"] = responseData.userObj[key] :
                            key == "last_name" ? newUserObj["lastName"] = responseData.userObj[key] :
                            key == "email" ? newUserObj["email"] = responseData.userObj[key] :
                            key == "password" ? newUserObj["password"] = responseData.userObj[key] :
                            key == "birth_date" ? newUserObj["birthDate"] = responseData.userObj[key] :
                            key == "street_number" ? newUserObj["streetNumber"] = responseData.userObj[key] :
                            key == "street_name" ? newUserObj["streetName"] = responseData.userObj[key] :
                            key == "zip_code" ? newUserObj["zipCode"] = responseData.userObj[key] :
                            key == "city" ? newUserObj["city"] = responseData.userObj[key] :
                            key == "gender" ? newUserObj["gender"] = responseData.userObj[key] :
                            key == "picture" ? newUserObj["picture"] = responseData.userObj[key] :
                            ""
                        }

                        userContext.setUserDataFunction(userContext.getUserData, newUserObj);
                    }
                }

                else if (!responseData.flag) {


                    if (responseData.hasOwnProperty("error") && responseData.error.startsWith("Max upload")) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "El tamaño del archivo excede el máximo permitido (5 MB)";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }

                    else if (responseData.hasOwnProperty("error") && responseData.error.startsWith("File extension")) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                        document.documentElement.style.setProperty("--divErrorColor", "#ff0000");
                        divErrorPelement.textContent = "Extensión de archivo no aceptada";
                        divError.classList.add("active");

                        setTimeout(() => {
                            divError.classList.remove("active");
                        }, 3000);
                    }
                }
            }
        }
    };

    const handleCrossClickDelete = (e: React.MouseEvent) => {

        const picture = (document.getElementsByClassName("main--div--register--form--input--picture")[0] as HTMLInputElement);
        const pictureImage = (document.getElementsByClassName("main--div--register--form--input--picture--img")[0] as HTMLImageElement);
        
        picture.value = "";
        pictureImage.src = "http://localhost:8080/pictures/no_image.png";
    };







    // MANAGE SWITCH ELEMENTS //

    const handleClickSwitch = (e: React.MouseEvent) => {

        const divProfile = (document.getElementsByClassName("main--div--register main--div--profile")[0] as HTMLDivElement);
        divProfile.classList.toggle("active");

        const divReview = (document.getElementsByClassName("main--div--register main--div--profile--review")[0] as HTMLDivElement);
        divReview.classList.remove("off");
        divReview.classList.toggle("active");
    };






    // DELETE REVIEW //

    const handleClickDeleteReview = async (e: React.MouseEvent, review_id: number) => {

        e.preventDefault();
        
        (e.currentTarget.getElementsByClassName("profile--review--ul--li--button--delete--confirm--div")[0] as HTMLDivElement).classList.add("active");
    };






    // CONFIRM DELETE REVIEW //

    const handleClickConfirmDeleteReview = async (e: React.MouseEvent, review_id: number) => {

        e.preventDefault();
        e.stopPropagation();

        const liParentElement = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;

        liParentElement?.classList.add("remove");

        setTimeout(() => {

            liParentElement?.remove();
        }, 600);

        //

        const response = await fetch(`http://localhost:8080/api/review/delete/${review_id}/email/${userContext.getUserData.email}`, {

            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": userContext.jwt
            }
        });

        const responseData = await response.json();

        console.log(responseData);
    };






    // CANCEL DELETE REVIEW //

    const handleClickCancelDeleteReview = (e: React.MouseEvent, review_id: number) => {

        e.preventDefault();
        e.stopPropagation();

        const confirmBoxAll = (document.getElementsByClassName("profile--review--ul--li--button--delete--confirm--div") as HTMLCollectionOf<HTMLDivElement>);

        for (let ind = 0; ind < confirmBoxAll.length; ind++) {

            if ((confirmBoxAll[ind].getAttribute("data-id-review") as string) == review_id.toString()) {

                confirmBoxAll[ind].classList.remove("active");
            }
        }
    };


    useEffect(() => {

        userContext.setUserDataFunction(getUser, userContext.getUserData);
        fetchReviewsByUserId(userContext.getUserData.id);
    }, []);

    useEffect(() => {

        utilsContext.setBackButton(window.location.pathname);
    }, []);



    return (
        
        <main className="main">

            <BackButton pathname={utilsContext.backButton}/>

            <Image
                onClick={handleClickSwitch}
                className="image--switch"
                alt="arrow-switch"
                src={arrowRightLeft}
                height={0}
                width={0}
                unoptimized
            />
            
            <div className="main--div main--div--register main--div--profile active">

                <div className="error--div profile">
                    <p className="error--div--p">

                    </p>
                </div>

                <h2 className="main--div--register--title">
                    Perfil usuario
                </h2>

                <form className="main--div--register--form" method="POST" onSubmit={handleSubmitProfile}>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--picture">
                            Foto:
                        </label>
                        <input className="main--div--register--form--input--picture" type="file" name="main--div--register--form--input--picture" id="main--div--register--form--input--picture" onChange={handleChangeFilePicture}/>

                        <div className="main--div--register--form--input--picture--div">

                            {getUser.picture == "" || getUser.picture == null ?
                            
                                <Image
                                    className="main--div--register--form--input--picture--img"
                                    src={`http://localhost:8080/pictures/no_image.png`}
                                    alt="user-picture"
                                    height={0}
                                    width={0}
                                    unoptimized
                                />

                            :
                        
                                <Image
                                    className="main--div--register--form--input--picture--img"
                                    src={`http://localhost:8080/uploads/${getUser.picture}`}
                                    alt="user-picture"
                                    height={0}
                                    width={0}
                                    unoptimized
                                />

                            }
                        </div>
                        
                        <div className="upload--delete--picture--wrap">
                            <label className="main--div--register--form--label picture" htmlFor="main--div--register--form--input--picture">
                                Subir imágen
                            </label>
                            <button type="button" className="delete--picture" name="delete--picture" id="delete--picture" onClick={handleCrossClickDelete}>X</button>
                        </div>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--firstname">
                            Nombre*:
                        </label>
                        <input className="main--div--register--form--input--firstname" type="text" name="main--div--register--form--input--firstname" id="main--div--register--form--input--firstname" value={getUser.firstName} onChange={(e) => handleChangeInput(e, "firstName")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--lastname">
                            Apellido*:
                        </label>
                        <input className="main--div--register--form--input--lastname" type="text" name="main--div--register--form--input--lastname" id="main--div--register--form--input--lastname" value={getUser.lastName} onChange={(e) => handleChangeInput(e, "lastName")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--birthdate">
                            Fecha de nacimiento*:
                        </label>
                        <input className="main--div--register--form--input--birthdate" type="date" name="main--div--register--form--input--birthdate" id="main--div--register--form--input--birthdate" value={getUser.birthDate} onChange={(e) => handleChangeInput(e, "birthDate")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--select--gender">
                            Género*:
                        </label>

                        <select className="main--div--register--form--select--gender" name="main--div--register--form--select--gender" id="main--div--register--form--select--gender" value={getUser.gender} onChange={(e) => handleChangeInput(e, "gender")}>
                            
                            <option value="male" >Hombre</option>
                            <option value="female" >Mujer</option>

                        </select>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--email">
                            Correo electrónico*:
                        </label>
                        <input className="main--div--register--form--input--email" type="email" name="main--div--register--form--input--email" id="main--div--register--form--input--email" value={getUser.email} onChange={(e) => handleChangeInput(e, "email")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--number">
                            Número de calle:
                        </label>
                        <input className="main--div--register--form--input--street--number" type="number" name="main--div--register--form--input--street--number" id="main--div--register--form--input--street--number" value={getUser.streetNumber == -1 || Number.isNaN(getUser.streetNumber) ? "" : getUser.streetNumber} onChange={(e) => handleChangeInput(e, "streetNumber")}/* not required *//>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--street--name">
                            Nombre de calle*:
                        </label>
                        <input className="main--div--register--form--input--street--name" type="text" name="main--div--register--form--input--street--name" id="main--div--register--form--input--street--name" value={getUser.streetName} onChange={(e) => handleChangeInput(e, "streetName")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--zip--code">
                            Código postal*:
                        </label>
                        <input className="main--div--register--form--input--zip--code" type="number" name="main--div--register--form--input--zip--code" id="main--div--register--form--input--zip--code" value={Number.isNaN(getUser.zipCode) ? "" : getUser.zipCode} onChange={(e) => handleChangeInput(e, "zipCode")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--city">
                            Ciudad*:
                        </label>
                        <input className="main--div--register--form--input--city" type="text" name="main--div--register--form--input--city" id="main--div--register--form--input--city" value={getUser.city} onChange={(e) => handleChangeInput(e, "city")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--password">
                            Contraseña*:
                        </label>
                        <input className="main--div--register--form--input--password" type="password" name="main--div--register--form--input--password" id="main--div--register--form--input--password" autoComplete="off" onChange={(e) => handleChangeInput(e, "password")}/>
                    </div>

                    <div className="main--div--register--form--wrap--label--input">
                        <label className="main--div--register--form--label" htmlFor="main--div--register--form--input--password--confirm">
                            Confirmar contraseña*:
                        </label>
                        <input className="main--div--register--form--input--password--confirm" type="password" name="main--div--register--form--input--password--confirm" id="main--div--register--form--input--password--confirm" autoComplete="off"/>
                    </div>

                    <button className="main--div--register--form--button--submit" type="submit" name="main--div--register--form--button--submit">Validar
                    <span className="hover--button--span"></span>
                    </button>

                </form>
            </div>




            <div className="main--div main--div--register main--div--profile--review off">

                <div className="error--div profile">
                    <p className="error--div--p">

                    </p>
                </div>

                <h2 className="main--div--register--title">
                    Reseñas
                </h2>

                <ul className="profile--review--ul">
                    
                    {Object.keys(fetchReviews).map((elem, ind) => 
                        
                       <li className="profile--review--ul--li" key={ind}>

                            <button className="profile--review--ul--li--button--delete" name="profile--review--ul--li--button--delete" type="button" onClick={(e) => handleClickDeleteReview(e, (fetchReviews as any)[elem].review_id)}>
                                <div className="profile--review--ul--li--button--delete--div--wrap">
                                    <span className="profile--review--ul--li--button--delete--span">X</span>

                                    <div className="profile--review--ul--li--button--delete--confirm--div" data-id-review={(fetchReviews as any)[elem].review_id}>
                                        <span className="profile--review--ul--li--button--delete--confirm--div--span--text">¿Estás seguro de eliminar esta reseña?"</span>

                                        <div className="profile--review--ul--li--button--delete--confirm--div--yes--no--div">
                                            <span className="profile--review--ul--li--button--delete--confirm--div--yes--no--div--yes" onClick={(e) => handleClickConfirmDeleteReview(e, (fetchReviews as any)[elem].review_id)}>Sí</span>
                                            <span className="profile--review--ul--li--button--delete--confirm--div--yes--no--div--no" onClick={(e) => handleClickCancelDeleteReview(e, (fetchReviews as any)[elem].review_id)}>No</span>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            <div className="profile--review--ul--li--div">

                                <span className="profile--review--ul--li--span--firstname">{(fetchReviews as any)[elem].users_first_name}</span>
                                
                                <div className="profile--review--ul--li--div--wrap--stars">
                                    {Array.from(Array(Number((fetchReviews as any)[elem].review_rate)) as any).map((num, ind) =>
                                        <Fragment key={ind}>
                                        <Image
                                            key={ind}
                                            className="profile--star"
                                            alt="star"
                                            src={filledStar}
                                            height={0}
                                            width={0}
                                        />
                                        </Fragment>
                                    )}

                                    {Array.from(Array(5 - Number((fetchReviews as any)[elem].review_rate)) as any).map((num, ind) =>
                                        <Fragment key={ind}>
                                        <Image
                                            key={ind}
                                            className="profile--star"
                                            alt="star"
                                            src={emptyStar}
                                            height={0}
                                            width={0}
                                        />
                                        </Fragment>
                                    )}


                                </div>

                                <span className="profile--review--ul--li--span--comment">{(fetchReviews as any)[elem].review_comment}</span>

                                <span className="profile--review--ul--li--span--datetime">{(fetchReviews as any)[elem].review_created_at}</span>
                            </div>
                       </li>     
                        
                    )}
                </ul>

                <div className="main--div--register--form profile--opinion">

                </div>
            </div>
        </main>
    );
}