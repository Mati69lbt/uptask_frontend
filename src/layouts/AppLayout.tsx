// cspell: ignore Uptask
import LogoUptask from "@/components/LogoUptask";
import NavMenu from "@/components/NavMenu";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <header className="bg-gray-800 py-5">
        <div className=" max-w-screen-2xl mx-20 flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64">
            <LogoUptask />
          </div>
          <NavMenu />
        </div>
      </header>
      <section className="max-w-screen-2xl mx-auto mt-10 p-5">
        <Outlet />
      </section>
      <footer className="py-5">
        <p className="text-center">
          Matias Delgado - {new Date().getFullYear()}{" "}
        </p>
      </footer>
    </>
  );
};

export default AppLayout;
