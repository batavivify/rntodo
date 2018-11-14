/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Main from './Main';
import reducer from "./store/reducer";


const store = createStore(reducer);

type Props = {};
class App extends Component<Props> {

  render() {

    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
