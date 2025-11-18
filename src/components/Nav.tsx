import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 m-auto my-4 bg-white/10 backdrop-blur-sm gap-4  max-w-xs rounded-xl shadow-xl">
      <ul className="flex justify-between items-center">
        <li>
          <NavLink to={"/"} className="font-semibold text-white flex items-center gap-2">
            <img src="/favicon.ico" className="h-6"></img>
            Minicord
          </NavLink>
        </li>
        <li>
          <NavLink to={"/login"}>
            <button className="font-semibold text-white">Login</button>
          </NavLink>
        </li>
        <li>
          <NavLink to={"/signup"}>
            <button className="font-semibold text-white">Signup</button>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
