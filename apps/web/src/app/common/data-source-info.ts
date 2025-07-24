export type FieldInfo = {
  name: string;
  description?: string;
  isRequired: boolean;
};

export type DataSourceInfo = {
  id: string;
  name: string;
  description?: string;
  fields: FieldInfo[];
};
