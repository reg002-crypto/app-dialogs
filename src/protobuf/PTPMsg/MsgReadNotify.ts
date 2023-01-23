import BaseMsg from '../BaseMsg';
import { SID, CID_MSG } from '../PTPCommon';
import type { Pdu } from '../Pdu';
import type { MsgReadNotify_Type } from './types';

export default class MsgReadNotify extends BaseMsg {
  constructor(msg?: MsgReadNotify_Type) {
    super('PTP.Msg.MsgReadNotify', msg);
    this.setServiceId(SID.S_MSG);
    this.setCommandId(CID_MSG.CID_MsgReadNotify);
  }
  getMsg(): MsgReadNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): MsgReadNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static handlePdu(pdu: Pdu) {
    const msg = new MsgReadNotify().decode(pdu.getPbBody());
    return msg;
  }
}
