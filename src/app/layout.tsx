import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const outfit = Outfit({
    variable: "--font-sans",
    subsets: ["latin"],
});

const mono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

const title = "Vulcanode | Crafting Trees and Modular Graphs";
const description = "Crafting trees, structures, and visual budgets with a sublime experience. No registration, no server — all in your browser.";

export const metadata: Metadata = {
    metadataBase: new URL("https://vulcanode.app"),
    title: {
        default: title,
        template: "%s | Vulcanode",
    },
    description,
    keywords: [
        "crafting tree",
        "crafting trees",
        "árvore de crafting",
        "grafo de composição",
        "orçamento visual",
        "visual budget",
        "react flow",
        "hierarquia de itens",
        "receitas de jogos",
        "item hierarchy",
        "game recipes",
        "workflow",
        "mapa mental",
        "flow chart",
        "nodes",
        "editor visual",
        "visual editor",
        "graphs",
    ],
    authors: [{ name: "Vulcanode" }],
    openGraph: {
        type: "website",
        // locale: "pt_BR",
        url: "/",
        siteName: "Vulcanode",
        title,
        description,
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-BR"
            className={`${outfit.variable} ${mono.variable} font-sans dark h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-orange-500 selection:text-white">
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    );
}
