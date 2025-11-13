import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-2 m-auto my-4 bg-white/10 backdrop-blur-sm gap-4 w-fit h-fit rounded-xl shadow-xl">
      <ul className="flex justify-between items-center">
        <li>
          <NavLink to={"/home"} className="font-semibold text-white">
            MiniCord
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
