import { Link } from "react-router-dom";
import { Home, LogIn, UserPlus } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
            <Home size={18} /> Home
        </Link>
        <Link to="/login" className="flex items-center gap-2">
            <LogIn size={18} /> Login
        </Link>
        <Link to="/register" className="flex items-center gap-2">
            <UserPlus size={18} /> Register
        </Link>
    </nav>
  );
}