"use client";

import React from "react";
import { persistor, store } from "./store";
import logger from "redux-logger";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} logger={logger}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
