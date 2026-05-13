import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('test').select('*');
      console.log(data, error);
    };

    testConnection();
  }, []);

  return (
    <div className="text-white bg-gray-900 h-screen flex items-center justify-center">
      Lootr connected 🔥
      <Routes>
        <Route path="/" element={<h1 className="p-4">Home (Lootr)</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;