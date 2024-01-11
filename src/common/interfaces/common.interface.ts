export interface requestUser extends Request {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    sub: string;
    email: string;
  };
}
