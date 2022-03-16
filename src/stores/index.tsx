import React from 'react';
import { NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';

import './_hydration';
import { UIStore } from './ui';
import { CounterStore } from './counter';
import { HomeStore } from './home';

import { spy } from 'mobx';
import { createMobxDebugger } from 'mobx-flipper';
import { debugMobxActions } from 'mobx-action-flipper';
import { MMKV } from 'react-native-mmkv';

export const stores = {
  ui: new UIStore(),
  counter: new CounterStore(),
  home: new HomeStore()
};
type ContextStores = typeof stores;

if (__DEV__) {
  // spy(createMobxDebugger(stores));
  // debugMobxActions({ stores }, MMKV);
}

const storeContext = React.createContext<ContextStores>(stores);

export const withStores = (C: NavigationFunctionComponent) => {
  return (props: NavigationComponentProps): React.ReactElement => {
    return (
      <storeContext.Provider value={stores}>
        <C {...props} />
      </storeContext.Provider>
    );
  };
};

export const useStores = (): ContextStores => React.useContext(storeContext);

export const hydrateStores = async (): PVoid => {
  for (const key in stores) {
    if (Object.prototype.hasOwnProperty.call(stores, key)) {
      const s = (stores as Stores)[key];

      if (s.hydrate) {
        await s.hydrate();
      }
    }
  }
};
