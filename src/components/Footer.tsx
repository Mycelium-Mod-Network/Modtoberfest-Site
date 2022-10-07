import { LinkExternalIcon } from "@primer/octicons-react";
import LinkTo from "./ui/LinkTo";

export default function Footer() {
    return <footer className = "flex h-12 bg-black bg-opacity-10">
        <div className = "flex gap-x-2 mx-auto text-orange-400">
            <a href="https://github.com/Mycelium-Mod-Network/Modtoberfest-Site/" target="_blank" rel="noreferrer" className="navlink">GitHub <LinkExternalIcon /></a> | <LinkTo href = "/privacy" className = "navlink">Privacy</LinkTo>
        </div>
    </footer>;
}