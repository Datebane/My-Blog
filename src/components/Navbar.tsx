"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setCurrentUser } from "../store/blogSlice";
import { RootState } from "../store";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.blog);

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md p-0 mb-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
        <div className="text-xl font-bold text-gray-800">
          {currentUser
            ? `Ласкаво просимо, ${currentUser.username}!`
            : "Ласкаво просимо, Гість"}
        </div>
        <div className="space-x-4 flex items-center">
          <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors duration-200">
            Зміна теми (заглушка)
          </button>
          <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors duration-200">
            Меню (заглушка)
          </button>
          {currentUser && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
            >
              Вийти
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
