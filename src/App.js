import './App.css';

import React, { Component, Fragment } from 'react';
import { connect, Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { Machine } from 'xstate';

import { statechart } from './statechart';

const products = (state = {}) => state;

const stateMachine = Machine(statechart);

const Foo = ({ match, current, children }) => {
  if (current === match || Object.keys(current).includes(match) || Object.values(current).includes(match)) {
    return <Fragment>{children}</Fragment>;
  }

  return null;
};

const mapStateToProps = ({ machine: { current } }, ownProps) => {
  return { current, ...ownProps };
};

const Match = connect(mapStateToProps)(Foo);

const machine = (state = { current: stateMachine.initial }, action) =>
  action.type === 'TRANSITION'
    ? { ...state, current: stateMachine.transition(state.current, action.transition).value }
    : state;

const store = createStore(
  combineReducers({ machine, products }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <br />
          <br />
          <TransitionButton transition="WAKE_UP" label="Wake Up" />
          <TransitionButton transition="SCAN_PRODUCT" label="Scan" />
          <TransitionButton transition="ENTER_PRODUCT" label="Enter" />
          <TransitionButton transition="START_TX" label="Start TX" />
          <TransitionButton transition="ABORT" label="Abort" />
          <TransitionButton transition="CANCEL" label="Cancel" />
          <TransitionButton transition="FULLY_PAID" label="Cash" />
          <TransitionButton transition="FULLY_PAID" label="Card" />
          <TransitionButton transition="FINISHED" label="Print" />
          <TransitionButton transition="FINISHED" label="No Print" />
          <br />
          <br />
          <br />

          <Match match="idle">
            <span role="img">😴</span>
          </Match>
          <Match match="registering">
            <span role="img">🕵️‍♂️</span>
          </Match>
          <Match match="paying">
            <span role="img">💸</span>
          </Match>
          <Match match="printing">
            <span role="img">🖨</span>
          </Match>
        </div>
      </Provider>
    );
  }
}

const TransitionButton = connect(
  (state, { label }) => ({
    label,
  }),
  (dispatch, { transition }) => ({
    transition: () => dispatch({ type: 'TRANSITION', transition }),
  }),
)(({ transition, label }) => <button onClick={() => transition()}>{label}</button>);

export default App;
