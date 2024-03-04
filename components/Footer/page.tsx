"use client";

import Link from "next/link";

export default function Footer() {

    return (
        <footer className="footer">

            <ul className="footer--ul">

                <div className="footer--ul--anchor--wrap">
                    <a className="footer--ul--anchor" href="/legal-notice">
                        <li className="footer--ul--li">Aviso legal</li>
                        <span className="border--bottom--span--hover"></span>
                    </a>
                </div>

                <div className="footer--ul--anchor--wrap">
                    <a className="footer--ul--anchor" href="/privacy">
                        <li className="footer--ul--li">Aviso de privacidad</li>
                        <span className="border--bottom--span--hover"></span>
                    </a>
                </div>

                <div className="footer--ul--anchor--wrap">
                    <Link className="footer--ul--anchor" href="/contact">
                        <li className="footer--ul--li">Contacto</li>
                        <span className="border--bottom--span--hover"></span>
                    </Link>
                </div>
            </ul>

            <span className="footer--copyrights">© {new Date().getFullYear()}, Correr Juntos</span>

        </footer>
    );
}