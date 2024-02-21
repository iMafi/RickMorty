import { createSelector } from '@ngrx/store';

export const selectLoading = (state: any ) => state.load;
export const selectLoadingState = createSelector(
  selectLoading,
  (state) => state.loading
)
