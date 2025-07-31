import { AuthProvider } from './hooks/useAuth.jsx';
import AppRouter from './navigation/AppRouter';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
