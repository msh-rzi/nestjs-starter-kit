import { GlobalResponseType } from 'src/types/globalTypes';

export const globalResponse = <T>(
  data: GlobalResponseType<T>,
): GlobalResponseType<T> => ({
  ...data,
  time: Date.now(),
});
