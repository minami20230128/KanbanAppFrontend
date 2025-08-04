import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskBoard from "./TaskBoard";
import TaskDetail from "./TaskDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskBoard />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
