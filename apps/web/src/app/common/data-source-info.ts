export type FieldInfo = {
  name: string;
  description?: string;
  isRequired: boolean;
};

export type DataSourceInfo = {
  type: string;
  name: string;
  description?: string;
  fields: FieldInfo[];
};
