import axios from "axios";
import { setSQLDailySummary } from "./Database";

const auth =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjViNjAyZTBjYTFmNDdhOGViZmQxMTYwNGQ5Y2JmMDZmNGQ0NWY4MmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcm5hdXRoLWNmOWIwIiwiYXVkIjoicm5hdXRoLWNmOWIwIiwiYXV0aF90aW1lIjoxNzA2MDAyMjU0LCJ1c2VyX2lkIjoiMk80d2dyNHR0V2FvblRTa1BlWmhYTGw3UFlwMSIsInN1YiI6IjJPNHdncjR0dFdhb25UU2tQZVpoWExsN1BZcDEiLCJpYXQiOjE3MDYwMDIyNTQsImV4cCI6MTcwNjAwNTg1NCwiZW1haWwiOiJyZ2ZhaWZlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJyZ2ZhaWZlQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.jkS0jTYiQXr8RnNC4kGelMMqgU_-O_9dfbByfBNY3_rqZmJtuf3hNvue6i5e1MY6MUxl5q3qQFTsK_tz6Cii7TRQm2dFEMwl5qUGe7FwvjGBZosDNGsQblJ6bv2aMKKMc6DYndOS7HPQAzS6KHxAzefA7Cw6qD9Z7vNth6n_2cYrwdvi4Dxg1V47eOhJbHpat2tGS2Bt8LbfVqpFzoY7ag9MJ0u1NEPounHUVFWhjnrOWUsKU0OtEr6_AvavctUmDKIM1AW8v8GMufPyOZqj_foxqvmfVSZXqqaNqqvvFYPw99xDUT5vmaJSxBiME944vpDM4XLJftDw3fg_SHxG3w";

export async function setParrotDailySummary(summary) {
  try {
    let data = JSON.stringify({
      memories: summary,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://6r8kgx7cvd.execute-api.us-east-2.amazonaws.com/prod//api/v1/overview/daily_summary",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    //console.log(JSON.stringify(response.data));
    setSQLDailySummary(response.data.summary);
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it to the calling code
  }
}

export async function sendParrotChatMessage(_prompt, _chatHistory) {
  try {
    let data = JSON.stringify({
      prompt: _prompt,
      chat_history: _chatHistory || [],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://6r8kgx7cvd.execute-api.us-east-2.amazonaws.com/prod//api/v1/chat/prompt",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    return JSON.stringify(response.data);
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it to the calling code
  }
}
