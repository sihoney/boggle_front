import { Outlet } from "react-router-dom";

import NavBar from "@/components/NavBar";

const navItems = [
  { url: "/", title: "MAIN" },
  { url: "/my/reviews/sihoney", title: "MY REVIEW" },
];

export default function GlobalLayout() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header>
        <NavBar navItems={navItems} />
      </header>
      <main className="grow p-4">
        <Outlet />
      </main>
      <footer className="bg-stone-200 text-stone-600 p-4">&copy; BOGGLE</footer>
    </div>
  );
}
