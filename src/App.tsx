import { Routes, Route } from "react-router-dom"
import Landing from "./components/Landing"
import About from "./pages/About"
import Gallery from "./pages/Gallery"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  )
}

export default App

