import {name as appName} from './app.json';
import {AppRegistry} from 'react-native';
import Root from './app/Root';

AppRegistry.registerComponent(appName, () => Root);
