import * as React from 'react';
import {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Dialogs from './Dialogs';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Provider, useDispatch} from 'react-redux';
import {store} from './redux/store';
import {Pdu} from "./protobuf/Pdu";
import {CID_GROUP} from "./protobuf/PTPCommon";
import {GroupGetListRes} from "./protobuf/PTPGroup";

var Buffer = require('buffer/').Buffer

export function subscribe(eventName: string, listener: any) {
  document.addEventListener(eventName, listener);
}

export function unsubscribe(eventName: string, listener: any) {
  document.removeEventListener(eventName, listener);
}

export function publish(eventName: string, data: any) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export class WebViewAndroidProxy {
  static postEvent(eventName: string, data?: string | object) {
    //@ts-ignore
    if (window['WebViewAndroidProxy']) {
      if (data === undefined) {
        data = '{}';
      } else {
        if (typeof data !== 'string') {
          data = JSON.stringify(data);
        }
      }
      //@ts-ignore
      window['WebViewAndroidProxy']['postEvent'](eventName, data);
    }
  }
}

export function RootView() {
  //@ts-ignore
  const d = window.__GLOBAL_DATA['App.isCurrentThemeDay'] || false;
  const [isCurrentThemeDay, setIsCurrentThemeDay] = useState(!!d);
  const themeString = (b: boolean) => (b ? 'light' : 'dark');
  const theme1 = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeString(isCurrentThemeDay),
        },
        components: {
          MuiButtonBase: {
            defaultProps: {
              disableTouchRipple: false,
            },
          },
        },
        ...theme[themeString(isCurrentThemeDay)],
      }),
    [isCurrentThemeDay]
  );

  useEffect(() => {
    WebViewAndroidProxy.postEvent('sendRequest', {
      action: 'initApp',
      data: {},
    });
    WebViewAndroidProxy.postEvent('sendRequest', {
      action: 'initGroup',
      data: {},
    });
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const AppNotify = (e: any) => {
      console.log(JSON.stringify(e.detail));
      if (e.detail) {
        const { eventName, eventData } = e.detail;
        if (eventName == 'setIsCurrentThemeDay') {
          setIsCurrentThemeDay(eventData);
        }
        if (eventName == 'notifyPdu') {
          const pdu = new Pdu(Buffer.from(eventData,"hex"));
          if(pdu.getCommandId() == CID_GROUP.CID_GroupGetListRes){
            dispatch({
              type:"Dialogs/CID_GroupGetListRes",
              payload:GroupGetListRes.handlePdu(pdu)
            })
          }
        }
      }
    };
    subscribe('app.notify', AppNotify);
    return () => {
      unsubscribe('app.notify', AppNotify);
    };
  });
  return (
    <ThemeProvider theme={theme1}>
      <CssBaseline />
      <Container maxWidth='sm' sx={{ px: 0 }}>
        <Dialogs />
      </Container>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootView />
    </Provider>
  );
}
