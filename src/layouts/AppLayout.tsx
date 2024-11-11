// cspell: ignore Uptask, toastify, Matias
import LogoUptask from "@/components/LogoUptask";
import NavMenu from "@/components/NavMenu";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppLayout = () => {
  return (
    <>
      <header className="bg-gray-800 py-5">
        <div className=" max-w-screen-2xl mx-20 flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64">
            <Link to={"/"}>
              <LogoUptask />
            </Link>
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
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
};

export default AppLayout;
