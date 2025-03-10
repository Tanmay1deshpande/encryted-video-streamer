import { DECREMENT, ERROR, INCREMENT } from "./actions";

const initialState = {
  value: 0,
  err: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case INCREMENT:
      return { ...state, ...payload };

    case DECREMENT:
      return { ...state, ...payload };

    case ERROR:
      return { ...state, ...payload };

    default:
      return state;
  }
};
