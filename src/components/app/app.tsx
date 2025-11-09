import { ConstructorPage } from '@pages';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <ConstructorPage />
  </div>
);

export default App;
