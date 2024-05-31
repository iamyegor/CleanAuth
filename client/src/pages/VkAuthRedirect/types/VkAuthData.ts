interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  avatar_base: string | null;
  phone: string;
  email: string;
}

export default interface VkAuthData {
  type: string;
  auth: number;
  user: User;
  token: string;
  ttl: number;
  uuid: string;
  hash: string;
}
