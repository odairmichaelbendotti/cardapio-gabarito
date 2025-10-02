import { Outlet } from "react-router";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="bg-[#161410] flex flex-col items-center min-h-screen pb-10">
      <Header />
      <div className="max-w-[834px] w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
