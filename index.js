import 'react-native-gesture-handler';
import { registerRootComponent } from 'rnn-screens';

import { App, TabsApp, beforeStart } from './App';

registerRootComponent(App, { beforeStart });
