import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/Toast";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-indigo-600 selection:text-white">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </main>

        <Footer />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;