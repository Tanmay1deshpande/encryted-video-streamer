export const INCREMENT = "counter/increment";
export const DECREMENT = "counter/decrement";
export const ERROR = false;

export const increment = (payload) => ({
  type: INCREMENT,
  payload: payload,
});

export const decrement = (payload) => ({
  type: DECREMENT,
  payload: payload,
});

export const error = (payload) => ({
  type: ERROR,
  payload: payload,
});
