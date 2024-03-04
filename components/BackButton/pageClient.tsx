"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BackButton({pathname}: {pathname: string}) {

    const router = useRouter();

    if (pathname !== "/") {

        return (
            <div className="back--img--anchor--wrap">
                <Link className="back--img--anchor" href="" onClick={() => router.back()}>
                    <Image
                        className="back--img--arrow"
                        src={"../../assets/pictures/arrow.svg"}
                        alt="back-arrow"
                        width="0"
                        height="0"

                        unoptimized
                    />
                </Link>
            </div>
            );
    }

    else if (pathname == "/") {

        return (
            <>
            </>
        );
    }
}