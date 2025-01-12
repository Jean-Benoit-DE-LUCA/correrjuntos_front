"use client";

export default function HomeTextClient() {

    return (
        <>
            {window.location.pathname == "/" &&
            <>
            <span className="container--text one">Amistad</span>
            <span className="container--text two">Motivación</span>
            <span className="container--text three">Energía</span>
            <span className="container--text four">Ritmo</span>
            {/* <span className="container--text five">Entrenamiento</span>
            <span className="container--text six">Apoyo</span> */}
            </>
            }
        </>
    );
}