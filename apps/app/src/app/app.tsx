// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import NxWelcome from './nx-welcome';
import {Products} from "@app/products";
import {Orders} from "@app/orders";

export function App() {
  return (
    <div>
      <Products />
      <Orders />
      <NxWelcome title="app" />
    </div>
  );
}

export default App;
