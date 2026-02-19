import WelcomeScreen from "@/Componenets/CommonComponents/WelcomeScreen/WelcomeScreen";


export default function Page() {
    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user"))
            : null;

    return (
        <WelcomeScreen userName={user?.email?.split("@")[0]} />
    );
}
