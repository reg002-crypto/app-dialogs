import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Avatar, Divider, ListItemAvatar, ListItemButton} from '@mui/material';
import ColorsHelper from './helpers/ColorsHelper';
import {GlobalState} from "./redux/store";
import {GroupInfo_Type, GroupType} from "./protobuf/PTPCommon";
import {useSelector} from "react-redux";
import {DialogsSelectors} from "./redux/modules/Dialogs";

const RowItem = ({ group:{name,avatar,group_id} }: {group:GroupInfo_Type}) => {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          sx={{
            '&& .MuiTouchRipple-rippleVisible': {
              animationDuration: '90ms',
            },
          }}
          onClick={() => {
            window.location.reload();
            setTimeout(() => {
              //WebViewAndroidProxy.postEvent('openActivity', { id: 110 });
            }, 100);
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{ bgcolor: ColorsHelper.randomColor(group_id) }}
              src={avatar}
            />
          </ListItemAvatar>
          <ListItemText primary={name} secondary={group_id} />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' component='li' />
    </>
  );
};

const Dialogs:React.FC = () => {
  let dialogs = useSelector((state:GlobalState)=>DialogsSelectors.selectAll(state.Dialogs));
  console.log(JSON.stringify(dialogs))
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <List>
        {dialogs.map((group , index) => (
          <RowItem
            key={index + String(group.group_id)}
            group={ group }
          />
        ))}
      </List>
    </Box>
  );
}

export default Dialogs;
