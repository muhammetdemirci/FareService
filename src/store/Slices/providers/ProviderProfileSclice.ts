import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const providerProfileSlice = createSlice({
  name: "providerProfile",
  initialState: [],
  reducers: {
    getProvider: (state, action) => {
      return action.payload;
    },
  },
});

export default providerProfileSlice.reducer;

const { getProvider } = providerProfileSlice.actions;

export const getProviderProfile = (id) => async (dispatch) => {
  dispatch(getProvider({ error: false, loading: true }));
  try {
    const response = await axios({
      method: "get",
      // headers: {
      //     Authorization: `Bearer ${localStorage.userToken}`
      // },
      url: process.env.REACT_APP_API_BASE_URL + `/api/user/provider/${id}`,
    });
    //handle success
    let profileData = response.data;
    profileData.loading = false;

    const feedbacksResponse = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/user/feedback`,
      {
        params: {
          provider_id: id,
        },
      }
    );
    profileData.data.feedbacks = feedbacksResponse.data?.data || [];
    dispatch(getProvider(profileData));
  } catch (error) {
    //handle error
    let data = error.response.data;
    data.loading = false;
    dispatch(getProvider(error.response.data));
  }
};