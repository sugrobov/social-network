import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import Header from "../components/layout/Header";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Feed from "./feed/Feed";
import PrivateRoute from "../components/PrivateRoute";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/feed" element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <div>Profile Page (soon)</div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}


export default App;
