import { DECREMENT, INCREMENT } from "./actions";

const initialState = {
  value: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case INCREMENT:
      return { ...state, ...payload };

    case DECREMENT:
      return { ...state, ...payload };

    default:
      return state;
  }
};
