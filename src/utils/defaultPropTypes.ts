import {NavigationScreenProp} from 'react-navigation';

export interface NavigationProps {
  navigation: NavigationScreenProp<{}>;
}

export interface ReduxProps {
  dispatch: Function;
}
