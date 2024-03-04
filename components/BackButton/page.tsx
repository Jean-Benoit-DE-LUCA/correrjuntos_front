import dynamic from "next/dynamic";

const BackButton = dynamic(() => import ("./pageClient"), {
    ssr: false
});

export default BackButton;