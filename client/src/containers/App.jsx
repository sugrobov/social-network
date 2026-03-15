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
        {/* Добавляем внешний контейнер с максимальной шириной */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="pt-20 pb-8">
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
      </div>
    </BrowserRouter>
  );
}

export default App;