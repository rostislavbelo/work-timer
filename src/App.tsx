import "./App.css";
import { Layout } from "./Layout";
import { Header } from "./Header";
import { Tasks } from "./tasks";
import { Statistics } from "./statistics";
import { BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Tasks />} />    
            <Route path="/stats/" element={<Statistics />} />  
          </Routes> 
        </main>   
      </BrowserRouter>
    </Layout>
  );
}

export default App;
