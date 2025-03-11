import { LOADER } from "./actions";

const initialState = {
  loader: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOADER:
      return { ...state, loader: payload };

    default:
      return state;
  }
};
