import { get, handleAPIError } from "src/api/requests";

import type { APIResult } from "src/api/requests";

export interface User {
  _id: string;
  name: string;
  profilePictureURL: string;
}

export async function getUser(id: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/api/user/${id}`);
    const json = await response.json();

    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
