import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
