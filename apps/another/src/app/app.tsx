// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import NxWelcome from './nx-welcome';
import {Products} from "@app/products";

export function App() {
  return (
    <div>
      <Products />
      <NxWelcome title="another" />
    </div>
  );
}

export default App;
