import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Feed from "./feed/Feed";
import PrivateRoute from "../components/PrivateRoute";

function App() {
  return (

    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Header />
        {/* Отступ для фиксированного Header */}
        <main className="container mx-auto px-4 pt-20 pb-8">
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Профиль пользователя
                    </h2>
                    <p className="text-gray-600">Страница в разработке</p>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>

  );
}

export default App;