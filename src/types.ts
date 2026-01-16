type CoinsType = {
  coins: number;
};

type AddUrlTypeError = {
  url?:string;
  user_id?:string;
};

type SummaryType =  {
    url: string;
    user_id: number;
    id: string;
    created_at: Date;
    title: string;
    response: string | null;
}