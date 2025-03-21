import api from "./api";

export interface TableItem {
  id: string;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

export const fetchTableData = async (): Promise<TableItem[]> => {
  const response = await api.get<{ data: TableItem[] }>("/userdocs/get");
  return response.data.data;
};

export const createTableItem = async (item: Omit<TableItem, "id">) => {
  const response = await api.post("/userdocs/create", item);
  return response.data;
};

export const deleteTableItem = async (id: string) => {
  const response = await api.post(`/userdocs/delete/${id}`);
  return response.data;
};

export const updateTableItem = async (id: string, item: Omit<TableItem, "id">) => {
  const response = await api.post(`/userdocs/set/${id}`, item);
  return response.data;
};
