import { createReducer, on } from '@ngrx/store';
import { loadStart, loadEnd } from '../actions/root';

export const initialState = {
  loading: true
};

export const loadingReducer = createReducer(
  initialState,
  on(loadStart, (state) => ({...state, loading: true })),
  on(loadEnd, (state) => ({...state, loading: false }))
)
