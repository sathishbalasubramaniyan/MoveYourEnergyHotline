import * as Flex from '@twilio/flex-ui';
import { SyncClient, SyncMap, SyncMapItem } from 'twilio-sync';
// import { paginator } from 'twilio-sync/'
import {paginator} from 'twilio-sync'

const client = new SyncClient(Flex.Manager.getInstance().user.token);

export default client;

export const getAllSyncMapItems = async (syncMap) => {
  return syncMap.getItems().then(_pageHandler);
};

async function _pageHandler(paginator) {
  if (paginator.hasNextPage) {
    return paginator.items.concat(await paginator.nextPage().then(_pageHandler));
  }
  return Promise.resolve(paginator.items);
}