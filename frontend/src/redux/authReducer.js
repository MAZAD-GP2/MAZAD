const authReducer = (state = { isAdmin: null, test: "hi" }, action) => {

  if (action.type === "isAdmin") {
    return { ...state, isAdmin: true, test: "admin" };
  }
  if (action.type === "notAdmin") {
    return { ...state, isAdmin: false, test: "not admin" };
  }

  return { ...state };
};

export default authReducer;
