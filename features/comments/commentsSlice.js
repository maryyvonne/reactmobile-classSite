import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../shared/baseUrl";

const fetchComments = createAsyncThunk("comments/fetchComments", async () => {
  const response = await fetch(baseUrl + "comments");
  return response.json();
});

const postComment = createAsyncThunk(
  "comments/postComment",
  async (payload, { dispatch, getState }) => {
    setTimeout(() => {
      const { comments } = getState();
      payload.date = (new Date()).toISOString();      ;
      payload.id = comments.commentsArray.length;

      dispatch(addComment(payload));
    }, 2000);
  }
);

// const initialState = {
//   commentsArray: [],
//   isLoading: true,
//   errMsg: ""
// };

const commentsSlice = createSlice({
  name: "comments",
  initialState: { isLoading: true, errMess: null, commentsArray: [] },
  reducers: {
    addComment: (state, action) => {
      console.log("addComment action.payload:", action.payload);
      console.log("addComment state.commentsArray:", state.commentsArray);
      const newComment = {
        id: state.commentsArray.length + 1,
        ...action.payload,
      };
      state.commentsArray.push(action.payload);
    },
  },
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMess = null;
      state.commentsArray = action.payload;
    },
    [fetchComments.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMess = action.error ? action.error.message : "Fetch failed";
    },
  },
});

export const commentsReducer = commentsSlice.reducer;
export const { addComment } = commentsSlice.actions;
export { postComment, fetchComments };
