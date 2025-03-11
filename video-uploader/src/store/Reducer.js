import { DECREMENT, ERROR, INCREMENT, LOADER } from "./actions";

const initialState = {
  value: 0,
  err: false,
  loader: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case INCREMENT:
      return { ...state, ...payload };

    case DECREMENT:
      return { ...state, ...payload };

    case ERROR:
      return { ...state, ...payload };

    case LOADER:
      return { ...state, loader: payload };

    default:
      return state;
  }
};
