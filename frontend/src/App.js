import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-2xl shadow-lg bg-white space-y-4">
        <h1 className="text-3xl font-bold text-brand">Hello React + Tailwind!</h1>
        <p className="text-gray-600">This project uses Tailwind via CDN.</p>
        <button className="px-4 py-2 rounded-lg bg-brand text-white hover:bg-blue-600">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;

