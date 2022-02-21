import HelloWorld from "./components/HelloWorld/HelloWorld.component";
import Counter from './components/Counter/Counter.component';

import React, { Fragment } from 'react';

function App() {
  return (
    <Fragment>
      <HelloWorld />
      {/* <Counter /> */}
    </Fragment>
  );
}

export default App;