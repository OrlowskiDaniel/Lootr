import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

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
    </div>
  );
}

export default App;