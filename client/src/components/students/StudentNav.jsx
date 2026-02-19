import { Link } from "react-router-dom";
import Navbar from "../layout/navbar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const StudentNavbar = () => {
    const {openSignIn} = useClerk()
    const {user} = useUser()
  return (
    <Navbar className="navbar-student">
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div>
          <button className="cursor-pointer">Become Educator</button> |{" "}
          <Link to="/my-enrollments">My Enrollments</Link>
        </div>
      </div>
    </Navbar>
  );
};

export default StudentNavbar;
