import dynamic from "next/dynamic";

const DynamicHomeText = dynamic(() => import("./pageClient"), {
    ssr: false
});

export default DynamicHomeText;