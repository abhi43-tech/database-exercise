export interface MonthDto {
  country: string;
  month: Number;
  year: Number;
  data: {
    confirmed: number;
    deaths: number;
    recovered: number;
  };
}
