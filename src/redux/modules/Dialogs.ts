import {
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
} from '@reduxjs/toolkit';
import type { GroupInfo_Type } from '../../protobuf/PTPCommon';
import {GroupGetListRes_Type} from "../../protobuf/PTPGroup/types";
import {GroupType} from "../../protobuf/PTPCommon";
import {getRandomInt} from "../../helpers/utils";

export const isMobile = ()=>{
  //@ts-ignore
  return window['WebViewAndroidProxy'] !== undefined
}

const entityAdapter = createEntityAdapter<GroupInfo_Type>({
  selectId: (entity) => entity.group_id,
  sortComparer: (a: GroupInfo_Type, b: GroupInfo_Type) => {
    return b.group_id - a.group_id;
  },
});

interface DeviceStateState {
  ids: EntityId[];
  entities: Dictionary<GroupInfo_Type>;
}

const rows: GroupInfo_Type[] = [
  {
    group_adr: "group_adr",
    owner_uid: 0,
    pair_uid: 0,
    group_type: GroupType.GROUP_TYPE_PAIR,
    group_idx: 1,
    created_time: 1,
    group_id: getRandomInt(1000000),
    name: 'group1',
    avatar:
        'https://appassets.androidplatform.net/sdcard/storage/emulated/0/Android/data/org.telegram.messenger.beta/cache/-2147483648_-210003.jpg',
  }
];

const emptyInitialState = entityAdapter.getInitialState();
const filledState = entityAdapter.upsertMany(emptyInitialState, isMobile() ? [] : rows);

const initialState: DeviceStateState = {
  ...filledState,
};

const DialogsSlice = createSlice({
  name: 'Dialogs',
  initialState,
  reducers: {
    CID_GroupGetListRes: (state: DeviceStateState, { payload }:{payload:GroupGetListRes_Type}) => {
      const {groups} = payload
      entityAdapter.upsertMany(state,groups!!)
    },
    mergeState: (state: DeviceStateState, { payload }) => {
      Object.assign(state, payload);
    },
  },
});

export const actions = DialogsSlice.actions;
export const DialogsSelectors = entityAdapter.getSelectors();

export default DialogsSlice.reducer;
