// cspell: ignore Uptask, toastify, Matias
import LogoUptask from "@/components/LogoUptask";
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppLayout = () => {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/auth/login" />;

  if (data)
    return (
      <>
        <header className="bg-gray-800 py-5 relative z-50">
          <div className=" max-w-screen-2xl mx-20 flex flex-col lg:flex-row justify-between items-center">
            <div className="w-64">
              <Link to={"/"}>
                <LogoUptask />
              </Link>
            </div>
            <NavMenu name={data.name} />
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
        <ToastContainer
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          position="top-right" // 📌 Cambia la posición aquí
          autoClose={3000} // Cierra automáticamente en 3s
          hideProgressBar={false} // Muestra barra de progreso
          newestOnTop={true} // Ordena los últimos primero
          closeOnClick // Cierra al hacer clic
          draggable // Permite arrastrar el toast
          theme="light" // Opcional: light, dark, colored
        />
      </>
    );
};

export default AppLayout;
