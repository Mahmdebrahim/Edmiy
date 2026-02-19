import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { dummyEducatorData, assets } from "../../assets/assets";

const EducatorNavbar = () => {
  const { user } = useUser();
  const EducatorData = dummyEducatorData;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center">
          <img className="h-9" src={assets.logo} alt="Logo" />
        </Link>

        <div className="flex items-center gap-6 text-gray-600">
          <span className="hidden md:inline">
            Hi!, {user?.firstName || "Educator"}
          </span>

          {user ? (
            <UserButton />
          ) : (
            <img className="max-w-8" src={assets.profile_img} alt={EducatorData.name} />
          )}
        </div>
      </div>
    </header>
  );
};

export default EducatorNavbar;
