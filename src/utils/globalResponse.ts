import { GlobalResponseType } from 'src/types/globalTypes';

export const globalResponse = <T>(
  data: Omit<GlobalResponseType<T>, 'time'>,
): GlobalResponseType => ({
  ...data,
  time: Date.now(),
});
