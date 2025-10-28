import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

function NavItem({ item }) {
  const { url, title } = item;

  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        cn("px-3 py-1.5", isActive ? "text-purple-600" : "")
      }
    >
      {title}
    </NavLink>
  );
}

export default function NavBar({ navItems = [] }) {
  return (
    <nav className="bg-pink-200 flex items-center">
      {navItems.map((item, idx) => (
        <NavItem key={idx} item={item} />
      ))}
    </nav>
  );
}
