import LinkTo from "./ui/LinkTo";

export default function Footer() {
    return <footer className = "flex h-12 bg-black bg-opacity-10">
        <div className = "flex gap-x-2 mx-auto">

            <LinkTo href = "/privacy" className = "navlink">Privacy</LinkTo>

        </div>
    </footer>;
}