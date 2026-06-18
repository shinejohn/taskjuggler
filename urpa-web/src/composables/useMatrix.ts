import { createClient, RoomEvent } from 'matrix-js-sdk';
import { createUseMatrix } from '@taskjuggler/ui';
import api from '@/utils/api';

export type {
  MatrixSession,
  MatrixChatMessage,
  MatrixConversation,
} from '@taskjuggler/ui';

export const useMatrix = createUseMatrix({
  api,
  createClient,
  timelineEvent: RoomEvent.Timeline,
  defaultDeviceId: 'fibonacco-urpa',
});
