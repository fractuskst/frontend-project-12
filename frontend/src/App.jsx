import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes/routes.js";
import Root from "./pages/Root.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/404.jsx";
import { useSelector } from "react-redux";

const App = () => {
  const token = useSelector((state) => state.auth.token);
  return (
    <div className="d-flex flex-column h-100">
      <Routes>
        <Route
          path={ROUTES.main}
          element={token ? <Root /> : <Navigate to={ROUTES.login} />}
        />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.notFound} element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
